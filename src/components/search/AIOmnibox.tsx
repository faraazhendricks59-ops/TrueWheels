"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mic, MicOff, Search, Sparkles, X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { OmniboxResults, AISuggestionGroup } from "@/components/search/OmniboxResults";
import { InstantAnswer } from "@/components/search/InstantAnswer";
import { extractKeywords, searchItems, type SearchItem } from "@/lib/search-index";

interface AIOmniboxProps {
  initialQuery?: string;
  onClose?: () => void;
  className?: string;
}

export function AIOmnibox({ initialQuery = "", onClose, className }: AIOmniboxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isAI, setIsAI] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput();

  // AI mode tolerates a full question: if the literal phrase matches nothing,
  // retry on the keywords alone. Plain search stays exact, so the two modes
  // remain meaningfully different.
  const { results, usedKeywordFallback } = useMemo(() => {
    const direct = searchItems(query);
    if (direct.length > 0 || !isAI) return { results: direct, usedKeywordFallback: false };
    const keywords = extractKeywords(query);
    if (!keywords || keywords === query.trim().toLowerCase()) {
      return { results: direct, usedKeywordFallback: false };
    }
    return { results: searchItems(keywords), usedKeywordFallback: true };
  }, [query, isAI]);

  // Voice results replace the typed query as they arrive.
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      setIsOpen(true);
    }
  }, [transcript]);

  useEffect(() => setSelectedIndex(0), [query, isAI]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  const goTo = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  const select = useCallback(
    (item: SearchItem) => {
      goTo(item.href);
    },
    [goTo]
  );

  const submit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      const q = query.trim();
      if (!q) return;
      goTo(`/marketplace?q=${encodeURIComponent(q)}`);
    },
    [goTo, query]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      inputRef.current?.blur();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setSelectedIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (isOpen && results[selectedIndex]) select(results[selectedIndex]);
      else submit();
    }
  };

  const showResults = isOpen && query.length > 0;

  return (
    <div ref={containerRef} className={clsx("relative w-full max-w-3xl mx-auto", className)}>
      <form onSubmit={submit} className="relative">
        <div
          className={clsx(
            "flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border transition-all duration-300 ease-swift",
            "bg-white dark:bg-ink-900 shadow-lift",
            showResults
              ? "border-ink-200 dark:border-ink-700 rounded-b-none"
              : "border-ink-100 dark:border-ink-800 hover:border-brand/30 hover:shadow-glow"
          )}
        >
          <Icon icon={Search} size={20} className="text-ink-400 flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={isAI ? "Ask TrueWheels AI..." : "Search make, model or keyword"}
            aria-label="Search the marketplace"
            role="combobox"
            aria-expanded={showResults}
            aria-controls="omnibox-results"
            aria-autocomplete="list"
            aria-activedescendant={
              showResults && results[selectedIndex] ? `omnibox-${results[selectedIndex].id}` : undefined
            }
            className="flex-1 min-w-0 bg-transparent text-base text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none"
          />

          <FeatureGate featureKey="search.voice_input">
            {isSupported && (
              <button
                type="button"
                onClick={() => (isListening ? stopListening() : startListening())}
                aria-label={isListening ? "Stop voice search" : "Start voice search"}
                aria-pressed={isListening}
                className={clsx(
                  "p-2 rounded-xl transition-all flex-shrink-0",
                  isListening
                    ? "bg-brand/10 text-brand"
                    : "text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-600"
                )}
              >
                <Icon icon={isListening ? MicOff : Mic} size={18} className={isListening ? "animate-pulse" : undefined} />
              </button>
            )}
          </FeatureGate>

          <FeatureGate featureKey="search.ai_mode">
            <button
              type="button"
              onClick={() => {
                setIsAI((value) => !value);
                setIsOpen(true);
                resetTranscript();
              }}
              aria-pressed={isAI}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0",
                isAI
                  ? "bg-aurora-purple/10 text-aurora-purple border border-aurora-purple/20"
                  : "bg-ink-50 dark:bg-ink-800 text-ink-400 border border-transparent hover:text-ink-600"
              )}
            >
              <Icon icon={Sparkles} size={12} />
              {isAI ? "AI" : "Search"}
            </button>
          </FeatureGate>

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                resetTranscript();
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white flex-shrink-0"
            >
              <Icon icon={X} size={16} />
            </button>
          )}

          {/* Kept visible once a query is typed: the brief swapped it out for the
              clear button, which left Enter as the only way to submit. */}
          <SmartButton
            featureKey="search.submit"
            type="submit"
            size="sm"
            className="!h-9 !px-3 sm:!px-4 flex-shrink-0"
          >
            <span className="hidden sm:inline">Search</span>
            <Icon icon={ArrowRight} size={14} className="sm:ml-1" />
          </SmartButton>
        </div>
      </form>

      {showResults && (
        <div
          id="omnibox-results"
          ref={listRef}
          className="absolute top-full left-0 right-0 bg-white dark:bg-ink-900 border-x border-b border-ink-200 dark:border-ink-700 rounded-b-2xl shadow-xl z-50 overflow-hidden animate-slide-down"
        >
          {isAI && query.length > 5 && <InstantAnswer query={query} />}

          {isAI ? (
            <div className="p-4">
              <AISuggestionGroup query={query} onSelect={goTo} />
            </div>
          ) : null}

          <OmniboxResults
            header={
              usedKeywordFallback ? (
                <p className="px-2 pb-2 text-xs text-ink-400">
                  Interpreting your question as a search for{" "}
                  <span className="font-semibold text-ink-600 dark:text-ink-200">
                    {extractKeywords(query)}
                  </span>
                </p>
              ) : undefined
            }
            items={results}
            query={query}
            isAI={isAI}
            selectedIndex={selectedIndex}
            onSelect={select}
            onHover={setSelectedIndex}
          />

          <div className="px-4 sm:px-5 py-3 bg-ink-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800 flex justify-between items-center gap-2 text-xs text-ink-400">
            <span className="hidden sm:inline">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded font-mono">
                &crarr;
              </kbd>{" "}
              to search
            </span>
            <span className="truncate">Powered by NVIDIA NIM</span>
          </div>
        </div>
      )}
    </div>
  );
}

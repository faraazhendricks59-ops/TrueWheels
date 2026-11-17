"use client";

import { useState, useRef, useEffect, useId, ReactNode } from "react";
import { clsx } from "clsx";
import { useClickOutside, useEscapeKey } from "./overlay-hooks";

// --- TOOLTIP ---
interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "bottom";
}

/**
 * Hover AND focus reveal, wired through aria-describedby so the text is
 * announced rather than merely painted.
 */
export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* aria-describedby is always present, not just while visible: the
          description must be announced when the trigger receives focus. */}
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={clsx(
          "absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-ink-900 text-white text-[10px] font-medium rounded-lg shadow-lift pointer-events-none whitespace-nowrap z-50 transition-opacity",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {content}
      </span>
    </span>
  );
}

// --- DROPDOWN ---
interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  label?: string;
}

export function Dropdown({ trigger, children, align = "right", label = "Open menu" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  // ArrowDown/ArrowUp should land on a menu item, but the menu is not in the
  // DOM yet at keydown time, so defer the focus until after it renders.
  const focusFirstOnOpen = useRef(false);

  useClickOutside(isOpen, ref, () => setIsOpen(false));
  useEscapeKey(isOpen, () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  });

  const items = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);

  const focusItem = (direction: 1 | -1) => {
    const nodes = items();
    if (!nodes.length) return;
    const at = nodes.indexOf(document.activeElement as HTMLElement);
    const next =
      at === -1 ? (direction === 1 ? 0 : nodes.length - 1) : (at + direction + nodes.length) % nodes.length;
    nodes[next].focus();
  };

  useEffect(() => {
    if (isOpen && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      items()[0]?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        focusFirstOnOpen.current = true;
        setIsOpen(true);
      } else {
        focusItem(1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        focusFirstOnOpen.current = true;
        setIsOpen(true);
      } else {
        focusItem(-1);
      }
    }
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={label}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className="inline-flex cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950"
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          onKeyDown={handleKeyDown}
          className={clsx(
            "absolute z-50 mt-2 w-56 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl shadow-lift overflow-hidden animate-scale-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="p-1">{children}</div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

export function DropdownItem({ children, onClick, destructive = false }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={clsx(
        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 focus:outline-none focus:bg-ink-50 dark:focus:bg-ink-800",
        destructive
          ? "text-semantic-error hover:bg-semantic-error/10"
          : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
      )}
    >
      {children}
    </button>
  );
}

// --- POPOVER ---
interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  label?: string;
}

export function Popover({ trigger, children, align = "left", label = "Open popover" }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useClickOutside(isOpen, ref, () => setIsOpen(false));
  useEscapeKey(isOpen, () => setIsOpen(false));

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={label}
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950"
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={clsx(
            "absolute z-50 mt-2 w-72 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl shadow-lift p-4 animate-scale-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

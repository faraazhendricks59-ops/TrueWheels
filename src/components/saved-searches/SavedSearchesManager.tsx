"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmartButton } from "@/components/ui/SmartButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/motion/Reveal";
import { SavedSearchCard } from "./SavedSearchCard";
import { readSavedSearches, type SavedSearch } from "@/lib/saved-searches";

export function SavedSearchesManager() {
  const router = useRouter();
  // Stored on the device, so it can only be read after mount. Reading during
  // render would disagree with the server-rendered HTML.
  const [searches, setSearches] = useState<SavedSearch[] | null>(null);

  const reload = useCallback(() => setSearches(readSavedSearches()), []);

  useEffect(() => {
    reload();
    // Another tab changing the same store should be reflected here.
    const onStorage = () => reload();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 py-8">
      <Reveal variant="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
              Saved searches
            </h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1">
              Manage your alerts and track new market listings.
            </p>
          </div>
          <SmartButton
            featureKey="saved_searches.create_new"
            leftIcon={Plus}
            onClick={() => router.push("/marketplace")}
          >
            Create new search
          </SmartButton>
        </div>
      </Reveal>

      {searches === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : searches.length > 0 ? (
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {searches.map((search) => (
              <SavedSearchCard key={search.id} search={search} onChanged={reload} />
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal variant="up" delay={100}>
          <EmptyState
            icon={Search}
            title="No saved searches yet"
            description="Save your search filters from the Marketplace to get instant alerts when new vehicles match your criteria."
            actionLabel="Go to Marketplace"
            actionFeatureKey="saved_searches.empty_state_action"
            onAction={() => router.push("/marketplace")}
          />
        </Reveal>
      )}
    </div>
  );
}

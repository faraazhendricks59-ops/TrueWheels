"use client";

import { useState, type ReactNode } from "react";
import { Bell, Car, Heart, Loader2, MapPin, Plus, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { Badge, TrustBadge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch, Checkbox } from "@/components/ui/Toggles";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Modal } from "@/components/ui/Modal";
import { Sheet } from "@/components/ui/Sheet";
import { Dropdown, DropdownItem, Tooltip } from "@/components/ui/Floating";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { OverlayShowcase } from "@/components/ui/OverlayShowcase";
import { useToast } from "@/components/ui/Toast";
import { Icon } from "@/components/ui/Icon";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { ICON_SIZE, ICONS, ICON_CONFIRM, ICON_LOCATION } from "@/components/ui/icons";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-ink-900 dark:text-white">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-ink-200/70 bg-white p-5 dark:border-ink-800 dark:bg-ink-900 ${className}`}>
      {children}
    </div>
  );
}

const COLOR_TOKENS: { name: string; className: string }[] = [
  { name: "brand", className: "bg-brand" },
  { name: "brand-600", className: "bg-brand-600" },
  { name: "brand-700", className: "bg-brand-700" },
  { name: "brand-50", className: "bg-brand-50" },
  { name: "ink-900", className: "bg-ink-900" },
  { name: "ink-700", className: "bg-ink-700" },
  { name: "ink-500", className: "bg-ink-500" },
  { name: "ink-300", className: "bg-ink-300" },
  { name: "ink-100", className: "bg-ink-100" },
  { name: "ink-50", className: "bg-ink-50" },
  { name: "surface-paper", className: "bg-surface-paper" },
  { name: "semantic-success", className: "bg-semantic-success" },
  { name: "semantic-warning", className: "bg-semantic-warning" },
  { name: "semantic-error", className: "bg-semantic-error" },
];

const MOTION_DURATIONS = ["fast · 150ms", "base · 250ms", "slow · 400ms", "hero · 600ms"];
const EASINGS = ["swift · cubic-bezier(0.22,1,0.36,1)", "snap · cubic-bezier(0.2,0,0,1)", "glide · cubic-bezier(0.4,0,0.2,1)"];

export function DesignSystem() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [price, setPrice] = useState<[number, number]>([120000, 520000]);
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("suv");
  const [tab, setTab] = useState<"overview" | "specs" | "history">("overview");
  // Counters drive the one-shot icon motions so they can be replayed on demand.
  const [bell, setBell] = useState(0);
  const [pop, setPop] = useState(0);
  const [replay, setReplay] = useState(0);

  const sampleVehicle = DEMO_VEHICLES[0];

  return (
    <div className="space-y-16 pb-24">
      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">Design system reference</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Every token and primitive in one place. Flip theme, text size, contrast and data saver here to check a
            component in each mode.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccessibilityMenu />
        </div>
      </Panel>

      <Section id="colour" title="Colour" description="The palette. Brand red is the only accent; ink is the neutral ramp; semantic colours are for status only.">
        <Panel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {COLOR_TOKENS.map((token) => (
              <div key={token.name} className="space-y-2">
                <div className={`h-16 rounded-lg border border-ink-200/60 dark:border-ink-700/60 ${token.className}`} />
                <p className="text-xs font-medium text-ink-600 dark:text-ink-300">{token.name}</p>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section id="typography" title="Typography" description="Display face for headings, sans for body, mono for figures and codes.">
        <Panel className="space-y-3">
          <p className="font-display text-4xl font-black italic tracking-tight text-ink-900 dark:text-white">Display — TrueWheels</p>
          <p className="text-2xl font-semibold text-ink-900 dark:text-white">Heading 2xl</p>
          <p className="text-lg text-ink-800 dark:text-ink-200">Lead paragraph, lg.</p>
          <p className="text-sm text-ink-600 dark:text-ink-300">Body text, sm — the default reading size for dense listings.</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">Caption, xs — specification lines and credits.</p>
          <p className="font-mono text-sm text-ink-700 dark:text-ink-200">R 1 499 000 · 62 000 km</p>
        </Panel>
      </Section>

      <Section id="surface" title="Radius, spacing, elevation" description="Tight corners read as considered; three elevation steps, all neutral.">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Radius</p>
            <div className="flex flex-wrap items-end gap-3">
              {["rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl"].map((r) => (
                <div key={r} className={`h-12 w-12 border border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-800 ${r}`} />
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Elevation</p>
            <div className="flex flex-wrap items-center gap-4">
              {["shadow-card", "shadow-lift", "shadow-glass"].map((s) => (
                <div key={s} className={`flex h-14 w-20 items-center justify-center rounded-lg bg-white text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-300 ${s}`}>
                  {s.replace("shadow-", "")}
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Spacing steps</p>
            <div className="space-y-1.5">
              {[["1", "4px"], ["2", "8px"], ["4", "16px"], ["6", "24px"], ["8", "32px"]].map(([step, px]) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-xs text-ink-500">{step}</span>
                  <span className="h-2 rounded-full bg-brand" style={{ width: px }} />
                  <span className="text-xs text-ink-400">{px}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Section>

      <Section id="motion" title="Motion" description="Four durations, three easings. Every effect is suppressed for reduced motion and data saver.">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Durations</p>
            <ul className="space-y-1.5 text-sm text-ink-700 dark:text-ink-200">
              {MOTION_DURATIONS.map((d) => (
                <li key={d} className="font-mono text-xs">{d}</li>
              ))}
            </ul>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Easings</p>
            <ul className="space-y-1.5">
              {EASINGS.map((e) => (
                <li key={e} className="font-mono text-xs text-ink-700 dark:text-ink-200">{e}</li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Samples</p>
              <SmartButton featureKey="marketplace.view_toggle" variant="ghost" size="sm" onClick={() => setReplay((n) => n + 1)}>
                Replay
              </SmartButton>
            </div>
            {/* Keyed on `replay` so each sample's entrance animation restarts. */}
            <div key={replay} className="flex flex-wrap items-center gap-3">
              <span className="animate-rise rounded-lg bg-brand px-3 py-2 text-xs text-white">rise</span>
              <span className="animate-focus-in rounded-lg bg-ink-800 px-3 py-2 text-xs text-white">focus-in</span>
              <span className="animate-scale-in rounded-lg bg-ink-200 px-3 py-2 text-xs text-ink-800">scale-in</span>
              <span className="sheen-host rounded-lg bg-ink-800 px-3 py-2 text-xs text-white">sheen (hover)</span>
            </div>
          </Panel>
        </div>
      </Section>

      <Section id="icons" title="Icons" description="Lucide glyphs through the Icon wrapper. Decorative by default; pass a title when the icon is the only label.">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Size scale</p>
            <div className="flex items-end gap-5">
              {(Object.keys(ICON_SIZE) as (keyof typeof ICON_SIZE)[]).map((token) => (
                <div key={token} className="flex flex-col items-center gap-1.5">
                  <Icon icon={Car} size={token} />
                  <span className="font-mono text-[10px] text-ink-400">{token}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Animated (click)</p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => setBell((n) => n + 1)} className="flex flex-col items-center gap-1.5 text-ink-600 dark:text-ink-300">
                <AnimatedIcon icon={Bell} motion="bell" trigger={bell} size="lg" />
                <span className="text-[10px]">bell</span>
              </button>
              <button type="button" onClick={() => setPop((n) => n + 1)} className="flex flex-col items-center gap-1.5 text-brand">
                <AnimatedIcon icon={Heart} motion="pop" trigger={pop} size="lg" />
                <span className="text-[10px]">pop</span>
              </button>
              <span className="flex flex-col items-center gap-1.5 text-ink-500">
                <AnimatedIcon icon={Loader2} motion="spin" size="lg" />
                <span className="text-[10px]">spin</span>
              </span>
              <span className="flex flex-col items-center gap-1.5 text-ink-600 dark:text-ink-300">
                <AnimatedIcon icon={Bell} motion="wiggle" trigger={bell} size="lg" />
                <span className="text-[10px]">wiggle</span>
              </span>
            </div>
          </Panel>
          <Panel className="md:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Semantic registry</p>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((name) => (
                <div key={name} className="flex flex-col items-center gap-1.5 text-ink-600 dark:text-ink-300">
                  <Icon icon={ICONS[name]} size="xl" />
                  <span className="font-mono text-[10px] text-ink-400">{name}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Section>

      <Section id="buttons" title="Buttons" description="SmartButton applies its own feature gating, loading and disabled-reason handling.">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <SmartButton featureKey="marketplace.view_toggle" variant="primary">Primary</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" variant="secondary">Secondary</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" variant="outline">Outline</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" variant="ghost">Ghost</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" variant="danger">Danger</SmartButton>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SmartButton featureKey="marketplace.view_toggle" size="sm" leftIcon={Plus}>Small</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" leftIcon={SlidersHorizontal}>Default</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" size="lg">Large</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" size="icon" aria-label="Add" leftIcon={Plus}><span className="sr-only">Add</span></SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" isLoading>Loading</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" disabled disabledReason="Only for signed-in sellers">Disabled</SmartButton>
          </div>
        </Panel>
      </Section>

      <Section id="badges" title="Badges" description="Status, trust and spec chips. Tone carries meaning; do not use a tone decoratively.">
        <Panel className="flex flex-wrap items-center gap-3">
          <Badge tone="red">Red</Badge>
          <Badge tone="green" dot>Green</Badge>
          <Badge tone="amber" pulse>Amber</Badge>
          <Badge tone="blue">Blue</Badge>
          <Badge tone="ink">Ink</Badge>
          <TrustBadge label="Trust badge" source="Verified against the manufacturer's own records." />
        </Panel>
      </Section>

      <Section id="forms" title="Form controls" description="Label, hint and error are wired through useId, aria-describedby and role=alert.">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="space-y-4">
            <Input label="Your name" placeholder="Thabo Mokoena" value={name} onChange={(e) => setName(e.target.value)} hint="Shown on your listings." />
            <Input label="Email" placeholder="you@example.com" error="Enter a valid email address." />
            <Select
              label="Body type"
              value={body}
              onChange={setBody}
              options={[
                { value: "suv", label: "SUV" },
                { value: "bakkie", label: "Bakkie" },
                { value: "hatch", label: "Hatchback" },
              ]}
            />
          </Panel>
          <Panel className="space-y-5">
            <Switch label="Email alerts" description="Get an email when a saved search matches." checked={switchOn} onChange={setSwitchOn} />
            <Checkbox label="I agree to the terms" checked={checked} onChange={setChecked} />
            <RangeSlider
              label="Price"
              min={0}
              max={1000000}
              step={10000}
              value={price}
              onChange={setPrice}
              formatValue={(v) => `R ${v.toLocaleString("en-ZA")}`}
            />
          </Panel>
        </div>
      </Section>

      <Section id="overlays" title="Overlays" description="Modal, sheet, dropdown and tooltip — all focus-trapped with Escape and scroll lock.">
        <Panel className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SmartButton featureKey="marketplace.view_toggle" variant="outline" onClick={() => setModalOpen(true)}>Open modal</SmartButton>
            <SmartButton featureKey="marketplace.view_toggle" variant="outline" onClick={() => setSheetOpen(true)}>Open sheet</SmartButton>
            <Dropdown label="Demo menu" trigger={<span className="inline-flex items-center rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700">Dropdown</span>}>
              <DropdownItem>Item one</DropdownItem>
              <DropdownItem selected>Item two</DropdownItem>
              <DropdownItem destructive>Delete</DropdownItem>
            </Dropdown>
            <Tooltip content="A short explanation"><span className="rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700">Hover me</span></Tooltip>
          </div>
          <OverlayShowcase />
        </Panel>
      </Section>

      <Section id="feedback" title="Feedback" description="Toasts, skeletons, empty states and pagination.">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Toasts</p>
            <div className="flex flex-wrap gap-2">
              <SmartButton featureKey="marketplace.view_toggle" size="sm" variant="outline" onClick={() => toast({ variant: "success", title: "Listing saved", description: "It is now in your garage." })}>Success</SmartButton>
              <SmartButton featureKey="marketplace.view_toggle" size="sm" variant="outline" onClick={() => toast({ variant: "error", title: "Could not save", description: "Check your connection and try again." })}>Error</SmartButton>
              <SmartButton featureKey="marketplace.view_toggle" size="sm" variant="outline" onClick={() => toast({ variant: "info", title: "3 new matches" })}>Info</SmartButton>
            </div>
          </Panel>
          <Panel className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Skeleton</p>
            <CardSkeleton />
          </Panel>
          <Panel className="md:col-span-2">
            <EmptyState icon={Car} title="No vehicles match yet" description="Widen your price range or clear a filter to see more listings." actionLabel="Clear filters" actionFeatureKey="marketplace.clear_filters" onAction={() => {}} />
          </Panel>
          <Panel className="md:col-span-2">
            <Pagination currentPage={page} totalPages={9} onPageChange={setPage} />
          </Panel>
        </div>
      </Section>

      <Section id="tabs" title="Tabs" description="The active marker slides between tabs. Arrow keys move the selection.">
        <Panel>
          <SlidingTabs
            ariaLabel="Demo sections"
            panelId="demo-panel"
            activeId={tab}
            onChange={setTab}
            tabs={[
              { id: "overview", label: "Overview", icon: Car },
              { id: "specs", label: "Specs", icon: SlidersHorizontal },
              { id: "history", label: "History", icon: ShieldCheck },
            ]}
          />
        </Panel>
      </Section>

      <Section id="card" title="Listing card" description="The marketplace card, shown here so its hover and dark-mode states can be checked in isolation.">
        <div className="max-w-sm">{sampleVehicle && <VehicleCard vehicle={sampleVehicle} />}</div>
      </Section>

      <Section id="icon-refs" title="Icon references" description="Other glyphs used across the app, for quick comparison of weight and size.">
        <Panel className="flex flex-wrap items-center gap-6 text-ink-600 dark:text-ink-300">
          <Icon icon={ICON_CONFIRM} size="lg" />
          <Icon icon={ICON_LOCATION} size="lg" />
          <Icon icon={Bell} size="lg" />
          <Icon icon={MapPin} size="lg" />
        </Panel>
      </Section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example modal" description="Focus is trapped; Escape closes it." footer={<SmartButton featureKey="marketplace.view_toggle" onClick={() => setModalOpen(false)}>Close</SmartButton>}>
        <p className="text-sm text-ink-600 dark:text-ink-300">Modal body content goes here.</p>
      </Modal>

      <Sheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Example sheet" side="right">
        <p className="text-sm text-ink-600 dark:text-ink-300">Sheet body content goes here.</p>
      </Sheet>
    </div>
  );
}

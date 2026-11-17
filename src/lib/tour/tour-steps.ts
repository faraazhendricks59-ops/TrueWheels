export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  id: string;
  /** Matches the data-tour attribute on the target element. */
  target: string;
  title: string;
  description: string;
  placement?: TourPlacement;
  /**
   * Viewport the step is meaningful in. The sell action lives in the mobile
   * floating button, which is hidden from md upwards; without this the step
   * would have no target on desktop and the tour would stall there.
   */
  viewport?: "mobile" | "desktop";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "search",
    target: "global-search",
    title: "Find your next car",
    description:
      "Search by make, model or plain language from the omnibox. Press the shortcut shown on the bar at any time.",
    placement: "bottom",
  },
  {
    id: "ai-concierge",
    target: "ai-concierge",
    title: "Your AI co-pilot",
    description: "Ask TrueWheels to compare cars, estimate finance or find the best deals near you.",
    placement: "bottom",
  },
  {
    id: "list-vehicle",
    target: "fab-list-vehicle",
    title: "Sell in minutes",
    description: "Ready to sell? Start the guided listing wizard with AI photo checks.",
    placement: "top",
    viewport: "mobile",
  },
  {
    id: "profile",
    target: "profile-menu",
    title: "Your command centre",
    description: "Reach your Digital Garage, saved searches and dealer tools from your profile.",
    placement: "bottom",
  },
];

export function stepsForViewport(isMobile: boolean): TourStep[] {
  return TOUR_STEPS.filter((step) => !step.viewport || step.viewport === (isMobile ? "mobile" : "desktop"));
}

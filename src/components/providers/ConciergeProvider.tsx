"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ConciergeContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const ConciergeContext = createContext<ConciergeContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useConcierge = () => useContext(ConciergeContext);

/**
 * The sheet is opened from more than one place (the header pill and the home
 * dock). A shared state keeps those triggers in step instead of each holding
 * its own copy, which would let two sheets open at once.
 */
export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);
  return <ConciergeContext.Provider value={value}>{children}</ConciergeContext.Provider>;
}

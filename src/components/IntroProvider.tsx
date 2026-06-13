"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Preloader from "./Preloader";

type IntroState = { done: boolean };
const IntroContext = createContext<IntroState>({ done: true });

export const useIntro = () => useContext(IntroContext);

export default function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("cetus-intro", "1");
    } catch {
      /* ignore (private mode) */
    }
    document.body.style.overflow = "";
    setShowPreloader(false);
    setDone(true);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("cetus-intro") === "1";
    } catch {
      seen = false;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Skip the intro on repeat visits or for reduced-motion users.
    if (seen || reduce) {
      setDone(true);
      return;
    }
    setShowPreloader(true);
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <IntroContext.Provider value={{ done }}>
      {showPreloader && <Preloader onComplete={finish} />}
      {children}
    </IntroContext.Provider>
  );
}

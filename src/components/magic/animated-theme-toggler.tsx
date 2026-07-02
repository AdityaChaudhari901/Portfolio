"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartViewTransition = (callback: () => void) => {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

function subscribeToHydration(onStoreChange: () => void) {
  const id = window.setTimeout(onStoreChange, 0);
  return () => window.clearTimeout(id);
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

type ThemeMode = "dark" | "light";

export interface AnimatedThemeTogglerProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
  variant?: ThemeTransitionVariant;
  duration?: number;
  fromCenter?: boolean;
}

type ThemeTransitionVariant = "circle" | "square" | "triangle" | "diamond" | "rectangle" | "hexagon";

const THEME_TRANSITION_DURATION_MS = 850;
const THEME_TRANSITION_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function getClipPathKeyframes(variant: ThemeTransitionVariant, x: number, y: number, radius: number) {
  if (variant === "square") {
    return [
      `inset(${y}px ${window.innerWidth - x}px ${window.innerHeight - y}px ${x}px round 0)`,
      "inset(0 0 0 0 round 0)"
    ];
  }

  if (variant === "rectangle") {
    return [
      `inset(${y}px ${window.innerWidth - x}px ${window.innerHeight - y}px ${x}px round 8px)`,
      "inset(0 0 0 0 round 8px)"
    ];
  }

  if (variant === "triangle") {
    return [
      `polygon(${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px)`,
      `polygon(${x}px ${y - radius}px, ${x + radius}px ${y + radius}px, ${x - radius}px ${y + radius}px)`
    ];
  }

  if (variant === "diamond") {
    return [
      `polygon(${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px)`,
      `polygon(${x}px ${y - radius}px, ${x + radius}px ${y}px, ${x}px ${y + radius}px, ${x - radius}px ${y}px)`
    ];
  }

  if (variant === "hexagon") {
    return [
      `polygon(${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px)`,
      `polygon(${x - radius}px ${y}px, ${x - radius / 2}px ${y - radius}px, ${x + radius / 2}px ${y - radius}px, ${x + radius}px ${y}px, ${x + radius / 2}px ${y + radius}px, ${x - radius / 2}px ${y + radius}px)`
    ];
  }

  return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
}

interface UseAnimatedThemeToggleOptions {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  variant?: ThemeTransitionVariant;
  duration?: number;
  fromCenter?: boolean;
}

export function useAnimatedThemeToggle({
  theme,
  onThemeChange,
  variant = "circle",
  duration = THEME_TRANSITION_DURATION_MS,
  fromCenter = false
}: UseAnimatedThemeToggleOptions) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isTransitioningRef = React.useRef(false);
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const isDark = isHydrated && theme === "dark";

  async function toggleTheme(event?: React.MouseEvent<HTMLElement>) {
    if (isTransitioningRef.current) {
      return;
    }

    const nextTheme = theme === "dark" ? "light" : "dark";
    const startViewTransition = (
      document as Document & { startViewTransition?: StartViewTransition }
    ).startViewTransition?.bind(document);
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggerRect = event?.currentTarget.getBoundingClientRect() ?? buttonRef.current?.getBoundingClientRect();

    if (!startViewTransition || shouldReduceMotion) {
      onThemeChange(nextTheme);
      return;
    }

    isTransitioningRef.current = true;

    try {
      const transition = startViewTransition(() => {
        flushSync(() => {
          onThemeChange(nextTheme);
        });
      });

      await transition.ready;

      const rect = fromCenter ? undefined : triggerRect;
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const [fromClipPath, toClipPath] = getClipPathKeyframes(variant, x, y, maxRadius);
      const animation = document.documentElement.animate(
        [{ clipPath: fromClipPath }, { clipPath: toClipPath }],
        {
          duration,
          easing: THEME_TRANSITION_EASING,
          pseudoElement: "::view-transition-new(root)"
        }
      );

      await Promise.allSettled([animation.finished, transition.finished]);
    } finally {
      isTransitioningRef.current = false;
    }
  }

  return {
    buttonRef,
    isDark,
    toggleTheme
  };
}

export function AnimatedThemeIcon({ isDark, className }: { isDark: boolean; className?: string }) {
  return (
    <span className={cn("relative flex size-4 items-center justify-center", className)}>
      <Sun className={cn("absolute size-full transition-transform duration-300", isDark ? "scale-100 rotate-0" : "scale-0 rotate-90")} />
      <Moon
        className={cn(
          "absolute size-full transition-transform duration-300",
          isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        )}
      />
    </span>
  );
}

export function AnimatedThemeToggler({
  theme,
  onThemeChange,
  className,
  variant = "circle",
  duration,
  fromCenter
}: AnimatedThemeTogglerProps) {
  const { buttonRef, isDark, toggleTheme } = useAnimatedThemeToggle({
    theme,
    onThemeChange,
    variant,
    duration,
    fromCenter
  });

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      className={cn("relative overflow-hidden", className)}
      onClick={toggleTheme}
    >
      <AnimatedThemeIcon isDark={isDark} />
    </Button>
  );
}

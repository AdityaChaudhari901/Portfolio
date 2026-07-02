"use client";

import * as React from "react";
import { animate, useInView } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  /** Renders a fixed number of locale-formatted digits (e.g. thousands separators). */
  format?: boolean;
}

export function CountUp({ to, from = 0, duration = 1.6, className, format = true }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  React.useEffect(() => {
    if (!inView) return;

    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (value: number) => {
      const rounded = Math.round(value);
      node.textContent = format ? rounded.toLocaleString() : String(rounded);
    };

    if (prefersReduced) {
      render(to);
      return;
    }

    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: render
    });

    return () => controls.stop();
  }, [inView, from, to, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format ? from.toLocaleString() : from}
    </span>
  );
}

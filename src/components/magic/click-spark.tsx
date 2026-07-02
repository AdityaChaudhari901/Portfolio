"use client";

import * as React from "react";

interface Ripple {
  x: number;
  y: number;
  life: number; // 1 -> 0
}

const RING_COLOR = "245, 196, 81"; // amber, matches the site accent
const MAX_RADIUS = 22; // how far the ring expands, in px
const FADE = 0.05; // life lost per frame (~0.33s total)

export function ClickSpark() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ripplesRef = React.useRef<Ripple[]>([]);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ripples = ripplesRef.current;

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const r = ripples[i];
        r.life -= FADE;

        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // Ease-out expansion: fast at first, settling as it fades.
        const progress = 1 - r.life;
        const radius = MAX_RADIUS * (1 - Math.pow(1 - progress, 2));

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(${RING_COLOR}, ${r.life * 0.45})`;
        ctx.stroke();
      }

      if (ripples.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        rafRef.current = null;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      ripplesRef.current.push({ x: event.clientX, y: event.clientY, life: 1 });
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}

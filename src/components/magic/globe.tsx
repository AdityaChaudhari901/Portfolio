"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

// Amber to match the site accent.
const MARKER_COLOR: [number, number, number] = [251 / 255, 196 / 255, 81 / 255];

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  mapBaseBrightness: 0.12,
  baseColor: [1, 1, 1],
  markerColor: MARKER_COLOR,
  glowColor: [1, 1, 1],
  markers: [
    { location: [18.5204, 73.8567], size: 0.06 }, // Pune, India (home)
    { location: [19.076, 72.8777], size: 0.04 }, // Mumbai
    { location: [28.6139, 77.209], size: 0.03 }, // Delhi
    { location: [12.9716, 77.5946], size: 0.03 }, // Bengaluru
    { location: [13.0827, 80.2707], size: 0.03 }, // Chennai
    { location: [17.385, 78.4867], size: 0.03 }, // Hyderabad
    { location: [40.7128, -74.006], size: 0.03 }, // New York
    { location: [37.7749, -122.4194], size: 0.03 }, // San Francisco
    { location: [34.0522, -118.2437], size: 0.03 }, // Los Angeles
    { location: [41.8781, -87.6298], size: 0.03 }, // Chicago
    { location: [43.6532, -79.3832], size: 0.03 }, // Toronto
    { location: [51.5074, -0.1278], size: 0.03 }, // London
    { location: [48.8566, 2.3522], size: 0.03 }, // Paris
    { location: [52.52, 13.405], size: 0.03 }, // Berlin
    { location: [52.3676, 4.9041], size: 0.03 }, // Amsterdam
    { location: [55.7558, 37.6173], size: 0.03 }, // Moscow
    { location: [25.2048, 55.2708], size: 0.03 }, // Dubai
    { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
    { location: [3.139, 101.6869], size: 0.03 }, // Kuala Lumpur
    { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
    { location: [37.5665, 126.978], size: 0.03 }, // Seoul
    { location: [22.3193, 114.1694], size: 0.03 }, // Hong Kong
    { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
    { location: [-23.5505, -46.6333], size: 0.03 }, // São Paulo
    { location: [-1.2921, 36.8219], size: 0.03 } // Nairobi
  ]
};

export function Globe({
  className,
  config = GLOBE_CONFIG
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const phi = React.useRef(0);
  const width = React.useRef(0);
  const pointerInteracting = React.useRef<number | null>(null);
  const pointerInteractionMovement = React.useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  React.useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onResize = () => {
      if (canvasRef.current) {
        width.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width.current * 2,
      height: width.current * 2
    });

    // cobe v2 has no internal loop — we drive each frame ourselves.
    let raf = 0;
    const render = () => {
      if (!pointerInteracting.current && !prefersReduced) {
        phi.current += 0.005;
      }
      globe.update({
        phi: phi.current + rs.get(),
        width: width.current * 2,
        height: width.current * 2
      });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const timeout = setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", className)}>
      <canvas
        className="size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(event) => {
          pointerInteractionMovement.current = 0;
          updatePointerInteraction(event.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(event) => updateMovement(event.clientX)}
        onTouchMove={(event) =>
          event.touches[0] && updateMovement(event.touches[0].clientX)
        }
      />
    </div>
  );
}

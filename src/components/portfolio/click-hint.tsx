import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * A "click to know more" hint: a friendly pointing character (mirrored so he
 * points toward the cards) with a hand-drawn arrow and handwritten text.
 * Purely decorative — shown only where there's left-margin room.
 */
export function ClickHint({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none select-none", className)}>
      <span
        className="mb-1 block text-center text-sm leading-tight text-neutral-400 dark:text-neutral-400"
        style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
      >
        Click to know more
      </span>

      <div className="relative mx-auto w-14">
        <Image src="/pointing-boy.png" alt="" width={300} height={457} className="w-14 -scale-x-100" />

        {/* dashed curved arrow sweeping from the finger to the card */}
        <svg
          viewBox="0 0 58 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-full top-[46%] w-16 -translate-y-1/2 text-neutral-400 dark:text-neutral-400"
        >
          <path d="M2 12 C 14 40, 40 40, 53 13" strokeDasharray="5 6" />
          <path d="M45 14 L54 11 L53 23" />
        </svg>
      </div>
    </div>
  );
}

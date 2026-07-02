"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { IconLayoutGrid, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  external?: boolean;
}

export interface FloatingDockProps {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}

export function FloatingDock({ items, desktopClassName, mobileClassName }: FloatingDockProps) {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
}

interface FloatingDockVariantProps {
  items: FloatingDockItem[];
  className?: string;
}

function FloatingDockDesktop({ items, className }: FloatingDockVariantProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <motion.nav
      aria-label="Portfolio dock navigation"
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        "fixed bottom-4 left-1/2 z-40 hidden h-16 -translate-x-1/2 items-end gap-3 rounded-2xl border bg-background/85 px-4 pb-3 shadow-2xl backdrop-blur-xl sm:flex",
        className
      )}
    >
      {items.map((item) => (
        <FloatingDockIconContainer key={item.title} item={item} mouseX={mouseX} />
      ))}
    </motion.nav>
  );
}

function FloatingDockMobile({ items, className }: FloatingDockVariantProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 sm:hidden", className)}>
      <AnimatePresence>
        {open ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            className="mb-3 flex flex-col items-center gap-3"
          >
            {items
              .slice()
              .reverse()
              .map((item) => (
                <DockAction
                  key={item.title}
                  item={item}
                  className="flex size-11 items-center justify-center rounded-full border bg-background/90 shadow-xl backdrop-blur"
                  onAction={() => setOpen(false)}
                >
                  <span className="size-5">{item.icon}</span>
                  <span className="sr-only">{item.title}</span>
                </DockAction>
              ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label={open ? "Close floating dock" : "Open floating dock"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex size-12 items-center justify-center rounded-full border bg-background/90 text-foreground shadow-2xl backdrop-blur transition-colors hover:bg-accent"
      >
        {open ? <IconX className="size-5" /> : <IconLayoutGrid className="size-5" />}
      </button>
    </div>
  );
}

interface FloatingDockIconContainerProps {
  mouseX: MotionValue<number>;
  item: FloatingDockItem;
}

function FloatingDockIconContainer({ mouseX, item }: FloatingDockIconContainerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) {
      return Number.POSITIVE_INFINITY;
    }

    return value - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 78, 40]);
  const iconTransform = useTransform(distance, [-150, 0, 150], [20, 38, 20]);
  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconSize = useSpring(iconTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full"
    >
      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, x: "-50%", filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 2, x: "-50%", filter: "blur(8px)" }}
            className="absolute -top-10 left-1/2 w-max rounded-md border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-xl"
          >
            {item.title}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <DockAction
        item={item}
        className="flex size-full items-center justify-center rounded-full border bg-background text-muted-foreground shadow-md transition-colors hover:text-foreground"
      >
        <motion.span style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
          {item.icon}
        </motion.span>
        <span className="sr-only">{item.title}</span>
      </DockAction>
    </motion.div>
  );
}

interface DockActionProps {
  item: FloatingDockItem;
  className?: string;
  children: React.ReactNode;
  onAction?: () => void;
}

function DockAction({ item, className, children, onAction }: DockActionProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    item.onClick?.(event);
    onAction?.();
  }

  if (item.onClick) {
    return (
      <button type="button" aria-label={item.title} onClick={handleClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={item.href ?? "#"}
      aria-label={item.title}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      onClick={onAction}
      className={className}
    >
      {children}
    </a>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Experience } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  return (
    <Card className="overflow-hidden bg-card/75 shadow-none">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full cursor-pointer text-left transition-colors hover:bg-accent/40"
      >
        <CardHeader className="p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <CardTitle className="font-sans text-base font-semibold">{experience.company}</CardTitle>
              <CardDescription className="mt-1">
                {experience.role} - {experience.location}
              </CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:items-start">
              <span className="text-xs text-muted-foreground sm:text-right">{experience.period}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </div>
          </div>
        </CardHeader>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-sm leading-7 text-muted-foreground">{experience.summary}</p>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-7 text-muted-foreground">
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}

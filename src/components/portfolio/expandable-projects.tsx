"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { Project } from "@/lib/data";

import { ProjectVisual } from "./project-visual";

const badgeVariantByAccent = {
  signal: "signal",
  ember: "ember",
  coral: "coral"
} as const;

export function ExpandableProjects({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState<Project | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    document.body.style.overflow = active ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Always release the scroll lock if this component unmounts while open.
  React.useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 h-full w-full bg-black/60 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.button
              key={`close-${active.title}-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              onClick={() => setActive(null)}
              aria-label="Close project details"
              className="absolute right-4 top-4 z-[60] flex size-8 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition-colors hover:bg-accent"
            >
              <X className="size-4" />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="p-3 pb-0">
                <ProjectVisual project={active} />
              </motion.div>

              <div className="flex-1 overflow-auto p-4">
                <Badge variant={badgeVariantByAccent[active.accent]} className="mb-2 w-fit">
                  {active.subtitle}
                </Badge>
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="font-serif text-2xl font-semibold"
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`desc-${active.title}-${id}`}
                  className="mt-2 text-sm leading-6 text-muted-foreground"
                >
                  {active.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{active.impact}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.stack.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {active.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Button key={link.label} asChild size="sm">
                          <a href={link.href} target="_blank" rel="noreferrer">
                            {Icon ? <Icon /> : null}
                            {link.label}
                            <ExternalLink />
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <motion.div
            layoutId={`card-${project.title}-${id}`}
            key={project.title}
            onClick={() => setActive(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive(project);
              }
            }}
            className="group cursor-pointer overflow-hidden rounded-xl border bg-card/75 outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <motion.div layoutId={`image-${project.title}-${id}`}>
              <ProjectVisual project={project} />
            </motion.div>
            <div className="p-4">
              <Badge variant={badgeVariantByAccent[project.accent]} className="mb-2 w-fit">
                {project.subtitle}
              </Badge>
              <motion.h3
                layoutId={`title-${project.title}-${id}`}
                className="font-sans text-base font-semibold"
              >
                {project.title}
              </motion.h3>
              <motion.p
                layoutId={`desc-${project.title}-${id}`}
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                {project.description}
              </motion.p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Click to view details
                <ExternalLink className="size-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

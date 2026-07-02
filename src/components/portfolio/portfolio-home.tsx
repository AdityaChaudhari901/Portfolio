"use client";

import * as React from "react";
import { ArrowUpRight, Download, MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Globe } from "@/components/magic/globe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import {
  certifications,
  contactLinks,
  education,
  experiences,
  profile,
  projects,
  skillGroups
} from "@/lib/data";
import type { ContributionData } from "@/lib/github";

import { ClickHint } from "./click-hint";
import { ExperienceCard } from "./experience-card";
import { FloatingDock } from "./floating-dock";
import { GitHubActivity } from "./github-activity";
import { ProjectVisual } from "./project-visual";

interface RevealProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const badgeVariantByAccent = {
  signal: "signal",
  ember: "ember",
  coral: "coral"
} as const;

function Reveal({ id, className, children }: RevealProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold">{children}</h2>;
}

export function PortfolioHome({ contributions }: { contributions: ContributionData }) {
  const EducationIcon = education.icon;

  return (
    <>
      <div className="grain" />
      <FloatingDock />

      <main className="mx-auto flex min-h-screen w-full flex-col px-4 pb-28 pt-16 sm:max-w-4xl sm:px-6 sm:pt-24">
        <section id="home" className="scroll-mt-24">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <Badge variant="outline" className="mb-4 bg-background/80">
                <Sparkles className="mr-2 size-3" />
                Full-stack, AI, and mobile engineering
              </Badge>
              <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                <span>Hi, I&apos;m </span>
                <PointerHighlight
                  containerClassName="inline-block align-baseline"
                  rectangleClassName="border-neutral-300 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700"
                  pointerClassName="size-5 -rotate-90 text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] dark:text-yellow-400"
                >
                  <span className="relative z-10 inline-block px-1">
                    Aditya
                  </span>
                </PointerHighlight>
              </h1>
              <p className="mt-3 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {profile.role} building AI agents, React Native chat SDKs, RAG systems, and production web applications.
              </p>
            </div>
            <div className="hidden size-24 shrink-0 items-center justify-center rounded-lg border bg-card font-serif text-3xl font-semibold shadow-sm sm:flex">
              AC
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <a href="#projects">
                View work
                <ArrowUpRight />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={profile.resumeHref}>
                <Download />
                Resume
              </a>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              {profile.location}
            </span>
            <span className="hidden sm:inline">{profile.email}</span>
          </div>
        </section>

        <Reveal id="about" className="scroll-mt-24 pt-12">
          <SectionTitle>About</SectionTitle>
          <div className="space-y-4 text-pretty text-sm leading-7 text-muted-foreground">
            <p>{profile.summary}</p>
            <p>{profile.currentFocus}</p>
          </div>
        </Reveal>

        <Reveal id="experience" className="scroll-mt-24 pt-12">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="relative space-y-4">
            <ClickHint className="absolute right-full top-10 mr-8 hidden w-24 -translate-y-1/2 xl:block" />
            {experiences.map((experience) => (
              <ExperienceCard key={experience.company} experience={experience} />
            ))}
          </div>
        </Reveal>

        <Reveal className="pt-12">
          <SectionTitle>Education</SectionTitle>
          <Card className="bg-card/75 shadow-none">
            <CardHeader className="p-4">
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
                  <EducationIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="font-sans text-base font-semibold">{education.school}</CardTitle>
                  <CardDescription className="mt-1">{education.degree}</CardDescription>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {education.period} - {education.location}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Reveal>

        <Reveal id="skills" className="scroll-mt-24 pt-12">
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {skillGroups.flatMap((group) => group.skills).map((skill, index) => (
              <Badge key={`${skill}-${index}`} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Reveal>

        <Reveal id="activity" className="scroll-mt-24 pt-12">
          <GitHubActivity data={contributions} />
        </Reveal>

        <Reveal id="projects" className="scroll-mt-24 pt-12">
          <div className="mb-6 text-center">
            <Badge variant="outline" className="mb-3 bg-background/80">
              My Projects
            </Badge>
            <h2 className="font-serif text-3xl font-semibold">Check out my latest work</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              A few resume-backed projects across AI platforms, CMS systems, and customer-facing agent workflows.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.title} className="overflow-hidden bg-card/75 shadow-none">
                <ProjectVisual project={project} />
                <CardHeader className="p-4">
                  <Badge variant={badgeVariantByAccent[project.accent]} className="mb-2 w-fit">
                    {project.subtitle}
                  </Badge>
                  <CardTitle className="font-sans text-base font-semibold">{project.title}</CardTitle>
                  <CardDescription className="mt-2 leading-6">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm leading-7 text-muted-foreground">{project.impact}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.links.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Button key={link.label} asChild variant="outline" size="sm">
                          <a href={link.href} target="_blank" rel="noreferrer">
                            {Icon ? <Icon /> : null}
                            {link.label}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal className="pt-12">
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-2">
            {certifications.map((certification) => {
              const Icon = certification.icon;

              return (
                <div key={certification.label} className="flex items-center gap-3 rounded-md border bg-card/75 p-3">
                  <Icon className="size-4" />
                  <span className="text-sm text-muted-foreground">{certification.label}</span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal id="contact" className="scroll-mt-24 pt-12">
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y bg-neutral-100 px-4 py-12 text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-none sm:px-6">
            <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="relative mb-2 h-52 w-52 sm:h-64 sm:w-64">
                <Globe className="[mask-image:radial-gradient(circle_at_center,black_62%,transparent_84%)]" />
              </div>
              <Badge variant="outline" className="mb-5 border-neutral-300 bg-white/75 text-neutral-800 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white">
                Contact
              </Badge>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-neutral-950 dark:text-white sm:text-5xl">Get in touch</h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                Want to chat about full-stack, AI, or React Native work? Send a direct message with context and I will respond when I can.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {contactLinks.map((link) => {
                  const Icon = link.icon;
                  const isExternal = link.href.startsWith("http");
                  const isXLink = link.label === "X";

                  return (
                    <Button
                      key={link.label}
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-neutral-300 bg-white/80 text-neutral-900 shadow-sm backdrop-blur hover:border-neutral-900 hover:bg-neutral-950 hover:text-white focus-visible:ring-neutral-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white dark:hover:text-neutral-950 dark:focus-visible:ring-white/70 dark:focus-visible:ring-offset-neutral-950"
                    >
                      <a href={link.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
                        {Icon && !isXLink ? <Icon /> : null}
                        {link.label}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  IconBriefcase2,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconCode,
  IconHome,
  IconMail,
  IconRocket,
  IconSocial,
  IconVolume,
  IconVolumeOff,
  IconX
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { FloatingDock as AceternityFloatingDock, type FloatingDockItem } from "@/components/ui/floating-dock";
import { AnimatedThemeIcon, useAnimatedThemeToggle } from "@/components/magic/animated-theme-toggler";
import { playTick, setSoundEnabled, useSoundEnabled } from "@/lib/sound";

const iconClassName = "h-full w-full text-neutral-500 dark:text-neutral-300";

export function FloatingDock() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const { isDark, toggleTheme } = useAnimatedThemeToggle({
    theme,
    onThemeChange: setTheme
  });
  const soundOn = useSoundEnabled();
  const [socialOpen, setSocialOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{ x: number; y: number } | null>(null);

  const socialLinks = [
    { title: "LinkedIn", Icon: IconBrandLinkedin, href: "https://www.linkedin.com/in/aditya-chaudhari-ai/" },
    { title: "GitHub", Icon: IconBrandGithub, href: "https://github.com/AdityaChaudhari901" },
    { title: "X", Icon: IconBrandX, href: "https://x.com/AdityaXCodess" }
  ];

  const links: FloatingDockItem[] = [
    {
      title: "Home",
      icon: <IconHome className={iconClassName} />,
      href: "#home"
    },
    {
      title: "Experience",
      icon: <IconBriefcase2 className={iconClassName} />,
      href: "#experience"
    },
    {
      title: "Skills",
      icon: <IconCode className={iconClassName} />,
      href: "#skills"
    },
    {
      title: "Projects",
      icon: <IconRocket className={iconClassName} />,
      href: "#projects"
    },
    {
      title: "Contact",
      icon: <IconMail className={iconClassName} />,
      href: "#contact"
    },
    {
      title: socialOpen ? "Close" : "Social",
      icon: socialOpen ? (
        <IconX className={iconClassName} />
      ) : (
        <IconSocial className={iconClassName} />
      ),
      onClick: (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setAnchor({ x: rect.left + rect.width / 2, y: rect.top });
        setSocialOpen((open) => !open);
      }
    },
    {
      title: soundOn ? "Sound on" : "Sound off",
      icon: soundOn ? (
        <IconVolume className={iconClassName} />
      ) : (
        <IconVolumeOff className={iconClassName} />
      ),
      onClick: () => {
        const next = !soundOn;
        setSoundEnabled(next);
        if (next) playTick(); // confirmation tick when turning it on
      }
    },
    {
      title: "Theme",
      icon: <AnimatedThemeIcon isDark={isDark} className={iconClassName} />,
      onClick: toggleTheme
    }
  ];

  return (
    <>
      <AnimatePresence>
        {socialOpen && anchor ? (
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-[55]"
              onClick={() => setSocialOpen(false)}
            />
            {/* vertical menu stacked flush just above the dock, anchored to the
                button's x (stable — not affected by the dock's hover magnify) */}
            <div className="fixed bottom-20 z-[60]" style={{ left: anchor.x }}>
              {socialLinks.map((social, index) => {
                const Icon = social.Icon;
                return (
                  <motion.a
                    key={social.title}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.title}
                    onClick={() => setSocialOpen(false)}
                    initial={{ y: 0, opacity: 0, scale: 0.3 }}
                    animate={{ y: -(index * 44), opacity: 1, scale: 1 }}
                    exit={{ y: 0, opacity: 0, scale: 0.3 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 320, damping: 22 }}
                    className="absolute bottom-0 left-0 -ml-[22px] flex size-11 items-center justify-center rounded-full border bg-background text-neutral-500 shadow-lg transition-colors hover:bg-accent hover:text-foreground dark:text-neutral-300"
                  >
                    <Icon className="size-5" />
                  </motion.a>
                );
              })}
            </div>
          </>
        ) : null}
      </AnimatePresence>

      <AceternityFloatingDock items={links} />
    </>
  );
}

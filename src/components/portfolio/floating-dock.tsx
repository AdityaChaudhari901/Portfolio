"use client";

import {
  IconBriefcase2,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCode,
  IconHome,
  IconMail,
  IconRocket,
  IconVolume,
  IconVolumeOff
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
      title: "Projects",
      icon: <IconRocket className={iconClassName} />,
      href: "#projects"
    },
    {
      title: "Skills",
      icon: <IconCode className={iconClassName} />,
      href: "#skills"
    },
    {
      title: "Contact",
      icon: <IconMail className={iconClassName} />,
      href: "#contact"
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedin className={iconClassName} />,
      href: "https://linkedin.com/in/aditya-chaudhari-ai",
      external: true
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className={iconClassName} />,
      href: "https://github.com/AdityaChaudhari901",
      external: true
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

  return <AceternityFloatingDock items={links} />;
}

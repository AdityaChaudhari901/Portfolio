"use client";

import * as React from "react";

import { initSound } from "@/lib/sound";

/** Mounts once to restore the sound preference and attach the global click listener. */
export function SoundController() {
  React.useEffect(() => {
    initSound();
  }, []);

  return null;
}

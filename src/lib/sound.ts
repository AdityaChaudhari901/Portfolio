import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sound-enabled";
const CLICK_SOUND_SRC = "/MouseClick.mp3";
const POOL_SIZE = 4; // lets rapid clicks overlap instead of cutting each other off
const VOLUME = 0.5;

let enabled = false;
let initialized = false;
let pool: HTMLAudioElement[] = [];
let poolIndex = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Wire up the global click listener and restore the saved preference.
 * Safe to call multiple times — only the first call takes effect.
 */
export function initSound() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  enabled = window.localStorage.getItem(STORAGE_KEY) === "true";
  emit();

  pool = Array.from({ length: POOL_SIZE }, () => {
    const audio = new Audio(CLICK_SOUND_SRC);
    audio.preload = "auto";
    audio.volume = VOLUME;
    return audio;
  });

  window.addEventListener("pointerdown", () => {
    if (enabled) playTick();
  });
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }
  emit();
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook: re-renders when the sound preference changes. */
export function useSoundEnabled() {
  return useSyncExternalStore(
    subscribeSound,
    () => enabled,
    () => false
  );
}

/** Plays the click sound (public/MouseClick.mp3) from a small round-robin pool. */
export function playTick() {
  if (typeof window === "undefined" || pool.length === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const audio = pool[poolIndex];
  poolIndex = (poolIndex + 1) % pool.length;

  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Autoplay blocked or interrupted — fail silently.
    });
  } catch {
    // Audio unsupported — fail silently.
  }
}

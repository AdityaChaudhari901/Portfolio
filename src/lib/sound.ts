import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sound-enabled";
const CLICK_SOUND_SRC = "/MouseClick.mp3";
const VOLUME = 0.5;

let enabled = false;
let initialized = false;

// Web Audio gives near-instant, overlapping playback. HTMLAudioElement.play()
// carries 100-300ms of latency on mobile (esp. iOS Safari), which is what made
// the click feel laggy and slow. We decode the clip once into an AudioBuffer and
// fire a fresh, disposable source node per click.
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let buffer: AudioBuffer | null = null;
let decoding = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/** Create the AudioContext + gain and decode the clip. Safe to call repeatedly. */
function ensureAudio() {
  if (typeof window === "undefined") return;

  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return; // Web Audio unsupported — stay silent.
    ctx = new Ctor();
    gain = ctx.createGain();
    gain.gain.value = VOLUME;
    gain.connect(ctx.destination);
  }

  if (!buffer && !decoding) {
    decoding = true;
    void fetch(CLICK_SOUND_SRC)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx!.decodeAudioData(data))
      .then((decoded) => {
        buffer = decoded;
      })
      .catch(() => {
        // Fetch/decode failed — fail silently, no clicks will sound.
      })
      .finally(() => {
        decoding = false;
      });
  }
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

  // Kick off context creation + decode up front so the buffer is ready before
  // the first real click. The context starts "suspended" on mobile until a
  // gesture resumes it (handled in the pointerdown listener below).
  ensureAudio();

  window.addEventListener(
    "pointerdown",
    () => {
      // A user gesture is the only place iOS/Chrome will resume a suspended
      // AudioContext — do it on every click; it's a no-op once running.
      if (ctx?.state === "suspended") void ctx.resume();
      if (enabled) playTick();
    },
    { passive: true }
  );
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

/** Plays the click sound (public/MouseClick.mp3) with near-zero latency. */
export function playTick() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ensureAudio();
  if (!ctx || !gain || !buffer) return; // still decoding — skip this click.

  if (ctx.state === "suspended") void ctx.resume();

  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.start(0);
  } catch {
    // start() can throw if the context is in a bad state — fail silently.
  }
}

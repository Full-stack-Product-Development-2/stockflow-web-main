import { useSyncExternalStore } from "react";

// Bump the version to discard everything saved by an older data shape.
const PREFIX = "stockflow:v1:";

const values = new Map();
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function readSaved(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function getStored(key, seed) {
  if (!values.has(key)) values.set(key, readSaved(key) ?? seed);
  return values.get(key);
}

export function setStored(key, seed, update) {
  const next = typeof update === "function" ? update(getStored(key, seed)) : update;
  values.set(key, next);

  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(next));
  } catch {
    // Storage blocked or full: keep the in-memory value for this tab.
  }

  emit();
}

export function useStored(key, seed) {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => getStored(key, seed),
  );
}

export function clearStored() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing saved to clear.
  }

  values.clear();
  emit();
}

// Another tab changed the data: drop the cached copy so the next read reloads it.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === null) values.clear();
    else if (event.key.startsWith(PREFIX)) values.delete(event.key.slice(PREFIX.length));
    else return;

    emit();
  });
}

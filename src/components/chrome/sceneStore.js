// What each section is showing right now, published by the stories so the page chrome can follow
// them: a short line of detail and the mark that fits the scene.
import { useSyncExternalStore } from "react";

let snapshot = {};
const listeners = new Set();

export function publishScene(section, data) {
  const previous = snapshot[section];
  if (previous && previous.detail === data.detail && previous.mark === data.mark && previous.accent === data.accent) return;
  snapshot = { ...snapshot, [section]: data };
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSceneDetails = () => useSyncExternalStore(subscribe, () => snapshot, () => snapshot);

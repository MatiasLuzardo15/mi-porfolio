import { useEffect, useState } from "react";

// A value driven by scroll that the visitor can still override by hand.
// The override lasts until the scroll-driven value changes again.
export function useScrubbed(scrubbed) {
  const [override, setOverride] = useState(null);
  useEffect(() => setOverride(null), [scrubbed]);
  return [override ?? scrubbed, setOverride];
}

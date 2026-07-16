import { useEffect, useRef } from "react";

export const PremiumCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrame;

    document.documentElement.classList.add("custom-cursor-enabled");

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      animationFrame = requestAnimationFrame(render);
    };

    const showCursor = () => {
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };

    const hideCursor = () => {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };

    const onPointerMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      showCursor();

      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest("a, button, input, textarea, [role='button']");
      ring.classList.toggle("is-interactive", Boolean(interactive));
    };

    const onPointerDown = () => ring.classList.add("is-pressed");
    const onPointerUp = () => ring.classList.remove("is-pressed");
    const onPointerOut = (event) => {
      if (!event.relatedTarget) hideCursor();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointerout", onPointerOut);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className="premium-cursor-ring" aria-hidden="true" />
      <span ref={dotRef} className="premium-cursor-dot" aria-hidden="true" />
    </>
  );
};

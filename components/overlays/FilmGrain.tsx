"use client";
import { useEffect, useRef } from "react";

export default function FilmGrain({ opacity = 0.045 }: { opacity?: number }) {
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let seed = 0;
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      if (turbRef.current) {
        turbRef.current.setAttribute("seed", String(seed));
        seed = (seed + 1) % 1000;
      }
      timer = setTimeout(tick, 80);
    }
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 99 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="mpfl-grain" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="1" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" in="noise" result="grayNoise"/>
        <feComposite in="grayNoise" in2="SourceGraphic" operator="in"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#mpfl-grain)" opacity={opacity}/>
    </svg>
  );
}

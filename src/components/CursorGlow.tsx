import { useEffect, useRef, useState } from 'react';
import { spotlightOn } from '../lib/spotlight';

// A soft teal spotlight that trails the cursor. Uses `screen` blending so it
// only lightens the dark UI (never muddies text). Disabled for touch devices,
// reduced-motion users, and when the visitor turns it off (nav toggle).
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);

  // React to the nav toggle.
  useEffect(() => {
    setEnabled(spotlightOn());
    const onChange = (e: Event) => setEnabled((e as CustomEvent).detail as boolean);
    window.addEventListener('spotlight', onChange);
    return () => window.removeEventListener('spotlight', onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    if (!el) return;
    if (!enabled || reduce || noHover) {
      el.style.opacity = '0';
      return;
    }

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = '1';
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    const tick = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      el.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-[600px] w-[600px] opacity-0 transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, rgba(20,184,166,0.10), transparent 60%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

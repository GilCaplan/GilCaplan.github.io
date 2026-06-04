import { useEffect, useRef } from 'react';

// Subtle animated node/edge graph — a quiet nod to Warset's conflict network.
// Respects prefers-reduced-motion (renders a static frame).
export default function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    const N = 46;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));

    // Pointer interaction: nearby nodes link to the cursor and drift toward it.
    const mouse = { x: -1, y: -1, on: false };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= w && mouse.y <= h;
    };
    const onLeave = () => {
      mouse.on = false;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const R = 180; // pointer influence radius (px)
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          // gentle pull toward the cursor when it's near
          if (mouse.on) {
            const ddx = mouse.x / w - n.x;
            const ddy = mouse.y / h - n.y;
            if (Math.hypot(ddx * w, ddy * h) < R) {
              n.vx += ddx * 0.0000016;
              n.vy += ddy * 0.0000016;
            }
          }
          n.vx = Math.max(-0.0013, Math.min(0.0013, n.vx));
          n.vy = Math.max(-0.0013, Math.min(0.0013, n.vy));
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
        }
      }
      // links from nearby nodes to the cursor
      if (mouse.on) {
        for (const n of nodes) {
          const dx = n.x * w - mouse.x;
          const dy = n.y * h - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            ctx.strokeStyle = `rgba(20, 184, 166, ${0.28 * (1 - dist / R)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x * w, n.y * h);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 26);
        g.addColorStop(0, 'rgba(20, 184, 166, 0.5)');
        g.addColorStop(1, 'rgba(20, 184, 166, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      // edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(20, 184, 166, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.55)';
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    if (!reduce) {
      window.addEventListener('pointermove', onMove);
      document.addEventListener('mouseleave', onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}

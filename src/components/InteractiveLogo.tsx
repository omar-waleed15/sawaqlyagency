import { useEffect, useRef } from "react";

interface Dot {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

// Bitmap of the "S" logo split into left (blue) and right (yellow) halves.
// 1 = blue, 2 = yellow, 0 = empty
const PATTERN = [
  "0011111111100111111111100",
  "0111111111101111111111110",
  "1111000000001111000000111",
  "1111000000001110000000011",
  "1111000000000000000000000",
  "1111100000000000000000000",
  "0111111111100000000000000",
  "0011111111110000000000000",
  "0000000111111000000000000",
  "0000000011111100000000000",
  "0000000001111110000000000",
  "0000000000022222200000000",
  "0000000000002222220000000",
  "0000000000000022222220000",
  "0000000000000002222222000",
  "0000000000000000222222200",
  "0000000000000000022222220",
  "0000000000022000002222222",
  "0000000000222200000222222",
  "0000000002222220000022222",
  "1100000022222220000022222",
  "1111111111222000000022222",
  "1111111110000000000022222",
  "0111111100000000000222222",
  "0011111000000000002222220",
];

export default function InteractiveLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const setup = () => {
      const parent = canvas.parentElement!;
      const size = Math.min(parent.clientWidth, 560);
      sizeRef.current = { w: size, h: size };
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = PATTERN[0].length;
      const rows = PATTERN.length;
      const cell = size / (cols + 6);
      const offX = (size - cols * cell) / 2;
      const offY = (size - rows * cell) / 2;

      const blue = getCss("--brand-blue");
      const yellow = getCss("--brand-yellow");

      const dots: Dot[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = PATTERN[r][c];
          if (v === "0") continue;
          const x = offX + c * cell + cell / 2;
          const y = offY + r * cell + cell / 2;
          dots.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            color: v === "1" ? blue : yellow,
          });
        }
      }
      dotsRef.current = dots;
    };

    const getCss = (name: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || "#3b82f6";
    };

    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas.parentElement!);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouseRef.current = { x: -9999, y: -9999 });
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const tick = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      const cell = w / (PATTERN[0].length + 6);
      const radius = cell * 0.38;
      const repel = cell * 6;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const d of dotsRef.current) {
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < repel) {
          const f = (1 - dist / repel) * 4;
          d.vx += (dx / (dist || 1)) * f;
          d.vy += (dy / (dist || 1)) * f;
        }
        // spring back
        d.vx += (d.ox - d.x) * 0.06;
        d.vy += (d.oy - d.y) * 0.06;
        d.vx *= 0.82;
        d.vy *= 0.82;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.fillStyle = d.color;
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto">
      <div
        className="absolute inset-8 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <canvas ref={canvasRef} className="relative touch-none" />
    </div>
  );
}

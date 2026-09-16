const STARS = Array.from({ length: 52 }, (_, i) => ({
  left: `${(i * 19 + 8) % 100}%`,
  top: `${(i * 37 + 13) % 100}%`,
  size: 1 + (i % 3),
  delay: `${(i % 7) * 0.45}s`,
  duration: `${2.4 + (i % 5) * 0.7}s`,
}));

export function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STARS.map((star, i) => (
        <span
          key={i}
          className="planet-star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

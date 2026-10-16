/**
 * Glowing voxel core floating between the two hands — a small plus-shaped
 * cluster of translucent cubes (violet top, ember heart) with a soft halo.
 * Pure CSS so it stays crisp; drifts gently and follows the cursor.
 */
export default function CrystalCore() {
  const cube = (extra, background, shadow) => ({
    background,
    boxShadow: `${shadow}, inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -6px 10px rgba(0,0,0,0.35)`,
    ...extra,
  });

  return (
    <div className="core-float pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Halo */}
      <div
        aria-hidden
        className="core-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          width: 190,
          height: 190,
          background:
            'radial-gradient(circle, rgba(253,186,116,0.5) 0%, rgba(240,171,252,0.32) 38%, rgba(139,92,246,0.22) 62%, transparent 75%)',
        }}
      />
      {/* Voxel plus */}
      <div className="relative" style={{ width: 118, height: 118 }}>
        <div
          aria-hidden
          className="absolute rounded-[5px]"
          style={cube(
            { left: 40, top: 6, width: 38, height: 38, transform: 'rotate(-8deg)' },
            'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 55%, #6d28d9 100%)',
            '0 0 26px rgba(139,92,246,0.8)'
          )}
        />
        <div
          aria-hidden
          className="absolute rounded-[5px]"
          style={cube(
            { left: 8, top: 40, width: 38, height: 38, transform: 'rotate(6deg)' },
            'linear-gradient(135deg, #e9d5ff 0%, #a855f7 60%, #7e22ce 100%)',
            '0 0 26px rgba(168,85,247,0.8)'
          )}
        />
        <div
          aria-hidden
          className="absolute rounded-[6px]"
          style={cube(
            { left: 40, top: 40, width: 40, height: 40 },
            'linear-gradient(135deg, #fff7ed 0%, #fdba74 35%, #f0abfc 70%, #8b5cf6 100%)',
            '0 0 34px rgba(253,186,116,0.9)'
          )}
        />
        <div
          aria-hidden
          className="absolute rounded-[5px]"
          style={cube(
            { left: 74, top: 40, width: 36, height: 36, transform: 'rotate(-5deg)' },
            'linear-gradient(135deg, #fae8ff 0%, #f0abfc 55%, #a855f7 100%)',
            '0 0 26px rgba(240,171,252,0.8)'
          )}
        />
        <div
          aria-hidden
          className="absolute rounded-[5px]"
          style={cube(
            { left: 40, top: 74, width: 38, height: 38, transform: 'rotate(7deg)' },
            'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 60%, #4c1d95 100%)',
            '0 0 26px rgba(139,92,246,0.8)'
          )}
        />
        {/* Ember heart */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[6px]"
          style={{ width: 26, height: 26, background: 'radial-gradient(circle, #fff7ed 0%, #fdba74 55%, transparent 80%)' }}
        />
      </div>
    </div>
  );
}

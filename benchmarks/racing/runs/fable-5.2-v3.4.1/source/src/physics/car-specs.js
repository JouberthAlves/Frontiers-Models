// Physical description of the two car models. The same specs drive the player and the AIs.
// Axes of the car frame: x forward, y up, z right. Distances in metres, mass in kg.

const torqueCurve = (pts) => (x) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
    return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
  }
  return pts[pts.length - 1][1];
};

export const CAR_SPECS = {
  // low, wide rear-wheel-drive GT coupe: more power, more top speed, a little tail-happy
  gt: {
    id: 'gt', name: 'Aurora GT', tagline: 'Cupê GT · V8 · tração traseira',
    mass: 1420, wheelbase: 2.68, track: 1.64, cgHeight: 0.43, frontWeight: 0.47,
    length: 4.56, width: 1.94, height: 1.24,
    wheelRadius: 0.345, wheelWidth: 0.30,
    yawInertiaK: 1.05, rideHeight: 0.115,
    spring: [62000, 68000], damper: [5200, 5600], arb: [16000, 9000], bump: 0.085,
    mu: 1.04, corneringB: 13.2, corneringC: 1.45, peakFalloff: 0.86,
    drive: [0, 1], brakeBias: 0.62, brakeForce: 16800,
    cdA: 0.68, clA: 1.05, aeroBalance: 0.44,
    engine: {
      idle: 950, redline: 7600, limiter: 7750, peakTorque: 382, inertia: 0.16,
      curve: torqueCurve([[0, 0.55], [0.13, 0.62], [0.3, 0.84], [0.5, 0.97], [0.66, 1.0], [0.82, 0.94], [0.95, 0.83], [1.02, 0.7]]),
      gears: [3.15, 2.18, 1.62, 1.27, 1.03, 0.86], final: 3.42, reverse: 3.0, efficiency: 0.9, shiftTime: 0.14,
      engineBrake: 0.11,
    },
    steerLock: 34, audio: 'v8',
  },
  // short, upright all-wheel-drive hot hatch: lighter, punchy out of corners, lower top speed
  hatch: {
    id: 'hatch', name: 'Vento RS', tagline: 'Hatch esportivo · turbo · tração integral',
    mass: 1295, wheelbase: 2.56, track: 1.56, cgHeight: 0.5, frontWeight: 0.58,
    length: 4.18, width: 1.84, height: 1.42,
    wheelRadius: 0.33, wheelWidth: 0.255,
    yawInertiaK: 0.98, rideHeight: 0.13,
    spring: [58000, 52000], damper: [4900, 4500], arb: [15000, 12500], bump: 0.09,
    mu: 1.03, corneringB: 13.8, corneringC: 1.42, peakFalloff: 0.88,
    drive: [0.42, 0.58], brakeBias: 0.66, brakeForce: 15400,
    cdA: 0.74, clA: 0.7, aeroBalance: 0.47,
    engine: {
      idle: 1000, redline: 7000, limiter: 7150, peakTorque: 348, inertia: 0.13,
      curve: torqueCurve([[0, 0.45], [0.14, 0.52], [0.3, 0.9], [0.42, 1.0], [0.7, 1.0], [0.85, 0.9], [0.96, 0.78], [1.02, 0.66]]),
      gears: [3.45, 2.3, 1.68, 1.3, 1.05, 0.87], final: 3.55, reverse: 3.2, efficiency: 0.88, shiftTime: 0.16,
      engineBrake: 0.09,
    },
    steerLock: 35, audio: 'turbo4',
  },
};

// slip angle (rad) at which the lateral force peaks: C * atan(B * a) = pi/2
for (const spec of Object.values(CAR_SPECS)) spec.peakSlip = Math.tan(Math.PI / 2 / spec.corneringC) / spec.corneringB;

export const CAR_ORDER = ['gt', 'hatch'];

// Grip and rolling resistance per surface id (track.js SURF): [grip multiplier, rolling drag coefficient, roughness]
export const SURFACE_PHYS = [
  [1.0, 0.013, 0.0],   // asphalt
  [0.93, 0.016, 1.0],  // kerb
  [0.52, 0.16, 0.5],   // sand
  [0.6, 0.075, 0.45],  // grass
  [0.68, 0.06, 0.55],  // gravel
  [0.95, 0.017, 0.22], // paving stone
  [0.97, 0.014, 0.08], // concrete
  [0.99, 0.013, 0.12], // bridge deck
];

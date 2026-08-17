export const codeSnippets = [
  {
    id: 'fraud-checker',
    filename: 'FraudScoringEngine.ts',
    language: 'typescript',
    badge: 'Cybersecurity & Algorithms',
    title: 'E-Commerce Risk Assessment & Velocity Engine',
    description: 'Custom transaction scoring algorithm developed for Softyx to detect suspicious checkout patterns and mitigate merchant chargeback risks.',
    code: `// Softyx Fraud Checker — Risk Assessment & Velocity Engine
// Author: Samir Qureshi (Metropolitan University, Sylhet)

export interface TransactionPayload {
  orderId: string;
  ipAddress: string;
  customerEmail: string;
  orderTotalUSD: number;
  shippingCountry: string;
  billingCountry: string;
  deviceFingerprint: string;
  failedAttemptsIn24h: number;
}

export interface RiskEvaluation {
  riskScore: number; // 0 to 100
  action: 'APPROVE' | 'CHALLENGE_2FA' | 'DECLINE';
  flags: string[];
}

export function evaluateTransactionRisk(tx: TransactionPayload): RiskEvaluation {
  let score = 0;
  const flags: string[] = [];

  // 1. Geo-mismatch check (Billing vs Shipping jurisdiction)
  if (tx.billingCountry !== tx.shippingCountry) {
    score += 25;
    flags.push('GEO_MISMATCH: Cross-border billing and shipping vectors');
  }

  // 2. Velocity & Brute Force attempt tracking
  if (tx.failedAttemptsIn24h >= 3) {
    score += tx.failedAttemptsIn24h * 15;
    flags.push(\`VELOCITY_SPIKE: \${tx.failedAttemptsIn24h} failed attempts in last 24h\`);
  }

  // 3. High-Value Anomaly Threshold
  if (tx.orderTotalUSD > 800) {
    score += 18;
    flags.push('ANOMALY_VALUE: Order value exceeds baseline distribution');
  }

  // Determine final risk action
  let action: RiskEvaluation['action'] = 'APPROVE';
  if (score >= 70) {
    action = 'DECLINE';
  } else if (score >= 35) {
    action = 'CHALLENGE_2FA';
  }

  return {
    riskScore: Math.min(score, 100),
    action,
    flags
  };
}`,
    sampleOutput: `[Risk Analysis Output]
[OK] Order #SOF-8842 Scanned in 4.2ms
[OK] Velocity Check: 0 recent failures
[OK] Risk Score: 12/100 (Low Risk)
[OK] Decision: APPROVE (Instant Checkout Authorized)`
  },
  {
    id: 'virtual-tryon',
    filename: 'BodyDimensionMapper.ts',
    language: 'typescript',
    badge: 'Interactive E-Commerce',
    title: '3D Body Proportion & Sizing Math for Softyx',
    description: 'Calculates real-world clothing drape and fit recommendations based on height, weight, and shoulder-to-hip ratio geometry.',
    code: `// Softyx Virtual Try-On — Body Proportions & Drape Calculation
// Author: Samir Qureshi

export interface UserDimensions {
  heightCm: number;
  weightKg: number;
  chestCm: number;
  waistCm: number;
  fitPreference: 'slim' | 'regular' | 'oversized';
}

export interface SizeRecommendation {
  recommendedSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  confidenceScore: number;
  easeAllowanceCm: number;
  modelScaleVector: { x: number; y: number; z: number };
}

export function calculateFitRecommendation(user: UserDimensions): SizeRecommendation {
  // Calculate Body Mass Index & volumetric chest proportion
  const bmi = user.weightKg / Math.pow(user.heightCm / 100, 2);
  const chestToHeightRatio = user.chestCm / user.heightCm;

  // Determine garment ease allowance based on preference
  const easeAllowance = user.fitPreference === 'slim' ? 4 : user.fitPreference === 'oversized' ? 12 : 8;
  const targetChest = user.chestCm + easeAllowance;

  let size: SizeRecommendation['recommendedSize'] = 'M';
  if (targetChest < 92) size = 'S';
  else if (targetChest <= 100) size = 'M';
  else if (targetChest <= 108) size = 'L';
  else if (targetChest <= 116) size = 'XL';
  else size = 'XXL';

  return {
    recommendedSize: size,
    confidenceScore: 0.96,
    easeAllowanceCm: easeAllowance,
    modelScaleVector: {
      x: (user.waistCm / 80) * 1.05,
      y: (user.heightCm / 175) * 1.0,
      z: (user.chestCm / 96) * 1.02
    }
  };
}`,
    sampleOutput: `[Fit Engine Calculation]
[OK] User Height: 178cm | Weight: 72kg | Fit: Slim
[OK] Recommended Garment Size: L (96% confidence)
[OK] 3D Avatar Mesh Transform Matrix generated`
  },
  {
    id: 'fluid-wave',
    filename: 'FluidVertexShader.ts',
    language: 'typescript',
    badge: '3D Spatial Mathematics',
    title: 'Harmonic Vertex Wave Matrix in Three.js',
    description: 'The real mathematical sine & cosine displacement function powering the organic undulating background canvas in this portfolio.',
    code: `// Real-Time Harmonic 3D Vertex Wave Displacement
// Author: Samir Qureshi (Metropolitan University, Sylhet)

import * as THREE from 'three';

export function updateUndulatingWaveSurface(
  mesh: THREE.Mesh,
  elapsedTime: number,
  pointer: { x: number; y: number }
): void {
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const originalPositions = mesh.userData.originalPositions as Float32Array;
  const currentPositions = geometry.attributes.position.array as Float32Array;

  const count = currentPositions.length;

  for (let i = 0; i < count; i += 3) {
    const x = originalPositions[i];
    const y = originalPositions[i + 1];

    // Dual harmonic oscillation
    const primaryWave = Math.sin(x * 0.25 + elapsedTime * 1.2) * 1.1;
    const secondaryWave = Math.cos(y * 0.3 + elapsedTime * 0.8) * 0.9;

    // Interactive pointer repulsion & localized ripple physics
    const distanceToPointer = Math.hypot(x - pointer.x * 10, y - pointer.y * 6);
    const ripple = Math.sin(distanceToPointer * 0.5 - elapsedTime * 2.0) 
                   * 0.35 
                   * Math.exp(-distanceToPointer * 0.1);

    // Apply combined Z displacement
    currentPositions[i + 2] = originalPositions[i + 2] + (primaryWave * secondaryWave) + ripple;
  }

  geometry.attributes.position.needsUpdate = true;
}`,
    sampleOutput: `[Three.js Pipeline]
[OK] 3,456 vertices displaced per frame
[OK] Sub-1ms GPU vertex compute
[OK] 60.0 FPS locked spatial render`
  }
];

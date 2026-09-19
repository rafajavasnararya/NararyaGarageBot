export const MEDIA_LABELS = [
  "LIKELY_ORIGINAL",
  "LIKELY_MANUAL_EDITED",
  "LIKELY_AI_ASSISTED",
  "UNCERTAIN"
];

export function reviewImage({ metadata = {}, visionScore = null, manualSignals = 0 } = {}) {
  let label = "UNCERTAIN";
  let confidence = 0;

  if (Number.isFinite(visionScore) && visionScore >= 0.8) {
    label = "LIKELY_AI_ASSISTED";
    confidence = visionScore;
  } else if (manualSignals >= 2) {
    label = "LIKELY_MANUAL_EDITED";
    confidence = Math.min(0.95, 0.55 + manualSignals * 0.1);
  } else if (Object.keys(metadata).length > 0) {
    label = "LIKELY_ORIGINAL";
    confidence = 0.55;
  }

  return { label, confidence, requiresHumanReview: label === "UNCERTAIN" || confidence < 0.75 };
}

export function disclaimer() {
  return "Pemeriksaan AI hanya indikasi probabilistik, bukan bukti forensik. Kasus tidak pasti wajib diperiksa manusia.";
}

export async function classifyWithVision({ imageBase64, mimeType = "image/jpeg", sensitive = false } = {}) {
  if (!imageBase64) return { label: "UNCERTAIN", confidence: 0, requiresHumanReview: true };
  if (sensitive && process.env.ALLOW_SENSITIVE_AI_REVIEW !== "true") {
    return { label: "UNCERTAIN", confidence: 0, requiresHumanReview: true, reason: "sensitive_external_ai_disabled" };
  }

  const endpoint = process.env.AI_VISION_API_URL;
  if (!endpoint) return { label: "UNCERTAIN", confidence: 0, requiresHumanReview: true, reason: "vision_provider_missing" };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.AI_VISION_API_KEY ? { authorization: "Bearer " + process.env.AI_VISION_API_KEY } : {})
      },
      body: JSON.stringify({
        image: imageBase64,
        mimeType,
        task: "classify-edit-origin",
        labels: MEDIA_LABELS,
        instruction: "Return JSON only with label and confidence. Do not infer identity or biometrics."
      }),
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) throw new Error("vision_http_" + res.status);
    const d = await res.json();
    return reviewImage({ metadata: { provider: true }, visionScore: Number(d.confidence), manualSignals: 0 });
  } catch {
    return { label: "UNCERTAIN", confidence: 0, requiresHumanReview: true };
  }
}

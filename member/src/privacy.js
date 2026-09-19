export const SENSITIVE_DOCUMENT_TYPES = ["KTP","KK","SIM","KARTU_PELAJAR","FACE"];
export const MEMBER_EVIDENCE_TYPES = ["SOCIAL_SCREENSHOT","MOD_OWNERSHIP"];

export function redactSensitive(value) {
  const x = { ...value };
  for (const k of ["ktp","kk","sim","kartuPelajar","face","identity","rawIdentity","rawFace"]) delete x[k];
  return x;
}

export function consentText() {
  return [
    "🔐 MEMBER RESMI NARARYA",
    "",
    "Data digunakan untuk verifikasi membership, administrasi pembelian, keamanan transaksi, dan layanan.",
    "Dokumen identitas harus dikirim melalui chat privat, bukan grup/channel.",
    "Data sensitif disimpan sebagai referensi file privat; akses dibatasi admin berwenang dan dicatat.",
    "",
    "Data dapat mencakup nomor WhatsApp, Gmail, akun Instagram/TikTok, PO BUSSID/ETS2, bukti kepemilikan mod/KD, serta dokumen identitas sesuai kebutuhan verifikasi.",
    "",
    "Pemeriksaan gambar AI hanya indikasi probabilistik. Keputusan verifikasi akhir tetap melalui review manusia.",
    "",
    "Balas /member setuju untuk melanjutkan."
  ].join("\n");
}

export function isSensitive(type) {
  return SENSITIVE_DOCUMENT_TYPES.includes(String(type).toUpperCase());
}

export function publicMember(member) {
  return redactSensitive(member);
}

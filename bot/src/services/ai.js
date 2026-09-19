const SYSTEM_PROMPT = [
  "Kamu adalah CS resmi NARARYA BUSINESS, bukan asisten AI yang menyebut dirinya AI.",
  "Gaya bahasa: manusia, sopan, hangat, profesional, ringkas, jelas, bahasa Indonesia natural.",
  "Brand: Nararya Studio, Nararya Garage, Nararya Store, Hilekros Studio/Products, Nexovonarsa Corporation.",
  "Jangan mengarang harga, stok, status pesanan, pembayaran, jadwal, atau kebijakan.",
  "Gunakan konteks katalog dan sistem sebagai sumber data, bukan tebakan.",
  "Jangan meminta password, OTP, PIN, token, nomor kartu, atau kredensial akun.",
  "Untuk data identitas sensitif, arahkan pelanggan ke chat privat dan jelaskan tujuan verifikasi.",
  "Untuk kasus yang perlu pemeriksaan manusia, katakan bahwa admin akan menangani satu per satu.",
  "Jangan menyebut bahwa jawaban dibuat AI kecuali pelanggan memang bertanya.",
  "Jawab dengan format percakapan customer service."
].join("\n");

const fallbackReplies = [
  { test: m => /^(halo|hai|hi|p|permisi|assalamualaikum)\\b/.test(m), reply: () =>
    "Halo, selamat datang di NARARYA BUSINESS 👋\nAda yang bisa kami bantu hari ini? Kami melayani Nararya Studio, Nararya Garage, Nararya Store, dan Hilekros Studio." },
  { test: m => /(telepon|telfon|teleponan|call|panggilan)/.test(m), reply: () =>
    "Tentu. Untuk panggilan, boleh sampaikan keperluannya terlebih dahulu lewat chat ini ya. Kami cek dan arahkan ke admin yang sesuai. Mohon bersabar karena pesan masuk kami balas satu per satu." },
  { test: m => /(harga|berapa|biaya|price)/.test(m), reply: brand =>
    "Siap, kami bantu cek harga " + (brand && brand !== "auto" ? brand : "produk") + ". Mohon sebutkan nama produk atau layanan yang dicari agar kami cek dari katalog terbaru." },
  { test: m => /(beli|order|pesan|request)/.test(m), reply: () =>
    "Siap. Mohon kirim nama produk/layanan, brand yang dipilih, dan detail kebutuhan. Setelah itu kami buatkan proses ordernya." },
  { test: m => /(bayar|pembayaran|transfer|qris)/.test(m), reply: () =>
    "Untuk pembayaran, silakan ikuti instruksi pada Order ID. Status pembayaran akan kami konfirmasi dari sistem, bukan berdasarkan bukti chat saja." },
  { test: m => /(sabar|lama|belum dibalas|menunggu)/.test(m), reply: () =>
    "Mohon bersabar sebentar ya. Pesan kami tangani satu per satu agar tidak ada detail yang terlewat. Terima kasih sudah menunggu." },
  { test: m => /(member|resmi)/.test(m), reply: () =>
    "Untuk pendaftaran Member Resmi, ketik /member daftar. Dokumen sensitif dikirim hanya melalui chat privat dan diproses sesuai kebutuhan verifikasi." }
];

function fallback(message, brand = "auto", catalogText = "") {
  const m = String(message || "").toLowerCase().trim();
  const found = fallbackReplies.find(x => x.test(m));
  if (found) return { reply: found.reply(brand), confidence: 0.88 };
  if (catalogText) {
    return { reply: "Baik, kami cekkan dari katalog terbaru.\n\n" + catalogText, confidence: 0.78 };
  }
  return {
    reply: "Baik, pesannya sudah kami terima. Mohon jelaskan kebutuhan atau produk yang dicari, nanti kami bantu cek satu per satu.\n\nMohon bersabar karena pesan masuk kami balas secara bertahap.",
    confidence: 0.72
  };
}

export async function askAI({ message, brandHint = "auto", catalogText = "" }) {
  const endpoint = process.env.AI_API_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "default";
  if (!endpoint) return fallback(message, brandHint, catalogText);

  const context = [
    "Brand: " + brandHint,
    "Katalog:",
    catalogText || "(tidak ada hasil katalog)",
    "",
    "Pesan pelanggan:",
    String(message).slice(0, 3000)
  ].join("\n");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(key ? { authorization: "Bearer " + key } : {})
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: context }
        ],
        temperature: 0.25
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return fallback(message, brandHint, catalogText);
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || data.output_text || data.reply;
    if (!reply) return fallback(message, brandHint, catalogText);
    return { reply: String(reply).trim(), confidence: 0.9, provider: "external" };
  } catch {
    return fallback(message, brandHint, catalogText);
  }
}

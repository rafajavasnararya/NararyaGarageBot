const FOOTER = "\n\nPT NEXOVONARSACORPORATION - All Right Reserved";

export const withFooter = (text) => {
  const s = String(text ?? "");
  return s.includes("PT NEXOVONARSACORPORATION - All Right Reserved") ? s : s + FOOTER;
};

export const mainMenu = () => withFooter([
  "🤖 NARARYA BUSINESS BOT",
  "",
  "① 🎨 NARARYA STUDIO",
  "② 🚌 NARARYA GARAGE",
  "③ 🛒 NARARYA STORE",
  "④ 🔵 HILEKROS STUDIO",
  "⑤ 🏢 NEXOVONARSA CORPORATION",
  "",
  "Ketik nama brand, tanyakan harga/katalog/order, atau gunakan /member daftar.",
  "Admin grup: /rules /groupinfo /tagall /promote /demote /remove /subject /description."
].join("\n"));

export function brandMenu(b) {
  const d = {
    studio: ["🎨 NARARYA STUDIO","Vector","Line Up","Kaos / Jersey","Logo Team / Products / Perusahaan","Julukan","Pamflet Trip","Papan Informasi","Poster Umum / Poster Bus","Stiker","3D Design"],
    garage: ["🚌 NARARYA GARAGE","Kodename","Mod Request","ACC","Karoseri","Livery","BUSSID Services","ETS2 Services","Order & Payment"],
    store: ["🛒 NARARYA STORE","Produk digital","Produk fisik","Katalog","Stok","Order","Pembayaran","Status pesanan"],
    hilekros: ["🔵 HILEKROS STUDIO","Creative products","Design","Digital products","Catalog","Order","Support"],
    corporation: ["🏢 NEXOVONARSA CORPORATION","Corporate Headquarters & Holding Company","Managing Our Brands & Business Units","Nararya Studio","Nararya Garage","Nararya Store","Hilekros Studio"]
  }[b];
  return withFooter(d ? [d[0], "", ...d.slice(1).map(x => "• " + x)].join("\n") : mainMenu());
}

const sensitive=['ktp','kk','sim','kartuPelajar','face','identity'];
export function redactSensitive(value){const x={...value};for(const k of sensitive)delete x[k];return x;}
export function consentText(){return 'Persetujuan: data digunakan untuk verifikasi Member Resmi, administrasi pembelian, keamanan transaksi, dan layanan. Dokumen identitas dikirim hanya melalui kanal privat. Jangan kirim OTP, password, PIN, token, atau data kartu.';}
export function isSensitive(type){return ['KTP','KK','SIM','KARTU_PELAJAR','FACE'].includes(String(type).toUpperCase());}
export function publicMember(member){return redactSensitive(member);}
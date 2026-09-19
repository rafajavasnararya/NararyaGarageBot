# Group Approval

Group approval menggunakan allowlist internal.

Alur:
1. Bot melihat dirinya ditambahkan ke sebuah grup.
2. Grup dicatat sebagai PENDING.
3. Admin menerima notifikasi approval.
4. Admin menjalankan /groupapprove JID.
5. Setelah APPROVED, bot otomatis mengaktifkan customer-service dan fungsi grup.
6. Jika REJECTED, bot tidak menjalankan fungsi admin.

Ini bukan mekanisme WhatsApp untuk menerima undangan secara universal. Ini adalah lapisan kontrol aplikasi agar hanya grup yang disetujui admin yang diproses.

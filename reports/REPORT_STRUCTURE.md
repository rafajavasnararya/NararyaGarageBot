# Office Report Structure

Reports are separated like an office database:
- NARARYA_SALES.xlsx/.docx: completed sales.
- NARARYA_ORDERS.xlsx/.docx: order lifecycle.
- NARARYA_FINANCE.xlsx/.docx: income, expense and payment records.
- NARARYA_MEMBERS.xlsx/.docx: operational member records.
- NARARYA_CATALOG.xlsx/.docx: catalog snapshot.

Raw KTP, KK, SIM, student-card and face files are not placed in ordinary reports.
The member workbook keeps a secure evidence reference only. Raw evidence belongs
in private encrypted storage with access control and retention/deletion rules.

Run: python reports/generate_office_reports.py

Google Drive synchronization uses stable managed file IDs so an existing report is
replaced instead of creating duplicates.

PT NEXOVONARSACORPORATION - All Right Reserved

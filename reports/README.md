# Reports

Excel terpisah:
- NARARYA_SALES.xlsx
- NARARYA_ORDERS.xlsx
- NARARYA_FINANCE.xlsx
- NARARYA_MEMBERS.xlsx
- NARARYA_CATALOG.xlsx

Word terpisah:
- NARARYA_SALES_SOP.docx
- NARARYA_FINANCE_SOP.docx
- NARARYA_MEMBER_PRIVACY_SOP.docx
- NARARYA_DEPLOYMENT_SOP.docx

Drive synchronization memakai logical key stabil. Sinkronisasi pertama membuat file dan menyimpan file ID. Sinkronisasi berikutnya memakai endpoint update pada file ID yang sama, jadi tidak membuat salinan baru.

Dokumen identitas sensitif tidak diekspor ke workbook biasa.
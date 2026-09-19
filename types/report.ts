export type ReportKind = "sales" | "orders" | "finance" | "members" | "catalog";

export interface ManagedReport {
  key: string;
  excelFile: string;
  wordFile: string;
  mimeExcel: string;
  mimeWord: string;
  driveFileId?: string;
  updatedAt?: string;
}

export interface SecureMemberEvidence {
  memberId: string;
  kind: "SOCIAL_SCREENSHOT" | "MOD_OWNERSHIP" | "KTP" | "KK" | "SIM" | "KARTU_PELAJAR" | "FACE";
  encrypted: true;
  privateStorageRef: string;
  sha256: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

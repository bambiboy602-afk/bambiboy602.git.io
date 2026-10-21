export type SourceStatus =
  | "verified"
  | "unverified"
  | "stale"
  | "retired";

export interface SourceReference {
  id: string;
  title: string;
  publisher?: string;
  urlOrFile: string;
  accessedAt?: string;
  lastVerifiedAt?: string;
  status: SourceStatus;
  notes?: string;
}

export type ModuleName =
  | "maestro"
  | "tom-identity"
  | "bambi-rsm"
  | "grower"
  | "knowledge-vault";

export interface ModuleResult<T> {
  module: ModuleName;
  result: T;
  sources?: SourceReference[];
  uncertainties?: string[];
  requiresOwnerApproval?: boolean;
}

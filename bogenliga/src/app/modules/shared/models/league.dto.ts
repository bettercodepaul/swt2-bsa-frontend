// Data Transfer Object (DTO) for the League API (v1/liga)
// Mirrors the backend response as a flat list with optional parent references.

export interface LeagueDTO {
  id: number;
  name: string;
  regionId?: number | null;
  disziplinId?: number | null;
  ligaUebergeordnetId?: number | null; // parent league id (null for root)
  ligaUebergeordnetName?: string | null;
  version?: number | null;
}

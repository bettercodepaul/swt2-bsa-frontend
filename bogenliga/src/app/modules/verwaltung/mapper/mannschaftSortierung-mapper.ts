import {VersionedDataTransferObject} from "@shared/data-provider";
import {MannschaftSortierungDTO} from "@verwaltung/types/datatransfer/mannschaftSortierung-dto.class";

export function fromPayload(payload: VersionedDataTransferObject): MannschaftSortierungDTO {
  return MannschaftSortierungDTO.copyFrom(payload);
}

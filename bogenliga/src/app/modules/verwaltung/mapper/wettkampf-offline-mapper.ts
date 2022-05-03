import {VersionedDataTransferObject} from '../../shared/data-provider';
import {
  WettkampfOfflineSyncDto
} from '@verwaltung/types/datatransfer/wettkampf-offline-sync-dto.class';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';

export function toDTOFromOfflineWettkampfArray(wettkaempfe: OfflineWettkampf[]): WettkampfDTO[] {
  let list: WettkampfDTO[];
  list = []
  wettkaempfe.forEach((it) =>  list.push(toDTOFromOfflineWettkampf(it)));
  return list;
}

export function toDTOFromOfflineWettkampf(wettkampf: OfflineWettkampf): WettkampfDTO {
  const wettkampfDO = new WettkampfDTO();

  wettkampfDO.wettkampfTag = parseInt(wettkampf.tag);
  wettkampfDO.id = wettkampf.id;
  wettkampfDO.version = wettkampf.version;
  wettkampfDO.wettkampfAusrichter = parseInt(wettkampf.ausrichter);
  wettkampfDO.wettkampfBeginn = wettkampf.beginn;
  wettkampfDO.wettkampfDisziplinId = wettkampf.disziplinId;
  wettkampfDO.wettkampfTypId = wettkampf.wettkampftypId;
  wettkampfDO.wettkampfPlz = wettkampf.plz;
  wettkampfDO.wettkampfOrtsname = wettkampf.ortsname;
  wettkampfDO.wettkampfOrtsinfo = wettkampf.ortsinfo;
  wettkampfDO.wettkampfStrasse = wettkampf.strasse;
  wettkampfDO.wettkampfVeranstaltungsId = wettkampf.veranstaltungId;

  return wettkampfDO;
}

export function fromOfflineWettkampfPayload(payload: VersionedDataTransferObject): OfflineWettkampf {
  return toDO(WettkampfOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineWettkampfPayloadArray(payload: VersionedDataTransferObject[]): OfflineWettkampf[] {
  return payload.map((data) => fromOfflineWettkampfPayload(data));
}

export function toDO(payload: WettkampfOfflineSyncDto): OfflineWettkampf {

  return {
    id: payload.id,
    version: payload.version,
    veranstaltungId: payload.veranstaltungId,
    datum: payload.datum,
    beginn: payload.beginn,
    tag: payload.tag,
    disziplinId: payload.disziplinId,
    wettkampftypId: payload.wettkampftypId,
    ausrichter: payload.ausrichter,
    strasse: payload.strasse,
    plz: payload.plz,
    ortsname: payload.ortsname,
    ortsinfo: payload.ortsinfo,
    offlinetoken: payload.offlinetoken,


  };

}



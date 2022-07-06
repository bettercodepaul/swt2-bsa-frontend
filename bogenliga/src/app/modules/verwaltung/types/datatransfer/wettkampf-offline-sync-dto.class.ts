import {DataTransferObject} from '@shared/data-provider';

export class WettkampfOfflineSyncDto implements DataTransferObject {
  // This maps the DTO from the Backend
  id: number;
  version: number;
  veranstaltungId: number;
  datum: string;
  beginn: string;
  tag: string;
  disziplinId: number;
  wettkampftypId: number;
  ausrichter: string;
  strasse: string;
  plz: string;
  ortsname: string;
  ortsinfo: string;
  offlinetoken: string;


  static copyFrom(optional: {
    id?: number;
    version?: number;
    veranstaltungsId?: number;
    datum?: string;
    beginn?: string;
    tag?: string;
    disziplinId?: number;
    wettkampfTypId?: number;
    ausrichter?: string;
    strasse?: string;
    plz?: string;
    ortsname?: string;
    ortsinfo?: string;
    offlineToken?: string;
  } = {}): WettkampfOfflineSyncDto {
    const copy = new WettkampfOfflineSyncDto();

    copy.id = optional.id || null;
    if (optional.id == null) {
      console.error('ID expected but not set for Wettkampf-Offline-Sync-Dto!');
    }
    copy.version = optional.version || null;
    copy.veranstaltungId = optional.veranstaltungsId;
    copy.datum = optional.datum || null;
    copy.beginn = optional.beginn || null;
    copy.tag = optional.tag || null;
    copy.disziplinId = optional.disziplinId || null;
    copy.wettkampftypId = optional.wettkampfTypId || null;
    copy.ausrichter = optional.ausrichter || null;
    copy.strasse = optional.strasse || null;
    copy.plz = optional.plz || null;
    copy.ortsname = optional.ortsname || null;
    copy.ortsinfo = optional.ortsinfo || null;
    copy.offlinetoken = optional.offlineToken || null;


    return copy;
  }

}

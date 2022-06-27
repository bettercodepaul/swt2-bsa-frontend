import {VereinDO} from '@verwaltung/types/verein-do.class';
import {OfflineVerein} from '@shared/data-provider/offlinedb/types/offline-verein.interface';

export function offlineVereinFromVereinDOArray(vereine: VereinDO[]): OfflineVerein[]{
  return vereine.map(verein => offlineVereinFromVereinDO(verein));
}

export function offlineVereinFromVereinDO(verein: VereinDO): OfflineVerein{
  return {
    icon: verein.icon,
    id: verein.id,
    identifier: verein.identifier,
    name: verein.name,
    regionId: verein.regionId,
    regionName: verein.regionName,
    version: 1,
    website: verein.website,
    description: verein.description

  }
}

export function toDOfromOfflineVereinArray(vereine: OfflineVerein[]): VereinDO[]{
  return vereine.map(verein => toDOfromOfflineVerein(verein));
}

export function toDOfromOfflineVerein(verein: OfflineVerein): VereinDO{
  return {
    description: verein.description,
    icon: verein.icon,
    id: verein.id,
    identifier: verein.identifier,
    name: verein.name,
    regionId: verein.regionId,
    regionName: verein.regionName,
    version: verein.version,
    website: verein.website

  }
}

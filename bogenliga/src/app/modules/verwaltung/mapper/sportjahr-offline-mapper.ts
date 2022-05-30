import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';

export function fromOfflineSportjahr(jahr): SportjahrVeranstaltungDO[] {
  let veranstaltungenJahr: SportjahrVeranstaltungDO[] = [{
    sportjahr: jahr,
    version: 1,
    id: 1
  }]
  return veranstaltungenJahr
}

import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';


/*
  shared function um das aktive Sportjahr aus der Datenbank zu lesen und als number zurueck gibt
 */

export async function getActiveSportYear(einstellungenDataProvider: EinstellungenProviderService ): Promise<number>  {

  let activeSportYear: number;

  await einstellungenDataProvider.findAll()
      .then((response: BogenligaResponse<EinstellungenDO[]>) => {
        let i;
        for (i of response.payload.values()) {
          if ( i.key === 'aktives-Sportjahr') {
            // tslint:disable-next-line:radix
            activeSportYear = parseInt(i.value);
          }
        }
        console.log('1 ' + activeSportYear);
      });
  return activeSportYear;
}

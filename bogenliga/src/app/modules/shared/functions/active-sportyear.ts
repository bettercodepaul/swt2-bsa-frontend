import { EinstellungenProviderService } from '@verwaltung/services/einstellungen-data-provider.service';
import { BogenligaResponse } from '@shared/data-provider';
import { EinstellungenDO } from '@verwaltung/types/einstellungen-do.class';

/*
 shared function to read the active sport year from the database and return it as a number
 */

export async function getActiveSportYear(einstellungenDataProvider: EinstellungenProviderService): Promise<number> {
  let activeSportYear: number;

  await einstellungenDataProvider.findAll()
                                 .then((response: BogenligaResponse<EinstellungenDO[]>) => {
                                   const sportYearSetting = response.payload.find(item => item.key === "aktives-Sportjahr");
                                   if (sportYearSetting) {

                                     activeSportYear = parseInt(sportYearSetting.value);
                                     console.log("Aktives Sportjahr: " + activeSportYear);
                                   } else {
                                     console.log("Kein Sportjahr gefunden");
                                   }
                                 });

  return activeSportYear;
}

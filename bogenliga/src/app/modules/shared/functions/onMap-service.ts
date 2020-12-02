import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';

/**
 * Creates Link to Google Maps
 * Splits given Location at every comma and passes it to Google Maps
 * @param $event
 */
export const onMapService = ($event: WettkampfDO): void => {

  const str = $event.wettkampfOrt;
  let splits: string[];
  splits = str.split(', ', 5);
  let locationUrl = 'https://www.google.de/maps/place/';
  for (let i = 0; i < splits.length; i++) {
    if (i !== 0) {
      locationUrl += '+';
    }
    locationUrl += splits[i];
  }
  window.open(locationUrl);
};





















































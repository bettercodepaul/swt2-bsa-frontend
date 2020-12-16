import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';

/**
 * Creates Link to Google Maps
 * Splits given Location at every comma and passes it to Google Maps
 * @param $event
 */
export const onMapService = ($event: WettkampfDO): void => {


  const strasse = $event.wettkampfStrasse;
  const plz = $event.wettkampfPlz;
  const ortsname = $event.wettkampfOrtsname;

  const location = [strasse, plz, ortsname];

  let locationUrl = 'https://www.google.de/maps/place/';
  for (let i = 0; i < location.length; i++) {
    // vor ersten Übergabewert kein "+" setzen
    if (i !== 0) {
      locationUrl += '+';
    }
    locationUrl += location[i];
  }
  window.open(locationUrl);
};



















































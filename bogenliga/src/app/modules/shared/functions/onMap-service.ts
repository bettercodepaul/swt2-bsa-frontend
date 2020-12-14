import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';

/**
 * Creates Link to Google Maps
 * Splits given Location at every comma and passes it to Google Maps
 * @param $event
 */
export const onMapService = ($event: WettkampfDO): void => {

  const ort = $event.wettkampfOrt;
  const strasse = $event.wettkampfStrasse;
  const plz = $event.wettkampfPlz;
  const ortsname = $event.wettkampfOrtsname;


  let location = [ort, strasse, plz, ortsname]


  //location = ort.split(', ', 5);

  let locationUrl = 'https://www.google.de/maps/place/';
  for (let i = 0; i < location.length; i++) {
    if (i !== 0) {
      locationUrl += '+';
    }
    locationUrl += location[i];
  }
  window.open(locationUrl);
};





















































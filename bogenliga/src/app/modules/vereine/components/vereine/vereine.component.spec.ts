import {VereineComponent} from './vereine.component';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';

/**
 * Ticket swt2#2160:
 * Beim Leeren der Suche blieb die Vereine-Liste auf dem Suchergebnis (alle Vereine)
 * stehen, statt zur initialen (Bezirks-)Liste zurueckzukehren.
 *
 * findBySearch('') muss jetzt loadVereine() (findAll) aufrufen, nicht findBySearch.
 */
describe('VereineComponent - findBySearch (swt2#2160)', () => {

  let component: VereineComponent;
  let vereinDataProvider: jasmine.SpyObj<VereinDataProviderService>;

  beforeEach(() => {
    vereinDataProvider = jasmine.createSpyObj('VereinDataProviderService', ['findAll', 'findBySearch']);
    vereinDataProvider.findAll.and.returnValue(Promise.resolve({payload: []} as any));
    vereinDataProvider.findBySearch.and.returnValue(Promise.resolve({payload: []} as any));

    // Router/ActivatedRoute werden in findBySearch nicht benoetigt -> Stubs reichen.
    component = new VereineComponent({} as any, {} as any, vereinDataProvider);
  });

  it('laedt bei leerer Suche die initiale (Bezirks-)Liste via findAll, nicht via findBySearch', () => {
    component.findBySearch('');

    expect(vereinDataProvider.findAll).toHaveBeenCalled();
    expect(vereinDataProvider.findBySearch).not.toHaveBeenCalled();
  });

  it('laedt bei reiner Leerzeichen-Eingabe ebenfalls die initiale Liste via findAll', () => {
    component.findBySearch('   ');

    expect(vereinDataProvider.findAll).toHaveBeenCalled();
    expect(vereinDataProvider.findBySearch).not.toHaveBeenCalled();
  });

  it('sucht bei nicht-leerer Eingabe via findBySearch', () => {
    component.findBySearch('Ulm');

    expect(vereinDataProvider.findBySearch).toHaveBeenCalledWith('Ulm');
    expect(vereinDataProvider.findAll).not.toHaveBeenCalled();
  });
});

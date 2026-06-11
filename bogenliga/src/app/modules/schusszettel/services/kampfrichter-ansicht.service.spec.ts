import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {KampfrichterAnsichtService, KampfrichterMatchDO} from './kampfrichter-ansicht.service';
import {environment} from 'src/environments/environment';

describe('KampfrichterAnsichtService', () => {
  let service: KampfrichterAnsichtService;
  let http: HttpTestingController;

  const base = `${environment.backendBaseUrl}/v1/kampfrichter-session`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KampfrichterAnsichtService],
    });
    service = TestBed.inject(KampfrichterAnsichtService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrCreateToken', () => {
    it('sends GET to /token with wettkampfid param', () => {
      service.getOrCreateToken(42).subscribe(res => {
        expect(res.token).toBe('abc123');
      });

      const req = http.expectOne(r => r.url === `${base}/token` && r.params.get('wettkampfid') === '42');
      expect(req.request.method).toBe('GET');
      req.flush({token: 'abc123'});
    });
  });

  describe('getMatches', () => {
    it('sends GET to /matches with wettkampfid and token params', () => {
      const mockMatches: KampfrichterMatchDO[] = [{
        matchId: 1, nr: 1, begegnung: 1, matchScheibennummer: 1,
        mannschaftId: 10, mannschaftName: 'Team A',
        strafPunkteSatz1: 0, strafPunkteSatz2: 0, strafPunkteSatz3: 0,
        strafPunkteSatz4: 0, strafPunkteSatz5: 0,
        sessionStatus: 'SATZEINGABE',
      }];

      service.getMatches(42, 'tok').subscribe(res => {
        expect(res.length).toBe(1);
        expect(res[0].matchId).toBe(1);
      });

      const req = http.expectOne(r =>
        r.url === `${base}/matches` &&
        r.params.get('wettkampfid') === '42' &&
        r.params.get('token') === 'tok'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockMatches);
    });

    it('returns empty array when backend responds with []', () => {
      service.getMatches(1, 'x').subscribe(res => expect(res).toEqual([]));
      http.expectOne(r => r.url === `${base}/matches`).flush([]);
    });
  });

  describe('updateStrafpunkte', () => {
    it('sends PUT to /strafpunkte with correct params and body', () => {
      const body = {
        matchId: 7,
        strafPunkteSatz1: 1, strafPunkteSatz2: 0,
        strafPunkteSatz3: 2, strafPunkteSatz4: 0, strafPunkteSatz5: 1,
      };

      service.updateStrafpunkte(42, 'tok', body).subscribe(res => {
        expect(res.message).toBe('ok');
      });

      const req = http.expectOne(r =>
        r.url === `${base}/strafpunkte` &&
        r.params.get('wettkampfid') === '42' &&
        r.params.get('token') === 'tok'
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.matchId).toBe(7);
      expect(req.request.body.strafPunkteSatz1).toBe(1);
      req.flush({message: 'ok'});
    });
  });
});

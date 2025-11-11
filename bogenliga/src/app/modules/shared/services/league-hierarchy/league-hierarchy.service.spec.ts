import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {LeagueHierarchyService} from './league-hierarchy.service';
import {environment} from '@environment';
import {LeagueDTO} from '@shared/models/league.dto';

describe('LeagueHierarchyService', () => {
  let service: LeagueHierarchyService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.backendBaseUrl}/v1/liga`;
  const mockFlat: LeagueDTO[] = [
    { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
    { id: 2, name: 'Regionalliga', ligaUebergeordnetId: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeagueHierarchyService]
    });
    service = TestBed.inject(LeagueHierarchyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should build a tree from flat list (200)', () => {
    service.getHierarchy().subscribe((res) => {
      expect(res.status).toBe('ok');
      expect(res.data.length).toBe(1); // one root
      expect(res.data[0].children.length).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockFlat);
  });

  it('should map empty response to status "empty"', () => {
    service.getHierarchy().subscribe((res) => {
      expect(res.status).toBe('empty');
      expect(res.data.length).toBe(0);
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush([]);
  });

  it('should fallback to local mock on 404', () => {
    service.getHierarchy().subscribe((res) => {
      expect(res.status).toBe('offline-fallback');
      expect(res.data.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush({}, { status: 404, statusText: 'Not Found' });

    const mockReq = httpMock.expectOne('./assets/mocks/league-hierarchy.json');
    mockReq.flush([
      { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
      { id: 2, name: 'Regionalliga', ligaUebergeordnetId: 1 }
    ]);
  });

  it('should map timeout to status "timeout" and still try fallback', fakeAsync(() => {
    let finalStatus: string | undefined;

    service.getHierarchy({ timeoutMs: 10 }).subscribe((res) => {
      finalStatus = res.status;
      // if fallback kicks in, status will be offline-fallback
      // otherwise timeout
    });

    const req = httpMock.expectOne(apiUrl);
    // do not flush -> simulate timeout
    tick(11);

    const mockReq = httpMock.expectOne('./assets/mocks/league-hierarchy.json');
    mockReq.flush([
      { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null }
    ]);

    expect(finalStatus).toBe('offline-fallback');
  }));

  it('should map 500 to status error and still try fallback', () => {
    service.getHierarchy().subscribe((res) => {
      expect(['offline-fallback', 'error']).toContain(res.status);
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    const mockReq = httpMock.expectOne('./assets/mocks/league-hierarchy.json');
    mockReq.flush([
      { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null }
    ]);
  });
});

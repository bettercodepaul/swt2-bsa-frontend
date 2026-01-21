import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { LeagueHierarchyService } from './league-hierarchy.service';
import { LeagueDTO } from '@shared/models/league.dto';
import { LeagueHierarchyResult, LeagueTreeNode } from '@shared/models/tree-node';
import { environment } from '@environment';

describe('LeagueHierarchyService', () => {
  let service: LeagueHierarchyService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.backendBaseUrl;
  const expectedUrl = `${baseUrl}/v1/liga`;
  const mockFallbackUrl = './assets/mocks/league-hierarchy.json';

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

  describe('getHierarchy()', () => {
    it('should return status "ok" with tree nodes on successful API call', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
        { id: 2, name: 'Regionalliga', ligaUebergeordnetId: 1 }
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        expect(result.data).toBeDefined();
        expect(result.data.length).toBe(1); // One root node
        expect(result.data[0].id).toBe(1);
        expect(result.data[0].name).toBe('Bundesliga');
        expect(result.data[0].children.length).toBe(1);
        expect(result.data[0].children[0].id).toBe(2);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockLeagues);
    });

    it('should return status "empty" when API returns empty array', (done) => {
      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('empty');
        expect(result.data).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush([]);
    });


    it('should use custom timeout when provided', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null }
      ];

      service.getHierarchy({ timeoutMs: 10000 }).subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockLeagues);
    });

    it('should retry failed requests up to 2 times', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null }
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        done();
      });

      // First request fails
      const req1 = httpMock.expectOne(expectedUrl);
      req1.flush(null, { status: 500, statusText: 'Internal Server Error' });

      // Second request (retry) succeeds
      const req2 = httpMock.expectOne(expectedUrl);
      req2.flush(mockLeagues);
    });
  });

  describe('fromFlatList() - Tree Building', () => {
    it('should build tree from flat list with nested hierarchy', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
        { id: 2, name: 'Regionalliga Nord', ligaUebergeordnetId: 1 },
        { id: 3, name: 'Regionalliga Süd', ligaUebergeordnetId: 1 },
        { id: 4, name: 'Oberliga Hamburg', ligaUebergeordnetId: 2 }
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        expect(result.data.length).toBe(1); // One root

        const root = result.data[0];
        expect(root.id).toBe(1);
        expect(root.name).toBe('Bundesliga');
        expect(root.level).toBe(0);
        expect(root.parentId).toBeNull();
        expect(root.children.length).toBe(2); // Two regionalligen

        const regionNord = root.children.find(c => c.id === 2);
        expect(regionNord).toBeDefined();
        expect(regionNord!.name).toBe('Regionalliga Nord');
        expect(regionNord!.level).toBe(1);
        expect(regionNord!.parentId).toBe(1);
        expect(regionNord!.children.length).toBe(1); // One oberliga

        const oberliga = regionNord!.children[0];
        expect(oberliga.id).toBe(4);
        expect(oberliga.name).toBe('Oberliga Hamburg');
        expect(oberliga.level).toBe(2);
        expect(oberliga.parentId).toBe(2);

        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockLeagues);
    });

    it('should handle orphan nodes (nodes without existing parent) as roots', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
        { id: 2, name: 'Orphan Liga', ligaUebergeordnetId: 999 } // Parent doesn't exist
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        expect(result.data.length).toBe(2); // Both as roots

        const orphan = result.data.find(n => n.id === 2);
        expect(orphan).toBeDefined();
        expect(orphan!.name).toBe('Orphan Liga');
        expect(orphan!.level).toBe(0); // Treated as root
        expect(orphan!.parentId).toBe(999); // Parent ID preserved

        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockLeagues);
    });

    it('should return empty array for empty input', (done) => {
      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('empty');
        expect(result.data).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush([]);
    });

    it('should handle multiple root nodes', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Bundesliga', ligaUebergeordnetId: null },
        { id: 2, name: 'Landesliga', ligaUebergeordnetId: null },
        { id: 3, name: 'Bezirksliga', ligaUebergeordnetId: null }
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        expect(result.data.length).toBe(3); // Three roots
        expect(result.data.map(n => n.id)).toEqual([1, 2, 3]);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockLeagues);
    });

    it('should calculate level correctly for deep hierarchies', (done) => {
      const mockLeagues: LeagueDTO[] = [
        { id: 1, name: 'Level 0', ligaUebergeordnetId: null },
        { id: 2, name: 'Level 1', ligaUebergeordnetId: 1 },
        { id: 3, name: 'Level 2', ligaUebergeordnetId: 2 },
        { id: 4, name: 'Level 3', ligaUebergeordnetId: 3 }
      ];

      service.getHierarchy().subscribe((result: LeagueHierarchyResult) => {
        expect(result.status).toBe('ok');
        const root = result.data[0];
        expect(root.level).toBe(0);
        expect(root.children[0].level).toBe(1);
        expect(root.children[0].children[0].level).toBe(2);
        expect(root.children[0].children[0].children[0].level).toBe(3);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockLeagues);
    });
  });

});

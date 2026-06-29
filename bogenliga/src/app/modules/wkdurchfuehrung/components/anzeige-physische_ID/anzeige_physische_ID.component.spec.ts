import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BogenligaResponse, RequestResult} from '@shared/data-provider';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {AnzeigePhysischeIDComponent} from './anzeige_physische_ID.component';
import {ActivatedRoute, Router, convertToParamMap} from '@angular/router';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';

const successResponse = (payload: string): BogenligaResponse<string> => ({
  result: RequestResult.SUCCESS,
  payload
});

const listResponse = (payload: AnzeigenDO[]): BogenligaResponse<AnzeigenDO[]> => ({
  result: RequestResult.SUCCESS,
  payload
});

const wettkampfResponse = (payload: WettkampfDTO): BogenligaResponse<WettkampfDTO> => ({
  result: RequestResult.SUCCESS,
  payload
});

describe('AnzeigePhysischeIDComponent', () => {
  let component: AnzeigePhysischeIDComponent;
  let fixture: ComponentFixture<AnzeigePhysischeIDComponent>;
  let anzeigenProviderMock: jasmine.SpyObj<AnzeigenProviderService>;
  let routerMock: jasmine.SpyObj<Router>;
  let wettkampfProviderMock: jasmine.SpyObj<WettkampfDataProviderService>;

  beforeEach(async () => {
    anzeigenProviderMock = jasmine.createSpyObj('AnzeigenProviderService', ['getNewPhysischeBildschirmID', 'getByWettkampfId', 'findAll']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    wettkampfProviderMock = jasmine.createSpyObj('WettkampfDataProviderService', ['findById']);
    anzeigenProviderMock.getNewPhysischeBildschirmID.and.returnValue(Promise.resolve(successResponse('Ab1C')));
    anzeigenProviderMock.getByWettkampfId.and.returnValue(Promise.resolve(listResponse([])));
    anzeigenProviderMock.findAll.and.returnValue(Promise.resolve(listResponse([])));
    wettkampfProviderMock.findById.and.returnValue(Promise.resolve(wettkampfResponse(new WettkampfDTO())));
    routerMock.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [AnzeigePhysischeIDComponent],
      providers: [
        {provide: AnzeigenProviderService, useValue: anzeigenProviderMock},
        {provide: Router, useValue: routerMock},
        {provide: WettkampfDataProviderService, useValue: wettkampfProviderMock},
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: convertToParamMap({wettkampfId: '22', veranstaltungId: '123', wettkampftag: '2'})
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnzeigePhysischeIDComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showGeneratedID should set physischeBildschirmID from provider payload', async () => {
    await component.showGeneratedID();

    expect(anzeigenProviderMock.getNewPhysischeBildschirmID).toHaveBeenCalled();
    expect(component.physischeBildschirmID).toBe('Ab1C');
  });

  it('showGeneratedID should stringify a null payload', async () => {
    anzeigenProviderMock.getNewPhysischeBildschirmID.and.returnValue(
      Promise.resolve(successResponse(null)));

    await component.showGeneratedID();

    expect(component.physischeBildschirmID).toBe('null');
  });

  it('ngOnInit should load the id and activate fullscreen', async () => {
    const requestFullscreenSpy = spyOn(document.documentElement, 'requestFullscreen')
      .and.returnValue(Promise.resolve());

    await component.ngOnInit();
    component.ngOnDestroy();

    expect(component.physischeBildschirmID).toBe('Ab1C');
    expect(requestFullscreenSpy).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('ngOnInit should not throw when requestFullscreen rejects', async () => {
    spyOn(document.documentElement, 'requestFullscreen')
      .and.returnValue(Promise.reject(new Error('denied')));

    await component.ngOnInit();
    component.ngOnDestroy();

    expect(component.physischeBildschirmID).toBe('Ab1C');
  });

  it('checkRegistrationAndRedirect should navigate to fullscreen after registration', async () => {
    anzeigenProviderMock.getByWettkampfId.and.returnValue(Promise.resolve(listResponse([{
      id: 4,
      physischeBildschirmId: 'Ab1C',
      tableTyp: 'tabelle',
      aktuellesMatch: 1,
      wettkampfId: 22
    }])));

    await component.ngOnInit();
    await component.checkRegistrationAndRedirect();
    component.ngOnDestroy();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/wkdurchfuehrung/fullscreen', 123, 2]);
  });

  it('onEscapeKey should exit fullscreen when a fullscreen element is active', () => {
    const exitFullscreenSpy = spyOn(document, 'exitFullscreen').and.returnValue(Promise.resolve());
    spyOnProperty(document, 'fullscreenElement', 'get').and.returnValue(document.documentElement);

    component.onEscapeKey();

    expect(exitFullscreenSpy).toHaveBeenCalled();
    expect(component.isFullscreen).toBe(false);
  });

  it('onEscapeKey should do nothing when no fullscreen element is active', () => {
    const exitFullscreenSpy = spyOn(document, 'exitFullscreen').and.returnValue(Promise.resolve());
    spyOnProperty(document, 'fullscreenElement', 'get').and.returnValue(null);

    component.onEscapeKey();

    expect(exitFullscreenSpy).not.toHaveBeenCalled();
    expect(component.isFullscreen).toBe(true);
  });
});

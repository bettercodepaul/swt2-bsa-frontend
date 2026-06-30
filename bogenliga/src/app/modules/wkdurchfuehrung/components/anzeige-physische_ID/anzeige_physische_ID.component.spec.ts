import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BogenligaResponse, RequestResult} from '@shared/data-provider';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {AnzeigePhysischeIDComponent} from './anzeige_physische_ID.component';

const successResponse = (payload: string): BogenligaResponse<string> => ({
  result: RequestResult.SUCCESS,
  payload
});

describe('AnzeigePhysischeIDComponent', () => {
  let component: AnzeigePhysischeIDComponent;
  let fixture: ComponentFixture<AnzeigePhysischeIDComponent>;
  let anzeigenProviderMock: jasmine.SpyObj<AnzeigenProviderService>;

  beforeEach(async () => {
    anzeigenProviderMock = jasmine.createSpyObj('AnzeigenProviderService', ['getNewPhysischeBildschirmID']);
    anzeigenProviderMock.getNewPhysischeBildschirmID.and.returnValue(Promise.resolve(successResponse('Ab1C')));

    await TestBed.configureTestingModule({
      declarations: [AnzeigePhysischeIDComponent],
      providers: [{provide: AnzeigenProviderService, useValue: anzeigenProviderMock}],
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

    expect(component.physischeBildschirmID).toBe('Ab1C');
    expect(requestFullscreenSpy).toHaveBeenCalled();
  });

  it('ngOnInit should not throw when requestFullscreen rejects', async () => {
    spyOn(document.documentElement, 'requestFullscreen')
      .and.returnValue(Promise.reject(new Error('denied')));

    await component.ngOnInit();

    expect(component.physischeBildschirmID).toBe('Ab1C');
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

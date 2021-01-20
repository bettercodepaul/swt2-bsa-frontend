import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {REGIONEN_CONFIG} from './regionen.config';
import Sunburst, {Node} from 'sunburst-chart';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {ChartNode} from './ChartNode';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {RegionDataProviderService} from '@verwaltung/services/region-data-provider.service';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {RegionDTO} from '@verwaltung/types/datatransfer/region-dto.class';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {RoleVersionedDataObject} from '@verwaltung/services/models/roles-versioned-data-object.class';
import {Router} from '@angular/router';
// import {LigatabelleComponent} from '../../../ligatabelle/components/ligatabelle/ligatabelle.component';
// import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';

const chartDetailsSizeMultiplikator = 0.5;

@Component({
  selector:    'bla-regionen',
  templateUrl: './regionen.component.html',
  styleUrls: ['./regionen.component.scss']
})

export class RegionenComponent implements OnInit {

  public config = REGIONEN_CONFIG;
  public regionen: RegionDO[];
  public selectedDTOs: RegionDO[];
  public currentRegionDO: RegionDO;

  private selectedVereinDO: VereinDO;
  private selectedLigaDO: LigaDO;

  public NO_REGION_SELECTED = 'Bitte Region eingeben...';
  private selectedRegionsId: number;
  public loadingRegionen = true;
  public multipleSelections = true;

  private ligen: LigaDTO[];
  private vereine: VereinDTO[];
  private myChart = Sunburst(); // initializes sunburst-diagramm


  @ViewChild('chart', { static: true }) myDiv: ElementRef;

  constructor(private regionDataProviderService: RegionDataProviderService,
              private vereinDataProviderService: VereinDataProviderService,
              private ligaDataProviderService: LigaDataProviderService,
              private router: Router) {
  }

  ngOnInit() {
    this.getDataAndShowSunburst();
    this.currentRegionDO = new RegionDO();
    this.loadRegionen();
  }

  convertDataToTree(currentRegion: RegionDO, allRegions: RegionDO[]): ChartNode {

    const root = new ChartNode(currentRegion.regionName, this.createColor(currentRegion), currentRegion.id);

    if (currentRegion.regionTyp === 'KREIS') {
      return root;
    }
    allRegions.filter((region) => region.regionUebergeordnet === currentRegion.id)
              .forEach((r) => root.add(this.convertDataToTree(r, allRegions)));

    return root;
  }

  createColor(currentRegion: RegionDO): string {

    let color = '';

    if (currentRegion == null) {
      color = 'grey';
    } else if (currentRegion.regionTyp === 'BUNDESVERBAND') {
      color = 'orange';
    } else if (currentRegion.regionTyp === 'LANDESVERBAND') {
      color = 'red';
    } else if (currentRegion.regionTyp === 'BEZIRK') {
      color = 'blue';
    } else if (currentRegion.regionTyp === 'KREIS') {
      color = 'black';
    }
    return color;
  }

  getDataAndShowSunburst() {
    this.regionDataProviderService.findAll()
        .then((response: BogenligaResponse<RegionDO[]>) => {
            this.regionen = response.payload;
            this.loadSunburst();
          }
        );
  }

  loadSunburst() {
    const desc: HTMLInputElement = document.querySelector('#descriptionWrapper') as HTMLInputElement;
    desc.style.display = 'block';

    const data = this.convertDataToTree(this.regionen.filter((f) =>
      f.regionTyp === 'BUNDESVERBAND')[0], this.regionen).toJsonString();

    this.myChart
      .data(JSON.parse(data))
      .width(window.innerWidth * chartDetailsSizeMultiplikator)
      .height(window.innerHeight * chartDetailsSizeMultiplikator)
      .size('size')
      .color('color')
      .onClick((node) => {
        // outsourced update function so it is possible to use for other functions
        this.updateSunburst(node);

        this.selectInSelectionList(node);
      })
      (this.myDiv.nativeElement);

    console.log(this.myChart.label());

    // for automatic resizing
    window.addEventListener('resize', (func) => {
      const node = this.myChart.focusOnNode();
      if (node != null) {
        this.myChart
          .width(window.innerWidth * chartDetailsSizeMultiplikator)
          .height(window.innerHeight * chartDetailsSizeMultiplikator);
      } else {
        this.myChart
          .width(window.innerWidth * chartDetailsSizeMultiplikator)
          .height(window.innerHeight * chartDetailsSizeMultiplikator);
      }
    });
  }

  /**
   * Selects the item in the selectionListRegions according to the name of the selected node in the sunburst
   * @param node - The Node which should be selected in the SelectionLost
   */
  selectInSelectionList(node: Node): void {
    if (node === null) {
      console.log('NodeName = Null. Es scheint du bist am oberen ende angekommen!');
      return;
    }
    const list = document.getElementById('selectionListRegions') as HTMLSelectElement;
    const nameToSearch = node.name;
    const options = list.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === nameToSearch) {
        list.selectedIndex = i;
        return;
      }
    }
  }


  // used for sync sunburst and table. If table is clicked we search trough the sunburst-tree for the clicked element.
  findCurrentRegionDOInSunburstTree() {
    // this.myChart.data() gives back root element of sunburst tree
    let node = this.myChart.data();

    if (node === undefined) {
      return;
    } else if (node.name === this.currentRegionDO.regionName) { // if root is the searched element we are done here
      return node;
    } else {
      if (node.children !== undefined) { // if not we have to search trough the children of the root element
        node = this.searchChildren(node);
        return node;
      } else {
        return;
      }
    }
  }

  // We need a Node-object so we can update the sunburst with it. So we use a Node-object as parameter nad return value.
  searchChildren(node: Node): Node {
    // initialize new variable to save recursion progress
    let node1 = node;

    if (node.children !== undefined) {
      // check for each child if its the searched element
      for (const child of node.children) {
        if (child.name === this.currentRegionDO.regionName) {
          return child;
        } else { // search recursivly downwards the tree-elements
          node1 = this.searchChildren(child);
          if (node1.name === this.currentRegionDO.regionName) {
            return node1;
          }
        }
      }
    }
    return node;
  }

  // What should happen if we click on sunburst-diagramm
  updateSunburst(node) {
    this.myChart.focusOnNode(node);
    this.myChart.width(window.innerWidth * chartDetailsSizeMultiplikator);
    this.myChart.height(window.innerHeight * chartDetailsSizeMultiplikator);
    this.showDetails(node);
  }

  showDetails(node) {
    if (node != null) {

      this.regionDataProviderService.findById(node.id)
          .then((response: BogenligaResponse<RegionDO>) => {
              this.currentRegionDO = response.payload;
              this.loadDetails();
            }
          );
    } else {
      const details: HTMLInputElement = document.querySelector('#detailsWrapper') as HTMLInputElement;
      details.style.display = 'none';
      const desc: HTMLInputElement = document.querySelector('#descriptionWrapper') as HTMLInputElement;
      desc.style.display = 'block';
      const desc1: HTMLInputElement = document.querySelector('#descriptionWrapperClose') as HTMLInputElement;
      desc1.style.display = 'none';
    }
  }

  reloadVereineUndLigen() {
    this.vereinDataProviderService.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => this.setVereinDataObjects(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.getEmptyList());

    this.ligaDataProviderService.findAll()
        .then((response: BogenligaResponse<LigaDO[]>) => this.setLigaDataObjects(response))
        .catch((response: BogenligaResponse<LigaDO[]>) => this.getEmptyList());
  }

  public getVereine() {
    return this.vereine;
  }

  public getLigen() {
    return this.ligen;
  }

  public setVereinDataObjects(response: BogenligaResponse<VereinDO[]>): void {

    this.vereine = [];
    response.payload.forEach((responseItem) => {
      if (responseItem.regionId === this.currentRegionDO.id) {
        this.vereine.push(responseItem);
      }
    });
    return;
  }

  public setLigaDataObjects(response: BogenligaResponse<LigaDO[]>): void {

    this.ligen = [];
    response.payload.forEach((responseItem) =>  {
      if (responseItem.regionId === this.currentRegionDO.id) {
        console.log(responseItem);
        this.ligen.push(responseItem);
      }
    });

    return;
  }

  public onSelectVerein(event: VereinDO): void {
    this.selectedVereinDO = event[0];
    console.log(this.selectedVereinDO);
    this.router.navigateByUrl('/vereine/' + this.selectedVereinDO.id);
  }

  public onSelectLiga(event: LigaDO): void {
    this.selectedLigaDO = event[0];
    console.log(this.selectedLigaDO);
    console.log('regionen selectedid: ' + this.selectedLigaDO.id);
    this.router.navigateByUrl('/ligatabelle/' + this.selectedLigaDO.id);
    // this.router.navigateByUrl('/ligatabelle');
  }

  public getEmptyList(): RoleVersionedDataObject[] {
    return [];
  }

  // when a Region gets selected from the list
  public onSelect($event: RegionDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedRegionsId = this.selectedDTOs[0].id;
      this.currentRegionDO = this.selectedDTOs[0];
      // updates sunburst after clicking table
      this.updateSunburst(this.findCurrentRegionDOInSunburstTree());
      this.loadDetails();
    }
  }

  // backend-call to get the list of regionen
  private loadRegionen(): void {
    this.regionen = [];
    this.regionDataProviderService.findAll()
        .then((response: BogenligaResponse<RegionDTO[]>) => {this.regionen = response.payload;  this.loadingRegionen = false; })
        .catch((response: BogenligaResponse<RegionDTO[]>) => {this.regionen = response.payload; });

  }

  // Loads details for the selected region
  private loadDetails(): void {
    this.reloadVereineUndLigen();
    const details: HTMLInputElement = document.querySelector('#detailsWrapper') as HTMLInputElement;
    details.style.display = 'block';
    const desc: HTMLInputElement = document.querySelector('#descriptionWrapper') as HTMLInputElement;
    desc.style.display = 'none';
    const desc1: HTMLInputElement = document.querySelector('#descriptionWrapperClose') as HTMLInputElement;
    desc1.style.display = 'block';
  }

}

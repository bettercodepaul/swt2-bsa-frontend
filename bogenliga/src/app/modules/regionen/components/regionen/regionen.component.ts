import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {REGIONEN_CONFIG} from './regionen.config';
import Sunburst from 'sunburst-chart';
import {RegionDataProviderService} from '../../../verwaltung/services/region-data-provider.service';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {ChartNode} from './ChartNode';

@Component({
  selector:    'bla-regionen',
  templateUrl: './regionen.component.html'
})
export class RegionenComponent implements OnInit {

  public config = REGIONEN_CONFIG;
  private regionen: RegionDO[];

  @ViewChild('chart') myDiv: ElementRef;

  constructor(private regionDataProviderService: RegionDataProviderService) {

  }

  convertDataToTree(currentRegion: RegionDO, allRegions: RegionDO[]): ChartNode {

    const root = new ChartNode(currentRegion.regionName, this.createColor(currentRegion));

    // console.log(currentRegion.regionName);

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
      color = 'yellow';
    } else if (currentRegion.regionTyp === 'LANDESVERBAND') {
      color = 'red';
    } else if (currentRegion.regionTyp === 'BEZIRK') {
      color = 'blue';
    } else if (currentRegion.regionTyp === 'KREIS') {
      color = 'black';
    }
    return color;
  }

  getData() {
    this.regionDataProviderService.findAll()
        .then((response: BogenligaResponse<RegionDO[]>) => {
            this.regionen = response.payload;
            console.log(this.regionen);
            this.loadSunburst();
          }
        );
  }

  ngOnInit() {
    this.getData();
  }

  loadSunburst() {
    // let data = {
    //   name:     'main',
    //   color:    'magenta',
    //   children: [
    //     {
    //       name:  'a',
    //       color: 'yellow',
    //       size:  1
    //     }, {
    //       name:     'b',
    //       color:    'red',
    //       children: [
    //         {
    //           name:  'ba',
    //           color: 'orange',
    //           size:  1
    //         }, {
    //           name:     'bb',
    //           color:    'blue',
    //           children: [
    //             {
    //               name:  'bba',
    //               color: 'green',
    //               size:  1
    //             }, {
    //               name:  'bbb',
    //               color: 'pink',
    //               size:  1
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // };

    const data = this.convertDataToTree(this.regionen.filter((f) =>
      f.regionTyp === 'BUNDESVERBAND')[0], this.regionen).toJsonString();

    console.log(data);

    Sunburst()
      .data(data)
      .size('size')
      .color('color')
      (this.myDiv.nativeElement);


  }
}

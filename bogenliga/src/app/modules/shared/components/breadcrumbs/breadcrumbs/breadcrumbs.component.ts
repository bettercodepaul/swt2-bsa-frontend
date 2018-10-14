import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {BreadcrumbDO} from '../types/breadcrumb-dto.class';
import {isNumber} from 'util';

@Component({
  selector:    'bla-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls:   ['./breadcrumbs.component.scss'],
  providers:   [TranslatePipe]
})
export class BreadcrumbsComponent implements OnInit {

  @Input() public moduleTranslationKey = 'MANAGEMENT';

  constructor(private router: Router, private translate: TranslatePipe) {
  }

  ngOnInit() {
  }

  public getBreadCrumbs(): BreadcrumbDO[] {

    console.log('URL: ' + this.router.url);

    const breadCrumbs: BreadcrumbDO[] = [];

    const urlSegments = this.router.url.split('/');
    let route = '';
    for (let i = 1; i < urlSegments.length; i++) {
      const urlSegment = urlSegments[i];

      console.log('Segment: ' + urlSegment);

      if (urlSegment.trim().length > 0) {
        const translationKey = `${this.moduleTranslationKey}.${urlSegment.toUpperCase()}.TITLE`; // page translation key
        const label = this.translate.transform(`${translationKey}`);

        route += `/${urlSegment}`;

        if (label !== translationKey) {
          // translation key exists
          const breadCrumb = new BreadcrumbDO(
            label,
            route,
            (i === urlSegments.length - 1)
          );

          breadCrumbs.push(breadCrumb);

        } else if (isNumber(+urlSegment)) {

          const breadCrumb = new BreadcrumbDO(
            urlSegment,
            route,
            (i === urlSegments.length - 1)
          );

          breadCrumbs.push(breadCrumb);
        }


      }
    }

    console.log('BreadCrumbs: ' + JSON.stringify(breadCrumbs));

    return breadCrumbs;
  }
}

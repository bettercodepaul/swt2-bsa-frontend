import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {isNullOrUndefined, isNumber} from '@shared/functions';
import {BreadcrumbDO} from '../types/breadcrumb-dto.class';

@Component({
  selector:    'bla-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls:   ['./breadcrumbs.component.scss'],
  providers:   [TranslatePipe]
})
export class BreadcrumbsComponent implements OnInit {

  @Input() public moduleTranslationKey;

  constructor(private router: Router, private translate: TranslatePipe) {
  }

  ngOnInit() {
    if (isNullOrUndefined(this.moduleTranslationKey)) {
      console.warn('BreadcrumbsComponent: Property "moduleTranslationKey" must be defined');
    }
  }

  public getBreadCrumbs(): BreadcrumbDO[] {
    const homeBreadCrumb = new BreadcrumbDO(
      this.translate.transform('HOME.HOME.TITLE'),
      '/home',
      false
    );

    const breadCrumbs: BreadcrumbDO[] = [];

    const urlSegments = this.router.url.split('/');
    let route = '';
    for (let i = 1; i < urlSegments.length; i++) {
      const urlSegment = urlSegments[i];

      if (urlSegment.trim().length > 0) {
        // start always with home
        if (i === 1 && urlSegment.toUpperCase() !== 'HOME') {
          breadCrumbs.push(homeBreadCrumb);
        }

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

        } else if (urlSegment === 'add') {
          const breadCrumb = new BreadcrumbDO(
            this.translate.transform('BREADCRUMB.NEW_ENTITY'),
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

    return breadCrumbs;
  }
}

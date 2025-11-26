import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { isNullOrUndefined, isNumber } from '@shared/functions';
import { BreadcrumbDO } from '@shared/components';
import { RememberedLigaService } from '@shared/services/remembered-liga/remembered-liga.service';

@Component({
  selector: 'bla-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  providers: [TranslatePipe]
})
export class BreadcrumbsComponent implements OnInit {

  @Input() public moduleTranslationKey: string;

  constructor(
    private router: Router,
    private translate: TranslatePipe,
    private rememberedLigaService: RememberedLigaService
  ) {}

  ngOnInit(): void {
    if (isNullOrUndefined(this.moduleTranslationKey)) {
      console.warn('BreadcrumbsComponent: Property "moduleTranslationKey" must be defined');
    }
  }

  public getBreadCrumbs(): BreadcrumbDO[] {
    const remembered = this.rememberedLigaService.get();
    const ligaParamValue = remembered
      ? (remembered.slug || remembered.id)
      : null;

    const homeCrumb = new BreadcrumbDO(
      this.translate.transform('HOME.HOME.TITLE'),
      '/home',
      false,
      ligaParamValue ? { liga: ligaParamValue } : null
    );

    const crumbs: BreadcrumbDO[] = [];

    const tree: UrlTree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments.map(s => s.path) ?? [];

    // Wenn wir nicht auf /home sind, Home-Crumb voranstellen
    if (!(segments.length > 0 && segments[0].toLowerCase() === 'home')) {
      crumbs.push(homeCrumb);
    }

    let cumulativeRoute = '';
    segments.forEach((segment, idx) => {
      cumulativeRoute += `/${segment}`;
      const translationKey = `${this.moduleTranslationKey}.${segment.toUpperCase()}.TITLE`;
      const label = this.translate.transform(translationKey);
      const isLast = (idx === segments.length - 1);

      if (label !== translationKey) {
        crumbs.push(new BreadcrumbDO(label, cumulativeRoute, isLast));
        return;
      }

      if (segment === 'add') {
        crumbs.push(new BreadcrumbDO(
          this.translate.transform('BREADCRUMB.NEW_ENTITY'),
          cumulativeRoute,
          isLast
        ));
        return;
      }

      if (isNumber(+segment)) {
        crumbs.push(new BreadcrumbDO(segment, cumulativeRoute, isLast));
      }
    });

    return crumbs;
  }
}

!function(){function e(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}function i(e,i){for(var t=0;t<i.length;t++){var n=i[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{f2gQ:function(t,n,r){"use strict";r.r(n),r.d(n,"HilfeModule",(function(){return w}));var o=r("ofXK"),c={moduleTranslationKey:"HILFE",pageTitleTranslationKey:"HILFE.HILFE.TITLE",navigationCardsConfig:{navigationCards:[]}},a=r("20cS"),s=r("NJqk"),l=r("fXoL"),f=r("jhN1"),b=r("U9hD");function u(e,i){if(1&e){var t=l.Rb();l.Qb(0,"tr",7),l.Qb(1,"button",8),l.Xb("click",(function(){l.pc(t);var e=i.$implicit;return l.Zb().setUrl(e.url)})),l.Bc(2),l.Pb(),l.Pb()}if(2&e){var n=i.$implicit;l.zb(1),l.Ab("data-cy",n.cy_test),l.zb(1),l.Dc(" ",n.id," ")}}function d(e,i){if(1&e&&(l.Qb(0,"div",9),l.Qb(1,"iframe",10),l.Qb(2,"p"),l.Bc(3," Ihr Browser kann leider keine eingebetteten Frames anzeigen: Sie k\xf6nnen die eingebettete Seite \xfcber den folgenden Verweis aufrufen: "),l.Qb(4,"a",11),l.Bc(5,"Link zur Wikiseite"),l.Pb(),l.Pb(),l.Pb(),l.Pb()),2&e){var t=l.Zb();l.zb(1),l.fc("src",t.getSecureUrl(),l.rc),l.zb(3),l.fc("href",t.getSecureUrl(),l.sc)}}var h,g,p=[{path:"",pathMatch:"full",component:(h=function(){function t(i,n,r){e(this,t),this.sanitizer=i,this.currentUserService=n,this.onOfflineService=r,this.config=c,this.sections=[{id:"Startseite",url:"https://wiki.bsapp.de/doku.php?id=liga:startseite",cy_test:"test-startseite"},{id:"Ablauf Ligaleiter",url:"https://wiki.bsapp.de/doku.php?id=liga:arbeitsablauf",cy_test:"test-ligaleiter"},{id:"Wettkampfdurchf\xfchrung",url:"https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung",cy_test:"test-wkd"}],this.sessionHandling=new a.a(this.currentUserService,this.onOfflineService)}var n,r,o;return n=t,(r=[{key:"ngOnInit",value:function(){this.setUrl(this.sections[0].url)}},{key:"onMouseOver",value:function(e){this.sessionHandling.checkSessionExpired()&&window.location.reload()}},{key:"setUrl",value:function(e){this.wikiUrl=e,this.sectionSelected=!0}},{key:"getSecureUrl",value:function(){return this.sanitizer.bypassSecurityTrustResourceUrl(this.wikiUrl)}}])&&i(n.prototype,r),o&&i(n,o),t}(),h.\u0275fac=function(e){return new(e||h)(l.Lb(f.b),l.Lb(s.a),l.Lb(s.i))},h.\u0275cmp=l.Fb({type:h,selectors:[["bla-components"]],decls:8,vars:3,consts:[[3,"config"],[3,"mouseover"],[1,"hilfeseite-container"],[1,"hilfe-section-container"],["id","section-table"],["class","hilfe-table-section",4,"ngFor","ngForOf"],["class","hilfe-iframe-container",4,"ngIf"],[1,"hilfe-table-section"],[1,"btn","btn-primary","section-btn",3,"click"],[1,"hilfe-iframe-container"],["title","wiki-iframe","id","wiki-iframe","width","75%","height","500","name","Hilfeseite_eingebunden",3,"src"],[3,"href"]],template:function(e,i){1&e&&(l.Qb(0,"bla-navigation-dialog",0),l.Qb(1,"div",1),l.Xb("mouseover",(function(e){return i.onMouseOver(e)})),l.Ob(2),l.Qb(3,"div",2),l.Qb(4,"div",3),l.Qb(5,"table",4),l.zc(6,u,3,2,"tr",5),l.Pb(),l.Pb(),l.zc(7,d,6,2,"div",6),l.Pb(),l.Nb(),l.Pb(),l.Pb()),2&e&&(l.fc("config",i.config),l.zb(6),l.fc("ngForOf",i.sections),l.zb(1),l.fc("ngIf",i.sectionSelected))},directives:[b.a,o.s,o.t],styles:["h3[_ngcontent-%COMP%]{font-weight:700}#section-table[_ngcontent-%COMP%]{padding:50px}.hilfeseite-container[_ngcontent-%COMP%]{display:flex;flex-direction:row;margin-top:50px;margin-left:30px}.hilfe-iframe-container[_ngcontent-%COMP%]{width:100%;height:100%}#hilfe-button[_ngcontent-%COMP%]{margin:50px}.section-btn[_ngcontent-%COMP%]{margin:15px;min-width:18rem}#wiki-iframe[_ngcontent-%COMP%]{border:5px solid #7e7e7e;border-radius:10px;margin-left:7rem}#section-table[_ngcontent-%COMP%]{padding:10px}.demo[_ngcontent-%COMP%]{float:left;clear:none}"]}),h)}],m=r("tyNb"),v=r("FpXt"),k=r("3Pt+"),w=((g=function i(){e(this,i)}).\u0275mod=l.Jb({type:g}),g.\u0275inj=l.Ib({factory:function(e){return new(e||g)},imports:[[o.c,m.g.forChild(p),v.a,k.k]]}),g)}}])}();
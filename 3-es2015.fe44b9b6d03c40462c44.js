(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{NC86:function(e,t,a){"use strict";a.r(t),a.d(t,"LigatabelleModule",(function(){return F}));var i=a("ofXK"),l=a("3Pt+"),n=a("tyNb"),s=a("btWG"),o=a("th7h"),r=a("fXoL");let c=(()=>{class e{constructor(e){this.currentUserService=e}canActivate(){return this.currentUserService.hasAnyPermisson([])}}return e.\u0275fac=function(t){return new(t||e)(r.Ub(o.a))},e.\u0275prov=r.Hb({token:e,factory:e.\u0275fac}),e})();var b=a("mrSG"),d=a("PEb7");const h={moduleTranslationKey:"WETTKAEMPFE",pageTitleTranslationKey:"WETTKAEMPFE.WETTKAEMPFE.TITLE",navigationCardsConfig:{navigationCards:[]}},g={columns:[{translationKey:"WETTKAEMPFE.LIGATABELLE.TABELLENPLATZ",propertyName:"tabellenplatz",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.MANNSCHAFTNAME",propertyName:"mannschaft_name",width:70,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.MATCHPUNKTE",propertyName:"matchpunkte",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.SATZPUNKTE",propertyName:"satzpunkte",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.SATZPUNKTDIFFERENZ",propertyName:"satzpkt_differenz",width:15,sortable:!1}]};var u=a("nr0C"),E=a("v1Mt"),p=a("X628"),L=a("gQPg"),T=a("NJqk"),f=a("w90F"),v=a("ghtv"),m=a("3lZk"),A=a("yljE"),P=a("zLSN"),I=a("xOPY"),S=a("/2r1"),w=a("sYmb");const y=function(e){return[e]};let N=(()=>{class e extends d.CommonComponentDirective{constructor(e,t,a,i,l,n){super(),this.router=e,this.route=t,this.notificationService=a,this.veranstaltungsDataProvider=i,this.ligatabelleDataProvider=l,this.onOfflineService=n,this.config=h,this.config_table=g,this.PLACEHOLDER_VAR="Zur Suche Liga-Bezeichnung eingeben...",this.loading=!0,this.loadingLigatabelle=!0,this.multipleSelections=!0}ngOnInit(){console.log("Bin im Liga"),this.loadTableData(),this.providedID=void 0,this.hasID=!1,this.notificationService.discardNotification(),this.route.params.subscribe(e=>{Object(p.c)(e.id)?console.log("no params"):(this.providedID=parseInt(e.id,10),console.log("Provided Id ",this.providedID),this.hasID=!0)})}loadTableData(){return Object(b.a)(this,void 0,void 0,(function*(){this.loadedYears=[],this.availableYears=[],this.loadedVeranstaltungen=new Map,this.veranstaltungIdMap=new Map;try{console.log(this.onOfflineService.isOffline());const e=yield this.veranstaltungsDataProvider.findAllSportyearDestinct();this.loadedYears=e.payload;for(const t of e.payload){const e=yield this.veranstaltungsDataProvider.findBySportjahrDestinct(t.sportjahr);for(const a of e.payload)this.veranstaltungIdMap.set(a.id,a),this.loadedVeranstaltungen.set(t.sportjahr,e.payload),this.availableYears.includes(t)||this.availableYears.push(t)}this.loading=!1,this.loadingLigatabelle=!1,this.selectedYearId=this.availableYears[0].id,this.availableYears.length>0&&this.onSelectYear(this.availableYears)}catch(e){this.loading=!1,this.loadingLigatabelle=!1,console.log(e)}}))}loadLigaTableRows(){this.loadingLigatabelle=!0,this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltung.id).then(e=>this.handleLigatabelleSuccess(e)).catch(()=>this.handleLigatabelleFailure())}handleLigatabelleFailure(){console.log("failure"),this.rowsLigatabelle=[],this.loadingLigatabelle=!1}handleLigatabelleSuccess(e){console.log("success"),this.rowsLigatabelle=[],this.remainingLigatabelleRequests=e.payload.length,e.payload.length<=0||(this.rowsLigatabelle=Object(d.toTableRows)(e.payload)),this.loadingLigatabelle=!1}ligatabelleLinking(){this.router.navigateByUrl("/wettkaempfe/"+this.buttonForward)}onSelectYear(e){document.querySelector("#Button").style.display="block",this.veranstaltungenForYear=[],this.veranstaltungenForYear=this.loadedVeranstaltungen.get(e[0].sportjahr),this.selectedVeranstaltungId=this.veranstaltungenForYear[0].id,this.onSelectVeranstaltung([this.veranstaltungIdMap.get(this.selectedVeranstaltungId)])}onSelectVeranstaltung(e){this.selectedVeranstaltung=e[0],this.selectedVeranstaltungName=this.selectedVeranstaltung.name,this.buttonForward=this.selectedVeranstaltung.id,this.loadLigaTableRows()}}return e.\u0275fac=function(t){return new(t||e)(r.Lb(n.c),r.Lb(n.a),r.Lb(L.c),r.Lb(u.a),r.Lb(E.a),r.Lb(T.i))},e.\u0275cmp=r.Fb({type:e,selectors:[["bla-wettkaempfe"]],features:[r.wb],decls:37,vars:38,consts:[[3,"config"],["href","https://wiki.bsapp.de/doku.php?id=liga:ligatabelle","target","_blank"],[1,"subtitle"],[1,"layout-elements"],[1,"flexChild"],[1,"blackLink"],[2,"width","10%","margin-bottom","3%"],["selectionListHeight","3em",2,"width","10%","flex-grow","0","height","20px",3,"items","optionFieldSelector","loading","multipleSelections","selectedItemIds","onSelect"],["id","example",1,"table","table-hover","table-sm","table-responsive-sm","thead-light","table-striped",2,"width","80%"],["selectionListHeight","15em",2,"width","60%","flex-grow","0",3,"items","placeholderTranslationKey","optionFieldSelector","multipleSelections","selectedItemIds","onSelect"],[1,"row"],[3,"config","rows","loading","onRowEntry"],["id","Button"],[3,"id","onClick"],[1,"col-sm-9"],[1,"invalid-feedback"]],template:function(e,t){1&e&&(r.Qb(0,"bla-common-dialog",0),r.Mb(1,"bla-hilfe-button",1),r.Qb(2,"p",2),r.Bc(3),r.ac(4,"translate"),r.Pb(),r.Qb(5,"div",3),r.Qb(6,"bla-row-layout"),r.Qb(7,"div",4),r.Qb(8,"h5"),r.Qb(9,"a",5),r.Bc(10),r.ac(11,"translate"),r.Pb(),r.Pb(),r.Qb(12,"table",6),r.Qb(13,"bla-selectionlist",7),r.Xb("onSelect",(function(e){return t.onSelectYear(e)})),r.Pb(),r.Pb(),r.Qb(14,"div"),r.Qb(15,"h5"),r.Qb(16,"a",5),r.Bc(17),r.ac(18,"translate"),r.Pb(),r.Pb(),r.Qb(19,"table",8),r.Qb(20,"bla-quicksearch-list",9),r.Xb("onSelect",(function(e){return t.onSelectVeranstaltung(e)})),r.Pb(),r.Pb(),r.Pb(),r.Pb(),r.Qb(21,"div"),r.Qb(22,"h5"),r.Qb(23,"a",5),r.Bc(24),r.ac(25,"translate"),r.Pb(),r.Pb(),r.Qb(26,"div",10),r.Qb(27,"h5"),r.Qb(28,"bla-data-table",11),r.Xb("onRowEntry",(function(){return t.ligatabelleLinking()})),r.Pb(),r.Pb(),r.Pb(),r.Pb(),r.Qb(29,"div",12),r.Qb(30,"bla-button",13),r.Xb("onClick",(function(){return t.ligatabelleLinking()})),r.Bc(31),r.ac(32,"translate"),r.Pb(),r.Pb(),r.Qb(33,"div",14),r.Qb(34,"div",15),r.Bc(35),r.ac(36,"translate"),r.Pb(),r.Pb(),r.Pb(),r.Pb(),r.Pb()),2&e&&(r.fc("config",t.config),r.zb(3),r.Cc(r.bc(4,22,"WETTKAEMPFE.LIGATABELLE.DESCRIPTION")),r.zb(7),r.Cc(r.bc(11,24,"MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.SPORTJAHR")),r.zb(3),r.fc("items",t.availableYears)("optionFieldSelector","sportjahr")("loading",t.loading)("multipleSelections",!t.multipleSelections)("selectedItemIds",r.kc(34,y,t.selectedYearId)),r.zb(4),r.Cc(r.bc(18,26,"WETTKAEMPFE.LIGATABELLE.HEADER.VERANSTALTUNG")),r.zb(3),r.fc("items",t.veranstaltungenForYear)("placeholderTranslationKey",t.PLACEHOLDER_VAR)("optionFieldSelector","ligaName")("multipleSelections",!t.multipleSelections)("selectedItemIds",r.kc(36,y,t.selectedVeranstaltungId)),r.zb(4),r.Cc(r.bc(25,28,"WETTKAEMPFE.LIGATABELLE.TITEL")),r.zb(4),r.fc("config",t.config_table)("rows",t.rowsLigatabelle)("loading",t.loadingLigatabelle),r.zb(2),r.fc("id","regionSaveButton"),r.zb(1),r.Ec(" ",r.bc(32,30,"WETTKAEMPFE.LIGATABELLE.LINKDESCRIPTION")," ",t.selectedVeranstaltungName," "),r.zb(4),r.Dc(" ",r.bc(36,32,"MANAGEMENT.REGION_DETAIL.FORM.REGION_TYP.ERROR")," "))},directives:[f.a,v.a,m.a,A.a,P.a,I.a,S.a],pipes:[w.d],styles:[""]}),e})();const M=[{path:"",component:N,canActivate:[c],pathMatch:"full"},{path:"/:id",component:N,canActivate:[c],pathMatch:"full"}];let F=(()=>{class e{}return e.\u0275mod=r.Jb({type:e}),e.\u0275inj=r.Ib({factory:function(t){return new(t||e)},providers:[c],imports:[[i.c,n.g.forChild(M),s.SharedModule,l.k]]}),e})()}}]);
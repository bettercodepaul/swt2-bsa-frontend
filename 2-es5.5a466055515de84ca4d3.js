!function(){function e(e,n){var a;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=function(e,n){if(!e)return;if("string"==typeof e)return t(e,n);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return t(e,n)}(e))||n&&e&&"number"==typeof e.length){a&&(e=a);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,s=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return l=e.done,e},e:function(e){s=!0,o=e},f:function(){try{l||null==a.return||a.return()}finally{if(s)throw o}}}}function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function n(e,t){return(n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=r(e);if(t){var o=r(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return i(this,n)}}function i(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function r(e){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function s(e,t,n){return t&&l(e.prototype,t),n&&l(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{NC86:function(t,i,r){"use strict";r.r(i),r.d(i,"LigatabelleModule",(function(){return x}));var l,c,u,d=r("ofXK"),b=r("3Pt+"),h=r("tyNb"),f=r("btWG"),g=r("th7h"),p=r("fXoL"),v=((l=function(){function e(t){o(this,e),this.currentUserService=t}return s(e,[{key:"canActivate",value:function(){return this.currentUserService.hasAnyPermisson([])}}]),e}()).\u0275fac=function(e){return new(e||l)(p.Ub(g.a))},l.\u0275prov=p.Hb({token:l,factory:l.\u0275fac}),l),y=r("mrSG"),E=r("PEb7"),L={moduleTranslationKey:"WETTKAEMPFE",pageTitleTranslationKey:"WETTKAEMPFE.WETTKAEMPFE.TITLE",navigationCardsConfig:{navigationCards:[]}},m={columns:[{translationKey:"WETTKAEMPFE.LIGATABELLE.TABELLENPLATZ",propertyName:"tabellenplatz",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.MANNSCHAFTNAME",propertyName:"mannschaft_name",width:70,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.MATCHPUNKTE",propertyName:"matchpunkte",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.SATZPUNKTE",propertyName:"satzpunkte",width:15,sortable:!1},{translationKey:"WETTKAEMPFE.LIGATABELLE.SATZPUNKTDIFFERENZ",propertyName:"satzpkt_differenz",width:15,sortable:!1}]},A=r("nr0C"),S=r("v1Mt"),T=r("X628"),P=r("gQPg"),w=r("NJqk"),k=r("20cS"),I=r("S/GV"),F=r("a7Kz"),R=r("sNGV"),D=r("wHSu"),O=r("w90F"),M=r("ghtv"),N=r("3lZk"),C=r("yljE"),j=r("zLSN"),K=r("xOPY"),V=r("cWIM"),Q=r("sYmb"),Y=function(e){return[e]},z=((c=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&n(e,t)}(r,t);var i=a(r);function r(e,t,n,a,l,s,c,u){var d;return o(this,r),(d=i.call(this)).router=e,d.route=t,d.notificationService=n,d.veranstaltungsDataProvider=a,d.ligatabelleDataProvider=l,d.onOfflineService=s,d.currentUserService=c,d.einstellungenDataProvider=u,d.zuruecksetzenIcon=D.q,d.config=L,d.config_table=m,d.PLACEHOLDER_VAR="Zur Suche Liga-Bezeichnung eingeben...",d.ActionButtonColors=R.a,d.loading=!0,d.loadingLigatabelle=!0,d.multipleSelections=!0,d.isDeselected=!1,d.istURLkorrekt=!1,d.sessionHandling=new k.a(d.currentUserService,d.onOfflineService),d}return s(r,[{key:"ngOnInit",value:function(){var e=this;0==this.isDeselected&&(this.loadTableData(),this.providedID=void 0,this.hasID=!1,this.notificationService.discardNotification(),this.route.params.subscribe((function(t){Object(T.c)(t.id)?console.log("no params at ligatabelle"):(e.providedID=parseInt(t.id,10),e.hasID=!0,e.loadVeranstaltungFromLigaID(e.providedID))})))}},{key:"loadVeranstaltungFromLigaID",value:function(e){return Object(y.a)(this,void 0,void 0,regeneratorRuntime.mark((function t(){var n=this;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.veranstaltungsDataProvider.findByLigaId(e).then((function(e){return n.handleFindLigaSuccess(e)})).catch((function(e){return n.handleFindLigaFailure(e)}));case 2:case"end":return t.stop()}}),t,this)})))}},{key:"handleFindLigaSuccess",value:function(t){var n,a=e(t.payload);try{for(a.s();!(n=a.n()).done;){var i=n.value;if(i.sportjahr==this.selectedYearForVeranstaltung&&null!=i.id){this.selectedItemId=i.id,this.istURLkorrekt=!0;break}}}catch(r){a.e(r)}finally{a.f()}this.istURLkorrekt||null==this.selectedYearForVeranstaltung||this.handleFindLigaFailure(Error),this.istURLkorrekt=!1}},{key:"handleFindLigaFailure",value:function(e){console.log("Failure, ID not found "),this.router.navigateByUrl("/ligatabelle")}},{key:"onMouseOver",value:function(e){this.sessionHandling.checkSessionExpired()&&window.location.reload()}},{key:"loadTableData",value:function(){return Object(y.a)(this,void 0,void 0,regeneratorRuntime.mark((function t(){var n,a,i,r,o,l,s,c,u,d,b,h,f;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.loadedYears=[],this.availableYears=[],this.loadedVeranstaltungen=new Map,this.veranstaltungIdMap=new Map,n=0,a=0,i=[],t.prev=2,console.log(this.onOfflineService.isOffline()),t.next=6,this.veranstaltungsDataProvider.findAllSportyearDestinct();case 6:r=t.sent,this.loadedYears=r.payload,o=e(r.payload),t.prev=9,o.s();case 11:if((l=o.n()).done){t.next=20;break}return s=l.value,t.next=15,this.veranstaltungsDataProvider.findBySportjahrDestinct(s.sportjahr);case 15:c=t.sent,u=e(c.payload);try{for(u.s();!(d=u.n()).done;)b=d.value,this.veranstaltungIdMap.set(b.id,b),this.loadedVeranstaltungen.set(s.sportjahr,c.payload),this.availableYears.includes(s)||this.availableYears.push(s)}catch(g){u.e(g)}finally{u.f()}case 18:t.next=11;break;case 20:t.next=25;break;case 22:t.prev=22,t.t0=t.catch(9),o.e(t.t0);case 25:return t.prev=25,o.f(),t.finish(25);case 28:if(t.t1=this.onOfflineService.isOffline(),t.t1){t.next=33;break}return t.next=32,Object(F.a)(this.einstellungenDataProvider);case 32:this.aktivesSportjahr=t.sent;case 33:h=e(this.availableYears);try{for(h.s();!(f=h.n()).done;)f.value.sportjahr===this.aktivesSportjahr&&(n=a),a++}catch(g){h.e(g)}finally{h.f()}this.loading=!1,this.loadingLigatabelle=!1,this.selectedYearId=this.availableYears[n].id,this.availableYears.length>0&&(i.push(this.availableYears[n]),this.onSelectYear(i)),t.next=41;break;case 38:t.prev=38,t.t2=t.catch(2),this.loading=!1,this.loadingLigatabelle=!1,console.log(t.t2);case 41:case"end":return t.stop()}}),t,this,[[2,38],[9,22,25,28]])})))}},{key:"loadLigaTableRows",value:function(){var e=this;this.loadingLigatabelle=!0,this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltung.id).then((function(t){return e.handleLigatabelleSuccess(t)})).catch((function(){return e.handleLigatabelleFailure()}))}},{key:"handleLigatabelleFailure",value:function(){console.log("failure"),this.rowsLigatabelle=[],this.loadingLigatabelle=!1}},{key:"handleLigatabelleSuccess",value:function(e){console.log("success"),this.rowsLigatabelle=[],this.remainingLigatabelleRequests=e.payload.length,e.payload.length<=0||(this.rowsLigatabelle=Object(E.toTableRows)(e.payload)),this.loadingLigatabelle=!1}},{key:"ligatabelleLinking",value:function(){this.router.navigateByUrl("/wettkaempfe/"+this.buttonForward)}},{key:"onSelectYear",value:function(e){document.querySelector("#Button").style.display="block",this.veranstaltungenForYear=[],this.selectedYearForVeranstaltung=e[0].sportjahr,this.veranstaltungenForYear=this.loadedVeranstaltungen.get(e[0].sportjahr),this.selectedVeranstaltungId=this.veranstaltungenForYear[0].id,this.hasID&&this.loadVeranstaltungFromLigaID(this.providedID)}},{key:"onSelectVeranstaltung",value:function(e){this.selectedVeranstaltung=e[0],this.selectedVeranstaltungName=this.selectedVeranstaltung.name,this.buttonForward=this.selectedVeranstaltung.id,this.loadLigaTableRows(),this.router.navigate(["/ligatabelle/"+this.selectedVeranstaltung.ligaId])}},{key:"deselect",value:function(){this.isDeselected=!0,console.log(this.isDeselected),this.router.navigateByUrl("/ligatabelle")}}]),r}(E.CommonComponentDirective)).\u0275fac=function(e){return new(e||c)(p.Lb(h.d),p.Lb(h.a),p.Lb(P.c),p.Lb(A.a),p.Lb(S.a),p.Lb(w.i),p.Lb(w.a),p.Lb(I.a))},c.\u0275cmp=p.Fb({type:c,selectors:[["bla-wettkaempfe"]],features:[p.wb],decls:39,vars:43,consts:[[3,"config"],[3,"mouseover"],["href","https://wiki.bsapp.de/doku.php?id=liga:ligatabelle","target","_blank"],[1,"subtitle"],[1,"layout-elements"],[1,"flexChild"],[1,"blackLink"],[2,"width","10%","margin-bottom","3%"],["selectionListHeight","3em",2,"width","10%","flex-grow","0","height","20px",3,"items","optionFieldSelector","loading","multipleSelections","selectedItemIds","onSelect"],["id","example",1,"table","table-hover","table-sm","table-responsive-sm","thead-light","table-striped",2,"width","80%"],["selectionListHeight","15em",2,"width","60%","flex-grow","0",3,"items","placeholderTranslationKey","optionFieldSelector","multipleSelections","selectedItemIds","onSelect"],[1,"row",2,"margin-left","5px"],[3,"config","rows","loading","onRowEntry"],["id","Button"],[3,"id","color","iconClass","onClick"],[1,"col-sm-9"],[1,"invalid-feedback"]],template:function(e,t){1&e&&(p.Qb(0,"bla-common-dialog",0),p.Qb(1,"div",1),p.Xb("mouseover",(function(e){return t.onMouseOver(e)})),p.Mb(2,"bla-hilfe-button",2),p.Qb(3,"p",3),p.Fc(4),p.cc(5,"translate"),p.Pb(),p.Qb(6,"div",4),p.Qb(7,"bla-row-layout"),p.Qb(8,"div",5),p.Qb(9,"h5"),p.Qb(10,"a",6),p.Fc(11),p.cc(12,"translate"),p.Pb(),p.Pb(),p.Qb(13,"table",7),p.Qb(14,"bla-selectionlist",8),p.Xb("onSelect",(function(e){return t.onSelectYear(e)})),p.Pb(),p.Pb(),p.Qb(15,"div"),p.Qb(16,"h5"),p.Qb(17,"a",6),p.Fc(18),p.cc(19,"translate"),p.Pb(),p.Pb(),p.Qb(20,"table",9),p.Qb(21,"bla-quicksearch-list",10),p.Xb("onSelect",(function(e){return t.onSelectVeranstaltung(e)})),p.Pb(),p.Pb(),p.Pb(),p.Pb(),p.Qb(22,"div"),p.Qb(23,"h5"),p.Qb(24,"a",6),p.Fc(25),p.cc(26,"translate"),p.Pb(),p.Pb(),p.Qb(27,"div",11),p.Qb(28,"bla-data-table",12),p.Xb("onRowEntry",(function(){return t.ligatabelleLinking()})),p.Pb(),p.Pb(),p.Pb(),p.Qb(29,"div",13),p.Qb(30,"bla-actionbutton",14),p.Xb("onClick",(function(){return t.ligatabelleLinking()})),p.Fc(31),p.cc(32,"translate"),p.Pb(),p.Pb(),p.Qb(33,"div",15),p.Qb(34,"div",16),p.Fc(35),p.cc(36,"translate"),p.Pb(),p.Pb(),p.Pb(),p.Qb(37,"bla-actionbutton",14),p.Xb("onClick",(function(){return t.deselect()})),p.Fc(38," Auswahl zur\xfccksetzen "),p.Pb(),p.Pb(),p.Pb(),p.Pb()),2&e&&(p.ic("config",t.config),p.zb(4),p.Gc(p.dc(5,27,"WETTKAEMPFE.LIGATABELLE.DESCRIPTION")),p.zb(7),p.Gc(p.dc(12,29,"MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.SPORTJAHR")),p.zb(3),p.ic("items",t.availableYears)("optionFieldSelector","sportjahr")("loading",t.loading)("multipleSelections",!t.multipleSelections)("selectedItemIds",p.nc(39,Y,t.selectedYearId)),p.zb(4),p.Gc(p.dc(19,31,"WETTKAEMPFE.LIGATABELLE.HEADER.VERANSTALTUNG")),p.zb(3),p.ic("items",t.veranstaltungenForYear)("placeholderTranslationKey",t.PLACEHOLDER_VAR)("optionFieldSelector","ligaName")("multipleSelections",!t.multipleSelections)("selectedItemIds",p.nc(41,Y,t.selectedItemId)),p.zb(4),p.Gc(p.dc(26,33,"WETTKAEMPFE.LIGATABELLE.TITEL")),p.zb(3),p.ic("config",t.config_table)("rows",t.rowsLigatabelle)("loading",t.loadingLigatabelle),p.zb(2),p.ic("id","regionSaveButton")("color",t.ActionButtonColors.SUCCESS)("iconClass","th-list"),p.zb(1),p.Ic(" ",p.dc(32,35,"WETTKAEMPFE.LIGATABELLE.LINKDESCRIPTION")," ",t.selectedVeranstaltungName," "),p.zb(4),p.Hc(" ",p.dc(36,37,"MANAGEMENT.REGION_DETAIL.FORM.REGION_TYP.ERROR")," "),p.zb(2),p.ic("id","regionSaveButton")("color",t.ActionButtonColors.SECONDARY)("iconClass",t.zuruecksetzenIcon))},directives:[O.a,M.a,N.a,C.a,j.a,K.a,V.a],pipes:[Q.d],styles:[""]}),c),B=[{path:"",component:z,canActivate:[v],pathMatch:"full"},{path:"/:id",component:z,canActivate:[v],pathMatch:"full"}],x=((u=function e(){o(this,e)}).\u0275mod=p.Jb({type:u}),u.\u0275inj=p.Ib({factory:function(e){return new(e||u)},providers:[v],imports:[[d.c,h.h.forChild(B),f.SharedModule,b.k]]}),u)}}])}();
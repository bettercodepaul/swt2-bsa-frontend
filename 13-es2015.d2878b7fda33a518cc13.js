(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{LvZw:function(t,e,r){"use strict";r.r(e),r.d(e,"SpotterModule",(function(){return A}));var n=r("ofXK"),o=r("3Pt+"),c=r("tyNb"),s=r("btWG"),i=r("MB1H"),a=r("NJqk"),u=r("fXoL");let l=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(){return this.currentUserService.hasPermission(a.j.CAN_OPERATE_SPOTTING)}}return t.\u0275fac=function(e){return new(e||t)(u.Ub(a.a))},t.\u0275prov=u.Hb({token:t,factory:t.\u0275fac}),t})();var b=r("PEb7"),d=r("mwxE"),h=r("/2r1"),p=r("sYmb");let f=(()=>{class t{constructor(t,e,r){this.tabletSessionService=t,this.route=e,this.router=r,this.tokens=[],this.ButtonSize=b.ButtonSize}ngOnInit(){this.tabletSessionService.findAllTabletSessionswithoutArgument().then(t=>{this.sessions=t.payload;for(const e of this.sessions)e.accessToken&&this.tokens.push(e.accessToken.toString())},t=>{console.error(t)})}validateAccessToken(){for(const t of this.tokens)t&&this.accessTokenInput===t&&this.router.navigateByUrl("/spotter")}}return t.\u0275fac=function(e){return new(e||t)(u.Lb(d.a),u.Lb(c.a),u.Lb(c.c))},t.\u0275cmp=u.Fb({type:t,selectors:[["bla-authentication"]],decls:14,vars:15,consts:[[1,"container"],[1,"form-group"],["for","spotterAuth"],["type","password","name","spotterAuth","id","spotterAuth","required","","pattern","^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}$",1,"form-control",3,"ngModel","placeholder","ngModelChange"],[3,"id","buttonSize","click"]],template:function(t,e){1&t&&(u.Qb(0,"div",0),u.Qb(1,"h1"),u.Fc(2),u.cc(3,"translate"),u.Pb(),u.Qb(4,"div",1),u.Qb(5,"label",2),u.Fc(6),u.cc(7,"translate"),u.Pb(),u.Qb(8,"input",3),u.Xb("ngModelChange",(function(t){return e.accessTokenInput=t})),u.cc(9,"translate"),u.Pb(),u.Mb(10,"br"),u.Qb(11,"bla-button",4),u.Xb("click",(function(){return e.validateAccessToken()})),u.Fc(12),u.cc(13,"translate"),u.Pb(),u.Pb(),u.Pb()),2&t&&(u.zb(2),u.Gc(u.dc(3,7,"SPOTTER.AUTH.TITLE")),u.zb(4),u.Gc(u.dc(7,9,"SPOTTER.AUTH.TEXT")),u.zb(2),u.jc("placeholder",u.dc(9,11,"SPOTTER.AUTH.INFO")),u.ic("ngModel",e.accessTokenInput),u.zb(3),u.ic("id","spotterAuth")("buttonSize",e.ButtonSize.LARGE_BLOCK),u.zb(1),u.Hc(" ",u.dc(13,13,"SPOTTER.AUTH.BUTTON")," "))},directives:[o.c,o.z,o.v,o.o,o.r,h.a],pipes:[p.d],styles:[""]}),t})(),T=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(){return this.currentUserService.hasAnyPermisson([])}}return t.\u0275fac=function(e){return new(e||t)(u.Ub(a.a))},t.\u0275prov=u.Hb({token:t,factory:t.\u0275fac}),t})();const v=[{path:"",component:i.a,canActivate:[l]},{path:"authentication",component:f,canActivate:[T]}];var S=r("6NWb");r("FpXt");let A=(()=>{class t{static forRoot(){return{ngModule:s.SharedModule,providers:[T,l]}}static forChild(){return{ngModule:s.SharedModule,providers:[]}}}return t.\u0275mod=u.Jb({type:t}),t.\u0275inj=u.Ib({factory:function(e){return new(e||t)},providers:[l,T],imports:[[n.c,c.g.forChild(v),s.SharedModule.forChild(),o.k,S.i,s.SharedModule]]}),t})()}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"3UX2":function(t,r,e){"use strict";e.r(r),e.d(r,"WkdurchfuehrungModule",(function(){return M}));var c=e("ofXK"),n=e("3Pt+"),a=e("tyNb"),o=e("FpXt"),s=e("b6G9"),u=e("M5kS"),i=e("+Gk6"),h=e("yaAv"),p=e("th7h"),f=e("fXoL");let l=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(){return this.currentUserService.hasAnyPermisson([p.b.CAN_READ_WETTKAMPF,p.b.CAN_MODIFY_WETTKAMPF])}}return t.\u0275fac=function(r){return new(r||t)(f.Ub(p.a))},t.\u0275prov=f.Hb({token:t,factory:t.\u0275fac}),t})();const A=[{path:"",pathMatch:"full",component:s.a,canActivate:[l]},{path:"",pathMatch:"full",component:u.a},{path:"",pathMatch:"full",component:i.a},{path:"",pathMatch:"full",component:h.b},{path:":wettkampfId",pathMatch:"full",component:s.a},{path:"tabletadmin/:wettkampfId",pathMatch:"full",component:h.b},{path:"schusszettel/:match1id/:match2id",pathMatch:"full",component:u.a},{path:":match1id/:match2id/tablet",pathMatch:"full",component:i.a}];var v=e("NJqk");let m=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(t,r){return this.currentUserService.hasPermission(v.j.CAN_READ_MY_VERANSTALTUNG)}}return t.\u0275fac=function(r){return new(r||t)(f.Ub(v.a))},t.\u0275prov=f.Hb({token:t,factory:t.\u0275fac}),t})(),b=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(t,r){return this.currentUserService.hasPermission(v.j.CAN_OPERATE_SPOTTING)}}return t.\u0275fac=function(r){return new(r||t)(f.Ub(v.a))},t.\u0275prov=f.Hb({token:t,factory:t.\u0275fac}),t})(),d=(()=>{class t{constructor(t){this.currentUserService=t}canActivate(t,r){return this.currentUserService.hasAnyPermisson([v.j.CAN_MODIFY_MY_VERANSTALTUNG,v.j.CAN_OPERATE_SPOTTING])}}return t.\u0275fac=function(r){return new(r||t)(f.Ub(v.a))},t.\u0275prov=f.Hb({token:t,factory:t.\u0275fac}),t})(),M=(()=>{class t{static forRoot(){return{ngModule:o.a,providers:[l,m,b,d]}}}return t.\u0275mod=f.Jb({type:t}),t.\u0275inj=f.Ib({factory:function(r){return new(r||t)},providers:[l,m,b,d],imports:[[c.c,a.g.forChild(A),o.a.forChild(),n.k]]}),t})()}}]);
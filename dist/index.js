function i(e){return n=>t=>e({settings:n,env:t})}function o(e){if(e.pathPattern===void 0)throw new Error("The pathPattern setting is required")}var a=i(({env:e,settings:n})=>({id:"inlang.pluginTemplate",config(){return o(n),{readResources:t=>u({...t,env:e,settings:n}),writeResources:t=>l({...t,env:e,settings:n})}}}));async function u(e){let n=[];for(let t of e.config.languages){let r=e.settings.pathPattern.replace("{language}",t),s=JSON.parse(await e.env.$fs.readFile(r,{encoding:"utf-8"}));n.push(g(s,t))}return n}async function l(e){for(let n of e.resources){let t=e.settings.pathPattern.replace("{language}",n.languageTag.name);await e.env.$fs.writeFile(t,c(n))}}function g(e,n){return{type:"Resource",languageTag:{type:"LanguageTag",name:n},body:Object.entries(e).map(([t,r])=>p(t,r))}}function p(e,n){return{type:"Message",id:{type:"Identifier",name:e},pattern:{type:"Pattern",elements:[{type:"Text",value:n}]}}}function c(e){let n=Object.fromEntries(e.body.map(f));return JSON.stringify(n,null,2)}function f(e){return[e.id.name,e.pattern.elements[0].value]}export{a as default};
/*! Bundled license information:

@inlang/core/dist/plugin/pluginBuildConfig.js:
  (*! DON'T TOP-LEVEL IMPORT ESBUILD PLUGINS. USE DYNAMIC IMPORTS. *)
  (*! See https://github.com/inlang/inlang/issues/486 *)
*/

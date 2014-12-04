/*!
 * @copyright {JSON:Decode} 2014 - Pillars is a starting framework for any angular/node app. Please modify to suit your needs
 * @version v0.0.1
 * @link http://jsondecode.com
 * @license Proprietary
*/
!function(){"use strict";angular.module("pillars",["pillars.controllers","pillars.filters","ui.router"]).config(["$stateProvider","$urlRouterProvider","$httpProvider","$provide","$locationProvider",function(r,t){r.state("index",{controller:"MainCtrl",templateUrl:"views/home.html",url:"/"}).state("404",{templateUrl:"views/404.html",url:"/404"}),t.when("","/").otherwise("/404")}]).run(["$state","$rootScope","$location",function(r){r.go("index")}])}(),function(){"use strict";angular.module("pillars.controllers",[]).controller("MainCtrl",[function(){var r=this;r.frameworkName="Pillars",r.title=r.frameworkName,r.tagline="Your Starting Framework For Every Web Project"}])}(),function(){"use strict";angular.module("pillars.filters",[]).filter("reverse",function(){return function(r){return r.split("").reverse().join("")}}).filter("timeago",function(){return function(r){return moment(r).fromNow()}}).filter("stripTags",function(){return function(r){return String(r).replace(/<[^>]+>/gm,"")}}).filter("titlecase",function(){return function(r){var t=/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;return r=r||"",r.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,function(r,e,n){return e>0&&e+r.length!==n.length&&r.search(t)>-1&&":"!==n.charAt(e-2)&&("-"!==n.charAt(e+r.length)||"-"===n.charAt(e-1))&&n.charAt(e-1).search(/[^\s-]/)<0?r.toLowerCase():r.substr(1).search(/[A-Z]|\../)>-1?r:r.charAt(0).toUpperCase()+r.substr(1)})}})}();
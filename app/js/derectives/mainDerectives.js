angular.module('mainApp')
    .directive('colorSwitcher', function(){
       return {
           restrict: 'E',
           scope: {
               textAttr: '@',
               bindAttr: '='
           },
           replace: false,
           template:[
               '<div>',
               '<p>Hello! {{textAttr}}</p>',
               '<button ng-click="btnclick()">{{bindAttr}}</button>',
               '</div>'
           ].join(''),
           link: function(scope, elem, attr){
               scope.btnclick = function(){
                   scope.bindAttr = "NEW!";
               }
               elem.on('click', function(event){
                   scope.bindAttr = "NEW!";
               });
           }
       }
    });
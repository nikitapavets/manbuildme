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
    })
    .directive('pageRate', function () {
        return {
            link: function(scope, element, attrs){
                var star_wrap_template = element.append('<div class="star--wrap"></div>');
                for (var i = 0; i < 5; i++) {
                    var star_template = '<a href="#" ng-mouseover="starMouseOver();"><i class="fa fa-star-o" aria-hidden="true"></i></a>';
                    var star = star_wrap_template.append(star_template);
                    scope.$apply();
                }
            }
        }
    });
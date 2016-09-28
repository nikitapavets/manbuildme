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
    })
    .directive('comments', function ($http, $interval) {
        return {
            link: function(scope, element, attrs){
                var component_id = attrs.comments;
                /*$interval(function(){

                    var count = angular.element(element).children().length;
                    $http.post('/comment/update', {component_id: component_id, count: count})
                        .success(function(data){


                            data.forEach(function(comment){
                                var comment_templ =
                                    '<div class="comments--comment">' +
                                    '<div class="author">' +
                                    '<a href="/user/id' + comment.user_id + '/profile" target="_blank">' +
                                    comment.first_name + ' ' + comment.second_name +
                                    '</a>' +
                                    '<a href="javascript:" class="delete-ico"><i class="fa fa-times"></i></a>' +
                                    '</div>' +
                                    '<div class="msg">' + comment.value + '</div>' +
                                    '</div>';
                                angular.element(element).append(comment_templ);
                            });

                        });

                }, 1500)*/

            }
        }
    });
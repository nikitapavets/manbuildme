angular.module('mainApp', ['ngStorage', 'ngRoute', 'dndLists', 'btford.markdown'])
    .controller('mainController', function ($scope, $localStorage) {

        $scope.$storage = $localStorage.$default({
            styleColor: 'blue'
        });

        $scope.styleColor = $scope.$storage.styleColor;

        $scope.newColor = function(){
            $scope.$storage.styleColor = $scope.styleColor;
        };

        $scope.$storage = $localStorage;
        $scope.user = $scope.$storage.user;

        $scope.menuShowStatus = true;
        $scope.showMenu = function(){
            var menu = document.querySelector('.main-menu');
            var content = document.querySelector('.main-content');
            if($scope.menuShowStatus){
                angular.element(menu).css("transform", "translateX(-100%)");
                angular.element(content).css("margin-left", "0px");
            }else{
                angular.element(menu).css("transform", "translateX(0)");
                angular.element(content).css("margin-left", "300px");
            }
            $scope.menuShowStatus = !$scope.menuShowStatus;
        }

        $scope.starMouseOver = function(index){
            var star_wrap = document.querySelector(".star--wrap");
            var stars = angular.element(star_wrap).find("a");
            for(var i = 0; i <= index; i++){
                var star = stars.eq(i).css("border-bottom", "1px solid #2196F3");
            }
        }
        $scope.starMouseOut = function(){
            var star_wrap = document.querySelector(".star--wrap");
            var stars = angular.element(star_wrap).find("a");
            for(var i = 0; i < stars.length; i++){
                var star = stars.eq(i).css("border", "none");
            }
        }
        $scope.starClick = function(index){
            var star_wrap = document.querySelector(".star--wrap");
            var stars = angular.element(star_wrap).find("a");
            for(var i = 0; i < stars.length; i++){
                var star = stars.eq(i).addClass("fa-star-o").removeClass("fa-star");
            }
            for(var i = 0; i <= index; i++){
                var star = stars.eq(i).addClass("fa-star").removeClass("fa-star-o");
            }

            var rate = index + 1;
        }
    })
    .config(function($routeProvider){
        $routeProvider.when('/user/profile',
        {
            templateUrl:'/user/profile',
            controller:'appCtrl'
        });
    })
    .controller("appCtrl", function($scope){
        console.log('controller set up');
    });



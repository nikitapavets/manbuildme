angular.module('mainApp', ['ngStorage', 'ngRoute'])
    .controller('mainController', function ($scope, $localStorage) {

        $scope.$storage = $localStorage.$default({
            styleColor: 'blue'
        });

        $scope.styleColor = $scope.$storage.styleColor;

        $scope.newColor = function(){
            $scope.$storage.styleColor = $scope.styleColor;
        };

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
    })
    .config(function($routeProvider){
        $routeProvider.when('/users/profile',
        {
            templateUrl:'/users/profile',
            controller:'appCtrl'
        });
    })
    .controller("appCtrl", function($scope){
        console.log('controller set up');
    });



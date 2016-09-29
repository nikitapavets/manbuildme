angular.module('mainApp', ['ngStorage', 'ngRoute', 'dndLists', 'angularOneDrivePicker'])
    .controller('mainController', function ($scope, $localStorage, $http) {

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
    })
    .controller('ExampleCtrl', ['$scope', function ($scope) {
        $scope.files = [];

        $scope.onPicked = function (data) {
            angular.forEach(data.values, function (file, index) {
                $scope.files.push(file);
            });
        }
    }])
    .config(['angularOneDriveSettingsProvider', function (angularOneDriveSettingsProvider) {

        angularOneDriveSettingsProvider.configure({
            client_id    : '622cda87-2fc6-4d49-84d2-c7926f7e313c'
        });
    }])



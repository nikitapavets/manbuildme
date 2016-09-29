angular.module('mainApp', ['ngStorage', 'ngRoute', 'dndLists', 'lk-google-picker'])
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

        $scope.onLoaded = function () {
            console.log('Google Picker loaded!');
        }

        $scope.onPicked = function (docs) {
            angular.forEach(docs, function (file, index) {
                $scope.files.push(file);
            });
        }

        $scope.onCancel = function () {
            console.log('Google picker close/cancel!');
        }
    }])
    .config(['lkGoogleSettingsProvider', function (lkGoogleSettingsProvider) {

        lkGoogleSettingsProvider.configure({
            apiKey   : 'AIzaSyCCuNYE5hdRI6vKvSHYYBcTvJTGenfs3nY',
            clientId : '411562731944-956aidmkdkefimfdjes0s8im4orb9a88.apps.googleusercontent.com'
        });
    }])



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
    .config(['lkGoogleSettingsProvider', function (lkGoogleSettingsProvider) {

        // Configure the API credentials here
        lkGoogleSettingsProvider.configure({
            apiKey   : 'AIzaSyCCuNYE5hdRI6vKvSHYYBcTvJTGenfs3nY',
            clientId : '411562731944-956aidmkdkefimfdjes0s8im4orb9a88.apps.googleusercontent.com',
            scopes   : ['https://www.googleapis.com/auth/drive']
        });
    }])

    .filter('getExtension', function () {
        return function (url) {
            return url.split('.').pop();
        };
    })
    .controller('ExampleCtrl', ['$scope', 'lkGoogleSettings', function ($scope, lkGoogleSettings) {
        $scope.files     = [];
        $scope.languages = [
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'Français' },
            { code: 'ja', name: '日本語' },
            { code: 'ko', name: '한국' },
        ];

        // Check for the current language depending on lkGoogleSettings.locale
        $scope.initialize = function () {
            angular.forEach($scope.languages, function (language, index) {
                if (lkGoogleSettings.locale === language.code) {
                    $scope.selectedLocale = $scope.languages[index];
                }
            });
        };

        // Callback triggered after Picker is shown
        $scope.onLoaded = function () {
            console.log('Google Picker loaded!');
        }

        // Callback triggered after selecting files
        $scope.onPicked = function (docs) {
            angular.forEach(docs, function (file, index) {
                $scope.files.push(file);
            });
        }

        // Callback triggered after clicking on cancel
        $scope.onCancel = function () {
            console.log('Google picker close/cancel!');
        }

        // Define the locale to use
        $scope.changeLocale = function (locale) {
            lkGoogleSettings.locale = locale.code;
        };
    }]);



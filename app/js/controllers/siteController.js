angular.module('mainApp')
    .controller('siteController', function ($scope, $localStorage) {

        $scope.menuBarsStatus = false;
        $scope.$watch('menuBarsStatus', function(){
            console.log($scope.menuBarsStatus);
        });
        $scope.menuBars = function(){

            var menu = document.querySelector('.menu-pagination');
            if(!$scope.menuBarsStatus){
                angular.element(menu).css('display', 'block');
            }else{
                angular.element(menu).css('display', 'none');
            }
            $scope.menuBarsStatus = ! $scope.menuBarsStatus;
        }
    });
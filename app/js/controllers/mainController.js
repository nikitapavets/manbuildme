angular.module('mainApp', [])
    .controller('colorController', function ($scope) {

        $scope.styleColor = 'blue';

        $scope.switchColor = function(){
            console.log(color);
        };

        $scope.menuShowStatus = true;
        $scope.showMenu = function(){
            var elem = document.querySelector('.main-menu');
            if($scope.menuShowStatus){
                angular.element(elem).css("transform", "translateX(-100%)");
            }else{
                angular.element(elem).css("transform", "translateX(0)");
            }
            $scope.menuShowStatus = !$scope.menuShowStatus;
        }
    })

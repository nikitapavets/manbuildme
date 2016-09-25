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

        $scope.site_page = "page.jade"
    })
    .controller("dndController", function($scope) {

        $scope.models = {
            selected: null,
            lists: {"A": [], "B": []}
        };

        var compotents = [
            'text',
            'image',
            'video',
            'comments'
        ]

        // Generate initial model
        $scope.models.lists.B.push({label: 'text'});
        $scope.models.lists.B.push({label: 'image'});
        $scope.models.lists.B.push({label: 'video'});
        $scope.models.lists.B.push({label: 'comments'});
        for (var i = 0; i < 4; ++i) {
            $scope.models.lists.A.push({label: compotents[i]});
        }

        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);
    });

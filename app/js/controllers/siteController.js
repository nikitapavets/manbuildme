angular.module('mainApp')
    .controller('siteController', function ($scope, $localStorage) {

        $scope.menuBarsStatus = false;
        $scope.menuBars = function(){

            var menu = document.querySelector('.menu-pagination');
            if(!$scope.menuBarsStatus){
                angular.element(menu).css('display', 'block');
            }else{
                angular.element(menu).css('display', 'none');
            }
            $scope.menuBarsStatus = ! $scope.menuBarsStatus;
        }

        $scope.pushComment = function(){
            var elem = document.querySelector('.new_comment');
            var value = angular.element(elem).val();
            console.log(value);
        }

        $scope.site_page = "page.jade";
    })
    .controller("dndController", function($scope, $http) {



        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        $scope.page_id = 0;
        $scope.$watch('page_id', function(model) {
            if($scope.page_id != 0) {

                $http.post('/site/get_page', {page_id: $scope.page_id})
                    .success(function (data) {
                        console.log(data);


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

                        $scope.models.lists.B = data;
                        for (var i = 0; i < 4; ++i) {
                            $scope.models.lists.A.push({label: compotents[i]});
                        }
                    });
            }
        }, true);


        $scope.savePage = function(){
            var pageComponents = $scope.models.lists.B;

            console.log(pageComponents);
            $http.post('/site/save_page',
                {
                    pageComponents: pageComponents,
                    page_id: $scope.page_id
                })
                .success(function(data){
                    console.log(data);
                });
        }
    });

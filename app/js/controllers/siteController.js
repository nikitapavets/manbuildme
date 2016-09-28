angular.module('mainApp')
    .controller('siteController', function ($scope, $localStorage, $http) {

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

        $scope.$storage = $localStorage;
        $scope.user = $scope.$storage.user;

        $scope.updateComments = function(component_id){
            console.log(component_id);
        }

        $scope.pushComment = function(component_id, elem){
            var comment_fields = document.getElementsByClassName('new_comment');
            var comment = '';
            for(var i = 0; i < comment_fields.length; i++){
               if(angular.element(comment_fields[i]).val() != ''){
                   comment = angular.element(comment_fields[i]).val();
                   angular.element(comment_fields[i]).val('');
                   break;
               }
            }
            var hash = component_id;
            var user_id = $scope.user.id;

            $http.post('/comment/new', {comment: comment, hash: hash, user_id: user_id})
                .success(function(data){

                });
        }

        $scope.site_page = "page.jade";

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
        $scope.starClick = function(index, page_id){
            var star_wrap = document.querySelector(".star--wrap");
            var stars = angular.element(star_wrap).find("a");
            for(var i = 0; i < stars.length; i++){
                var star = stars.eq(i).addClass("fa-star-o").removeClass("fa-star");
            }
            for(var i = 0; i <= index; i++){
                var star = stars.eq(i).addClass("fa-star").removeClass("fa-star-o");
            }

            var rate = index + 1;
            $http.post('/site/add_rate',
                {
                    user_id: $scope.user.id,
                    page_id: page_id,
                    rate: rate
                })
                .success(function(data){
                   console.log(data);
                });
        }
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

                        if(data.length > 0){
                            $scope.models.lists.B = data;
                        }else{
                            $scope.models.lists.B[0] = {label: 'text'};
                        }
                        for (var i = 0; i < 4; ++i) {
                            $scope.models.lists.A.push({label: compotents[i]});
                        }
                    });
            }
        }, true);


        $scope.savePage = function(site_id, page_id){
            var pageComponents = $scope.models.lists.B;
            $http.post('/site/save_page',
                {
                    pageComponents: pageComponents,
                    site_id: site_id,
                    page_id: $scope.page_id
                })
                .success(function(data){
                    //todo
                });
        }
    });

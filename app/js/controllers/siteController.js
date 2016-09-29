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

            if($scope.user.id){
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

        }
    })
    .controller("dndController", function($scope, $http) {

        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        $scope.page_id = 0;
        $scope.site_id = 0;
        $scope.$watch('page_id', function(model) {
            if($scope.page_id != 0) {

                $http.post('/site/get_page', {page_id: $scope.page_id})
                    .success(function (data) {

                        console.log(data);

                        $scope.models = {
                            selected: null,
                            lists: {
                                "A": [
                                    {label: 'text'},
                                    {label: 'image'},
                                    {label: 'video'},
                                    {label: 'comments'}
                                ]
                            }
                        };



                        if(data){

                            if(data.layout > 0){
                                $scope.models.lists.Section_One = [];
                                $scope.models.lists.Section_One[0] = {label: 'text', value: 'Пустая страница'};
                            }
                            if(data.layout > 1){
                                $scope.models.lists.Section_Two = [];
                                $scope.models.lists.Section_Two[0] = {label: 'text', value: 'Пустая страница'};
                            }
                            if(data.layout > 2){
                                $scope.models.lists.Section_Three = [];
                                $scope.models.lists.Section_Three[0] = {label: 'text', value: 'Пустая страница'};
                            }

                            var l_comps = [
                                [], [], []
                            ];
                            for(var k = 0 ; k < data.components.length; k++){
                                if(data.components[k].position < 100){
                                    l_comps[0].push(data.components[k]);
                                }else if(data.components[k].position < 200){
                                    l_comps[1].push(data.components[k]);
                                }else{
                                    l_comps[2].push(data.components[k]);
                                }
                            }

                            if(data.layout > 0){
                                if(l_comps[0].length > 0){
                                    $scope.models.lists.Section_One = l_comps[0];
                                }
                            }
                            if(data.layout > 1){
                                if(l_comps[1].length > 0){
                                    $scope.models.lists.Section_Two = l_comps[1];
                                }
                            }
                            if(data.layout > 2){
                                if(l_comps[2].length > 0){
                                    $scope.models.lists.Section_Three = l_comps[2];
                                }
                            }
                        }

                        $scope.models.lists.Basket = [];
                        $scope.models.lists.Basket[0] = {label: 'text', value: 'Удалённый текстовый узел'};

                        var layoutTypes = Object.keys($scope.models.lists).length;
                        angular.element(document).ready(function () {
                            switch(layoutTypes){
                                case 3: {
                                    angular.element(document.querySelector('.layout-1')).addClass('col-md-12');
                                    angular.element(document.querySelector('.layout-1')).after('<div class="clearfix"></div>');
                                    angular.element(document.querySelector('.layout-2')).addClass('col-md-12');
                                    break;
                                }
                                case 4:{
                                    angular.element(document.querySelector('.layout-1')).addClass('col-md-6');
                                    angular.element(document.querySelector('.layout-2')).addClass('col-md-6');
                                    angular.element(document.querySelector('.layout-2')).after('<div class="clearfix"></div>');
                                    angular.element(document.querySelector('.layout-3')).addClass('col-md-12');
                                    break;
                                }
                                case 5:{
                                    angular.element(document.querySelector('.layout-1')).addClass('col-md-12');
                                    angular.element(document.querySelector('.layout-1')).after('<div class="clearfix"></div>');
                                    angular.element(document.querySelector('.layout-2')).addClass('col-md-6');
                                    angular.element(document.querySelector('.layout-3')).addClass('col-md-6');
                                    angular.element(document.querySelector('.layout-3')).after('<div class="clearfix"></div>');
                                    angular.element(document.querySelector('.layout-4')).addClass('col-md-12');
                                    break;
                                }
                            }
                        });

                    });
            }
        }, true);

        $scope.savePage = function(site_id, page_id){
            var pageComponents = [
                $scope.models.lists.Section_One,
                $scope.models.lists.Section_Two,
                $scope.models.lists.Section_Three
            ]
            console.log(pageComponents);
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

        var options = {
             success: function(files) {
                alert("Here's the file link: " + files[0].link)
                angular.element(document.querySelector($scope.DropBoxArea)).append(files[0].link);
             },
             cancel: function() {

             },
             linkType: "direct",
             multiselect: true,
             extensions: ['.jpg', '.png', '.jpeg'],
             };
        $scope.DropBoxInit = function(images_wrap_id){
            Dropbox.choose(options);
            $scope.DropBoxArea = '.images' + images_wrap_id;
        }
        $scope.DropBoxArea = '';

    });

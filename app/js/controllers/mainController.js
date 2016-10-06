angular.module('mainApp', ['ngStorage', 'ngRoute', 'dndLists'])
    .controller('mainController', function ($scope, $localStorage, $http) {

        $scope.$storage = $localStorage.$default({
            styleColor: 'blue',
            lang: 'rus'
        });

        $scope.styleColor = $scope.$storage.styleColor;
        $scope.lang = $scope.$storage.lang;
        console.log($scope.lang);

        $scope.$watch('lang', function(newValue, oldValue) {
            $scope.$storage.lang = $scope.lang;
            if(newValue == 'rus'){
                $scope.ctext = $scope.ctex_rus;
            }else{
                $scope.ctext = $scope.ctex_eng;
            }
        });

        $scope.ctex_rus = {
            styles: 'Стиль',
            lang: 'Язык',
            top_pages: 'Популярные страницы',
            last_pages: 'Последние обновления',
            table_title: 'Название',
            table_site: 'Сайт',
            table_type: 'Тема',
            table_rate: 'Рейтинг',
            table_update: 'Обновление',
            table_actions: 'Действия',
            table_pages: 'Страницы',
            table_created: 'Создание',
            table_creator: 'Создатель',
            table_top: 'Топ',
            style_red: 'Красный',
            style_blue: 'Синий',
            style_green: 'Зелёный',
            lang_rus: 'Рус',
            lang_eng: 'Анг',
            tags_cloud: 'Облако тегов',
            user_profile: 'Профиль',
            user_exit: 'Выйти',
            user_user: 'Пользователь',
            user_statistics: 'Статистика',
            user_sites: 'Сайты',
            user_all_sites: 'Сайтов',
            user_all_comments: 'Комментариев',
            user_all_marks: 'Оценок',
            add_site_site: 'Сайт',
            add_site_title: 'Название',
            add_site_theme: 'Тема',
            add_site_vert: 'Вертикальное меню',
            add_site_hor: 'Горизонтальное меню',
            add_site_tag: 'Тег',
            add_site_add: 'Добавить',
            add_site_site_pages: 'Страницы сайта',
            add_site_page: 'Страница',
            add_site_layout: 'Разметка',
            add_site_save: 'Сохранить',
        };

        $scope.ctex_eng = {
            styles: 'Style',
            lang: 'Lang',
            top_pages: 'Top pages',
            last_pages: 'Last pages',
            table_title: 'Title',
            table_site: 'Site',
            table_type: 'Type',
            table_rate: 'Rate',
            table_update: 'Update',
            table_actions: 'Actions',
            table_pages: 'Pages',
            table_created: 'Created',
            table_creator: 'Creator',
            table_top: 'Top',
            style_red: 'Red',
            style_blue: 'Blue',
            style_green: 'Green',
            lang_rus: 'Rus',
            lang_eng: 'Eng',
            tags_cloud: 'Tag cloud',
            user_profile: 'Profile',
            user_exit: 'Exit',
            user_user: 'User',
            user_statistics: 'Statistic',
            user_sites: 'Sites',
            user_all_sites: 'Sites',
            user_all_comments: 'Comments',
            user_all_marks: 'Marks',
            add_site_site: 'Site',
            add_site_title: 'Title',
            add_site_theme: 'Theme',
            add_site_vert: 'Vertical menu',
            add_site_hor: 'Horizontal menu',
            add_site_tag: 'Tag',
            add_site_add: 'Add',
            add_site_site_pages: 'Site pages',
            add_site_page: 'Page',
            add_site_layout: 'Layout',
            add_site_save: 'Save',
        };

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

        $scope.pages = [];
        $scope.pages_title = "";
        $scope.uploadTopPages = function(){
            $http.post('/top_pages')
                .success(function(data){
                    $scope.pages_title = $scope.ctext.top_pages;
                    $scope.pages = data;
                });
        }
        $scope.uploadLastPages = function(){
            $http.post('/last_pages')
                .success(function(data){
                    $scope.pages_title = $scope.ctext.last_pages;
                    $scope.pages = data;
                });
        }

        $scope.ShowSearchFiels = function(){
            angular.element(document.querySelector(".search_wrap")).toggleClass("hidden");
        }

        $scope.searchResult = [];
        $scope.SerchInformation = function(event){
            if(event.keyCode == 13){
                var search_val = angular.element(document.querySelector("#search-field")).val();
                console.log(search_val);
                $http.post('/search', {search_data: search_val})
                    .success(function(data){
                        $scope.searchResult = data;
                    });
            }
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
    });



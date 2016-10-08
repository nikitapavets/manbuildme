angular.module('mainApp')
    .controller('mainMenuController', function ($scope, $http, $localStorage) {

        $scope.user = {
            is_auth: false,
            rang: 'guest',
            avatar: '/img/no-avatar.png'
        };

        $scope.$storage = $localStorage.$default({
            user: $scope.user
        });
        if("social_id" in $scope.$storage.user){
            $scope.user = $scope.$storage.user;
        }

        $scope.userActions = [];
        $scope.userActions.exit = function(){
            delete $scope.$storage.user;
            $scope.user.is_auth = false;
            $scope.user.avatar = '/img/no-avatar.png';
            $scope.user.rang = 'guest';
            window.location.replace('/');
        }

        $scope.authType = '';
        $scope.auth= function(){
            OAuth.initialize('EFhhDQfN18bds23egFDfL80HwE0');
            OAuth.popup($scope.authType)
                .done(function(result) {
                    result.me().done(function(data) {
                        var user = new Object();
                        if("firstname" in data){
                            user.first_name = data.firstname;
                            user.second_name = data.lastname;
                        }else{
                            var name = data.name.split(' ');
                            user.first_name = name[0];
                            user.second_name = name[1];
                        }
                        user.social_id = data.id;
                        user.social_url = data.url;
                        user.avatar = data.avatar;
                        $http.post('/auth', user)
                            .success(function(data){
                                $scope.user = Object.assign(data);
                                $scope.user.is_auth = true;
                                $scope.user.name = $scope.user.first_name + ' ' + $scope.user.second_name;
                                $scope.$storage.user = $scope.user;
                            });
                    })
                })
        }

        $scope.showUserMenuStatus = false;
        $scope.showUserMenu = function(){
            var menu = document.querySelector('.about-user--menu');
            if($scope.showUserMenuStatus){
                angular.element(menu).css('display', 'none');
            }else{
                angular.element(menu).css('display', 'block');
            }
            $scope.showUserMenuStatus = !$scope.showUserMenuStatus;
        }

    })


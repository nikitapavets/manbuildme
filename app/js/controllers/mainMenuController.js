angular.module('mainApp')
    .controller('mainMenuController', function ($scope, $http) {

        $scope.user = new Object();
        $scope.isAuth = false;

        $scope.authType = '';
        $scope.auth= function(){
            OAuth.initialize('EFhhDQfN18bds23egFDfL80HwE0');
            OAuth.popup($scope.authType)
                .done(function(result) {
                    result.me().done(function(data) {
                        var user = new Object();
                        console.log(data);
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
                                $scope.user = data;
                                console.log(data);
                                $scope.isAuth = true;
                            });
                    })
                });
        }


    })


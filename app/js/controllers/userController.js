angular.module('mainApp')
    .controller('userController', function ($scope, $http, $localStorage) {
        $scope.$storage = $localStorage;
        $scope.user = $scope.$storage.user;

        $scope.user_sites = [];
        $http.post('/user/id' + $scope.user.id + '/profile', null)
            .success(function(data){
                $scope.user_sites = data;
            });

        $scope.siteRemove = function(site_id){
            $http.post('/site/remove', {site_id: site_id, user_id: $scope.user.id})
                .success(function(data){
                    if(data == 'ok'){
                        location.reload();
                    }
                });
        }

    });
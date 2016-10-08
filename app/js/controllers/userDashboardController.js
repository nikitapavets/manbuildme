angular.module('mainApp')
    .controller('userDashboardController', function ($scope, $http) {

        $scope.UserLock = function(user_id, index){

            if(index != 0) {
                var lock = document.querySelector('.lock' + user_id + ' i');
                var lock_status = angular.element(lock).hasClass("fa-lock");
                var new_status = lock_status ? 0 : 1;

                $http.post('/user/set_status', {status: new_status, user_id: user_id})
                    .success(function (data) {
                        if (data) {
                            angular.element(lock).toggleClass("fa-lock fa-unlock");
                        }
                    });
            }
        }

        $scope.UserRang = function(user_id, index){

            if(index != 0){
                var lock = document.querySelector('.rang'+user_id+' i');
                var lock_status = angular.element(lock).hasClass("fa-user");
                var new_rang = lock_status ? 'admin' : 'user';
                $http.post('/user/set_rang', {rang: new_rang, user_id: user_id})
                    .success(function(data){
                        if(data){
                            angular.element(lock).toggleClass("fa-user fa-user-secret");
                        }
                    });
            }
        }

        $scope.UserRemove = function(user_id, index){

            if(index != 0){
                var remove = document.querySelector('.remove'+user_id);
                angular.element(remove).detach();
                $http.post('/user/remove', {user_id: user_id})
                    .success(function(data){
                        if(data){
                            angular.element(remove).detach();
                        }
                    });
            }
        }

    });
angular.module('mainApp')
    .controller('mainMenuController', function ($scope) {

        $scope.user = {
            name: 'Nikita'
        };

        $scope.authType = '';
        $scope.auth= function(){

            OAuth.initialize('EFhhDQfN18bds23egFDfL80HwE0');
            OAuth.popup($scope.authType)
                .done(function(result) {
                    console.log(result);
                    result.me().done(function(data) {
                        console.log(data);
                    })
                });
        }


    })


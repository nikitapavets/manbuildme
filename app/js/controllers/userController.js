angular.module('mainApp')
    .controller('userController', function ($scope, $http, $localStorage) {
        $scope.$storage = $localStorage;
        $scope.user = $scope.$storage.user;
    });
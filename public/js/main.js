/**
 * Created by Kody on 2/9/2016.
 */
var pbWeb = angular.module('pbWeb', ['ngRoute']);

pbWeb.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'mainController'
        })
        .when('/map', {
            templateUrl: 'templates/map.html',
            controller: 'mapController'
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: 'templates/register.html',
            controller: 'registerController'
        })
        .when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'profileController'
        });
});

pbWeb.controller('mainController', function($scope) {
    $scope.message = 'Home';
});
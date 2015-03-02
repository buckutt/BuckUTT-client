'use strict';

var buckutt = angular.module('buckutt', [
    'ngRoute',
    'ngResource'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'connection/connection.html'
        }).otherwise({
            redirectTo: '/'
        });
}])
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
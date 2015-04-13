'use strict';

var buckutt = angular.module('buckutt', [
	'ngRoute',
	'ngResource',
	'angular-jwt'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'connection/connection.html'
		}).when('/waiter', {
			templateUrl: 'waiter/waiter.html'
		}).when('/buy', {
			templateUrl: 'buy/buy.html'
		}).otherwise({
			redirectTo: '/'
		});
}])
.run(function(GetDeviceId, config, Device) {
	switch(config.deviceId.method) {
		case "script":
			GetDeviceId.get({}, function(res_api) {
				if(res_api.device) {
					Device.setDeviceId(res_api.device);
				}
			});
			break;
		default:
			deviceId = config.deviceId.defaultValue;
			Device.setDeviceId(deviceId);
			break;
	}
});
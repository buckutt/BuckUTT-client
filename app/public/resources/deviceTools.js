'use strict';

buckutt.factory('GetDevice', function ($resource) {
	return $resource('/api/devices');
});

buckutt.factory('GetDevicePoint', function ($resource) {
	return $resource('/api/devicespoints?Period.startDate=<=:now&Period.endDate=>=:now');
});
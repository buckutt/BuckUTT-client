'use strict';

buckutt.factory('GetDevice', function ($resource) {
	return $resource('/api/devices');
});

buckutt.factory('GetDevicePoint', function ($resource) {
	return $resource('/api/devicespoints?Period.startDate=<%3d:now&Period.endDate=>%3d:now');
});

'use strict';

buckutt.factory('GetDeviceId', function ($resource, config) {
	return $resource('http://localhost:'+config.deviceId.port+'/device.html');
});
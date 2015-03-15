'use strict';

buckutt.provider('Device', [
	function () {
		var _deviceId = undefined;
		var _devicePoint = undefined;

		this.setDeviceId = function(deviceId) {
			_deviceId = deviceId;
		};

		this.$get = function() {
			return {
				getDeviceId: function () { 
					return _deviceId; 
				},
				setDevicePoint: function(devicePoint) {
					_devicePoint = devicePoint;
				},
				getDevicePoint: function() {
					return _devicePoint;
				}
			}
		};
	}
]);

buckutt.config(['DeviceProvider', function (DeviceProvider) {
    DeviceProvider.setDeviceId(1); // TO DO : get DeviceId from pertelian app
}]);
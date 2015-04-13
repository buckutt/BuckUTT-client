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
				setDeviceId: function(deviceId) {
					_deviceId = deviceId;
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
'use strict';

buckutt.controller('Connection', [
	'$scope',
	'$location',
	'$http',
	'GetUser',
	'GetDevice',
	'GetDevicePoint',
	'Notifier',
	'User',
	'Device',
	'GetLogin',
	'jwtHelper',
	'Socket',
	function($scope, $location, $http, GetUser, GetDevice, GetDevicePoint, Notifier, User, Device, GetLogin, jwtHelper, Socket) {
		$scope.userPin = '';
		$scope.savedId = '';


		if(!User.getSellerSocket()) {
			User.setSellerSocket(true);
			Socket.on('card', function(data) {
	 			if(!User.getUser() && !User.isBuyerLogged()) {
					$scope.cardId = data;
					$scope.pressEnter();
				}
			});
		}

		$scope.pressEnter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			cardId = cardId.substr(0,13);
			if(cardId != "") {
				$scope.savedId = cardId;
				askForPin();
			} else Notifier('Erreur', 'error', 2, '(empty)');
			$scope.cardId = '';
		}

		var askForPin = function() {
			$('#modalPin').modal();
		}

		$scope.changeUserPin = function(value) {
			if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
			else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
		}

		var updateDevice = function() {
			GetDevice.get({
				device: Device.getDeviceId(),
				isRemoved: false
			},
			function(res_api) {
				if(res_api.data) {
					var currentDate = new Date();
					var linkId = res_api.data.id;
					GetDevicePoint.get({
						DeviceId: linkId,
						order: 'priority',
						asc: 'ASC',
						embed: 'Period',
						now: (new Date(currentDate.setTime(currentDate.valueOf() - 60000 * currentDate.getTimezoneOffset()))).toISOString(),
						isRemoved: false
					},
					function(res_api) {
						if(res_api.data) {
							var pointId = getCurrentPoint(res_api.data);
							Device.setDevicePoint(pointId);
							$location.path("/waiter");
						} else {
							Notifier('Erreur', 'error', 4, 'DevicePoint');
						}
					});
				} else {
					Notifier('Erreur', 'error', 4, 'Device');
				}
			});
		}

		var getCurrentPoint = function(data) {
			if(data.length >= 2) return data[0].PointId;
			return data.PointId;
		};

		$scope.log = function() {
			GetLogin.save({
				MeanOfLoginId: 4,
				data: $scope.savedId,
				pin: $scope.userPin
			},
			function(res_api) {
				if(res_api.token) {
					User.setToken(res_api.token);
					var savedUser = res_api.user;
					savedUser.UsersRights = jwtHelper.decodeToken(User.getToken()).rights;
					if(jwtHelper.decodeToken(User.getToken()).rights) {
						User.setUser(savedUser);
						$http.defaults.headers.common.Authorization = 'Bearer '+User.getToken();
						updateDevice();
					} else {
						Notifier('Erreur', 'error', 2, '(rights)');
					}
				} else if(res_api.error) {
					Notifier('Erreur', 'error', 2, '(login)');
				}
			},
			function(err) {
				Notifier('Erreur', 'error', 2, '(login)');
			});
			$scope.userPin = '';
		}

		$scope.clearpin = function() {
			alert('Clear');
			$scope.userPin = '';
		}

		var giveBackFocus = function () {
                        angular.element('[focus-me]')[0].focus();
			setTimeout(giveBackFocus, 200);
		};

		giveBackFocus();
	}
]);

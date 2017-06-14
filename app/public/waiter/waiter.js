'use strict';

buckutt.controller('Waiter', [
	'$scope',
	'$location',
	'$timeout',
	'GetUser',
	'GetId',
	'GetGroups',
	'Device',
	'User',
	'Notifier',
	'Socket',
	function($scope, $location, $timeout, GetUser, GetId, GetGroups, Device, User, Notifier, Socket) {
		if(!User.hasRight('waiter', Device.getDevicePoint())) {
			Notifier('Erreur', 'error', 3);
			User.logout();
			$location.path("/")
		}

		$scope.cardId = '';
		$scope.lastBuyerData = User.getLastBuyerData();

		if(!User.getBuyerSocket()) {
			User.setBuyerSocket(true);
			Socket.on('card', function(data) {
				if(User.getUser() && !User.isBuyerLogged()) {
					$scope.cardId = data;
					$scope.pressEnterWaiter();
				}
			});
		}

        $scope.reloadPage = function () {
            location.reload();
        };

		$scope.pressEnterWaiter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			cardId = cardId.substr(0,13);
			if(cardId != "") {
				GetId.get({
					data: cardId,
					isRemoved: false
				},
				function(res_api) {
					if(!res_api.error && res_api.data) {
						GetUser.get({
							id: res_api.data.UserId,
							isRemoved: false
						},
						function(res_api2) {
							if(!res_api2.error && res_api2.data) {
								User.setBuyer(res_api2.data);
								var date = new Date();
								GetGroups.get({
									UserId: res_api2.data.id,
									now: (new Date(date.setTime(date.valueOf() - 60000 * date.getTimezoneOffset()))).toISOString(),
									isRemoved: false,
									embed: 'Period'
								},
								function(res_api3) {
									if(!res_api3.error && res_api3.data) {
										User.setBuyerGroups(res_api3.data);
										$location.path("/buy");
									} else Notifier('Erreur', 'error', 10);
								});
							}
							else Notifier('Erreur', 'error', 2, '(user)');
						});
					}
					else Notifier('Erreur', 'error', 2, '(user)');
				});
			} else Notifier('Erreur', 'error', 2, '(empty)');
			$scope.cardId = '';
		};

		$scope.askLogout = function() {
			$('#modalLogout').modal();
		};

		$scope.logout = function() {
			User.logout();
			$timeout(function() { $location.path("/"); }, 1000);
		};

		var giveBackFocus = function () {
			angular.element('[focus-me]')[0].focus();
			setTimeout(giveBackFocus, 200);
		};

		giveBackFocus();
	}
]);

'use strict';

buckutt.controller('Connection', [
	'$scope',
	'GetId',
	'GetUser',
	'Error',
	function($scope, GetId, GetUser, Error) {
		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		}

		$scope.pressEnter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			if(cardId != "") {
				GetId.get({
					cardId: cardId
				},
				function(res_api) {
					if(res_api.data) {
						askForPin(res_api.data);
					} else {
						Error('Erreur', 2, '(mol)');
					}
				});
				$scope.cardId = '';
			} else Error('Erreur', 2, '(empty)');
		}

		var askForPin = function(mol) {
			GetUser.get({
				user: mol.UserId
			},
			function(res_api) {
				if(res_api.data) {
					console.log(res_api.data);
				} else {
					Error('Erreur', 2, '(user)');
				}
			});
		}

		$scope.autofocus();
	}
]);
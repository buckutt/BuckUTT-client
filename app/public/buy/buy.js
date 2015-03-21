'use strict';
buckutt.controller('Buy', [
	'$scope',
	'$location',
	'GetAvailableArticles',
	'GetArticlesLinks',
	'User',
	'Device',
	'Error',
	function($scope, $location, GetAvailableArticles, GetArticlesLinks, User, Device, Error) {
		if(!User.hasRight('buy', Device.getDevicePoint())) {
			Error('Erreur', 3);
			User.logout();
			$location.path("/");
		}

		if(!User.isBuyerLogged()) {
			Error('Erreur', 5);
			$location.path("/waiter");
		}

		var currentCategory = "Accueil";
		$scope.categories = [];
		var products = {};
		var promotions = [];
		var promotionsIds = [];
		var nbSteps = [];
		$scope.buyer = User.getBuyer();

		GetAvailableArticles.get({
			PointId: Device.getDevicePoint(),
			BuyerId: User.getBuyer().id
		},
		function(res_api) {
			if(res_api.data[0]) {
				angular.forEach(res_api.data[0], function(product, key) {
					if(product.category == null) {
						product.category = "Accueil";
					}
					if(!products[product.category] && product.category) {
						$scope.categories.push({
							"id": product.category,
							"name": product.category
						});
						products[product.category] = [];
					}
					if(product.type == "product") products[product.category].push(product);
					else if(product.type == "promotion") {
						promotionsIds.push(product.id);
					}
					if(promotionsIds[0]) definePromotions(0);
					$scope.switchCategory(currentCategory);
					$scope.actualProducts = products[currentCategory];
					$scope.cart = [];
				});
			} else {
				Error('Erreur', 6);
				$location.path("/waiter");
			}
		});


		var definePromotions = function(articleId) {
			GetArticlesLinks.get({
				ArticleId: articleId
			},
			function(res_api) {
				if(res_api.data) {
					console.log(es_api.data);
				}
			})

			if(promotionsIds[(articleId+1)]) definePromotions(articleId+1);
		};

		$scope.switchCategory = function(id) {
			currentCategory = id;
			$scope.actualProducts = products[id];
		};

	}
]);
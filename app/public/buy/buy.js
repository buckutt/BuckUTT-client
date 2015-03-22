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
		var rawProducts = [];
		var promotions = [];
		var promotionsIds = [];
		var nbSteps = [];
		var cart = [];
		var nbCart = 0;
		$scope.buyer = User.getBuyer();

		GetAvailableArticles.get({
			PointId: Device.getDevicePoint(),
			BuyerId: User.getBuyer().id
		},
		function(res_api) {
			if(res_api.data[0]) {
				rawProducts = res_api.data[0];
				res_api.data[0].forEach(function(product, key) {
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
				});
				if(promotionsIds[0]) definePromotions(0);
				$scope.switchCategory(currentCategory);
				$scope.actualProducts = products[currentCategory];
				$scope.cart = [];
			} else {
				Error('Erreur', 6);
				$location.path("/waiter");
			}
		});

		var definePromotions = function(articleId) {
			GetArticlesLinks.get({
				ParentId: promotionsIds[articleId]
			},
			function(res_api) {
				if(res_api.data) {
					promotions[res_api.data[0].ParentId] = res_api.data;
					var maxPromo = 0;
					res_api.data.forEach(function(promotion, key) {
						if(promotion.step > maxPromo) maxPromo = promotion.step;
						nbSteps[promotion.ParentId] = maxPromo;
					});
				}
			});
			if(promotionsIds[(articleId+1)]) definePromotions(articleId+1);
		};

		$scope.isActive = function(category) {
			if (category.id == currentCategory) {
				return true;
			}
			return false;
		};

		$scope.switchCategory = function(id) {
			currentCategory = id;
			$scope.actualProducts = products[id];
		};

		var getProductById = function(id) {
			var foundProduct = undefined;
			rawProducts.forEach(function(rawProduct, key) {
				if(rawProduct.id == id) foundProduct = rawProduct;
			});
			return foundProduct;
		};


		var getLowestLevel = function(product) {
			if(product.ParentId == null) return product;
			else {
				var parent = getProductById(product.ParentId);
				return getLowestLevel(parent);
			}
		};

		var isPromotion = function(product, promo) {
			var lowerProduct = getLowestLevel(product);
			var returnValue = false;
			promotions[promo].forEach(function(state, key) {
				if(state.ArticleId == lowerProduct.id) {
					returnValue = true;
				}
			});
			return returnValue;
		};

		var getSteps = function(product, promo) {
			var steps = [];
			var lowerProduct = getLowestLevel(product);

			promotions[promo].forEach(function(step, key) {
				if(lowerProduct.id == step.ArticleId) {
					steps.push(step.step);
				}
			});

			return steps;
		};

		$scope.addProduct = function(product) {
			var backupCart = JSON.parse(JSON.stringify($scope.cart));
			var backupCredit = $scope.buyer.credit;
			var backupNbCart = nbCart;

			var isFound = false;
			$scope.cart.forEach(function(item, key) {
				if(item.product.id == product.id) {
					item.quantity++;
					isFound = true;
				}
			});

			if(!isFound) {
				$scope.cart.push({
					"product":product,
					"quantity":1
				});
			}

			$scope.buyer.credit -= product.price;
			nbCart++;

			var uids = {};
			var promos = {};

			promotions.forEach(function(promotion, key) {
				if(uids[key] == undefined) uids[key] = {};
				if(promos[key] == undefined) promos[key] = {};

				$scope.cart.forEach(function(item, key2) {
					for(var i= 1;i<=item.quantity;i++) {
						var steps = getSteps(item.product,key);
						var currentStep = steps[0];
						var currentUid = uids[key][currentStep];

						steps.forEach(function(step, key2) {
							if(uids[key][step] < currentUid || uids[key][step] == undefined) {
								currentStep = step;
								currentUid = uids[key][currentStep];
							}
						});

						if(uids[key][currentStep] == undefined) uids[key][currentStep] = 0;
						if(promos[key][uids[key][currentStep]] == undefined) promos[key][uids[key][currentStep]] = {};
						if(isPromotion(item.product,key) && currentStep) {
							promos[key][uids[key][currentStep]][currentStep] = item;
							uids[key][currentStep]++;
						}
					}
				});
			});

			angular.forEach(promos, function(promo, key) {
				angular.forEach(promo, function(uid, key2) {
					if(getObjectLength(uid) == nbSteps[key]) {
						var promoItem = {
							"product":getProductById(key),
							"quantity":1,
							"content":[]
						};

						angular.forEach(uid, function(step, key3) {
							promoItem.content[key3-1] = step.product;
							$scope.deleteProduct(step,1);
						});

						$scope.cart.push(promoItem);
						$scope.buyer.credit -= promoItem.product.price;
						nbCart++;
					}
				});
			});

			if($scope.buyer.credit < 0 || nbCart > 50) {
				$scope.cart = JSON.parse(JSON.stringify(backupCart));
				$scope.buyer.credit = backupCredit;
				nbCart = backupNbCart;
			}
		};

		 $scope.deleteProduct = function(item, nbItems) {
			var index = $scope.cart.indexOf(item);
			if(nbItems == 'all') nbItems = $scope.cart[index].quantity;
			if(nbItems <= $scope.cart[index].quantity) {
				$scope.buyer.credit += item.product.price*nbItems;
				if(nbItems == $scope.cart[index].quantity) {
					if(index > -1) {
						$scope.cart.splice(index,1);
					}
				} else {
					$scope.cart[index].quantity -= nbItems;
				}
				nbCart -= nbItems;
			}
		};

		var getObjectLength = function(object) {
			var count = 0;
			for(var i in object) {
				count++;
			}
			return count;
		};

	}
]);
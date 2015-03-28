'use strict';
buckutt.controller('Buy', [
	'$scope',
	'$location',
	'GetAvailableArticles',
	'GetArticlesLinks',
	'GetReloadTypes',
	'PostArticles',
	'PostReload',
	'User',
	'Device',
	'Notifier',
	function($scope, $location, GetAvailableArticles, GetArticlesLinks, GetReloadTypes, PostArticles, PostReload, User, Device, Notifier) {
		if(!User.hasRight('buy', Device.getDevicePoint())) {
			Notifier('Erreur', 'error', 3);
			User.logout();
			$location.path("/");
		}

		if(!User.isBuyerLogged()) {
			Notifier('Erreur', 'error', 5);
			$location.path("/waiter");
		}

		$scope.displayReload = false;
		$scope.displaySell = false;

		if(User.hasRight('sell', Device.getDevicePoint())) {
			$scope.displaySell = true;
		}		
		if(User.hasRight('reload', Device.getDevicePoint())) {
			$scope.displayReload = true;
		}

		$scope.cartSent = false;
		$scope.buyer = User.getBuyer();
		var currentCategory = "Accueil";

		// Reload tools
		if($scope.displayReload) {
			$scope.isDigits = true;
			$scope.reloadingCredit = 0;
			$scope.reloadingCart = [];

			var usefulReloads = [1, 2, 4, 7];
			var chosenType;
			$scope.isSellShown = false;
			$scope.showReload = function() {
				$scope.isSellShown = false;
				currentCategory = "Reload";
			}

			GetReloadTypes.get({},
			function(res_api) {
				if(res_api.data) {
					var reloadTypes = [];
					res_api.data.forEach(function(type, key) {
						if(usefulReloads.indexOf(type.id) !== -1) reloadTypes.push(type);
						if(type.id == usefulReloads[0]) $scope.setType(type);
					});
					$scope.reloadTypes = reloadTypes;
				} else {
					Notifier('Erreur', 'error', 8);
				}
			});

			$scope.setType = function(type) {
				chosenType = type;
				if(type.type == "boxes") {
					$scope.isDigits = false;
					$scope.reloadingCredit = 0;
				} else {
					$scope.isDigits = true;
					$scope.reloadingCredit.toFixed(2);
				}
			};

			$scope.isTypeActive = function(type) {
				if (type == chosenType) return true;
				return false;
			};

			$scope.changeCredit = function(value) {
				var backupCredit = $scope.reloadingCredit;
				if(value == 'x') {
					$scope.reloadingCredit *= 100;
					var modulo = $scope.reloadingCredit % 10;
					$scope.reloadingCredit -= modulo;
					$scope.reloadingCredit /= 1000;
				}
				else {
					$scope.reloadingCredit *= 10*100;
					$scope.reloadingCredit += value;
					$scope.reloadingCredit /= 100;
				}
				$scope.reloadingCredit = $scope.reloadingCredit.toFixed(2);

				if($scope.buyer.credit+$scope.reloadingCredit*100 > 10000) $scope.reloadingCredit = backupCredit;
			};

			$scope.replaceCredit = function(value) {
				if($scope.buyer.credit+value*100 <= 10000) $scope.reloadingCredit = value;
			};

			$scope.addToCart = function() {
				if($scope.buyer.credit+$scope.reloadingCredit*100 <= 10000) {
					var isFound = false;
					$scope.reloadingCart.forEach(function (reload, key) {
						if(reload.type.id == chosenType.id) {
							isFound = true;
							reload.credit += $scope.reloadingCredit*100;
						}
					});

					if(!isFound) {
						var reload = {
							type: chosenType,
							credit: $scope.reloadingCredit*100
						};

						$scope.reloadingCart.push(reload);
					}

					$scope.buyer.credit = $scope.buyer.credit+$scope.reloadingCredit*100;
					$scope.reloadingCredit = 0;
				}
			};

			$scope.deleteReload = function(reload) {
				var backupReloadingCart = JSON.parse(JSON.stringify($scope.reloadingCart));
				var backupCredit = $scope.buyer.credit;

				var index = $scope.reloadingCart.indexOf(reload);
				$scope.buyer.credit -= reload.credit;
				if(index > -1) $scope.reloadingCart.splice(index,1);

				if($scope.buyer.credit < 0) {
					$scope.reloadingCart = JSON.parse(JSON.stringify(backupReloadingCart));
					$scope.buyer.credit = backupCredit;
				}
			};

			var sendReloadingCart = function() {
				if($scope.reloadingCart.length > 0) {
					var nbReloads = $scope.reloadingCart.length;
					var nbFeedbacks = 0;
					var totalReloads = 0;
					$scope.reloadingCart.forEach(function(reload, key) {
						var params = {
							BuyerId: User.getBuyer().id,
							OperatorId: User.getUser().id,
							PointId: Device.getDevicePoint(),
							credit: reload.credit,
							ReloadTypeId: reload.type.id
						};
						PostReload.save(params, function(res_api) {
							if(res_api.id) {
								nbFeedbacks++;
								totalReloads+=reload.credit;

								if(nbFeedbacks == nbReloads) {
									User.setLastBuyerReload((totalReloads/100).toFixed(2));
									if($scope.displaySell) sendBuyingCart(totalReloads);
								}
							} else Notifier('Erreur', 'error', 9);
						});
					});
				} else if($scope.displaySell) sendBuyingCart();
				else $scope.logout();
			};
		}

		// Sell tools
		if($scope.displaySell) {
			$scope.isSellShown = true;
			$scope.categories = [];
			var products = {};
			var rawProducts = [];
			var promotions = [];
			var promotionsIds = [];
			var nbSteps = [];
			var nbCart = 0;
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
					Notifier('Erreur', 'error', 6);
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

			$scope.switchCategory = function(id) {
				$scope.isSellShown = true;
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
					if(item.article.id == product.id) {
						item.quantity++;
						isFound = true;
					}
				});

				if(!isFound) {
					$scope.cart.push({
						"article":product,
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
							var steps = getSteps(item.article,key);
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
							if(isPromotion(item.article,key) && currentStep) {
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
								"article":getProductById(key),
								"quantity":1,
								"content":[]
							};

							angular.forEach(uid, function(step, key3) {
								promoItem.content[key3-1] = step.article;
								$scope.deleteProduct(step,1);
							});

							$scope.cart.push(promoItem);
							$scope.buyer.credit -= promoItem.article.price;
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
				var backupCart = JSON.parse(JSON.stringify($scope.cart));
				var backupCredit = $scope.buyer.credit;
				var backupNbCart = nbCart;

				var index = $scope.cart.indexOf(item);
				if(nbItems == 'all') nbItems = $scope.cart[index].quantity;
				if(nbItems <= $scope.cart[index].quantity) {
					$scope.buyer.credit += item.article.price*nbItems;
					if(nbItems == $scope.cart[index].quantity) {
						if(index > -1) {
							$scope.cart.splice(index,1);
						}
					} else {
						$scope.cart[index].quantity -= nbItems;
					}
					nbCart -= nbItems;
				}

				if($scope.buyer.credit > 10000) {
					$scope.cart = JSON.parse(JSON.stringify(backupCart));
					$scope.buyer.credit = backupCredit;
					nbCart = backupNbCart;
				}
			};

			var sendBuyingCart = function(totalReloads=0) {
				if($scope.cart.length > 0) {
					var params = {
						BuyerId: User.getBuyer().id,
						SellerId: User.getUser().id,
						PointId: Device.getDevicePoint(),
						cart: $scope.cart
					}
					PostArticles.save(params, function(res_api) {
						var totalPurchases = 0;
						$scope.cart.forEach(function(article, key) {
							totalPurchases+=article.article.price*article.quantity;
						});

						if(!res_api.error) {
							User.setLastBuyerBuy((totalPurchases/100).toFixed(2));
						} else {
							Notifier('Erreur', 'error', 7, res_api.error.type.message);
						}
					});
				}

				$scope.logout();
			};

		}

		// Both sell and reload tools

		$scope.logout = function() {
			User.logoutBuyer();
			$location.path("/waiter");
		};

		$scope.sendCart = function() {
			$scope.cartSent = true;
			User.setLastBuyer($scope.buyer);
			if($scope.displaySell && !$scope.displayReload) sendBuyingCart();
			if($scope.displaySell && $scope.displayReload) sendReloadingCart();
			if(!$scope.displaySell && $scope.displayReload) sendReloadingCart();
		};

		var getObjectLength = function(object) {
			var count = 0;
			for(var i in object) {
				count++;
			}
			return count;
		};

		$scope.isActive = function(category) {
			if (category.id == currentCategory) {
				return true;
			}
			return false;
		};


	}
]);
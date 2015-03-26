'use strict';

buckutt.factory('GetAvailableArticles', function ($resource) {
	return $resource('/api/services/availableArticles');
});

buckutt.factory('GetArticlesLinks', function ($resource) {
	return $resource('/api/articleslinks');
});

buckutt.factory('PostArticles', function ($resource) {
	return $resource('/api/services/purchase');
});

buckutt.factory('PostReload', function ($resource) {
	return $resource('/api/services/reload');
});

buckutt.factory('GetReloadTypes', function ($resource) {
	return $resource('/api/reloadtypes');
});
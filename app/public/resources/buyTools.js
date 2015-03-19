'use strict';

buckutt.factory('GetAvailableArticles', function ($resource) {
	return $resource('/api/services/availableArticles');
});

buckutt.factory('GetArticlesLinks', function ($resource) {
	return $resource('/api/articlelinks');
});
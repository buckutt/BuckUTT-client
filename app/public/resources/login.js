buckutt.factory('GetLogin', function ($resource) {
	return $resource('/api/services/login');
});
'use strict';

buckutt.factory('GetId', function ($resource) {
	return $resource('/api/meanofloginsusers');
});

buckutt.factory('GetUser', function ($resource) {
	return $resource('/api/users');
});

buckutt.factory('GetRights', function ($resource) {
	return $resource('/api/usersrights');
});

buckutt.factory('GetLogin', function ($resource) {
	return $resource('/api/services/login');
});

buckutt.factory('GetGroups', function ($resource) {
	return $resource('/api/usersgroups?Period.startDate=<=:now&Period.endDate=>=:now');
});
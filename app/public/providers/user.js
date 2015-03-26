'use strict';

buckutt.provider('User', [
	function () {
		var _token = undefined;
		var _user = undefined;
		var _buyer = undefined;

		this.$get = function() {
			return {
				getUser: function () { 
					return _user;
				},
				hasRight: function(view, point) {
					return _hasRight(view, point);
				},
				setUser: function(user) {
					_setUser(user);
				},
				logout: function() {
					_logout();
				},
				logoutBuyer: function() {
					_logoutBuyer();
				},
				isBuyerLogged: function() {
					return _isBuyerLogged();
				},
				getBuyer: function () { 
					return _buyer;
				},
				setBuyer: function (buyer) { 
					_setBuyer(buyer);
				},
				getToken: function () { 
					return _token;
				},
				setToken: function (token) { 
					_setToken(token);
				}
			}
		};

		var _setUser = function(data) {
			_user = data;
		};

		var _setBuyer = function(data) {
			_buyer = data;
		};

		var _setToken = function(data) {
			_token = data;
		};

		var _logout = function() {
			_setUser(undefined);
		};

		var _logoutBuyer = function() {
			_setBuyer(undefined);
		};

		var _hasRight = function(view, point) {
			if(!_user) return false;
			switch(view) {
				case 'waiter':
					if(_checkRight('Seller', point) || _checkRight('droit_admin')) return true;
					return false;
					break;
				case 'buy':
					if(_checkRight('Seller', point) || _checkRight('Reloader', point) || _checkRight('droit_admin')) return true;
					return false;
					break;
				case 'sell':
					if(_checkRight('Seller', point) || _checkRight('droit_admin')) return true;
					return false;
					break;
				case 'reload':
					if(_checkRight('Reloader', point) || _checkRight('droit_admin')) return true;
					return false;
					break;
				default:
					return false;

			}
			return false;
		};

		var _checkRight = function(right, point) {
			if(!_user) return false;
			for(var key in _user.UsersRights) {
				var value = _user.UsersRights[key];
				if((value.name == right && !point) || (value.name == right && value.PointId == point)) return true;
			}
			return false;
		};

		var _isBuyerLogged = function() {
			if(_buyer) return true;
			return false;
		};
	}
]);
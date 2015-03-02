'use strict';

buckutt.directive('focusMe', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        scope.$apply(model.assign(scope, false));
                        element[0].focus();
                    }, 30);
                }
            });
        }
    };
});
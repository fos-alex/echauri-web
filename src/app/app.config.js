(function() {
    'use strict';

    angular
        .module('app')
        .config(configure)
        .run(["$rootScope", function($rootScope) {
            $rootScope.preferences =  {};

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                $rootScope.showSearchBar = (toState.name != 'home' ? true : false);
                $rootScope.isHomeScreen = (toState.name.indexOf('home') !== -1 ? true : false);
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.log('There was an error in the routing.');
                console.error(error);
            });

        }]);

    configure.$inject = [
        '$locationProvider',
        'RestangularProvider'
    ];

    function configure($locationProvider, RestangularProvider) {
        $locationProvider.html5Mode(true);

        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

        // No payload on DELETE method
        RestangularProvider.setRequestInterceptor(function(elem, operation) {
            if (operation === "remove") {
                return null;
            }
            return elem;
        });

        moment.locale('es');

    }



})();

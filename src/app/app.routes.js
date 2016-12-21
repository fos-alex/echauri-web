(function() {
    'use strict';

    angular
        .module('app')
        .config(routes);

    routes.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function routes($stateProvider, $urlRouterProvider) {
        // Default path for any unmatched url
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/home/home.html',
                controller: 'Home as vm'
            });

    }

})();

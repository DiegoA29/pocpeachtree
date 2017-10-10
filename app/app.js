(function(){
    'use strict';

    angular.module('moneyApp', [
        'transactionsModule',
        'commonModule',
        
        'ui.router',
        'ngTouch',
        'ui.bootstrap',
        'bcherny/formatAsCurrency',
        'ng-sweet-alert'
    ]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                controller: 'transactionsController',
                templateUrl: 'app/transactions/view.html'
            });
    }])
})();
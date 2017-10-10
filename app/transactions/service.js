(function(){
    'use strict';

    angular.module('transactionsModule').service('transactionsService', transactionsService);

    transactionsService.$inject = ['$http'];

    function transactionsService($http){
        var apiurl = 'mock/transactions.json';
        var service = {
            get: get,
            // post: post,
            // put: put
        };

        function get(){
            return $http.get(apiurl).then(function(result){
                return result.data;
            });
        }

        return service;
    }
})();
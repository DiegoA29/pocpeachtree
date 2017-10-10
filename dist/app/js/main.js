(function(){
    'use strinct';

    angular.module('commonModule', []);
})();
(function(){
    'use strict';

    angular.module('commonModule').service('utilsService', utilsService);

    utilsService.$inject = [];

    function utilsService(){
        var service = {
            formatDate: formatDate
        };

        function formatDate(date, format){
            if(!format)
                format = 'MMM DD';

            return moment(new Date(date)).format(format);
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular.module('commonModule').filter('searchFilter', searchFilter);

    searchFilter.$inject = ['utilsService'];

    function searchFilter(utilsService) {
        return function (inputArray, searchFields, searchCriteria) {
            if (!angular.isDefined(searchCriteria) || searchCriteria == '' || !angular.isDefined(searchFields) || searchFields.length === 0)
                return inputArray;

            searchCriteria = searchCriteria.toLowerCase().trim();
            var data = [];
            angular.forEach(inputArray, function (item) {
                for (var i = 0; i < searchFields.length; i++) {
                    var searchField = searchFields[i];
                    if(!searchField.dataType && item[searchField].toString().toLowerCase().trim().indexOf(searchCriteria) !== -1) {
                        data.push(item);
                        break;
                    } else if(searchField.dataType && searchField.dataType === 'Date' && utilsService.formatDate(item[searchField.name]).toLowerCase().indexOf(searchCriteria) !== -1){
                        data.push(item);
                        break;
                    }
                }
            })

            return data;
        }
    }
})();
(function(){
    'use strinct';

    angular.module('transactionsModule', [])
        .constant({
            minBalance: -500
        });
})();
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
(function () {
    'use strict';

    angular.module('transactionsModule').controller('transactionsController', transactionsController);

    transactionsController.$inject = ['$scope', '$filter', 'transactionsService', 'utilsService', 'SweetAlert', 'minBalance'];

    function transactionsController($scope, $filter, transactionsService, utilsService, SweetAlert, minBalance) {
        $scope.searchFields = ['transactionType', 'merchant', 'amount', { dataType: 'Date', name: 'transactionDate' }];
        $scope.transactions = [];
        $scope.sortDescending = true;
        $scope.newSortOrder = undefined;
        $scope.oldSortOrder = undefined;
        $scope.amount = 0;
        $scope.balance = 5824.76;
        $scope.toAccount = 'Georgia Power Electric Company';

        $scope.formatDate = function (date) {
            return utilsService.formatDate(date);
        };

        $scope.sortTransactions = function (order) {
            var newSortOrder = $scope.newSortOrder[0] === '-' ? $scope.newSortOrder.substring(1) : $scope.newSortOrder;
            var oldSortOrder = $scope.oldSortOrder && $scope.oldSortOrder[0] === '-' ? $scope.oldSortOrder.substring(1) : $scope.oldSortOrder;

            if(newSortOrder === oldSortOrder)
                $scope.sortDescending = !$scope.sortDescending;
            else
                $scope.sortDescending = true;

            order = $scope.sortDescending ? `-${order}` : order;
            $scope.transactions = $filter('orderBy')($scope.transactions, order);
            $scope.oldSortOrder = order;
        };

        $scope.$watch('amount', function () {
            if (!$scope.amount)
                $scope.amount = 0;
            else if($scope.amount == 0 || ($scope.balance - parseFloat($scope.amount)) < minBalance)
                $scope.transferForm.amount.$setValidity('number', false);
            else
                $scope.transferForm.amount.$setValidity('number', true);
        });

        $scope.getFromAccountValue = function () {
            return `Free Checking(4692) - $${$scope.balance}`;
        };

        $scope.transfer = function(){
            var amount = parseFloat($scope.amount);
            if(amount > 0 && ($scope.balance - amount) >= minBalance)
                SweetAlert.confirm("Are you sure?", {
                    title: 'Are you sure?',
                    text: `Do you want to transfer $${amount} to ${$scope.toAccount}?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#f26e2e',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }).then(function(p) { 
                    if(p){
                        $scope.transactions.splice(0, 0, {
                            amount: amount,
                            categoryCode: '#4168f4',
                            merchant: $scope.toAccount,
                            transactionDate: new Date(),
                            transactionType: 'Online Transfer',
                            merchantLogo: '/mock/georgia_power_company_icon.jpg'
                        });
                        SweetAlert.success('', { title: 'Transfer Completed!', text: 'The transfer has been successfully completed.', type: 'success'});
                        $scope.balance = ($scope.balance - amount).toFixed(2);
                        $scope.transferForm.$setPristine();
                        $scope.amount = 0;
                    }
                    else
                        SweetAlert.alert('', {title: 'Transfer Cancelled!',text: 'The transfer has been cancelled.',type: 'error'});
                }, function(p) { 
                    SweetAlert.alert('', {title: 'Unexpected Error!',text: 'Our tech-support has been notified. Try again later.',type: 'error'});
                });
        };

        $scope.clearSearch = function(){
            $scope.search = undefined;
        };

        // Load transactions list
        transactionsService.get().then(function (result) {
            angular.forEach(result.data, function(item){
                item.amount = parseFloat(item.amount);
                $scope.transactions.push(item);
            });
        });
    }
})();
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
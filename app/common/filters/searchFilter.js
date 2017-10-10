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
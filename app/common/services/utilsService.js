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
'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.run(function($rootScope, DwUrlExtraction, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('UrlExtractions'), 'app.dwUrlExtractions.list', 'fa-cog');

    DwUrlExtraction.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('UrlExtractions'), 'bg-lime', 'ion-clipboard', data.length, 'app.dwUrlExtractions.list');
    });

});

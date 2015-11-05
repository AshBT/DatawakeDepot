'use strict';
var app = angular.module('com.module.dwDomains');

app.run(function($rootScope, DwDomain, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Domains'), 'app.dwDomains.list', 'ion-ios-color-filter-outline');
    $rootScope.addMenu(gettextCatalog.getString('Domain Import'), 'app.dwDomains.import', 'ion-ios-color-filter-outline');

    DwDomain.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Domains'), 'bg-blue8', 'ion-ios-color-filter-outline', data.length, 'app.dwDomains.list');
    });

});

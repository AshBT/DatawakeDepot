'use strict';
var app = angular.module('com.module.dwDomainItems');

app.run(function($rootScope, DwDomainItem, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Domain Items'), 'app.dwDomainItems.list', 'fa-cog');

    DwDomainItem.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Domain Items'), 'bg-yellow', 'ion-clipboard', data.length, 'app.dwDomainItems.list');
    });

});

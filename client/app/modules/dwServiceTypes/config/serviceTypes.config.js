'use strict';
var app = angular.module('com.module.dwServiceTypes');

app.run(function($rootScope, DwServiceType, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('ServiceTypes'), 'app.dwServiceTypes.list', 'fa-sellsy');

    //DwServiceType.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('ServiceTypes'), 'bg-blue', 'fa-sellsy', data.length, 'app.dwServiceTypes.list');
    //});

});

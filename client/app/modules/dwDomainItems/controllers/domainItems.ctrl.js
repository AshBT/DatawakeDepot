'use strict';
var app = angular.module('com.module.dwDomainItems');

app.controller('DomainItemsCtrl', function($scope, $state, $stateParams, DwDomain, DwDomainItem, DwDomainEntityType, DomainItemsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];
    $scope.entityTypes = [];

    $scope.domainItem = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    }, {
        key: 'dwDomainId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            options: $scope.domains,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'dwDomainEntityTypeId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Domain Entity Type'),
            options: $scope.entityTypes,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    },{
        key: 'itemValue',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Value'),
            required: true
        }
    },{
        key: 'coreItem',
        type: 'checkbox',
        templateOptions: {
            label: gettextCatalog.getString('Core Item?'),
            required: false
        }
    }];

    $scope.delete = function(id) {
        DomainItemsService.deleteDomainItem(id, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainItemsService.upsertDomainItem($scope.domainItem, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwDomainItem.find({filter: {include: ['domain','domainEntityType']}}).$promise
        .then(function (allDomainItems) {
            $scope.safeDisplayeddomainItems = allDomainItems;
            $scope.displayedDomainItems = [].concat($scope.safeDisplayeddomainItems);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    DwDomain.find({filter: {include: []}}).$promise
        .then(function (allDomains) {
            for (var i = 0; i < allDomains.length; ++i) {
                $scope.domains.push({
                    value: allDomains[i].name,
                    name: allDomains[i].name + " - " + allDomains[i].description,
                    id: allDomains[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );

    DwDomainEntityType.find({filter: {include: []}}).$promise
        .then(function (allEntityTypes) {
            for (var i = 0; i < allEntityTypes.length; ++i) {
                $scope.entityTypes.push({
                    value: allEntityTypes[i].name,
                    name: allEntityTypes[i].name + " - " + allEntityTypes[i].description,
                    id: allEntityTypes[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );

    if ($stateParams.id) {
        $scope.loading = true;
        DwDomainItem.findOne({
            filter: {
                where: {
                    id: $stateParams.id
                },
                include: ['domain','domainEntityType']
            }
        }).$promise
            .then(function (domain) {
                $scope.domainItem = domain;
            });
        $scope.loading = false;
    } else {
        $scope.domainItem = {};
    }

});


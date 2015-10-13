'use strict';
var app = angular.module('com.module.dwDomainItems');

app.service('DomainItemsService', ['$state', 'CoreService', 'DwDomainItem', 'gettextCatalog', function($state, CoreService, DwDomainItem, gettextCatalog) {

  this.getDomainItems = function() {
    return DwDomainItem.find();
  };

  this.getDomainItem = function(id) {
    return DwDomainItem.findById({
      id: id
    });
  };

  this.upsertDomainItem = function(domainItem, cb) {
    DwDomainItem.upsert(domainItem, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
          'DomainItem saved'), gettextCatalog.getString(
          'Your domainItem is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving domainItem '), gettextCatalog.getString(
              'This domainItem could no be saved: ') + err);
    });
  };

  this.deleteDomainItem = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwDomainItem.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'DomainItem deleted'), gettextCatalog.getString(
                'Your domainItem is deleted!'));
            cb();
          }, function(err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error deleting domainItem'), gettextCatalog.getString(
                    'Your domainItem is not deleted! ') + err);
          });
        },
        function() {
          return false;
        });
  };

}]);

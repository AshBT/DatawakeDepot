'use strict';
var app = angular.module('com.module.dwTeams');

app.controller('TeamsCtrl', function($scope, $state, $stateParams, AminoUser, DwDomain, DwTeam, TeamsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.users = [];
  $scope.domains = [];

  $scope.formFields = [{
      key: 'id',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('id'),
          disabled: true
      }
  },{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Description'),
      required: false
    }
  }, {
    key: 'teamDomains',
    type: 'multiCheckbox',
    templateOptions: {
      label: 'Domains',
      options: $scope.domains,
      disabled: !$scope.currentUser.isAdmin
    }
  }, {
      key: 'users',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Users',
          options: $scope.users,
          valueProp: 'id',
          labelProp: 'name',
          disabled: !$scope.currentUser.isAdmin
      }
  }];

  $scope.delete = function(team) {
    TeamsService.deleteTeam(team, function() {
      $scope.safeDisplayedTeams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TeamsService.upsertTeam($scope.team, function() {
      $scope.safeDisplayedTeams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  if($scope.currentUser.isAdmin){
      DwTeam.find({filter: {include: ['trails','domains','users']}}).$promise
          .then(function (allTeams) {
            $scope.safeDisplayedTeams = allTeams;
            $scope.displayedTeams = [].concat($scope.safeDisplayedTeams);
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            $scope.loading = false;
          }
      );
  }else{
      $scope.safeDisplayedTeams = $scope.currentUser.teams;
      $scope.displayedTeams = [].concat($scope.safeDisplayedTeams);
  }
  $scope.loading = false;

  AminoUser.find({filter: {include: []}}).$promise
      .then(function (allUsers) {
          for (var i = 0; i < allUsers.length; ++i) {
              $scope.users.push({
                  value: allUsers[i].username,
                  name: allUsers[i].username,
                  id: allUsers[i].id
              });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  DwDomain.find({filter: {include: []}}).$promise
      .then(function (allDomains) {
          for (var i = 0; i < allDomains.length; ++i) {
              $scope.domains.push({
                  value: allDomains[i].name,
                  name: allDomains[i].name,
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

  if ($stateParams.id) {
      $scope.loading = true;
      DwTeam.findOne({
          filter: {
              where: {
                  id: $stateParams.id
              },
              fields:{},
              include: [
                  'users',
                  'trails',
                  {relation:'domains',
                      scope:{
                          fields:[
                              "name",
                              "description",
                              "id"
                          ]
                      }
                  }
              ]
          }
      }).$promise
          .then(function (domain) {
              $scope.team = domain;
          });
      $scope.loading = false;
  } else {
      $scope.team = {};
  }

});


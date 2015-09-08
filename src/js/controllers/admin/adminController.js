
angular.module('admin')
.controller('AdminController', ['$scope', '$state', '$modal', 'Auth', 'Alert', 'Address', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'Logger',
    function ($scope, $state, $modal, Auth, Alert, Address, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, Logger) {
        if($state.is('admin')){
            $state.go('admin.practice')
        }
        $scope.tabsData = [{
            heading: 'Practice',
            route: 'admin.practice',
            class: 'dlicons-office',
            active: false
        },
        {
            heading: 'Users',
            route: 'admin.users',
            class: 'dlicons-group',
            active: false
        },
        {
            heading: 'Invite New Practice',
            route: 'admin.invite',
            class: 'dlicons-user-add',
            active: false
        },
        {
            heading: 'Subscription',
            route: 'admin.subscription',
            class: 'dlicons-user',
            active: false
        }];

        $scope.alerts = [];
        
        var currentYear = moment().year();
        $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        var auth = $scope.auth = Auth.get();

        $scope.active = function(route){
            return $state.is(route);
        };
     
        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabsData.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });

        $scope.onChangeTab = function(data){
            $scope.tabsData.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        };
        
    }]);
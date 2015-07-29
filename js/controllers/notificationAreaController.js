dentalLinks.controller('NotificationAreaController', ['$scope', 'Notification',
    function ($scope,  Notification) {
        $scope.notification = Notification.get();

        $scope.close = function(){
            Notification.close();
        }
    }]);

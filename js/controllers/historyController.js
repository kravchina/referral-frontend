var historyModule = angular.module('history', ['ui.bootstrap']);

historyModule.controller('HistoryController', ['$scope', 'Auth', 'Referral', function ($scope, Auth, Referral) {
    $scope.referrals = Referral.findByPractice({id: Auth.get().practice_id});
}]);

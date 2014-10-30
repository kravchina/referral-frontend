var historyModule = angular.module('history', ['ui.bootstrap']);

historyModule.controller('HistoryController', ['$scope', 'Auth', 'Referral', function ($scope, Auth, Referral) {

	$scope.limitTo = 20;

    $scope.findReferralsByDateRange = function (start, end) {
    	$scope.start_date = start;
    	$scope.end_date = end;

        Referral.findByPractice({id: Auth.get().practice_id, start_date: start.toISOString(), end_date: end.toISOString(), term: $scope.query, limit: $scope.limitTo}, 
			function(data){
				console.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
            });
    };

    $scope.findReferralsByTerm = function () {
    	console.log($scope.query);
        Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query, limit: $scope.limitTo}, 
			function(data){
				console.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
			});
    };

    $scope.findReferralsByDateRange( moment().subtract('days', 29), moment());
}]);

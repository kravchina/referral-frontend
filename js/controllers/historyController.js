var historyModule = angular.module('history', ['ui.bootstrap']);

historyModule.controller('HistoryController', ['$scope', 'Auth', 'Referral', 'Logger', function ($scope, Auth, Referral, Logger) {

	$scope.limitTo = 20;

    $scope.findReferralsByDateRange = function (start, end) {
    	$scope.start_date = start;
    	$scope.end_date = end;

        Referral.findByPractice({id: Auth.get().practice_id, start_date: start.toISOString(), end_date: end.toISOString(), term: $scope.query, limit: $scope.limitTo}, 
			function(data){
				Logger.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
            });
    };

    $scope.findReferralsByTerm = function () {
    	Logger.log($scope.query);
        Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query, limit: $scope.limitTo}, 
			function(data){
				Logger.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
			});
    };

    $scope.findReferralsByDateRange(moment(0), moment().endOf('day'));
}]);

angular.module('history')
    .controller('HistoryController', ['$scope', 'Auth', 'Referral', 'Logger', function ($scope, Auth, Referral, Logger) {
	$scope.limitTo = 20;
    $scope.referrals = [];

    $scope.findReferralsByDateRange = function (start, end) {
    	$scope.start_date = start;
    	$scope.end_date = end;
        $scope.busy = true;
        Referral.findByPractice({id: Auth.get().practice_id, start_date: start.toISOString(), end_date: end.toISOString(), term: $scope.query, status: $scope.statusFilter, limit: $scope.limitTo},
			function(data){
				Logger.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
                $scope.busy = false;
            });
    };

    $scope.findReferralsByTerm = function () {
    	Logger.log($scope.query);
        $scope.busy = true;
        Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query, status: $scope.statusFilter, limit: $scope.limitTo},
			function(data){
				Logger.log(data);
				$scope.referrals = data.referrals;
				$scope.referrals_total_count = data.referrals_total_count;
                $scope.busy = false;
			});
    };

    $scope.findReferralsByStatus = function(){
        $scope.busy = true;
        Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query, status: $scope.statusFilter, limit: $scope.limitTo},
            function(data){
                Logger.log(data);
                $scope.referrals = data.referrals;
                $scope.referrals_total_count = data.referrals_total_count;
                $scope.busy = false;
            });
    };

    $scope.addMoreItems = function(){
        $scope.busy = true;
        var offset = $scope.referrals.length;
        Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query, status: $scope.statusFilter, limit: $scope.limitTo, offset: offset},
            function(data){
                for(var i=0; i < data.referrals.length; i++){
                    $scope.referrals.push(data.referrals[i]);
                }
                $scope.referrals_total_count = data.referrals_total_count;
                $scope.busy = false;
        });
    };

    $scope.findReferralsByDateRange(moment(0), moment().endOf('day'));
}]);
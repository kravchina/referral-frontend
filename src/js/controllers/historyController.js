angular.module('history')
    .controller('HistoryController', ['$scope', '$state', '$location','Auth', 'Referral', 'Logger', 'Practice',
    function ($scope, $state, $location, Auth, Referral, Logger, Practice) {
    var searchObject = $location.search();
	$scope.limitTo = 20;
    $scope.referrals = [];
    $scope.query = searchObject.query ? searchObject.query : null;
    $scope.statusFilter = searchObject.status ? searchObject.status : null;
    $scope.start_date = searchObject.start ? new Date(searchObject.start) : null;
    $scope.end_date = searchObject.end ? new Date(searchObject.end) : null;

    $scope.findReferralsByDateRange = function (start, end) {
        $location.search('start', start.toISOString());
        $location.search('end', end.toISOString());
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
        $location.search('query', $scope.query);
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
        $location.search('status', $scope.statusFilter);
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

    $scope.newRefferal = function(){
        Practice.checkContainsDoctor({practiceId: Auth.get().practice_id}, {}, function(success){
            if(success.result){
                $state.go('createReferral');
            } else {
                $state.go('error_page', {error_key: 'practice.doctor.not.found'});
            }
        });
    };

    if($scope.start_date && $scope.end_date) {
        $scope.findReferralsByDateRange($scope.start_date, $scope.end_date);
    } else {
        $scope.findReferralsByDateRange(moment(0), moment().endOf('day'));
    }
}]);

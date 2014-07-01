var historyModule = angular.module('history', ['ui.bootstrap']);

historyModule.controller('HistoryController', ['$scope', '$state', 'Auth', 'Referral', function ($scope, $state, Auth, Referral) {

	$scope.limitTo = 20;

    $scope.findReferralsByDateRange = function (start, end) {
    	$scope.start_date = start
    	$scope.end_date = end

         $scope.referrals = Referral.findByPractice({id: Auth.get().practice_id, start_date: start.toISOString(), end_date: end.toISOString(), term: $scope.query}, 
        					function(success){
        						console.log(success);
        						if (success.length > $scope.limitTo){
						        	$scope.referrals_show = $scope.limitTo
        						}
						       	else{
						       		$scope.referrals_show = success.length
						       	}
						        
        					});
        

    };

    $scope.findReferralsByTerm = function () {
    	console.log($scope.query)
         $scope.referrals = Referral.findByPractice({id: Auth.get().practice_id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), term: $scope.query}, 
        					function(success){
        						console.log(success.length);
        						if (success.length > $scope.limitTo){
						        	$scope.referrals_show = $scope.limitTo
        						}
						       	else{
						       		$scope.referrals_show = success.length
						       	}
        					});
        

    };

    $scope.findReferralsByDateRange( moment().subtract('days', 29), moment());
    console.log($scope.referrals);
    console.log($scope.referrals.length)

}]);

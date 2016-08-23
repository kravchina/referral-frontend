angular.module('history')
    .controller('HistoryController', ['$scope', '$state', '$location','Auth', 'Referral', 'Logger', 'Practice',
    function ($scope, $state, $location, Auth, Referral, Logger, Practice) {
    var params = $state.params,
        suppressParamsHandling = false;
    $scope.limitTo = 20;
    $scope.referrals = [];

    $scope.$watchCollection(function(){
        return $state.params;
    }, function(){
        if(!suppressParamsHandling){
            fillQueryFromParams();
            queryReferrals();
        }
        suppressParamsHandling = false;
    });

    function fillQueryFromParams(){
        $scope.query = params.query ? params.query : null;
        $scope.statusFilter = params.status ? params.status : null;
        $scope.start_date = params.start ? new Date(params.start) : moment(0);
        $scope.end_date = params.end ? new Date(params.end) : moment().endOf('day');
    };

    function queryReferrals(){
        $scope.busy = true;
        Referral.findByPractice({
                id: Auth.get().practice_id,
                start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(),
                term: $scope.query, status: $scope.statusFilter, limit: $scope.limitTo
            }, function(data){
                Logger.log(data);
                $scope.referrals = data.referrals;
                $scope.referrals_total_count = data.referrals_total_count;
                $scope.busy = false;
            });
    };

    $scope.findReferralsByDateRange = function (start, end) {
        suppressParamsHandling = true;
        $state.go('.', {start: start.toISOString(),end: end.toISOString() }, {notify: false});
    	$scope.start_date = start;
    	$scope.end_date = end;
        queryReferrals();
    };

    $scope.findReferralsByTerm = function () {
        suppressParamsHandling = true;
        $state.go('.', {query: $scope.query }, {notify: false});
    	Logger.log($scope.query);
        queryReferrals();
    };

    $scope.findReferralsByStatus = function(){
        suppressParamsHandling = true;
        $state.go('.', {status: $scope.statusFilter }, {notify: false});
        queryReferrals();
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

    fillQueryFromParams();
    queryReferrals();
}]);

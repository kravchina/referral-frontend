angular.module('error')
    .controller('ErrorController', ['$scope', '$stateParams', 'localize', function($scope, $stateParams, localize){
	$scope.error = {};
	if(localize.resourceFileLoaded){
        setupErrorMessage();
    }else{
        $scope.$on('localizeResourcesUpdated', function(){
            setupErrorMessage();
        });
    }

    function setupErrorMessage () {
        if ($stateParams.error_key === '') {
            $scope.error.header = 'default.error.header';
            $scope.error.key = 'default.error';
        } else {
            $scope.error.header = $stateParams.error_key + '.header';
            $scope.error.key = $stateParams.error_key;
        }
    }
}]);
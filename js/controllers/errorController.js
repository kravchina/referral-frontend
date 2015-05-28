var errorModule = angular.module('error', []);

errorModule.controller('ErrorController', ['$scope', '$stateParams', function($scope, $stateParams){
	$scope.error = {};

	if ($stateParams.error_key == '') {
		$scope.error.header = 'default.error.header';
		$scope.error.key = 'default.error';
	} else {
		$scope.error.header = $stateParams.error_key + '.header';
		$scope.error.key = $stateParams.error_key;
	}

}]);
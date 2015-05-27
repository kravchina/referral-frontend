var errorModule = angular.module('error', []);

errorModule.controller('ErrorController', ['$scope', '$stateParams', '$sce', function($scope, $stateParams, $sce){
	$scope.error = {};

	if ($stateParams.error_key == '') {
		$scope.error.key = 'default.error';
	} else {
		$scope.error.key = $stateParams.error_key;
	}

}]);
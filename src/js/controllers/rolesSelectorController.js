angular.module('dentalLinks')
    .controller('RolesSelectorController', ['$scope', '$element', '$attrs', 'USER_ROLES', 'Role',
    function ($scope, $element, $attrs, USER_ROLES, Role) {
        $scope.colSize = $attrs['colSize'] ? $attrs['colSize'] : 2;
        $scope.showRoles = $scope.showRoles ? $scope.showRoles : [USER_ROLES.doctor, USER_ROLES.aux, USER_ROLES.admin];

        filterByShow();

        $scope.selected = {radio: {}, checkbox: {}};

        $scope.onChangeRole = function(){
            $scope.inputMask = 0;
            $scope.checkboxes.forEach(function(item){
                if($scope.selected.checkbox[item.id]){
                    $scope.inputMask += item.mask;
                }
            });
            $scope.inputMask += $scope.selected.radio.mask;

            if(typeof $scope.onChange !== "undefined") {
                $scope.onChange($scope.inputMask);
            }
        };

        function choiceButtons (){
            if($scope.inputMask) {
                var data = Role.getFromMask($scope.inputMask);
            } else {
                var data = $scope.defaultRoles;
            }
            $scope.selected.radio = $scope.radios.filter(function(item){
                return Role.hasRoles([item], data);
            })[0];

            $scope.checkboxes.forEach(function(item){
                $scope.selected.checkbox[item.id] = Role.hasRoles([item], data);
            });
        };

        function filterByShow(){
            $scope.radios = [USER_ROLES.doctor, USER_ROLES.aux].filter(function(item){
                return $scope.showRoles.indexOf(item) != -1;
            });
            $scope.checkboxes = [USER_ROLES.admin, USER_ROLES.super].filter(function(item){
                return $scope.showRoles.indexOf(item) != -1;
            });
        };

        $scope.$watch('showRoles', function(newValue, oldValue){
            if(oldValue !== newValue){
                $scope.inputMask = 0;
            }
            filterByShow();
            choiceButtons();
            $scope.onChangeRole();
        });

}]);

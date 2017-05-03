angular.module('dentalLinks')
    .controller('UserAddressesController', ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {

        $scope.practiceAddressesCopy = angular.copy($scope.practiceAddresses).map(function(pAddress){
            if(typeof $scope.user.addresses === 'undefined') {
                return pAddress;
            }
            $scope.user.addresses.forEach(function(uAddress){
                if(uAddress.id === pAddress.id) {
                    pAddress.checked = true;
                }
            });
            return pAddress;
        });

        function arrayObjectIndexOf(inputArray, searchTerm, property) {
            for(var i = 0, len = inputArray.length; i < len; i++) {
                if (inputArray[i][property] === searchTerm) {
                    return i;
                }
            }
            return -1;
        }

        $scope.toggleAddresses = function(selectedItem){
            var index = arrayObjectIndexOf($scope.user.addresses, selectedItem.id, 'id');

            if(index !== -1){
                if($scope.user.addresses.length > 1) {
                    $scope.user.addresses.splice(index, 1);
                    selectedItem.checked = false;
                } else {
                    selectedItem.checked = !selectedItem.checked;
                }
            } else {
                selectedItem.checked = true;
                $scope.user.addresses.push(selectedItem);
            }

            $scope.user.user_addresses_attributes = $scope.practiceAddressesCopy.map(function(item){
                var selectAddressIndex = arrayObjectIndexOf($scope.user.addresses, item.id, 'id');

                if(selectAddressIndex === -1) {
                    var userAddressesIndex  = arrayObjectIndexOf($scope.user.user_addresses, item.id, 'address_id');
                    if(userAddressesIndex !== -1) {
                        return {id: $scope.user.user_addresses[userAddressesIndex].id, _destroy: true};
                    } else {
                        return {};
                    }
                }
                return {user_id: $scope.user.id, address_id: item.id};
            });
        };

}]);

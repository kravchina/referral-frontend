angular.module('modals')
.controller('PatientModalController', [ '$scope', '$uibModalInstance', 'Auth', 'ModalHandler', 'Patient', 'fullname', '$uibModal', 'Alert',
        function ($scope, $uibModalInstance, Auth, ModalHandler, Patient, fullname, $uibModal, Alert) {

    $scope.title = 'Create a New Patient Record';
    $scope.alerts = [];
    $scope.datepickerStatus = {opened: false};

    if (fullname) {
        var spacePosition = fullname.lastIndexOf(' '); //lastIndexOf is needed for names with several words, like Jean Francois Moullin, where Jean Francois is a name and Moullin is a surname
        var first_name = '';
        var last_name = '';
        if (fullname != '' && spacePosition == -1) {
            first_name = fullname;
        } else {
            first_name = fullname.substr(0, spacePosition);
            last_name = fullname.substr(spacePosition + 1);
        }
        $scope.patient = {'first_name': first_name, 'last_name': last_name};
    }

    $scope.ok = function (patient) {
        patient.practice_id = Auth.get() ? Auth.get().practice_id : '';
        patient.birthday = moment(patient.birthday).format('YYYY-MM-DD');//fix for #114475519
        function createPatient(){
            Patient.save({patient: patient},
                function (success) {
                    ModalHandler.close($uibModalInstance, success);
                },
                function (failure) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'Error occurred during patient create.', true)
                });
        };

        if(patient.practice_id) {
            Patient.searchPatientDuplicate(patient, function (success) {
                if (success.patient) {
                    var dedupingModalInstance = $uibModal.open({
                        templateUrl: 'partials/patient_deduping_form.html',
                        controller: 'DedupingPatientModalController',
                        resolve: {
                            isCreatingPatient: function(){
                                return true;
                            }
                        }
                    });

                    dedupingModalInstance.result.then(function (useExistingPatient) {
                        if (useExistingPatient) {
                            ModalHandler.close($uibModalInstance, success.patient);
                        } else {
                            createPatient();
                        }
                    });
                } else {
                    createPatient();
                }

            });
        } else {
            ModalHandler.close($uibModalInstance, patient);
        }

    };
    $scope.openDatePicker = function($event){
        $scope.datepickerStatus.opened = true;
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);

    };
}])

.controller('DedupingPatientModalController', ['$scope', '$uibModalInstance', 'isCreatingPatient', function($scope, $uibModalInstance, isCreatingPatient){
        $scope.useExistingPatient = true;
        $scope.isCreatingPatient = isCreatingPatient;

        $scope.ok = function () {
            $uibModalInstance.close($scope.useExistingPatient);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])

.controller('EditPatientModalController', [ '$scope', '$state', '$uibModalInstance', 'Auth', 'Alert', 'ModalHandler', 'Patient', 'patientForEdit', '$uibModal',
        function ($scope, $state, $uibModalInstance, Auth, Alert, ModalHandler, Patient, patientForEdit, $uibModal) {
    $scope.title = 'Edit Patient Record';
    $scope.datepickerStatus = {opened: false};
    $scope.alerts = [];
    $scope.patient = {first_name: patientForEdit.first_name, last_name: patientForEdit.last_name, birthday: moment(patientForEdit.birthday).toDate(), email: patientForEdit.email, phone: patientForEdit.phone};//we need a copy of the object to be able to cancel changes (otherwise two-way binding changes the patient's data on parent page right away)
    $scope.ok = function (patient) {
        patient.birthday = moment(patient.birthday).format('YYYY-MM-DD');//fix for #114475519
        function updatePatient () {
            Patient.update({id: patientForEdit.id}, {patient: patient},
                function (success) {
                    ModalHandler.close($uibModalInstance, success);
                },
                function (failure) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'Error occurred during patient update.', true);
                });
        };

        patient.id = patientForEdit.id;
        patient.practice_id = patientForEdit.practice_id;

        if($state.is('createReferral')) {
            Patient.searchPatientDuplicate(patient, function (success) {
                if (success.patient) {
                    var dedupingModalInstance = $uibModal.open({
                        templateUrl: 'partials/patient_deduping_form.html',
                        controller: 'DedupingPatientModalController',
                        resolve: {
                            isCreatingPatient: function () {
                                return false;
                            }
                        }
                    });

                    dedupingModalInstance.result.then(function (useExistingPatient) {
                        if (useExistingPatient) {
                            ModalHandler.close($uibModalInstance, success.patient);
                        } else {
                            updatePatient();
                        }
                    });
                } else {
                    updatePatient();
                }

            });
        } else {
            updatePatient();
        }

    };

    $scope.openDatePicker = function ($event) {
        $scope.datepickerStatus.opened = true;
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('ChangeDestProviderModalController', [ '$scope', '$uibModalInstance', 'Auth','Alert', 'ModalHandler', 'Referral', 'referral', 'User', function ($scope, $uibModalInstance, Auth, Alert, ModalHandler, Referral, referral, User) {
    $scope.providerId = referral.dest_provider_id;
    $scope.referral = angular.copy(referral);

    $scope.referral.dest_practice.users.unshift({id: -1, first_name: 'First', last_name: 'Available', firstAvailable: true, addresses: $scope.referral.dest_practice.addresses});

    $scope.filterByAddress = function(addressId){
        return function(item){
            for(var i = 0; i < item.addresses.length; i++) {
                if(item.addresses[i].id === addressId) {
                    return true;
                }
            }
            return false;
        };
    };
    $scope.ok = function (providerId) {
        $scope.referral.dest_practice.users.shift();
        referral = $scope.referral;
        Referral.update({id: referral.id}, {referral: {dest_provider_id: providerId, address_id: $scope.referral.address_id}},
            function (success) {
                ModalHandler.close($uibModalInstance, providerId);
            },
            function (failure) {
                Alert.error($scope.alerts, 'Error occurred during referral update.');
            });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('NoteModalController', ['$scope', '$uibModalInstance', 'ModalHandler', function ($scope, $uibModalInstance, ModalHandler) {
    $scope.ok = function (note) {
        //nothing to do, we cant save note right here because at this stage referral doesn't exist. We can only add new note to the list on the parent page (create referral) and save simultaneously with referral.
        if (note == undefined || note.match(/^\s*$/)){
            ModalHandler.dismiss($uibModalInstance);
        }else{
            ModalHandler.close($uibModalInstance,note);
        }
        
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };

}])

.controller('EditNoteModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'noteData', function ($scope, $uibModalInstance, ModalHandler, noteData) {
    $scope.note = angular.copy(noteData);

    $scope.ok = function (note) {
        if (note == undefined || note.message.match(/^\s*$/)){
            ModalHandler.dismiss($uibModalInstance);
        }else{
            ModalHandler.close($uibModalInstance, $scope.note);
        }
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };

}])
.controller('NoteVersionsModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'versions', function ($scope, $uibModalInstance, ModalHandler, versions) {
    $scope.versions = versions;
    $scope.ok = function () {
        ModalHandler.close($uibModalInstance);
    };

}])

.controller('ProviderModalController',
    ['$scope', '$uibModalInstance', 'ModalHandler', 'ProviderInvitation', 'Alert', 'Spinner', 'sendEmailNotification', 'inviterId',
        function ($scope, $uibModalInstance, ModalHandler, ProviderInvitation, Alert, Spinner, sendEmailNotification, inviterId) {
    $scope.alerts = [];
    $scope.model = {};
    $scope.isProviderInvite = true;

    $scope.$watch( //we need only one-way updates from typeahead, otherwise typeahead works incorrectly
        function () {
            return $scope.model.existingProvider;
        }, function (newVal, oldVal, scope) {
            if (newVal) {
                $scope.model.provider = {id: newVal.id, first_name: newVal.first_name, email: newVal.email, last_name: newVal.last_name};
            }
        });
    $scope.ok = function (provider) {
        provider.inviter_id = inviterId;
        var resultHandlers = {
            success: function (success) {
                ModalHandler.close($uibModalInstance, success);
            },
            failure: function (failure) {
                $scope.alerts = [];
                Alert.error($scope.alerts, failure.data.message[0], true);
            }
        };

        ProviderInvitation.saveProvider({provider_invitation: provider, send_email: sendEmailNotification, front_desk: !$scope.isProviderInvite}, resultHandlers.success, resultHandlers.failure);
    };
    $scope.closeAlert = function (index) {
        Alert.close($scope.alerts, index);
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('PracticeModalController', ['$scope', '$uibModalInstance', 'ModalHandler','Alert', 'Practice', 'Procedure', function ($scope, $uibModalInstance, ModalHandler, Alert, Practice, Procedure) {
    $scope.alerts = [];
    $scope.practice = {addresses_attributes: [{}]};
    $scope.practiceTypes = Procedure.practiceTypes();
    $scope.addAddress = function(){
        $scope.practice.addresses_attributes.push({});
    };
    $scope.removeAddress = function(address){
        $scope.practice.addresses_attributes.splice($scope.practice.addresses_attributes.indexOf(address), 1);
    };
    $scope.ok = function (practice) {
        ModalHandler.close($uibModalInstance, practice);
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('PracticeDeleteModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'Alert', 'Practice', 'User', 'Referral', 'selectedPractice', 'Notification',
    function($scope, $uibModalInstance, ModalHandler, Alert, Practice, User, Referral, selectedPractice, Notification){
        $scope.practice = angular.copy(selectedPractice);
        $scope.delete_type = 'delete_practice';
        $scope.dest_practice = {};
        $scope.dest_user = '';

        Referral.countByPractice({id: $scope.practice.id}, function(success){
             $scope.referrals_count = success.count;
        });

        $scope.findPractice = function(searchValue){
            $scope.dest_practice = {};
            return Practice.publicSearchPractice({search: searchValue}).$promise;
        };

        $scope.onPracticeSelected = function(destPractice){
            $scope.dest_practice = destPractice;
            User.getAllUsers({practice_id: destPractice.id}, function(users){
                $scope.dest_practice.users = [];
                $scope.dest_practice.users.push({first_name: 'First', last_name: 'Available', id: -1});
                $scope.dest_practice.users = $scope.dest_practice.users.concat(users);
            });
        };

        $scope.deletePractice = function(){
            var error = {};
            if($scope.delete_type == 'delete_practice') {
                Practice.delete({practiceId: $scope.practice.id}, function(success){
                    Notification.success('Practice delete success');
                }, function(failure){
                    error = failure;
                });
            } else if ($scope.delete_type == 'move_referrals') {
                Practice.deleteAndMoveReferral({id: $scope.practice.id, dest_practice_id: $scope.dest_practice.id, dest_user_id: $scope.dest_user.id}, function(success){
                    Notification.success('Practice delete success');
                }, function(failure){
                    error = failure;
                });
            }

            ModalHandler.close($uibModalInstance, error);
        };
        $scope.cancel = function () {
            ModalHandler.dismiss($uibModalInstance);
        };
    }])

.controller('UserModalController',
    ['$scope', '$uibModalInstance', 'ModalHandler', 'ProviderInvitation', 'Registration', 'Auth', 'Alert', 'Logger', 'USER_ROLES', 'Role', 'practice', 'practiceTypes',
    function ($scope, $uibModalInstance, ModalHandler, ProviderInvitation, Registration, Auth, Alert, Logger, USER_ROLES, Role, practice, practiceTypes) {
    $scope.practice = angular.copy(practice);
    $scope.practiceTypes = practiceTypes.filter(function(type){
        return type.code != 'multi_specialty';
    });
    $scope.result = {};
    $scope.alerts = [];
    $scope.isInvite = true;
    $scope.isAux = false;
    $scope.user = {};
    $scope.user.roles_mask = 0;
    $scope.user.specialty_type_id = $scope.practice.practice_type.code != 'multi_specialty' ? $scope.practice.practice_type_id : '';
    $scope.defaultRoles = [USER_ROLES.aux];
    $scope.showRoles = [USER_ROLES.aux, USER_ROLES.doctor, USER_ROLES.admin];

    $scope.toggleRadio = function(user){
        if(!$scope.isInvite) {
            $scope.defaultRoles = [USER_ROLES.doctor];
            $scope.showRoles = [USER_ROLES.doctor];
        }else {
            $scope.defaultRoles = [USER_ROLES.aux];
            $scope.showRoles = [USER_ROLES.doctor, USER_ROLES.aux, USER_ROLES.admin];
        }
    };

    $scope.onRoleChange = function(resultMask) {
        $scope.isAux = Role.hasRoles([USER_ROLES.aux], Role.getFromMask(resultMask));
    };

    $scope.ok = function (user) {
        user.practice_id = ($scope.params && $scope.params.practiceId) || Auth.getOrRedirect().practice_id;
        user.inviter_id = Auth.getOrRedirect().id;

        if($scope.isAux) {
            user.specialty_type_id = '';
        }

        if($scope.isInvite){
            ProviderInvitation.saveUser({provider_invitation: user},
                function (success) {
                    ModalHandler.close($uibModalInstance, success);
                }, function (failure) {
                    Logger.log(failure);
                    $scope.alerts = [];//reset alerts list because we need only one alert at a time
                    Alert.error($scope.alerts, failure.data.message[0], true);
                    Logger.log($scope.alerts);
                });
        } else {
            Registration.create_no_login_user({user: user},
                function(success){
                    ModalHandler.close($uibModalInstance, success);
                },function(failure){
                    Logger.log(failure);
                    $scope.alerts = [];//reset alerts list because we need only one alert at a time
                    Alert.error($scope.alerts, failure.data.message[0], true);
                    Logger.log($scope.alerts);
                });
        }
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('UpgradeModalController', ['$scope', '$uibModalInstance','$window', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', 'Practice', 'Logger', 'ServerSettings', 'practice_id', 'stripe_subscription_id', 'interval', 'Spinner', 'stripe', function ($scope, $uibModalInstance, $window, ModalHandler, ProviderInvitation, Auth, Alert, Practice, Logger, ServerSettings, practice_id, stripe_subscription_id, interval, Spinner, stripe) {
    $scope.result = {};
    $scope.alerts = [];
    var currentYear = moment().year();
    $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5 ];

    $scope.stripe_subscription_id = stripe_subscription_id;
    Logger.log($scope.stripe_subscription_id);
    var handleError = function(failure){
        Alert.error($scope.alerts, 'Error: can\'t access to payment system. Please try again later.', true);
        $scope.disableForm = true;
    };
    ServerSettings.getStripeApiPublicKey(function(success){
        if(success.key){
            //key could be null if it was not set in server's environment variables
             stripe.setPublishableKey(success.key);
           // $window.Stripe.setPublishableKey(success.key);
        }else{
            handleError();
        }
    }, handleError);

    $scope.ok = function (payment_info) {
        Spinner.show();
        return stripe.card.createToken({
            number: payment_info.card_number,
            cvc: payment_info.card_cvc,
            exp_month: payment_info.card_exp_month,
            exp_year: payment_info.card_exp_year
        })
            .then(function (token) {
                console.log('token created for card ending in ', token.card.last4);
                Logger.log(payment_info);
                return Practice.subscribe({practiceId: practice_id}, {
                        practice: {
                            name_on_card: payment_info.name_on_card,
                            stripe_token: token.id,
                            subscription_interval: interval
                        }
                    },
                    function (success) {
                        Logger.log(success);
                        Alert.success($scope.alerts, 'Thank you for upgrading to a Premium Account. Your automatic renewal date  is ' + moment(success.subscription_active_until).format('MM-DD-YY'), true);
                        ModalHandler.close($uibModalInstance, success);
                    },
                    function (failure) {
                        $scope.alerts = [];
                        Alert.error($scope.alerts, 'An error occurred during account update: ' + failure.data.error, true)
                    });

            })
            .then(function (payment) {
                Spinner.hide();
                console.log('successfully submitted payment for $', payment.amount);
            })
            .catch(function (err) {
                if (err.type && /^Stripe/.test(err.type)) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'An error occurred during account update: ' + err.message, true);
                    Spinner.hide();
                }
                else {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'An error occurred during account update: ' + err.message, true)
                }
            });


    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('DowngradeModalController', [ '$scope', '$uibModalInstance', 'ModalHandler', function($scope, $uibModalInstance, ModalHandler){
    $scope.ok = function () {
        ModalHandler.close($uibModalInstance);
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('EditUserModalController',
    ['$scope', 'showNameControls', 'showRoleSelector', '$uibModalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'Logger', 'editUser', 'practiceUsers', 'practiceType', 'practiceAddresses', 'Registration', 'ProviderInvitation', 'Notification', 'USER_ROLES', 'Role', 'Procedure', '$uibModal',
        function ($scope, showNameControls, showRoleSelector, $uibModalInstance, ModalHandler, User, Auth, Alert, Logger, editUser, practiceUsers, practiceType, practiceAddresses, Registration, ProviderInvitation, Notification, USER_ROLES, Role, Procedure, $uibModal) {
            $scope.result = {};
            $scope.alerts = [];
            Logger.log(editUser.id);
            $scope.showNameControls = showNameControls;
            $scope.showRoleSelector = showRoleSelector;
            $scope.practiceTypes = [];
            $scope.showRoles = [USER_ROLES.super, USER_ROLES.aux, USER_ROLES.doctor, USER_ROLES.admin];
            Procedure.practiceTypes({'include_procedures': false}, function(success){
                success.map(function(item){
                    if(item.code !== 'multi_specialty'){
                        $scope.practiceTypes.push(item);
                    }
                });
            });
            $scope.user = editUser;//for now we need only is_admin property to be set
            $scope.practiceAddresses = practiceAddresses;
            $scope.user.is_admin = Role.hasRoles([USER_ROLES.admin], Role.getFromMask($scope.user.roles_mask));
            var initialEmail = editUser.email;

            $scope.auth = Auth.get();
            $scope.listInputUsers = practiceUsers.map(function (inputUser) {
                inputUser = angular.copy(inputUser);
                editUser.email_bindings.forEach(function (checkedUser) {
                    if (inputUser.id == checkedUser.id) {
                        inputUser.ticked = true;
                    }
                });
                return inputUser;
            });
            $scope.listOutputUsers = [];

            $scope.checkEmail = function (email) {
                // this checks for the same email address among existing invitations in the database
                ProviderInvitation.validate({email: email}, function (success) {
                    $scope.userForm.email.$setValidity('email', true);
                }, function (failure) {
                    $scope.userForm.email.$setValidity('email', false);
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'user.exists', true);
                });
            };


            $scope.ok = function (user) {
                if(user.email === '') {
                    var confirmModalInstance = $uibModal.open({
                        templateUrl: 'partials/confirmation.html',
                        controller: 'ConfirmationModalController',
                        resolve: {
                            confirmMessage: function(){
                                return 'If you delete this user\'s email address, they will no longer be able to login. Do you want to continue?';
                            }
                        }
                    });

                    confirmModalInstance.result.then(function () {
                        user.no_login = true;
                        saveUser();
                        ModalHandler.close($uibModalInstance);
                    });
                } else {
                    saveUser();
                }

                function saveUser () {
                    if (!showRoleSelector) {
                        if (Role.hasRoles([USER_ROLES.admin], Role.getFromMask(user.roles_mask)) && !user.is_admin) {
                            user.roles_mask -= USER_ROLES.admin.mask;
                        } else if (!Role.hasRoles([USER_ROLES.admin], Role.getFromMask(user.roles_mask)) && user.is_admin) {
                            user.roles_mask += USER_ROLES.admin.mask;
                        }
                    }
                    if (user.password !== user.password_confirmation) {
                        $scope.alerts = [];
                        Alert.error($scope.alerts, 'Error: Password does not match', true);
                        return;
                    }
                    User.update({id: editUser.id}, {
                        user: user,
                        email_relations: $scope.listOutputUsers
                    }, function (success) {
                        $scope.user.user_addresses = success.user_addresses;
                        Logger.log(success);
                        if (initialEmail !== user.email && user.email !== '') {
                            Registration.sendEmailVerification({
                                email: user.email,
                                user_id: user.id
                            }).$promise.then(function () {
                                Notification.success('Confirmation email message was sent to the new email address. Please check your email to complete the change.');
                            });
                        }
                        ModalHandler.close($uibModalInstance, success);
                    }, function (failure) {
                        Logger.log(failure);
                        if (failure.data.password) {
                            Alert.error($scope.alerts, 'Error: Password ' + failure.data.password[0], true);
                        } else {
                            Alert.error($scope.alerts, failure.data.message, true);
                        }

                    });
                    editUser.email_bindings = $scope.listOutputUsers;
                }
            };


            $scope.roleName = function(roles_mask){
                var str = '';
                Role.getFromMask(roles_mask).reverse().forEach(function(elem){
                    str += str == '' ? elem.name : ', ' + elem.name;
                });
                return str;
            };

            $scope.is_multispecialty = function(){
                return Role.hasRoles([USER_ROLES.doctor], Role.getFromMask($scope.user.roles_mask)) && practiceType.code === 'multi_specialty';
            };

            $scope.cancel = function () {
                ModalHandler.dismiss($uibModalInstance);
                $scope.user.email = initialEmail;
                $scope.listInputUsers = [];
            };
}])

.controller('EditNoLoginUserModalController',
    ['$scope', 'showNameControls', '$uibModalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'Logger', 'editUser', 'practiceType', 'Procedure', 'practiceAddresses',
    function ($scope, showNameControls, $uibModalInstance, ModalHandler, User, Auth, Alert, Logger, editUser, practiceType, Procedure, practiceAddresses) {
        $scope.user = editUser;
        $scope.alerts = [];
        $scope.practiceTypes = [];
        $scope.showNameControls = showNameControls;
        Procedure.practiceTypes({'include_procedures': false}, function(success){
            success.map(function(item){
                if(item.code !== 'multi_specialty'){
                    $scope.practiceTypes.push(item);
                }
            });
        });
        $scope.practiceAddresses = practiceAddresses;

        $scope.cancel = function () {
            $scope.user.email = undefined; //reset user email if modal is closed
            ModalHandler.dismiss($uibModalInstance);
        };

        $scope.save = function(user){
            User.update({id: user.id}, {
                user: {
                    title: user.title,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    specialty_type_id: user.specialty_type_id,
                    user_addresses_attributes: user.user_addresses_attributes
                }
            }, function (success) {
                if (user.email) {

                    User.sendPasswordInvitation({id: user.id}, { email: user.email, specialty_type_id: user.specialty_type_id},
                        function (success) {
                            ModalHandler.close($uibModalInstance, user);
                        },
                        function (failure) {
                            $scope.alerts = [];
                            Alert.error($scope.alerts, failure.data.error, true);
                        });
                }else{
                    ModalHandler.close($uibModalInstance, success);
                }
            }, function (failure) {
                $scope.alerts = [];
                Alert.error($scope.alerts, failure.data.error, true);
            });
        };

        $scope.is_multispecialty = function(){
            return practiceType.code === 'multi_specialty';
        };

}])

.controller('SecurityCodeModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'Auth', 'SecurityCode', function ($scope, $uibModalInstance, ModalHandler, Auth, SecurityCode) {
    $scope.securityCode = SecurityCode.get({practice_id: Auth.get().practice_id});
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('DatePickerModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'currentDate', function ($scope, $uibModalInstance, ModalHandler, currentDate) {
    $scope.date = currentDate;

    $scope.dateSelected = function(){
        ModalHandler.close($uibModalInstance, $scope.date);
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('RegistrationResultController', ['$scope', '$uibModalInstance', 'ModalHandler', function ($scope, $uibModalInstance, ModalHandler) {
    $scope.resultMessage = 'Thank you for registering your account on Dental Care Links. Your account is waiting to start sending HIPAA Compliant referrals for free!';
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    }
}])

.controller('PromoRegistrationResultController', ['$scope', '$uibModalInstance', 'ModalHandler', function ($scope, $uibModalInstance, ModalHandler) {
    $scope.resultMessage = 'Thank you for registering your account on Dental Care Links. Your account is waiting for approval!';
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    }
}])

.controller('InviteUserResultController', ['$scope', '$uibModalInstance', 'ModalHandler', 'toEmail', function ($scope, $uibModalInstance, ModalHandler, toEmail) {
    $scope.resultMessage = 'Your invite has been sent to ' + toEmail + '. The email contains a special link to complete their registration, once this is done their account will be activated.';
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    }
}])

    .controller('EmailChangeResultController', ['$scope', '$uibModalInstance', 'ModalHandler', function ($scope, $uibModalInstance, ModalHandler) {
    $scope.resultMessage = 'Your email was changed. Please login with your new credentials';
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    }
}])

.controller('ReferralSuccessModalController', ['$scope', '$uibModalInstance', 'ModalHandler', function($scope, $uibModalInstance, ModalHandler){
    $scope.cancel = function () {
        ModalHandler.close($uibModalInstance);
    };
    $scope.goDownload = function () {
        ModalHandler.close($uibModalInstance);
    }
}])

.controller('InvitationValidationController', ['$scope', '$uibModalInstance', 'Alert', 'ModalHandler', 'ProviderInvitation', 'invitation', function($scope, $uibModalInstance, Alert, ModalHandler, ProviderInvitation, invitation){
    $scope.alerts = [];
    $scope.cancel = function () {
        ModalHandler.dismiss($uibModalInstance);
    };
    $scope.sendInvitation = function () {
        ProviderInvitation.resend({id: invitation.id}, function (success) {
                ModalHandler.close($uibModalInstance);
            },
            function (failure) {
                $scope.alerts = [];
                Alert.error($scope.alerts, 'An error occurred during invitation resend...', true)
            });
    }
}])

.controller('ErrorModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'message', function($scope, $uibModalInstance, ModalHandler, message){
    $scope.message = message;

    $scope.cancel = function(){
        ModalHandler.close($uibModalInstance);
    };
}])

.controller('SubscriptionChangeModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'locationsNumber', 'basePrice', 'subscriptionPrice', 'subscriptionInterval', 'cancelCallback', function($scope, $uibModalInstance, ModalHandler, locationsNumber, basePrice, subscriptionPrice, subscriptionInterval, cancelCallback){
    $scope.basePrice = basePrice;
    $scope.subscriptionPrice = subscriptionPrice;
    $scope.subscriptionInterval = subscriptionInterval;
    $scope.locationsNumber = locationsNumber;
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    };
    $scope.cancel = function(){
        cancelCallback();
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('ConfirmationModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'confirmMessage',
    function($scope, $uibModalInstance, ModalHandler, confirmMessage){
    $scope.confirmMessage = confirmMessage;
    $scope.ok = function(){
        ModalHandler.close($uibModalInstance);
    };
    $scope.cancel = function(){
        ModalHandler.dismiss($uibModalInstance);
    };
}])

.controller('UnsubscribeModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'confirmMessage',
    function($scope, $uibModalInstance, ModalHandler, confirmMessage){
        $scope.confirmMessage = confirmMessage;

        $scope.ok = function(){
            ModalHandler.close($uibModalInstance);
        };
}])

.controller('PasswordEditModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'message',
    function($scope, $uibModalInstance, ModalHandler, message){
        $scope.message = message;

        $scope.ok = function(){
            ModalHandler.close($uibModalInstance);
        };
}])

.controller('SuccessGuestReferralModalController', ['$scope', '$uibModalInstance', 'ModalHandler',
    function($scope, $uibModalInstance, ModalHandler){
        $scope.message = "Almost done! We need you to confirm the entered email is yours. Please activate the referral by clicking the link in the email message we've sent to you.";

        $scope.ok = function(){
            ModalHandler.close($uibModalInstance);
        };
}])

.controller('RegistrationEmailResendModalController', ['$scope', '$uibModalInstance', 'ModalHandler',
    function ($scope, $uibModalInstance, ModalHandler) {
        $scope.ok = function () {
            ModalHandler.dismiss($uibModalInstance);
        }

}])

.controller('AddPluginVersionModalController', ['$scope', '$uibModalInstance', 'ModalHandler',
    function ($scope, $uibModalInstance, ModalHandler) {
        $scope.version = '';
        $scope.add = function () {
            ModalHandler.close($uibModalInstance, $scope.version);
        };
        $scope.cancel = function(){
            ModalHandler.dismiss($uibModalInstance);
        };
}])

.controller('VersionLogsModalController', ['$scope', '$uibModalInstance', 'ModalHandler', 'logs',
    function ($scope, $uibModalInstance, ModalHandler, logs) {
        $scope.logs = logs;

        $scope.cancel = function(){
            ModalHandler.dismiss($uibModalInstance);
        };
}])

.controller('InviteGuestModalController', ['$scope', '$modalInstance', 'ModalHandler', 'Referral', 'referral', 'Notification',
    function ($scope, $modalInstance, ModalHandler, Referral, referral, Notification) {

        $scope.invite = function() {
            Referral.sendGuestReferralUpdatedEmail({id: referral.id}, function(success) {
                Notification.success('Email to guest was sent successfully!');
                referral.no_more_guest_conversion_offers = true; // no more than one offer email per referral. Server also sets it to true
                ModalHandler.dismiss($modalInstance);
            }, function(error) {
                Notification.error('An error occurred.');
                ModalHandler.dismiss($modalInstance);
            });
        };

        $scope.skip = function() {
            ModalHandler.dismiss($modalInstance);
        };
}])

.controller('DeleteProviderModalController', ['$scope', '$uibModalInstance', 'ModalHandler',
    function ($scope, $uibModalInstance, ModalHandler) {
        $scope.ok = function(){
            ModalHandler.close($uibModalInstance, true);
        };
        $scope.cancel = function(){
            ModalHandler.close($uibModalInstance, false);
        };
}]);

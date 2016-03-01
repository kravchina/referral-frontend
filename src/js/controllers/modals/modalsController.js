angular.module('modals')
.controller('PatientModalController', [ '$scope', '$modalInstance', 'Auth', 'ModalHandler', 'Patient', 'fullname', '$modal', 'Alert',
        function ($scope, $modalInstance, Auth, ModalHandler, Patient, fullname, $modal, Alert) {

    $scope.title = 'Create a New Patient Record';
    $scope.alerts = [];

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

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
        patient.practice_id = Auth.getOrRedirect().practice_id;

        function createPatient(){
            Patient.save({patient: {salutation: patient.salutation, first_name: patient.first_name, last_name: patient.last_name, middle_initial: patient.middle_initial, birthday: moment(patient.birthday).format('YYYY-MM-DD'), email: patient.email, phone: patient.phone, practice_id: patient.practice_id}},
                function (success) {
                    ModalHandler.close($modalInstance, success);
                },
                function (failure) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'Error occurred during patient create.', true)
                });
        };

        Patient.searchPatientDuplicate(patient, function (success) {
            if (typeof(success.patient) !== 'undefined' && success.patient !== null) {

                var dedupingModalInstatnce = $modal.open({
                    templateUrl: 'partials/patient_deduping_form.html',
                    controller: 'DedupingPatientModalController',
                    resolve: {
                        isCreatingPatient: function(){
                            return true;
                        }
                    }
                });

                dedupingModalInstatnce.result.then(function (useExistingPatient) {
                    if (useExistingPatient) {
                        ModalHandler.close($modalInstance, success.patient);
                    } else {
                        createPatient();
                    }
                });
            } else {
                createPatient();
            }

        });

    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);

    };
}])

.controller('DedupingPatientModalController', ['$scope', '$modalInstance', 'isCreatingPatient', function($scope, $modalInstance, isCreatingPatient){
        $scope.useExistingPatient = true;
        $scope.isCreatingPatient = isCreatingPatient;

        $scope.ok = function () {
            $modalInstance.close($scope.useExistingPatient);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

.controller('EditPatientModalController', [ '$scope', '$modalInstance', 'Auth', 'Alert', 'ModalHandler', 'Patient', 'patientForEdit', '$modal',
        function ($scope, $modalInstance, Auth, Alert, ModalHandler, Patient, patientForEdit, $modal) {
    $scope.title = 'Edit Patient Record';

    $scope.alerts = [];
    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
    $scope.patient = {salutation: patientForEdit.salutation, first_name: patientForEdit.first_name, last_name: patientForEdit.last_name, middle_initial: patientForEdit.middle_initial, birthday: new Date(patientForEdit.birthday), email: patientForEdit.email, phone: patientForEdit.phone};//we need a copy of the object to be able to cancel changes (otherwise two-way binding changes the patient's data on parent page right away)
    $scope.ok = function (patient) {
        function updatePatient () {
            Patient.update({id: patientForEdit.id}, {patient: {salutation: patient.salutation, first_name: patient.first_name, last_name: patient.last_name, middle_initial: patient.middle_initial, birthday: moment(patient.birthday).format('YYYY-MM-DD'), email: patient.email, phone: patient.phone}},
                function (success) {
                    ModalHandler.close($modalInstance, success);
                },
                function (failure) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'Error occurred during patient update.', true);
                });
        };

        patient.id = patientForEdit.id;
        patient.practice_id = patientForEdit.practice_id;

        Patient.searchPatientDuplicate(patient, function (success) {
            if (typeof(success.patient) !== 'undefined' && success.patient !== null) {

                var dedupingModalInstatnce = $modal.open({
                    templateUrl: 'partials/patient_deduping_form.html',
                    controller: 'DedupingPatientModalController',
                    resolve: {
                        isCreatingPatient: function(){
                            return false;
                        }
                    }
                });

                dedupingModalInstatnce.result.then(function (useExistingPatient) {
                    if (useExistingPatient) {
                        ModalHandler.close($modalInstance, success.patient);
                    } else {
                        updatePatient();
                    }
                });
            } else {
                updatePatient();
            }

        });

    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('ChangeDestProviderModalController', [ '$scope', '$modalInstance', 'Auth','Alert', 'ModalHandler', 'Referral', 'referral', 'User', function ($scope, $modalInstance, Auth, Alert, ModalHandler, Referral, referral, User) {
    $scope.providerId = referral.dest_provider_id;
    $scope.referral = referral;

    User.getProviders({practice_id: referral.dest_practice_id}).$promise.then(function (users) {
        users.unshift({id: -1, first_name: 'First', last_name: 'Available', firstAvailable: true});
        $scope.providers = users;
    });

    $scope.ok = function (providerId) {
        Referral.update({id: referral.id}, {referral: {dest_provider_id: providerId}},
            function (success) {
                ModalHandler.close($modalInstance, providerId);
            },
            function (failure) {
                Alert.error($scope.alerts, 'Error occurred during referral update.');
            });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('NoteModalController', ['$scope', '$modalInstance', 'ModalHandler', function ($scope, $modalInstance, ModalHandler) {
    $scope.ok = function (note) {
        //nothing to do, we cant save note right here because at this stage referral doesn't exist. We can only add new note to the list on the parent page (create referral) and save simultaneously with referral.
        if (note == undefined || note.match(/^\s*$/)){
            ModalHandler.dismiss($modalInstance);
        }else{
            ModalHandler.close($modalInstance,note);
        }
        
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };

}])

.controller('EditNoteModalController', ['$scope', '$modalInstance', 'ModalHandler', 'noteData', function ($scope, $modalInstance, ModalHandler, noteData) {
    $scope.note = angular.copy(noteData);

    $scope.ok = function (note) {
        if (note == undefined || note.message.match(/^\s*$/)){
            ModalHandler.dismiss($modalInstance);
        }else{
            ModalHandler.close($modalInstance, $scope.note);
        }
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };

}])

.controller('ProviderModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Alert', 'Auth', 'Spinner', 'sendEmailNotification', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Alert, Auth, Spinner, sendEmailNotification) {
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
        provider.inviter_id = Auth.getOrRedirect().id;
        var resultHandlers = {
            success: function (success) {
                ModalHandler.close($modalInstance, success);
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
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('PracticeModalController', ['$scope', '$modalInstance', 'ModalHandler','Alert', 'Practice', 'Procedure', function ($scope, $modalInstance, ModalHandler, Alert, Practice, Procedure) {
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
        ModalHandler.close($modalInstance, practice);
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('PracticeDeleteModalController', ['$scope', '$modalInstance', 'ModalHandler', 'Alert', 'Practice', 'User', 'Referral', 'selectedPractice', 'Notification',
    function($scope, $modalInstance, ModalHandler, Alert, Practice, User, Referral, selectedPractice, Notification){
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

            ModalHandler.close($modalInstance, error);
        };
        $scope.cancel = function () {
            ModalHandler.dismiss($modalInstance);
        };
    }])

.controller('UserModalController',
    ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Registration', 'Auth', 'Alert', 'Logger', 'USER_ROLES', 'Role',
    function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Registration, Auth, Alert, Logger, USER_ROLES, Role) {
    $scope.result = {};
    $scope.alerts = [];
    $scope.isInvite = true;
    $scope.user = {};
    $scope.user.roles_mask = 0;
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

    $scope.ok = function (user) {
        user.practice_id = ($scope.params && $scope.params.practiceId) || Auth.getOrRedirect().practice_id;
        user.inviter_id = Auth.getOrRedirect().id;

        if($scope.isInvite){
            ProviderInvitation.saveUser({provider_invitation: user},
                function (success) {
                    ModalHandler.close($modalInstance, success);
                }, function (failure) {
                    Logger.log(failure);
                    $scope.alerts = [];//reset alerts list because we need only one alert at a time
                    Alert.error($scope.alerts, failure.data.message[0], true);
                    Logger.log($scope.alerts);
                });
        } else {
            Registration.create_no_login_user({user: user},
                function(success){
                    ModalHandler.close($modalInstance, success);
                },function(failure){
                    Logger.log(failure);
                    $scope.alerts = [];//reset alerts list because we need only one alert at a time
                    Alert.error($scope.alerts, failure.data.message[0], true);
                    Logger.log($scope.alerts);
                });
        }
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('UpgradeModalController', ['$scope', '$modalInstance','$window', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', 'Practice', 'Logger', 'ServerSettings', 'practice_id', 'stripe_subscription_id', 'Spinner', 'stripe', function ($scope, $modalInstance, $window, ModalHandler, ProviderInvitation, Auth, Alert, Practice, Logger, ServerSettings, practice_id, stripe_subscription_id, Spinner, stripe) {
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
                            stripe_token: token.id
                        }
                    },
                    function (success) {
                        Logger.log(success);
                        Alert.success($scope.alerts, 'Thank you for upgrading to a Premium Account. Your automatic renewal date  is ' + moment(success.subscription_active_until).format('MM-DD-YY'), true);
                        ModalHandler.close($modalInstance, success);
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
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('EditUserModalController',
    ['$scope', '$modalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'Logger', 'editUser', 'practiceUsers', 'practiceType', 'Registration', 'ProviderInvitation', 'Notification', 'USER_ROLES', 'Role', 'Procedure',
        function ($scope, $modalInstance, ModalHandler, User, Auth, Alert, Logger, editUser, practiceUsers, practiceType, Registration, ProviderInvitation, Notification, USER_ROLES, Role, Procedure) {
            $scope.result = {};
            $scope.alerts = [];
            Logger.log(editUser.id);
            $scope.practiceTypes = [];
            Procedure.practiceTypes({'include_procedures': false}, function(success){
                success.map(function(item){
                    if(item.code !== 'multi_specialty'){
                        $scope.practiceTypes.push(item);
                    }
                });
            });
            $scope.user = editUser;//for now we need only is_admin property to be set
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
                ProviderInvitation.validate({email: email}, function (success) {
                    $scope.userForm.email.$setValidity('email', true);
                }, function (failure) {
                    $scope.userForm.email.$setValidity('email', false);
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'user.exists', true);
                });
            };


            $scope.ok = function (user) {
                if(Role.hasRoles([USER_ROLES.admin], Role.getFromMask(user.roles_mask)) && !user.is_admin) {
                    user.roles_mask -= USER_ROLES.admin.mask;
                } else if(!Role.hasRoles([USER_ROLES.admin], Role.getFromMask(user.roles_mask)) && user.is_admin) {
                    user.roles_mask += USER_ROLES.admin.mask;
                }
                if (user.password != user.password_confirmation) {
                    $scope.alerts = [];
                    Alert.error($scope.alerts, 'Error: Password does not match', true);
                    return;
                }
                if (initialEmail !== user.email) {
                    Registration.sendEmailVerification({email: user.email, user_id: user.id}).$promise.then(function(){
                        Notification.success('Confirmation letter was sent to your new email address. Your email will be changed right after confirmation.');
                    });
                }
                User.update({id: editUser.id}, {user: user, email_relations: $scope.listOutputUsers}, function (success) {
                    Logger.log(success);
                    ModalHandler.close($modalInstance,success);
                },  function (failure) {
                    Logger.log(failure);
                    if(failure.data.password){
                        Alert.error($scope.alerts, 'Error: Password ' + failure.data.password[0], true);
                    }else{
                        Alert.error($scope.alerts, 'Error: ' + failure.data.message, true);
                    }
                    
                });
                editUser.email_bindings = $scope.listOutputUsers;
            };


            $scope.roleName = function(roles_mask){
                var str = '';
                Role.getFromMask(roles_mask).reverse().forEach(function(elem){
                    str += str == '' ? elem.name : ', ' + elem.name;
                });
                return str;
            };

            $scope.is_multispecialty = function(){
                return Role.hasRoles([USER_ROLES.doctor], Role.getFromMask($scope.user.roles_mask)) && practiceType.code == 'multi_specialty';
            };

            $scope.cancel = function () {
                ModalHandler.dismiss($modalInstance);
                $scope.user.email = initialEmail;
                $scope.listInputUsers = [];
            };
}])

.controller('EditNoLoginUserModalController',
    ['$scope', '$modalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'Logger', 'editUser', 'practiceType', 'Procedure',
    function ($scope, $modalInstance, ModalHandler, User, Auth, Alert, Logger, editUser, practiceType, Procedure) {
        $scope.user = editUser;
        $scope.alerts = [];
        $scope.practiceTypes = [];
        Procedure.practiceTypes({'include_procedures': false}, function(success){
            success.map(function(item){
                if(item.code !== 'multi_specialty'){
                    $scope.practiceTypes.push(item);
                }
            });
        });

        $scope.cancel = function () {
            $scope.user.email = undefined; //reset user email if modal is closed
            ModalHandler.dismiss($modalInstance);
        };

        $scope.ok = function (user) {
             User.sendPasswordInvitation({id: user.id}, {email: user.email, specialty_type_id: user.specialty_type_id},
                 function(success){
                     ModalHandler.close($modalInstance,success);
                 },
                 function(failure){
                    $scope.alerts = [];
                    Alert.error($scope.alerts, failure.data.error, true);
                 });
        };

        $scope.save = function(user){
            User.update({id: user.id}, {user: {specialty_type_id: user.specialty_type_id}}, function(success){
                ModalHandler.dismiss($modalInstance);
            }, function(failure){
                $scope.alerts = [];
                Alert.error($scope.alerts, failure.data.error, true);
            });
        };

        $scope.is_multispecialty = function(){
            return practiceType.code === 'multi_specialty';
        };

}])

.controller('SecurityCodeModalController', ['$scope', '$modalInstance', 'ModalHandler', 'Auth', 'SecurityCode', function ($scope, $modalInstance, ModalHandler, Auth, SecurityCode) {
    $scope.securityCode = SecurityCode.get({practice_id: Auth.get().practice_id});
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('DatePickerModalController', ['$scope', '$modalInstance', 'ModalHandler', 'currentDate', function ($scope, $modalInstance, ModalHandler, currentDate) {
    $scope.date = currentDate;

    $scope.dateSelected = function(){
        ModalHandler.close($modalInstance, $scope.date);
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('RegistrationResultController', ['$scope', '$modalInstance', 'ModalHandler', function ($scope, $modalInstance, ModalHandler) {
    $scope.resultMessage = 'Thank you for registering your account on Dental Links. Your account is waiting to start sending HIPAA Compliant referrals for free! You can log in from any browser at www.dentalcarelinks.com using your username (email address) and password.';
    $scope.ok = function(){
        ModalHandler.close($modalInstance);
    }
}])

    .controller('EmailChangeResultController', ['$scope', '$modalInstance', 'ModalHandler', function ($scope, $modalInstance, ModalHandler) {
    $scope.resultMessage = 'Your email was changed. Please login with your new credentials';
    $scope.ok = function(){
        ModalHandler.close($modalInstance);
    }
}])

.controller('ReferralSuccessModalController', ['$scope', '$modalInstance', 'ModalHandler', function($scope, $modalInstance, ModalHandler){
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
    $scope.goDownload = function () {
        ModalHandler.close($modalInstance);
    }
}])

.controller('InvitationValidationController', ['$scope', '$modalInstance', 'Alert', 'ModalHandler', 'ProviderInvitation', 'invitation', function($scope, $modalInstance, Alert, ModalHandler, ProviderInvitation, invitation){
    $scope.alerts = [];
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
    $scope.sendInvitation = function () {
        ProviderInvitation.resend({id: invitation.id}, function (success) {
                ModalHandler.close($modalInstance);
            },
            function (failure) {
                $scope.alerts = [];
                Alert.error($scope.alerts, 'An error occurred during invitation resend...', true)
            });
    }
}])

.controller('ErrorModalController', ['$scope', '$modalInstance', 'ModalHandler', 'message', function($scope, $modalInstance, ModalHandler, message){
    $scope.message = message;

    $scope.cancel = function(){
        ModalHandler.close($modalInstance);
    };
}])

.controller('SubscriptionChangeModalController', ['$scope', '$modalInstance', 'ModalHandler', 'BASE_SUBSCRIPTION_PRICE', 'locationsNumber', 'cancelCallback', function($scope, $modalInstance, ModalHandler, BASE_SUBSCRIPTION_PRICE, locationsNumber, cancelCallback){
    $scope.baseSubscriptionPrice = BASE_SUBSCRIPTION_PRICE;
    $scope.locationsNumber = locationsNumber;
    $scope.ok = function(){
        ModalHandler.close($modalInstance);
    };
    $scope.cancel = function(){
        cancelCallback();
        ModalHandler.dismiss($modalInstance);
    };
}])

.controller('RegistrationEmailResendModalController', ['$scope', '$modalInstance', 'ModalHandler',
    function ($scope, $modalInstance, ModalHandler) {
        $scope.ok = function () {
            ModalHandler.dismiss($modalInstance);
        }

}]);

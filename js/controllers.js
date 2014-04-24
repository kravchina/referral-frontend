var dentalLinksControllers = angular.module('dentalLinksControllers', ['ui.bootstrap', 'angularFileUpload']);

dentalLinksControllers.controller('LoginController', ['$scope', '$window', '$location', 'Login', 'redirect',
    function ($scope, $window, $location, Login, redirect) {
        $scope.authenticated = $window.sessionStorage.token ? true : false;
        $scope.email = $window.sessionStorage.email;
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/
            Login.login({'user': {'email': user.email, 'password': user.password }},
                function (success) {
                    $window.sessionStorage.token = success.token;
                    $window.sessionStorage.email = user.email;
                    $window.sessionStorage.roles = success.roles;
                    $scope.email = user.email;
                    $scope.authenticated = true;
                    $location.path(redirect.path);
                    $scope.success = true;
                    $scope.failure = false;                },
                function (failure) {
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.email;
                    $scope.message = 'Error: invalid username or password';
                    $scope.authenticated = false;

                    $scope.success = false;
                    $scope.failure = true;
                });
        };
        $scope.logout = function () {
            Login.logout(function () {
                    $scope.email = null;
                    $scope.message = null;
                    $scope.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.email;
                    $location.path('/sign_in');
                }
            );

        };
    }]);

dentalLinksControllers.controller('ReferralsController', ['$scope', 'Practice', 'Patient', 'Referral', 'S3Bucket', '$modal', '$fileUploader', function ($scope, Practice, Patient, Referral, S3Bucket, $modal, $fileUploader) {

    /*$scope.patients = Patient.query();

    $scope.practices = Practice.query();*/

    $scope.model = {referral: {}, practice: {}};

    $scope.createReferral = function (model) {

        model.referral.dest_practice_id = $scope.destinationPractice.id;
        model.referral.patient_id = $scope.patient.id;

        $scope.create_referral_result = Referral.save(model,
            function (success) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.failure = true;
                $scope.success = false;

            });

    };

    $scope.findPatient = function(searchValue){
        return Patient.searchPatient( {search: searchValue }).$promise.then(function(res){
            return res;
        });
    };

    $scope.findPractice = function(searchValue){
        return Practice.searchPractice( {search: searchValue }).$promise.then(function(res){
            return res;
        });
    };

    $scope.patientDialog = function () {

        var modalInstance = $modal.open({
            templateUrl: 'partials/patient_form.html',
            controller: 'PatientModalController'/*,
             resolve: {
             items: function () {
             return $scope.items;
             }
             }*/
        });

        modalInstance.result.then(function (patient) {
            $scope.patient = patient;
        });
    };

    $scope.practiceDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/practice_form.html',
            controller: 'PracticeModalController'
        });

        modalInstance.result.then(function (practice_invite) {
            $scope.destinationPractice = {name: practice_invite.practice_name, id: practice_invite.practice_id};
        });
    };

    $scope.model.attachments = [];

    S3Bucket.getCredentials(function (success) {
        var bucket_path = 'uploads/';
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'https://mezerny.s3.amazonaws.com',
            formData: [
                { key: bucket_path + '${filename}' },
                {AWSAccessKeyId: success.s3_access_key_id},
                {acl: 'public-read'},
                {success_action_status: '201'},
                {policy: success.s3_policy},
                {signature: success.s3_signature}
            ]
        });

        // ADDING FILTERS

        // Images only
        /*uploader.filters.push(function (item *//*{File|HTMLInputElement}*//*) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });
*/
        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.debug('FORM DATA:', uploader.formData);
            console.debug('SCOPE DATA:', $scope.s3Credentials);
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
            $scope.model.attachments.push({url: item.url + '/' + bucket_path + item.file.name, notes: item.notes});

        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.error('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });

    });


}]);

dentalLinksControllers.controller('PatientModalController', [ '$scope', '$modalInstance', 'Patient', function ($scope, $modalInstance, Patient) {

    /*$scope.patient = patient;*/

    $scope.ok = function (patient) {
        Patient.save({patient: patient},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                $scope.success = false;
                $scope.failure = true;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


dentalLinksControllers.controller('PracticeModalController', ['$scope', '$modalInstance', 'PracticeInvitation', function ($scope, $modalInstance, PracticeInvitation) {
    $scope.ok = function (practice_invite) {
        PracticeInvitation.save({practice: practice_invite},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                $scope.success = false;
                $scope.failure = true;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

dentalLinksControllers.controller('ReferralsViewController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$sce', function ($scope, $stateParams, $fileUploader, $timeout, Referral, PDF, Note, S3Bucket, Attachment, $sce) {
    $scope.referral = Referral.get({id: $stateParams.referral_id});

    $scope.referral.$promise.then(function (data) {

        PDF.addParagraph('Patient: ' + data.patient.first_name + ' ' + data.patient.last_name);
        PDF.addParagraph('Original practice: ' + data.orig_practice.name);
        PDF.addParagraph('Original practice description: ' + data.orig_practice.description);
        PDF.addParagraph('Memo: ' + data.memo);
        PDF.addParagraph('Referral status: ' + data.status);

        PDF.addNotes(data.notes);
    });

    $scope.savePdf = function () {
        PDF.save('referral.pdf')
    };

    $scope.submitNote = function (note) {
        Note.save({note: {message: note, referral_id: $scope.referral.id}}, function (success) {
            $scope.newNote = '';
            $scope.referral.notes.push(success);
        });
    };

    $scope.acceptReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'accepted'},
            function (success) {
                referral.status = 'accepted';
                $scope.acceptSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;
            });

    };

    $scope.rejectReferral = function (referral) {
        Referral.updateStatus({id: referral.id}, {status: 'rejected'},
            function (success) {
                referral.status = 'rejected';
                $scope.acceptSuccess = true;
                $scope.failure = false;

            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;

            });
    };

    $scope.completeReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'completed'},
            function (success) {
                referral.status = 'completed';
                $scope.completeSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.completeSuccess = false;
                $scope.failure = true;
            });

    };

    $scope.isImage = function(attachment){
        return attachment.filename.search(/(jpg|png|gif)$/) >= 0;
    };

    S3Bucket.getCredentials(function (success) {
        var bucket_path = 'uploads/';
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'https://mezerny.s3.amazonaws.com',
            formData: [
                { key: bucket_path + '${filename}' },
                {AWSAccessKeyId: success.s3_access_key_id},
                {acl: 'public-read'},
                {success_action_status: '200'},
                {policy: success.s3_policy},
                {signature: success.s3_signature}
            ]
        });

        // ADDING FILTERS

        // Images only
        /*uploader.filters.push(function (item *//*{File|HTMLInputElement}*//*) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });*/

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.debug('FORM DATA:', uploader.formData);
            console.debug('SCOPE DATA:', $scope.s3Credentials);
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
            var attachment = {filename: item.url + '/' + bucket_path + item.file.name, notes: item.notes, referral_id: $scope.referral.id};
            Attachment.save({attachment: attachment}, function (success) {
                $scope.referral.attachments.push(attachment);
            });

        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.error('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });

    });


}])
;

//not used now
dentalLinksControllers.controller('UsersController', ['$scope', 'Practice', function ($scope, Practice) {
    $scope.roles = [
        {'mask': 0, 'name': 'admin'},
        {'mask': 2, 'name': 'doctor'},
        {'mask': 4, 'name': 'aux'}
    ];
    $scope.practices = Practice.query();
}]);


dentalLinksControllers.controller('PasswordsController', ['$scope', '$stateParams', 'Password', function ($scope, $stateParams, Password) {
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user},
            function (result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (result) {
                $scope.failure = true;
                $scope.success = false;
            })
    };
    $scope.initial = true;
    $scope.success = false;
    $scope.changePassword = function (model) {


        model.reset_password_token = $stateParams.reset_password_token;
        Password.change({'user': model, 'format': 'json'},
            function (success_result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (error_result) {
                $scope.success = false;
                $scope.failure = true;
            });
    };
}]);


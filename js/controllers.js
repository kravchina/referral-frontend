var dentalLinksControllers = angular.module('dentalLinksControllers', ['ui.bootstrap', 'angularFileUpload']);

dentalLinksControllers.controller('LoginController', ['$scope', '$window', '$location', 'Login',
    function ($scope, $window, $location, Login) {
        $scope.authenticated = $window.sessionStorage.token ? true : false;
        $scope.email = $window.sessionStorage.email;
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/
            Login.login({'user': {'email': user.email, 'password': user.password }},
                function (success) {
                    $window.sessionStorage.token = success.token;
                    $window.sessionStorage.email = user.email;
                    $scope.email = user.email;
                    $scope.message = 'Successful login. Welcome!';
                    $scope.authenticated = true;
                    $location.path('/create_referral');
                    $scope.success = true;
                    $scope.failure = false;
                },
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

    $scope.patients = Patient.query();

    $scope.practices = Practice.query();

    $scope.model = {referral: {}, practice: {}};

    $scope.createReferral = function (model) {

        $scope.create_referral_result = Referral.save(model,
            function (success) {
                $scope.patients = Patient.query();
                $scope.practices = Practice.query();

                $scope.success = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.failure = true;
                $scope.success = false;

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
            $scope.patients.push(patient);
            $scope.model.referral.patient_id = patient.id;
        });
    };

    $scope.practiceDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/practice_form.html',
            controller: 'PracticeModalController'
        });

        modalInstance.result.then(function (practice_invite) {
            $scope.practices.push(practice_invite);
            $scope.model.practice.practice_id = practice_invite.id;
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
        uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });

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

dentalLinksControllers.controller('ReferralsViewController', ['$scope', '$routeParams', '$fileUploader', 'Referral', 'Note', 'S3Bucket', 'Attachment', '$sce', function ($scope, $routeParams, $fileUploader, Referral, Note, S3Bucket, Attachment, $sce) {
    $scope.referral = Referral.get({id: $routeParams.referral_id});

    var pdf = new jsPDF('p','in','letter')
        , sizes = [12, 16, 20]
        , fonts = [['Times','Roman'],['Helvetica',''], ['Times','Italic']]
        , font, size, lines
        , margin = 0.5 // inches on a 8.5 x 11 inch sheet.
        , verticalOffset = margin
        , loremipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id eros turpis. Vivamus tempor urna vitae sapien mollis molestie. Vestibulum in lectus non enim bibendum laoreet at at libero. Etiam malesuada erat sed sem blandit in varius orci porttitor. Sed at sapien urna. Fusce augue ipsum, molestie et adipiscing at, varius quis enim. Morbi sed magna est, vel vestibulum urna. Sed tempor ipsum vel mi pretium at elementum urna tempor. Nulla faucibus consectetur felis, elementum venenatis mi mollis gravida. Aliquam mi ante, accumsan eu tempus vitae, viverra quis justo.\n\nProin feugiat augue in augue rhoncus eu cursus tellus laoreet. Pellentesque eu sapien at diam porttitor venenatis nec vitae velit. Donec ultrices volutpat lectus eget vehicula. Nam eu erat mi, in pulvinar eros. Mauris viverra porta orci, et vehicula lectus sagittis id. Nullam at magna vitae nunc fringilla posuere. Duis volutpat malesuada ornare. Nulla in eros metus. Vivamus a posuere libero.';

    // Margins:
    pdf.setDrawColor(0, 255, 0)
        .setLineWidth(1/72)
        .line(margin, margin, margin, 11 - margin)
        .line(8.5 - margin, margin, 8.5-margin, 11-margin)

    // the 3 blocks of text
    for (var i in fonts){
        if (fonts.hasOwnProperty(i)) {
            font = fonts[i];
            size = sizes[i] ;

            lines = pdf.setFont(font[0], font[1])
                .setFontSize(size)
                .splitTextToSize(loremipsum, 7.5) ;
            // Don't want to preset font, size to calculate the lines?
            // .splitTextToSize(text, maxsize, options)
            // allows you to pass an object with any of the following:
            // {
            // 	'fontSize': 12
            // 	, 'fontStyle': 'Italic'
            // 	, 'fontName': 'Times'
            // }
            // Without these, .splitTextToSize will use current / default
            // font Family, Style, Size.
            console.log(lines);
            pdf.text(0.5, verticalOffset + size / 72, lines);

            verticalOffset += (lines.length + 0.5) * size / 72
        }
    }

    var string = pdf.output('datauristring');

    $scope.pdfSrc =  $sce.trustAsResourceUrl(string);







    $scope.submitNote = function (note) {
        Note.save({note: {message: note, referral_id: $scope.referral.id}}, function (success) {
            $scope.newNote = '';
            $scope.referral.notes.push({message: note});
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

    S3Bucket.getCredentials(function (success) {
        var bucket_path = 'uploads/';
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'https://mezerny.s3.amazonaws.com',
            formData: [
                { key: bucket_path + '${filename}' },
                {AWSAccessKeyId: success.s3_access_key_id},
                {acl: 'authenticated-read'},
                {success_action_status: '200'},
                {policy: success.s3_policy},
                {signature: success.s3_signature}
            ]
        });

        // ADDING FILTERS

        // Images only
        uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });

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


}]);

//not used now
dentalLinksControllers.controller('UsersController', ['$scope', 'Practice', function ($scope, Practice) {
    $scope.roles = [
        {'mask': 0, 'name': 'admin'},
        {'mask': 2, 'name': 'doctor'},
        {'mask': 4, 'name': 'aux'}
    ];
    $scope.practices = Practice.query();
}]);


dentalLinksControllers.controller('PasswordsController', ['$scope', '$routeParams', 'Password', function ($scope, $routeParams, Password) {
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


        model.reset_password_token = $routeParams.reset_password_token;
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

dentalLinksControllers.controller('PDFController', ['$scope', '$sce', function ($scope, $sce) {

}]);
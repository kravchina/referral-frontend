var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);

createReferralModule.controller('CreateReferralsController', ['$scope', 'Practice', 'Patient', 'Procedure', 'Provider', 'Referral', 'S3Bucket', '$modal', '$fileUploader', '$timeout', function ($scope, Practice, Patient, Procedure, Provider, Referral, S3Bucket, $modal, $fileUploader, $timeout) {

    $scope.alerts = [];

    var pushAlert = function (type, message) {
        var alert = { type: type, message: message, promise: $timeout(function () {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 5000) };
        $scope.alerts.push(alert);

    };

    $scope.closeAlert = function (index) {
        $timeout.cancel($scope.alerts[index].promise); //cancel automatic removal
        $scope.alerts.splice(index, 1);
    };

    $scope.procedures = Procedure.query();

    $scope.practiceTypes = Procedure.practiceTypes();

    $scope.providers = Provider.query(function(success){}, function(failure){
        pushAlert('danger', 'Server doesn\'t respond. Please try again later');
    });

    $scope.model = {referral: {notes_attributes: []}, practice: {}};

    $scope.updatePracticeType = function (item) {
        for (var i = 0; i < $scope.practiceTypes.length; i++) {
            if ($scope.practiceTypes[i].id == item.practice_type_id) {
                $scope.practiceType = $scope.practiceTypes[i];
                break;
            }
        }
    };

    $scope.now = function(){
        return Date.now();
    };

    $scope.createReferral = function (model) {

        model.referral.dest_practice_id = $scope.destinationPractice.id;
        model.referral.patient_id = $scope.patient.id;
        model.referral.teeth = teeth.join('+');
        for (var i = 0; i < $scope.uploader.queue.length; i++) {
            var item = $scope.uploader.queue[i];
            item.upload();
        }

        $scope.create_referral_result = Referral.save(model,
            function (success) {
               pushAlert('success', 'Referral was sent successfully!')
            },
            function (failure) {
                pushAlert('danger', 'An error occurred during referral creation...')
            });

    };

    $scope.findPatient = function (searchValue) {
        return Patient.searchPatient({search: searchValue, now: Date.now() }).$promise.then(function (res) {
            return res;
        });
    };

    $scope.findPractice = function (searchValue) {
        return Practice.searchPractice({search: searchValue, now: Date.now() }).$promise.then(function (res) {
            return res;
        });
    };

    $scope.patientDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/patient_form.html',
            controller: 'PatientModalController'
        });

        modalInstance.result.then(function (patient) {
            $scope.patient = patient;
        });
    };

    $scope.providerDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/provider_form.html',
            controller: 'ProviderModalController'
        });

        modalInstance.result.then(function (provider) {
            $scope.destinationPractice = $scope.destinationPractice || {users: [], name: ''};
            $scope.destinationPractice.users.push(provider);
            $scope.model.referral.dest_provider_id = provider.id;
            //$scope.provider = provider;
        });
    };

    $scope.noteDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/note_form.html',
            controller: 'NoteModalController'
        });

        modalInstance.result.then(function (note) {

            $scope.model.referral.notes_attributes.push({message: note, created_at: Date.now()});
        });
    };

    var teeth = [];
    $scope.toggleTooth = function (toothNumber) {
        var index = teeth.indexOf(toothNumber);
        if (index == -1) {
            teeth.push(toothNumber);
        } else {
            teeth.splice(index, 1);
        }
    };


    $scope.model.attachments = [];

    S3Bucket.getCredentials(function (success) {
        var bucket_path = 'uploads/';
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'https://dev1-attachments.s3.amazonaws.com/',
            formData: [
                { key: bucket_path + '${filename}' },
                {AWSAccessKeyId: success.s3_access_key_id},
                {acl: 'public-read'},
                {success_action_status: '200'},
                {policy: success.s3_policy},
                {signature: success.s3_signature}
            ]
        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
            $scope.model.attachments.push({url: item.url + bucket_path + item.file.name, notes: item.notes});
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
            pushAlert('danger', 'Adding file failed. Please try again later.')
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


        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
            pushAlert('info', 'Attachment was cancelled.')
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.error('Error', xhr, item, response);
            pushAlert('danger', 'An error occured during attachment upload. Please try again later.')
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

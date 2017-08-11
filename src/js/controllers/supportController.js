angular.module('dentalLinks')
    .controller('SupportController', ['$scope', 'Support', 'Notification',
        function ($scope, Support, Notification) {
            $scope.questions = [
                {
                    question: 'HOW DO I CREATE A NEW REFERRAL?',
                    answer: 'To create a new referral click the NEW REFERRAL button on the History Page. Fill the form with the appropriate information. Attach any necessary radiographs or documents. Using the notes field you can add additional information. When finished you may Save the referral or Sign and Send it.'
                },
                {
                    question: 'WHAT DOES IT COST TO USE THE DENTAL CARE LINKS SERVICE?',
                    answer: 'It will always be free to use basic Dental Care Links features to send and receive referrals. Advanced features are currently in beta and are also free.'

                },
                {
                    question: 'CAN I SEND A REFERRAL TO ANY DENTIST?',
                    answer: 'Yes, you can send referrals to any dentist and receive them from any dentist. If the dentist is not already a Dental Care Links user, you can send them a referral and invite them to join in one form with just their name and email address.'
                },
                {
                    question: 'IS DENTAL CARE LINKS HIPAA COMPLIANT?',
                    answer: 'Yes, Dental Care Links makes it very simple to share patient referral information online without risking your patient’s privacy.'
                },
                {
                    question: 'HOW DO I SEND A POST-OP REPORT AFTER I COMPLETE THE PATIENT\'S TREATMENT?',
                    answer: 'All referrals active and complete act as a shared patient file. To update the file just open the original referral and add any necessary attachments and notes. The updated information will be available immediately and the referring dentists will be notified that the patient information has been updated.'
                },
                {
                    question: 'CAN I INVITE SOMEONE TO USE DENTAL CARE LINKS WITHOUT SENDING THEM A NEW REFERRAL?',
                    answer: 'Yes, In the account setting page use the + Invite Colleagues tab?'
                },
                {
                    question: 'CAN MORE THAN ONE DENTIST USE THE SAME ACCOUNT?',
                    answer: 'Yes, from the ADMIN page under the USERS tab you will be able to invite dentist and auxiliary from your practice to share your account.'
                },
                {
                    question: 'CAN I EDIT A REFERRAL THAT I HAVE ALREADY SENT?',
                    answer: 'Yes, Simply open the referral you would like to edit and add images or notes. These updated images and notes will be viewable to the other dentists instantly.'
                }
            ];
            $scope.send = function (support) {
                Support.sendQuestion({question: support.question, email: support.email},
                    function (success) {
                        Notification.success('We received your message and will get back to you as soon as we can.')
                    },
                    function (failure) {
                        Notification.error('Sorry, your message was not sent due to error. Please try again later.')
                    });
            }

        }])
;
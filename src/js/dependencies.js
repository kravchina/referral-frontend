window.jQuery = require('jquery');
require('angular');
require('angular-ui-router');
require('angular-ui-router-tabs');
require('angular-cookies');
require('angular-ui-bootstrap');
require('ng-infinite-scroll');
require('angularFileUpload');
require('angular-resource');
require('angular-sanitize');
require('angular-ui-mask');
require('localize');
require('istevenMultiSelect');
require('moment');
require('daterangepicker');
require('jqueryPlaceholder');
require('jsPDFaddimage');
require('jsPDFcell');
require('jsPDFfromhtml');
require('jsPDFsplittext');
require('jsPDFfonts');
require('angularStripe');
require('angularCreditCards');
require('angular-clipboard');
require('angular-css');

angular.module('jsPDF', []).factory('jsPDF', function(){ return require('jsPDF');});

angular.module('admin', ['ui.bootstrap', 'angular-stripe', 'credit-cards', 'angular-clipboard']);
angular.module('console', ['ui.bootstrap']);
angular.module('history', ['ui.bootstrap', 'infinite-scroll']);
angular.module('activity', ['ui.bootstrap', 'infinite-scroll']);
angular.module('login', []);
angular.module('passwords', []);
angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);
angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);
angular.module('modals', ['ui.bootstrap']);
angular.module('pdf', ['jsPDF']);
angular.module('registration', []);
angular.module('unsavedChanges', []);
angular.module('dentalLinksServices', ['ngResource']);
angular.module('dentalLinksDirectives', ['angularFileUpload']);
angular.module('error', []);
angular.module('unsubscribe', []);
angular.module('guest', []);

require('./controllers/admin/adminController.js');
require('./controllers/admin/adminInviteController.js');
require('./controllers/admin/adminPracticeController.js');
require('./controllers/admin/adminSubscriptionController.js');
require('./controllers/admin/adminUsersController.js');
require('./controllers/console/consoleController.js');
require('./controllers/console/practiceConsoleController.js');
require('./controllers/console/reportsConsoleController.js');
require('./controllers/console/utilitiesConsoleController.js');
require('./controllers/console/pluginConsoleController.js');
require('./controllers/modals/modalsController.js');
require('./controllers/createReferralsController.js');
require('./controllers/createGuestReferralsController.js');
require('./controllers/errorController.js');
require('./controllers/historyController.js');
require('./controllers/activityController.js');
require('./controllers/loginController.js');
require('./controllers/passwordsController.js');
require('./controllers/registrationController.js');
require('./controllers/reviewReferralsController.js');
require('./controllers/savePasswordsController.js');
require('./controllers/viewReferralsController.js');
require('./controllers/unsubscribeController.js');
require('./controllers/activateGuestReferralController.js');
require('./directives/directives.js');
require('./directives/referral/findPatientDirective.js');
require('./directives/referral/findPracticeDirective.js');
require('./directives/referral/fromProviderDirective.js');
require('./directives/referral/toProviderDirective.js');
require('./directives/referral/procedureBlockDirective.js');
require('./services/pdf.js');
require('./services/referralHelper.js');
require('./services/consoleHelper.js');
require('./services/services.js');
require('./services/unsavedChanges.js');

angular.module('dentalLinks', [
    'ui.router',
    'ui.router.tabs',
    'ngCookies',
    'admin',
    'console',
    'history',
    'activity',
    'login',
    'passwords',
    'createReferrals',
    'viewReferrals',
    'modals',
    'pdf',
    'registration',
    'unsavedChanges',
    'dentalLinksServices',
    'dentalLinksDirectives',
    'ui.mask',
    'localization',
    'error',
    'unsubscribe',
    'guest',
    'isteven-multi-select',
    'angularFileUpload',
    'dentalLinksPartials',
    'angularCSS'
]);

require('./directives/referral/findPatientController.js');
require('./directives/referral/findPracticeController.js');
require('./directives/referral/fromProviderController.js');
require('./directives/referral/toProviderController.js');
require('./directives/referral/procedureBlockController.js');
require('./controllers/subscriptionChangeController.js');
require('./controllers/attachmentsController.js');
require('./controllers/navController.js');
require('./controllers/teethController.js');
require('./controllers/notesController.js');
require('./controllers/rolesSelectorController.js');
require('./controllers/userAddressesController.js');
require('./controllers/notificationAreaController.js');
require('./controllers/supportController.js');
require('./services/imageUtils.js');
require('./services/logger.js');

require('./app.js');

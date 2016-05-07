angular.module('dentalLinksDirectives')
// Angular File Upload module does not include this directive
// Only for example
.directive('access', [ 'Auth', 'USER_ROLES', function (Auth, USER_ROLES) {
    return {
        restrict: 'A',
        link: function (scope, $element, attrs) {
            var prevDisp = $element.css('display');
            if (!Auth.authorize(attrs.access.split(/[,\s]+/)))
                $element.css('display', 'none');
            else
                $element.css('display', prevDisp);
        }
    }
}])

.directive('accessEnable', [ 'Auth', 'USER_ROLES', function (Auth, USER_ROLES) {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            var prevDisabled = $element.prop('disabled');
            if (!Auth.authorize(attrs.accessEnable.split(/[,\s]+/)))
                $element.prop('disabled', true);
            else
                $element.prop('disabled', prevDisabled);
        }
    }
}])

.directive('expandNote', [function () {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            $element.children('.note-expand').on('click', function () {
                $element.toggleClass('expand');
            });

        }
    }

}])

.directive('stateSelect', [function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/state_select.html',
        scope: {
            'class': '@',
            'disabled': '@',
            'address': '='
        }/*,
        link: function(scope, element, attributes){
            scope.disabled = attributes.ngDisabled;
            scope.class = attributes.ngClass;
        }*/
    }
}])

.directive('attachmentThumb', ['$window', 'Auth', function ($window, Auth) {
    return {
        link: function (scope, element, attributes) {
            var type = attributes.attachmentThumb.slice(attributes.attachmentThumb.lastIndexOf('.') + 1);
            var cssClass;
            switch (type.toLowerCase()) {
                case 'doc':
                case 'docx':
                    cssClass = 'attach-word';
                    break;
                case 'xls':
                case 'xlsx':
                    cssClass = 'attach-excel';
                    break;
                case 'pdf':
                    cssClass = 'attach-pdf';
                    break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    if (/trident/i.test($window.navigator.userAgent)){
                    //TODO: workaround for https://www.pivotaltracker.com/story/show/86373800. Need to change that to use cookies for image authentication.
                        var auth = Auth.get();
                        element.attr( 'style',  "background: url(" + attributes.attachmentThumb + '&token=' + auth.token + '&from=' + auth.email + "&is_thumb=true) no-repeat top/contain, url('img/loader.gif') no-repeat top");
                        cssClass = '';
                    }else{
                        element.attr( 'style',  "background: url('img/loader.gif') no-repeat top");
                        angular.element('<img/>').attr('src', attributes.attachmentThumb + "&is_thumb=true").load(function() {
                            angular.element(this).remove();
                            element.attr('style', "background: url(" + attributes.attachmentThumb + "&is_thumb=true) no-repeat top/contain");
                        });
                        cssClass = '';
                    }
                    break;
                default :
                    cssClass = 'attach-file';

            }
            element.addClass(cssClass);
        }
    }
}])

.directive('ngThumb', ['$window', 'ImageUtils', function ($window, ImageUtils) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            /*if (!helper.isImage(params.file)) return;*/

            if (!helper.isImage(params.file)) {
                var type = params.file.name.slice(params.file.name.lastIndexOf('.') + 1);
                var cssClass = '';
                switch (type.toLowerCase()) {
                    case 'docx':
                    case 'doc':
                        cssClass = 'attach-word';
                        break;
                    case 'pdf':
                        cssClass = 'attach-pdf';
                        break;
                    case 'xlsx':
                    case 'xls':
                        cssClass = 'attach-excel';
                        break;
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        cssClass = '';
                    break;
                    default :
                        cssClass = 'attach-file';
                }
                element.addClass(cssClass)
            }
            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var canvasImgDimensions = ImageUtils.resizeImageKeepingAspectRatio({width: this.width, height: this.height}, params.longEdgeSize);
                canvas.attr({ width: canvasImgDimensions.width, height: canvasImgDimensions.height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, canvasImgDimensions.width, canvasImgDimensions.height);
            }
        }
    };
}])

.directive('dateRangePicker', ['$parse', function($parse){
    return {
        restrict: 'A',
        link: function (scope, $element, attrs){
            var dateRangeCallback = $parse(attrs.dateRangePicker);
            $element.daterangepicker(
                {
                    startDate: moment(0),
                    endDate: moment().endOf('day'),
                    ranges: {
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'All': [moment(0), moment().endOf('day')] // not sure what formula to use
                    }
                },
                function(start, end) {
                    if (start.format('MMMM D, YYYY') == moment(0).format('MMMM D, YYYY') && end.format('MMMM D, YYYY') == moment().endOf('day').format('MMMM D, YYYY')) {
                        $element.find('span').html('All');
                    } else {
                        $element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));    
                    }
                    dateRangeCallback(scope, {start: start, end: end});
                }
            );

            $element.find('span').html('All');
        }
    }
}])

.directive('editForm', [function () {
    return {
        restrict: 'A',
        scope: {
            source: '=editForm',
            showLabels: '='
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            if(typeof $scope.showLabels === 'undefined') {
                $scope.showLabels = false;
            }
            //we now can't store pre-found input and select elements as a variables because of ng-repeat directive for multiple addresses (it doesn't find elements inside ng-repeat)
            this.enableControls = function () {
                $element.find('input').removeClass('data1').removeAttr('disabled');
                $element.find('select').removeClass('data1').removeAttr('disabled');
                if(!$scope.showLabels) {
                    $element.find('label').removeClass('hidden');
                }
            };
            this.disableControls = function () {
                $element.find('input').addClass('data1').attr('disabled', 'disabled');
                $element.find('select').addClass('data1').attr('disabled', 'disabled');
                if(!$scope.showLabels) {
                    $element.find('label').addClass('hidden');
                }
            };
        }]
    }
}])

.directive('deleteButton', [function () {
    return {
        scope: {},
        restrict: 'A',
        link: function (scope, $element, attrs) {

            $element.on('click', function () {
                angular.element('.btn-delete.active').each(function(key, value){
                    if($element.get(0) != angular.element(value).get(0)) {
                        angular.element(value).toggleClass('active');
                    }
                });
                $element.toggleClass('active');
            });
        }
    }

}])

.directive('toggleEdit', ['PracticeEditMode', function (PracticeEditMode) {
    return {
        scope: {},
        restrict: 'A',
        require: ['^editForm', '^form'],
        link: function (scope, $element, attrs, formCtrls) {

            var editFormCtrl = formCtrls[0];
            var formCtrl = formCtrls[1];
            var editButton = $element;
            var addAddressButton = $element.next();
            var saveButton = $element.next().next();
            // edit
            editButton.on('click', function (e) {
                PracticeEditMode.init(editFormCtrl, formCtrl, editButton, addAddressButton, saveButton);
                PracticeEditMode.on();
            });

            // save
            saveButton.on('click', function (e) {
                PracticeEditMode.init(editFormCtrl, formCtrl, editButton, addAddressButton, saveButton);
                PracticeEditMode.off();
            });

            if(attrs.toggleEdit){
                editButton.triggerHandler('click');
            }
        }
    }

}])

.directive('ngFocusMe', ['$parse', '$timeout', function($parse, $timeout){
    return {
        restrict: 'AC',
        link: function(scope, element, attrs){
            $timeout(function() {
                element[0].focus();
            }, 100);
        }
    }
}])

.directive('focusPassword', [function(){
    return {
        restrict: 'A',
        link: function(scope, element){
            scope.$on("focusPassword", function() {
                    element[0].focus();

            });
        }
    }
}])

.directive('ngCtrlEnter', ['$parse', '$timeout', function($parse, $timeout){
    return {
        restrict: 'AC',
        link: function(scope, element, attrs){
            
            element.bind("keydown keypress", function(event) {
                if(event.which === 13 && event.ctrlKey == true) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngCtrlEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        }
    }
}])

.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.stopEvent, function (e) {
                e.preventDefault();
                e.stopPropagation();

            });
        }
    };
})

.directive('attachments', [function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/attachments.html',
        controller: 'AttachmentsController'
    }

}])

.directive('teethChart', [function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/teeth_chart.html',
        controller: 'TeethController'
    }

}])

.directive('notes', [function () {
    return {
        restrict: 'E',
        scope: {
            inputModel : '=',
            immediateUpdate : '='
        },
        templateUrl: 'partials/notes.html',
        controller: 'NotesController'
    };
}])

.directive('dynamicHtml', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, element, attrs) {
        scope.$watch(attrs.dynamicHtml, function(html) {
        element.html(html);
        $compile(element.contents())(scope);
      });
    }
  };
}])

.directive('rolesSelector', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputMask : '=',
            defaultRoles : '=',
            showRoles : '='
        },
        templateUrl: 'partials/roles_selector.html',
        controller: 'RolesSelectorController'
    };
}])

.directive('userAddresses', [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            user: '=',
            practiceAddresses: '='
        },
        templateUrl: 'partials/user_addresses.html',
        controller: 'UserAddressesController'
    };
}])

.directive('phoneFormatter', ['$compile', function($compile){
    return {
        terminal: true,
        priority: 1000,
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$set('ui-mask', '(999) 999-9999');
            attrs.$set('placeholder', '(xxx) xxx-xxxx');
            element.removeAttr('phone-formatter');
            $compile(element)(scope);
        }
    };
}]);

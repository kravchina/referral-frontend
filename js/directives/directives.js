var dentalLinksDirectives = angular.module('dentalLinksDirectives', ['angularFileUpload']);
// Angular File Upload module does not include this directive
// Only for example

dentalLinksDirectives.directive('access', [ 'Auth', function (Auth) {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            var prevDisp = $element.css('display');
            if (!Auth.authorize(attrs.access.split(/[,\s]+/)))
                $element.css('display', 'none');
            else
                $element.css('display', prevDisp);
        }
    }
}]);

dentalLinksDirectives.directive('expandNote', [function () {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            $element.on('click', function () {
                $element.toggleClass('expand');
            });

        }
    }

}]);


dentalLinksDirectives.directive('pdfPhotos', ['Auth', 'PDF', 'File', 'Logger', function (Auth, PDF, File, Logger) {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            if (Auth.authorize(attrs.access.split(/[,\s]+/))) {
                if(!File.isImage(scope.attachment.filename)){
                    PDF.addImage(scope.$index, null, scope.attachment);
                }
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function () {
                    PDF.addImage(scope.$index, img, scope.attachment);
                };
                img.src = scope.host + '/attachment/?file=' + scope.attachment.filenameToDownload;
                Logger.log('Loading image ' + img.src);
            }
        }
    }
}]);

dentalLinksDirectives.directive('attachmentThumb', [function () {
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
                    element.attr( 'style',  "background-image: url('" + attributes.attachmentThumb + "&is_thumb=true')");
                    cssClass = '';
                    break;
                default :
                    cssClass = 'attach-file';

            }
            element.addClass(cssClass);
        }
    }
}]);

/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
dentalLinksDirectives.directive('ngThumb', ['$window', 'ImageUtils', function ($window, ImageUtils) {
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
}]);

dentalLinksDirectives.directive('dateRangePicker', ['$parse', function($parse){
    return {
        restrict: 'A',
        link: function (scope, $element, attrs){
            var dateRangeCallback = $parse(attrs.dateRangePicker);
            $element.daterangepicker(
                {
                    startDate: moment().subtract('days', 29),
                    endDate: moment(),
                    ranges: {
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'All': [moment(0), moment().endOf('day')] // not sure what formula to use
                    }
                },
                function(start, end) {
                    $element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                    dateRangeCallback(scope, {start: start, end: end});
                }
            );

            $element.find('span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        }
    }
}]);

dentalLinksDirectives.directive('editForm', [function () {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element) {
            var inputs = $element.find('input');
            var selects = $element.find('select');
            this.enableControls = function () {
                inputs.removeClass('data1');
                inputs.removeAttr('disabled');
                selects.removeClass('data1');
                selects.removeAttr('disabled');
            };
            this.disableControls = function () {
                inputs.addClass('data1');
                inputs.attr('disabled', 'disabled');
                selects.addClass('data1');
                selects.attr('disabled', 'disabled');
            };
        }
    }
}]);

dentalLinksDirectives.directive('deleteButton', [function () {
    return {
        scope: {},
        restrict: 'A',
        link: function (scope, $element, attrs) {

            $element.on('click', function () {
                $element.toggleClass('active');
            });
        }
    }

}]);

dentalLinksDirectives.directive('toggleEdit', function () {
    return {
        scope: {},
        restrict: 'A',
        require: '^editForm',
        link: function (scope, $element, attrs, editFormCtrl) {

            var editButton = $element;
            var saveButton = $element.next();

            // edit
            editButton.on('click', function (e) {
                editButton.addClass('hide');
                saveButton.removeClass('hide');
                editFormCtrl.enableControls();
            });

            // save
            saveButton.on('click', function (e) {
                editButton.removeClass('hide');
                saveButton.addClass('hide');
                editFormCtrl.disableControls();
            });

        }
    }

});

dentalLinksDirectives.directive('ngFocusMe', ['$parse', '$timeout', function($parse, $timeout){
    return {
        restrict: 'AC',
        link: function(scope, element, attrs){
            
            $timeout(function() {
                console.log(element[0]);
                element[0].focus(); 
            }, 100);
        }
    }
}]);

dentalLinksDirectives.directive('ngCtrlEnter', ['$parse', '$timeout', function($parse, $timeout){
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
}]);

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

dentalLinksDirectives.directive('toggleEdit', [function () {
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

}]);

dentalLinksDirectives.directive('dateRangePicker', [function(){
    return {
        scope: {},
        restrict: 'A',
        link: function (scope, $element, attrs){
            $element.daterangepicker(
                {
                    startDate: moment().subtract('days', 29),
                    endDate: moment(),
                    ranges: {
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'All': [moment().startOf('days'), moment().endOf('days')] // not sure what formula to use
                    }
                },
                function(start, end) {
                    $element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                }
            );

            $element.find('span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        }
    }
}]);

dentalLinksDirectives.directive('pdfPhotos', ['Auth', 'PDF', function (Auth, PDF) {
    return {
        scope: true,
        restrict: 'A',
        link: function (scope, $element, attrs) {
            var img = $element[0];
            if (Auth.authorize(attrs.access.split(/[,\s]+/))) {
                img.onload = function () {
                    PDF.addImage(scope.$index, img, scope.attachment.notes);
                };
            }
        }
    }
}]);

/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
dentalLinksDirectives.directive('ngThumb', ['$window', function ($window) {
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
                var type = '|' + params.file.type.slice(params.file.type.lastIndexOf('/') + 1) + '|';
                var cssClass = '';
                switch (type) {
                    case '|doc|':
                        cssClass = 'attach-word';
                        break;
                    case '|pdf|':
                        cssClass = 'attach-pdf';
                        break;
                    case '|xls|':
                        cssClass = 'attach-excel';
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
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

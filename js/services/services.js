/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

var host = 'http://localhost:3000';
//var host = 'http://referral-server.herokuapp.com';

dentalLinksServices.factory('Auth', ['$cookieStore', function ($cookieStore) {
    return {
        authorize: function (roles) {
            if (roles === undefined) {
                return true;
            }
            //var auth = $cookieStore.get('auth') || {};
            var auth = {};
            if($.cookie('auth') != undefined){
                auth = $.parseJSON($.cookie('auth'));
            }

            if (auth.roles) {
                for (var i = 0; i < roles.length; i++) {
                    if (auth.roles.indexOf(roles[i]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        get: function () {
            //return $cookieStore.get('auth');
            if($.cookie('auth') != undefined){
                return $.parseJSON($.cookie('auth'));
            }
            return undefined;
        },
        set: function (value) {
            $.cookie('auth', JSON.stringify(value), {expires: 1/48});
            //$cookieStore.put('auth', value);
        },
        remove: function(){
            $cookieStore.remove('auth');
        }
    };
}]);

dentalLinksServices.factory('Alert', ['$timeout', function($timeout){
    return {
        push: function(alerts, type, message){
            var alert = { type: type, message: message, promise: $timeout(function () {
                alerts.splice(alerts.indexOf(alert), 1);
            }, 5000) };
            alerts.push(alert);

        },
        close: function(alerts, index){
            $timeout.cancel(alerts[index].promise); //cancel automatic removal
            alerts.splice(index, 1);
        }
    }
}]);

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId', {}, {
            searchPractice: {method: 'GET', url: host + '/practices/search', isArray: true},
            update: {method: 'PUT'}
        });
    }]);


dentalLinksServices.factory('PracticeInvitation', ['$resource',
    function ($resource) {
        return $resource(host + '/practice_invitations/:id');
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients/:id', {}, {
        searchPatient: {method: 'GET', url: host + '/patients/search', isArray: true}
    });
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals/:id', {id: '@id'}, {
        saveTemplate: {method: 'POST', url: host + '/referrals/new/template'},
        update: {method: 'PUT'},
        updateStatus: {method: 'PUT', url: host + '/referrals/:id/status'},
        findByPractice: {method: 'GET', url: host + '/referrals/practice/:id', isArray: true}
    });
}]);

dentalLinksServices.factory('Login', ['$resource', function ($resource) {
    return $resource(host + '/sign_in', {}, {
        login: { method: 'POST'},
        logout: {method: 'DELETE', url: host + '/sign_out'}
    });
}]);

dentalLinksServices.factory('Password', ['$resource', function ($resource) {
    return $resource(host + '/password', {}, {
        reset: {method: 'POST'},
        change: {method: 'PUT'}
    })
}]);

dentalLinksServices.factory('S3Bucket', ['$resource', function ($resource) {
    return $resource(host + '/s3', {}, {
        getCredentials: {method: 'GET'}
    });
}]);

dentalLinksServices.factory('Note', ['$resource', function ($resource) {
    return $resource(host + '/notes');
}]);

dentalLinksServices.factory('Attachment', ['$resource', function ($resource) {
    return $resource(host + '/attachments');
}]);

dentalLinksServices.factory('Procedure', ['$resource', function($resource){
 return $resource(host + '/procedures', {}, {
     practiceTypes: {method: 'GET', url: host + '/practice_types', isArray: true}
 })
}]);

dentalLinksServices.factory('Provider', ['$resource', function($resource){
 return $resource(host + '/users/:id');
}]);

dentalLinksServices.factory('User', ['$resource', function($resource){
    return $resource(host + '/users/:id', {}, {
        getInvitees: {method:'GET',url: host + '/invitees/:user_id', isArray: true},
        update: {method: 'PUT' }
    })
}]);

dentalLinksServices.factory('PDF', [function () {
    var pdf;
    var paragraphs;
    var images;
    var notes;
    var font =
        ['Times', 'Roman'];
    var size = 16;
    var imageStart = {
        x: 10, y: 60
    };
    var paragraphStart = {
        x: 10, y: 10
    };
    var buildPdf = function () {
        var caret = 18;
        var pdf = new jsPDF();
        pdf.setFontSize(size);
        //printing start paragraphs with referral information
        for (var i = 0; i < paragraphs.length; i++) {
            var lines = pdf.splitTextToSize(paragraphs[i], 190);
            pdf.text(paragraphStart.x, caret, lines);
            caret += 3 + lines.length * size / pdf.internal.scaleFactor ;
        }
        caret += 10;

        //printing notes
        pdf.text(paragraphStart.x, caret, 'Notes:');
        caret += 10;
        for (var k = 0; k < notes.length; k++) {
            var noteLines = pdf.splitTextToSize(notes[k].message, 190);
            pdf.text(paragraphStart.x, caret, noteLines);
            caret += 3 + noteLines.length * size / pdf.internal.scaleFactor;
        }

        if (images.length > 0) {
            //printing image attachments
            caret += 16;
            pdf.text(paragraphStart.x, caret, 'Attachments:');
            caret += 10;
            for (var j = 0; j < images.length; j++) {
                if(!images[j]){
                    continue;
                }
                var image = images[j].image;
                var note = images[j].note;
                var aspectRatio = image.width / image.height;
                if (caret + (190 / aspectRatio) > 287 /*end of the A4 paper including margin 10mm*/) {
                    pdf.addPage();
                    caret = 10;
                }
                pdf.addImage(image, 'JPEG', imageStart.x, caret, 190, 190 / aspectRatio);
                caret += 190 / aspectRatio;
                if (note) {
                    caret += 5;
                    pdf.text(paragraphStart.x, caret, note);
                }
                caret += 10;
            }
        }
        return pdf;

    };
    return {
        init: function(){
            paragraphs = [];
            images = [];
            notes = [];
        },
        addParagraph: function (text) {
            paragraphs.push(text);
        },
        addImage: function (index, image, text) {
            while (index >= images.length) {
                images[images.length] = null;
            }
            images.splice(index, 1, {image: image, note: text});
        },
        addNotes: function (notesArray) {
            notes = notesArray;
        },
        getEmbeddableString: function () {
            return buildPdf().output('datauristring');
        },
        save: function (filename) {
            buildPdf().save(filename);
        }
    }
}]);

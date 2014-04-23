/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

//var host = 'http://localhost:3000';
var host = 'http://referral-server.herokuapp.com';

dentalLinksServices.factory('Auth', ['$window', function ($window) {
    return {
        authorize: function (roles) {
            if (roles === undefined) {
                return true;
            }
            if ($window.sessionStorage.roles) {
                for (var i = 0; i < roles.length; i++) {
                    if ($window.sessionStorage.roles.indexOf(roles[i]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

}]);

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId', {}, {
            searchPractice: {method: 'GET', url: host + '/practices/search', isArray: true}
        });
    }]);


dentalLinksServices.factory('PracticeInvitation', ['$resource',
    function ($resource) {
        return $resource(host + '/practice_invitations/:id');
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients/:id');
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals/:id', {id: '@id'}, {
        updateStatus: {method: 'PUT', url: host + '/referrals/:id/status'}
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

dentalLinksServices.factory('PDF', [function () {
    var pdf;
    var paragraphs = [];
    var images = [];
    var notes = [];
    var font =
        ['Times', 'Roman'];
    var size = 16;
    var imageStart = {
        x: 10, y: 60
    };
    var paragraphStart = {
        x: 10, y: 10
    };
    var caret = 10;
    var buildPdf = function () {
        var pdf = new jsPDF();
        //printing start paragraphs with referral information
        for (var i = 0; i < paragraphs.length; i++) {
            caret += 8;
            pdf.text(paragraphStart.x, caret, paragraphs[i]);
        }
        caret += 16;

        //printing notes
        pdf.text(paragraphStart.x, caret, 'Notes:');
        for (var k = 0; k < notes.length; k++) {
            caret += 8;
            pdf.text(paragraphStart.x, caret, notes[k].message);
        }

        if (images.length > 0) {
            //printing image attachments
            caret += 16;
            pdf.text(paragraphStart.x, caret, 'Attachments:');
            caret += 10;
            for (var j = 0; j < images.length; j++) {
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

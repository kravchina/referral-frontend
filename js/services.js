/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

//var host = 'http://localhost:3000';
var host = 'http://referral-server.herokuapp.com';

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId');
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
    var totalImages;
    var processedImages;
    var font =
        ['Times', 'Roman'];
    var size = 16;
    var lastImagePosition = {
        x: 10, y: 10
    };
    var lastParagraphPosition = {
        x: 10, y:10
    };
    return {
        create: function () {
            pdf = new jsPDF();
            return pdf;
        },
        addParagraph: function (text) {
            pdf = pdf || new jsPDF();
            pdf.text(lastParagraphPosition.x, lastParagraphPosition.y, text);
            lastParagraphPosition.y+= 20;
            return pdf;
        },
        addImage: function (index, image, text) {
            pdf = pdf || new jsPDF();
            var aspectRatio = image.width/image.height;
            if(lastImagePosition.y + (190/aspectRatio * index) + 190/aspectRatio > 287 /*end of the A4 paper including margin 10mm*/){
                pdf.addPage();
                pdf.addImage(image, 'JPEG', lastImagePosition.x, lastImagePosition.y, 190, 190/aspectRatio);

            }
            pdf.addImage(image, 'JPEG', lastImagePosition.x, lastImagePosition.y + (190/aspectRatio * index), 190, 190/aspectRatio);
            //lastImagePosition.y += 50;
            processedImages = processedImages || 0;
            processedImages++;
            return pdf;
        },
        getEmbeddableString: function () {
            return pdf.output('datauristring');
        },
        setTotalImages: function(number){
            totalImages = number;
        },
        imagesReady: function(){
            return totalImages == processedImages;
        },
        save: function(filename){
            pdf.save(filename);
        }

    }
}]);

dentalLinksServices.factory('ImageService', [function () {
    var images = [];
    return {
        getImages: function () {
            return images;
        },
        addImage: function(image, index){
            images.splice(index, 0, image);
        }

    }
}]);
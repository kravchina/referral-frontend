angular.module('dentalLinks')
    .service('ImageUtils', function() {
    this.resizeImage = function(imageDimensions, exptdDimensions) {
        var imageRatio = imageDimensions.width / imageDimensions.height;
        var exptdRatio = exptdDimensions.width / exptdDimensions.height;
        
        var result = {};
        
        if (imageRatio > exptdRatio) {
            // resizing by width
            result.width = exptdDimensions.width;
            result.height = result.width / imageRatio;
        } else {
            // resizing by height
            result.height = exptdDimensions.height;
            result.width = result.height * imageRatio;
        }
        
        return result;
    };

    this.resizeImageKeepingAspectRatio = function(imageDimensions, expectedLongEdgeSize){
        return this.resizeImage(imageDimensions, {width: expectedLongEdgeSize, height:expectedLongEdgeSize});
    };
    
});

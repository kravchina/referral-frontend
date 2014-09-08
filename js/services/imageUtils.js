var imageUtils = angular.module('imageUtils', []);

dentalLinks.service('ImageUtils', function() {
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
    
    this.resizeImageTest = function() {
        var t;
        t = this.resizeImage({width: 3, height: 3}, {width: 3, height: 3});
        console.log('===== ', t.width == 3 && t.height == 3);
        t = this.resizeImage({width: 4, height: 2}, {width: 4, height: 6});
        console.log('===== ', t.width == 4 && t.height == 2);
        t = this.resizeImage({width: 1, height: 2}, {width: 2, height: 4});
        console.log('===== ', t.width == 2 && t.height == 4);
        t = this.resizeImage({width: 1, height: 2}, {width: 2, height: 2});
        console.log('===== ', t.width == 1 && t.height == 2);
        t = this.resizeImage({width: 1, height: 2}, {width: 1, height: 3});
        console.log('===== ', t.width == 1 && t.height == 2);
        t = this.resizeImage({width: 2, height: 2}, {width: 4, height: 6});
        console.log('===== ', t.width == 4 && t.height == 4);
        t = this.resizeImage({width: 2, height: 2}, {width: 6, height: 4});
        console.log('===== ', t.width == 4 && t.height == 4);
        
        t = this.resizeImage({width: 2, height: 4}, {width: 1, height: 3});
        console.log('===== ', t.width == 1 && t.height == 2);
        t = this.resizeImage({width: 2, height: 4}, {width: 2, height: 2});
        console.log('===== ', t.width == 1 && t.height == 2);
        t = this.resizeImage({width: 4, height: 4}, {width: 2, height: 2});
        console.log('===== ', t.width == 2 && t.height == 2);
        t = this.resizeImage({width: 8, height: 4}, {width: 2, height: 2});
        console.log('===== ', t.width == 2 && t.height == 1);
        t = this.resizeImage({width: 4, height: 8}, {width: 2, height: 2});
        console.log('===== ', t.width == 1 && t.height == 2);
    };
    
});

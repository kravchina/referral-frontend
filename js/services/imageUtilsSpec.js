describe('imageUtils', function() {
    var imageUtils;
    
    beforeEach(function() {
        module('dentalLinks'); // yes, imageUtils service is for some reason declared in module 'dentalLinks', not 'imageUtils'
        inject(function(_ImageUtils_) {
            imageUtils = _ImageUtils_;
        });
    });
    
    it('keeps square the same if it\'s blocked on both X and Y', function() {
        var t = imageUtils.resizeImage({width: 3, height: 3}, {width: 3, height: 3});
        expect(t.width).toEqual(3);
        expect(t.height).toEqual(3);
    });

    it('keeps horizontal rectangle the same if it\'s blocked on X', function() {
        var t = imageUtils.resizeImage({width: 4, height: 2}, {width: 4, height: 6});
        expect(t.width).toEqual(4);
        expect(t.height).toEqual(2);
    });

    it('enlarges rectangle fitting both X and Y if possible', function() {
        var t = imageUtils.resizeImage({width: 1, height: 2}, {width: 2, height: 4});
        expect(t.width).toEqual(2);
        expect(t.height).toEqual(4);
    });

    it('keeps vertical rectangle the same if its blocked on Y', function() {
        var t = imageUtils.resizeImage({width: 1, height: 2}, {width: 2, height: 2});
        expect(t.width).toEqual(1);
        expect(t.height).toEqual(2);
    });

    it('keeps vertical rectangle the same if its blocked on X', function() {
        var t = imageUtils.resizeImage({width: 1, height: 2}, {width: 1, height: 3});
        expect(t.width).toEqual(1);
        expect(t.height).toEqual(2);
    });

    it('enlarges rectangle fitting X', function() {
        var t = imageUtils.resizeImage({width: 2, height: 2}, {width: 4, height: 6});
        expect(t.width).toEqual(4);
        expect(t.height).toEqual(4);
    });

    it('enlarges rectangle fitting Y', function() {
        var t = imageUtils.resizeImage({width: 2, height: 2}, {width: 6, height: 4});
        expect(t.width).toEqual(4);
        expect(t.height).toEqual(4);
    });

    it('shrinks vertical rectangle fitting X', function() {
        var t = imageUtils.resizeImage({width: 2, height: 4}, {width: 1, height: 3});
        expect(t.width).toEqual(1);
        expect(t.height).toEqual(2);
    });

    it('shrinks small vertical rectangle fitting Y', function() {
        var t = imageUtils.resizeImage({width: 2, height: 4}, {width: 2, height: 2});
        expect(t.width).toEqual(1);
        expect(t.height).toEqual(2);
    });

    it('shrinks square fitting both X and Y if possible', function() {
        var t = imageUtils.resizeImage({width: 4, height: 4}, {width: 2, height: 2});
        expect(t.width).toEqual(2);
        expect(t.height).toEqual(2);
    });

    it('shrinks horizontal rectangle fitting X', function() {
        var t = imageUtils.resizeImage({width: 8, height: 4}, {width: 2, height: 2});
        expect(t.width).toEqual(2);
        expect(t.height).toEqual(1);
    });

    it('shrinks large vertical rectangle fitting Y', function() {
        var t = imageUtils.resizeImage({width: 4, height: 8}, {width: 2, height: 2});
        expect(t.width).toEqual(1);
        expect(t.height).toEqual(2);
    });

});

System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var _bbs, _sourceImage, _sourceCanvas, _normalizedCanvas, _sourceContext, _normalizedContext, MaxNormWidth, SudokuRendererComponent;
    function doSomeImageProcessing() {
        var normImg = normalizeImage();
        _bbs = normImg;
        //_bbs = this.normalizeImage();
        // detects the angle of rotation
        var strongestLine, grid, digits;
        if ((strongestLine = _bbs.houghTransformCenter()) &&
            (grid = _bbs.detectRect(strongestLine.theta))) {
            digits = _bbs.ocr();
            console.log("OCR-ed grid\n", digits.join('\n ')
                .replace(/,/g, ' ')
                .replace(/0/g, '.'));
            /*var theCallback = this.digitsCallback;
            setTimeout(function() {
                theCallback(digits);
            }, 0);*/
            this.digitsCallback(digits);
        }
        else {
            console.log("Couldn't find a sudoku board in that image..");
            return;
        }
    }
    function normalizeImage() {
        var img = _sourceImage, imgW = img.naturalWidth || img.width, imgH = img.naturalHeight || img.height;
        //"Normalized" width and height:
        var w = imgW, h = imgH;
        if ((w > MaxNormWidth) || (h > MaxNormWidth)) {
            var shrink = MaxNormWidth / Math.max(imgW, imgH);
            w = Math.round(w * shrink);
            h = Math.round(h * shrink);
        }
        var imgData, pixels, bbs, pixelsMono, index, r, g, b;
        // Draw the image onto a canvas so we can read the individual pixels:
        //
        console.log('Resizing', [imgW, imgH], '->', [w, h]);
        _normalizedCanvas.width = _sourceCanvas.width = w;
        _normalizedCanvas.height = _sourceCanvas.height = h;
        _sourceContext.drawImage(img, 0, 0, w, h);
        // Create 2D array with BBSud pixels
        //
        imgData = _sourceContext.getImageData(0, 0, w, h);
        console.log('Read image data...');
        pixels = [];
        //If anything, a bit slower...
        //  pixels = ABOUtils.initArray({ length: h, factory: function() {
        //    return ABOUtils.initArray({ length: w });
        //  }});
        index = 0;
        for (var y = 0; y < h; ++y) {
            if (!(y % 100)) {
                console.log('Reading row ' + y);
            }
            var row = [];
            pixels.push(row);
            for (var x = 0; x < w; ++x) {
                //var index = (y * w + x) * 4; // index of the current pixel
                r = imgData.data[index];
                g = imgData.data[index + 1];
                b = imgData.data[index + 2];
                //a = imgData.data[index + 3];
                index += 4;
                row.push(new BBSud.Pixel(r, g, b));
            }
        }
        console.log('Extracted pixels...');
        // Create a monochrome image and redraw:
        //
        bbs = new BBSud.SudBitmap({
            image: pixels,
            setPixel: renderPixel
        });
        pixelsMono = bbs.monochrome();
        console.log('B/W image...');
        for (var y = 0; y < h; ++y) {
            for (var x = 0; x < w; ++x) {
                var index_1 = (y * w + x) * 4; // index of the current pixel
                var mono = pixelsMono[y][x];
                imgData.data[index_1] = mono;
                imgData.data[index_1 + 1] = mono;
                imgData.data[index_1 + 2] = mono;
                imgData.data[index_1 + 3] = 255;
            }
        }
        _normalizedContext.putImageData(imgData, 0, 0);
        return bbs;
    }
    function renderPixel(point, pixel) {
        var x = Math.round(point.x), y = Math.round(point.y);
        //_normContext.save();
        _normalizedContext.fillStyle = (pixel.alpha === undefined) ?
            "rgb(" + [pixel.red, pixel.green, pixel.blue] + ")" :
            "rgba(" + [pixel.red, pixel.green, pixel.blue, pixel.alpha] + ")";
        _normalizedContext.fillRect(x, y, 1, 1);
        //_normContext.restore()
    }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
             //BBSud.SudBitmap
            MaxNormWidth = 500;
            SudokuRendererComponent = (function () {
                function SudokuRendererComponent() {
                }
                SudokuRendererComponent.prototype.ngAfterViewInit = function () {
                    _sourceImage = new Image();
                    //http://stackoverflow.com/questions/18474727/canvas-has-been-tainted-by-cross-origin-data-work-around
                    _sourceImage.crossOrigin = "anonymous";
                    //_sourceImage.onload = doSomeImageProcessing(null);
                    //_sourceImage.onload = doSomeImageProcessing;
                    _sourceCanvas = this.mySourceCanvas.nativeElement;
                    _normalizedCanvas = this.myNormalizedCanvas.nativeElement;
                    _sourceContext = _sourceCanvas.getContext("2d");
                    _normalizedContext = _normalizedCanvas.getContext("2d");
                };
                SudokuRendererComponent.prototype.renderBoardImage = function (inImageURL, inCallback, inBoardComponent) {
                    //_sourceImage.onload = doSomeImageProcessing(inCallback);
                    _sourceImage.digitsCallback = inCallback;
                    _sourceImage.boardComponent = inBoardComponent;
                    _sourceImage.onload = doSomeImageProcessing;
                    _sourceImage.src = inImageURL;
                    _sourceImage.setAttribute('class', 'loaded');
                };
                __decorate([
                    core_1.ViewChild('sourceCanvas'), 
                    __metadata('design:type', Object)
                ], SudokuRendererComponent.prototype, "mySourceCanvas", void 0);
                __decorate([
                    core_1.ViewChild('normalizedCanvas'), 
                    __metadata('design:type', Object)
                ], SudokuRendererComponent.prototype, "myNormalizedCanvas", void 0);
                SudokuRendererComponent = __decorate([
                    core_1.Component({
                        selector: 'renderer-cmp',
                        providers: [],
                        template: "\n        <div id=\"canvasWrapper\" hidden>\n            <canvas #sourceCanvas id=\"source\"></canvas>\n            <canvas #normalizedCanvas id=\"normalized\"></canvas>\n        </div>\n    ",
                        styleUrls: [],
                        directives: [],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], SudokuRendererComponent);
                return SudokuRendererComponent;
            }());
            exports_1("SudokuRendererComponent", SudokuRendererComponent);
        }
    }
});
//# sourceMappingURL=boardRenderer.component.js.map
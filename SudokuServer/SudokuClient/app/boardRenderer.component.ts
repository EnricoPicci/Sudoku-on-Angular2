declare var BBSud: any;

var _bbs; //BBSud.SudBitmap

var _sourceImage;
var _sourceCanvas;
var _normalizedCanvas;
var _sourceContext;
var _normalizedContext;
var MaxNormWidth = 500;

import {Component, ViewChild} from 'angular2/core';

@Component({
    selector: 'renderer-cmp',
	providers: [],
    template: `
        <div id="canvasWrapper" hidden>
            <canvas #sourceCanvas id="source"></canvas>
            <canvas #normalizedCanvas id="normalized"></canvas>
        </div>
    `,
    styleUrls: [],
	directives: [],
    inputs: []
})
export class SudokuRendererComponent {
    @ViewChild('sourceCanvas') mySourceCanvas;
    @ViewChild('normalizedCanvas') myNormalizedCanvas;
    
    ngAfterViewInit() {
        _sourceImage = new Image();
        //http://stackoverflow.com/questions/18474727/canvas-has-been-tainted-by-cross-origin-data-work-around
        _sourceImage.crossOrigin = "anonymous";
        //_sourceImage.onload = doSomeImageProcessing(null);
        //_sourceImage.onload = doSomeImageProcessing;
        
        _sourceCanvas = this.mySourceCanvas.nativeElement;
        _normalizedCanvas = this.myNormalizedCanvas.nativeElement;
        _sourceContext = _sourceCanvas.getContext("2d");
        _normalizedContext = _normalizedCanvas.getContext("2d");
        
    }
    
    public renderBoardImage(inImageURL: string, inCallback: any) {
        //_sourceImage.onload = doSomeImageProcessing(inCallback);
        _sourceImage.digitsCallback = inCallback;
        _sourceImage.onload = doSomeImageProcessing;
        _sourceImage.src = inImageURL;
        _sourceImage.setAttribute('class', 'loaded');
    }
    
}

    function doSomeImageProcessing() {
        var normImg = normalizeImage();
        _bbs = normImg;
        //_bbs = this.normalizeImage();

        // detects the angle of rotation
        var strongestLine,
            grid, digits;

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
            //this.digitsCallback(digits);
        } else {
            console.log("Couldn't find a sudoku board in that image..");
            //return;
        }
        this.digitsCallback(digits);
    }

    function normalizeImage() {
        var img = _sourceImage,
            imgW = img.naturalWidth || img.width,
            imgH = img.naturalHeight || img.height;

        //"Normalized" width and height:
        var w = imgW,
            h = imgH;
        if ((w > MaxNormWidth) || (h > MaxNormWidth)) {
            var shrink = MaxNormWidth / Math.max(imgW, imgH);
            w = Math.round(w * shrink);
            h = Math.round(h * shrink);
        }

        var imgData, pixels, bbs, pixelsMono,
            index, r, g, b;

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
                //pixels[y][x] = new BBSud.Pixel(r, g, b);
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
                let index = (y * w + x) * 4; // index of the current pixel
                var mono = pixelsMono[y][x];

                imgData.data[index] = mono;
                imgData.data[index + 1] = mono;
                imgData.data[index + 2] = mono;
                imgData.data[index + 3] = 255;
            }
        }
        _normalizedContext.putImageData(imgData, 0, 0);

        return bbs;
    }
    
    function renderPixel(point, pixel) {
        var x = Math.round(point.x),
            y = Math.round(point.y);

        //_normContext.save();
        _normalizedContext.fillStyle = (pixel.alpha === undefined) ?
            "rgb(" + [pixel.red, pixel.green, pixel.blue] + ")" :
            "rgba(" + [pixel.red, pixel.green, pixel.blue, pixel.alpha] + ")";
        _normalizedContext.fillRect(x, y, 1, 1);
        //_normContext.restore()
    }
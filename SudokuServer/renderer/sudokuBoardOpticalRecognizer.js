(function(undefined) {

    var _sourceImage = new Image(); //$$('#source-image')[0];
    //http://stackoverflow.com/questions/18474727/canvas-has-been-tainted-by-cross-origin-data-work-around
    _sourceImage.crossOrigin = "anonymous";
    _sourceImage.onload = doSomeImageProcessing;

    const MaxNormWidth = 500;
    var _sourceCanvas = $$('#source')[0],
        _sourceContext = _sourceCanvas.getContext("2d"),
        _normCanvas = $$('#normalized')[0],
        _normContext = _normCanvas.getContext("2d");

    var _bbs; //BBSud.SudBitmap

    function doSomeImageProcessing() {
        _bbs = normalizeImage();

        // detects the angle of rotation
        var strongestLine,
            grid, digits;

        if ((strongestLine = _bbs.houghTransformCenter()) &&
            (grid = _bbs.detectRect(strongestLine.theta))) {
            //console.log(strongestLine, grid);

            digits = _bbs.ocr();
            console.log("OCR-ed grid\n", digits.join('\n ')
                .replace(/,/g, ' ')
                .replace(/0/g, '.'));
        } else {
            console.log("Couldn't find a sudoku board in that image..");
            return;
        }

        //Recreate the grid using textboxes, and wait for manual OCR fixes:
        
        // I think this is not usefull
                //renderBoard(grid, digits);
                //_stepSolve.style.display = 'block';
    }
    
    function initInputs() {
        var fileArea = document, //$$('#file-area')[0],
            fileInput = $$('#file-area input')[0];

        var inputAction = function(data) {
            console.log('Image dropped.');
            renderSource(data);
        };

        ABOUtils.dropImage(fileArea, inputAction);
        ABOUtils.dropImage(fileInput, inputAction);
    }

    function renderSource(imgSrc) {
        _sourceImage.src = imgSrc;
        _sourceImage.setAttribute('class', 'loaded');
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
            //var canvW = Math.min(imgW, MaxNormWidth),
            //    canvH = (imgH * canvW/imgW) || (canvW/2);
            w = Math.round(w * shrink);
            h = Math.round(h * shrink);
        }

        var imgData, pixels, bbs, pixelsMono,
            index, r, g, b;

        // Draw the image onto a canvas so we can read the individual pixels:
        //
        console.log('Resizing', [imgW, imgH], '->', [w, h]);
        _normCanvas.width = _sourceCanvas.width = w;
        _normCanvas.height = _sourceCanvas.height = h;
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
        _normContext.putImageData(imgData, 0, 0);

        return bbs;
    }
    
    initInputs();

})();    
    
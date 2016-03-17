"use strict";

var ABOUtils = ABOUtils || {};

(function(utils, undefined) {
    
    utils.dropImage = function(target, callback) {
        var imgUrl,
            acceptedTypes = ['image/png', 
                             'image/jpeg', 
                             'image/gif', 
                             'image/svg', 
                             'image/svg+xml'];
        
        function handleFile(file) {
            if(!file) { return; }
            
            if(acceptedTypes.indexOf(file.type) >= 0) {
                
                //New and better(?) way..
                //https://developer.mozilla.org/en-US/docs/Web/API/Camera_API/Introduction
                //http://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
                //
                //  var reader = new FileReader();
                //  reader.onload = function (event) {
                //      //console.log('ABOUtils.dropImage, read', event);
                //      callback(event.target.result);
                //  };
                //  reader.readAsDataURL(file);
                //
                if(imgUrl) {
                    //We probably don't need to hang on to the previous file anymore,
                    //so we release it for performance reasons:
                    URL.revokeObjectURL(imgUrl);
                }
                imgUrl = URL.createObjectURL(file);
                callback(imgUrl);
            }
        }
        
        //If we are intercepting a file input field, we use the onchange event instead of drag/drop events.
        //That way we fetch the file both on drag/drop (built-in behavior for file input fields), 
        //and when a file is selected through the old-fashioned "Browse" button.
        //
        //http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
        if((target.nodeName === 'INPUT') && (target.type === 'file')) {
            target.onchange =  function(e) {
                var input = e.target;
                if (input.files) {
                    handleFile(input.files[0]);
                }
            };
        }
        else {
            //http://html5demos.com/dnd-upload
            target.ondragover = function () { return false; };
            target.ondragend = function () { return false; };
            target.ondrop = function (e) {
                e.preventDefault();

                var file = e.dataTransfer.files[0];
                //console.log('ABOUtils.dropImage, dropped', file.type);
                handleFile(file);
            }
        }
    }
    
    utils.initArray = function(config) {
        var len = config.length,
            fac = config.factory || function() { return config.value; };
        
        //"RangeError: Maximum call stack size exceeded" on large arrays (length ~250000)
        //
        //  //http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
        //  return Array.apply(null, Array(len))
        //              .map(function(x, i) { return fac(i); });
        //
        var array = [];
        for(var i = 0; i < len; i++) {
            array.push(fac(i));
        }
        return array;
    }
    
    //http://stackoverflow.com/questions/7459704/in-javascript-best-way-to-convert-nodelist-to-array
    //Usage:
    //  ABOUtils.live('click', 'nav .aap a', function(event) { console.log(event); alert(this + ' clicked'); });
    utils.live = function(eventType, elementQuerySelector, callback) {
        document.addEventListener(eventType, function (event) {

            var qs = $$(elementQuerySelector);
            if (qs && qs.length) {
                
                var el = event.target, index = -1;
                while (el && ((index = qs.indexOf(el)) === -1)) {
                    el = el.parentElement;
                }

                if (index > -1) {
                    callback.call(el, event);
                }
            }
        });
    }
    
    utils.createElement = function(tag, attributes, parent) {
        
        var tagAndClassOrID = tag.split(/([#\.])/);
        if((tagAndClassOrID.length === 3) && tagAndClassOrID[2]) {
            tag = tagAndClassOrID[0] || 'div';
            attributes = attributes || {};
            //Add either id or class to the attributes list:
            attributes[{'#': 'id', '.': 'class'}[tagAndClassOrID[1]]] = tagAndClassOrID[2];
        }
        
        var element = document.createElement(tag);
        if(attributes) {
            for(var key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
        }
        if(parent) {
            parent.appendChild(element);
        }
        return element;
    }

    //A list of 104 colors from Tatarize's comment at
    //http://godsnotwheregodsnot.blogspot.no/2012/09/color-distribution-methodology.html
    //
    //  ["#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
    //   "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
    //   "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
    //   "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
    //   "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
    //   "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
    //   "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
    //   "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
    //   "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
    //   "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
    //   "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
    //   "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
    //   "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"];
    //
    //Converted to 3 hex digit color codes (e.g #BF9) => 3 characters per color:
    var ColorPalette = '000FF02EFF3FF4408407AA05FDD74000A6FAB960548AF978500899FFE2405C035F435F38665B106700B9FA9F8CB0AC60DEF00375' +
                         '49B93011AD034087320FB0BFE97BC04BBABF90210497061B6EBF467B76789786857FC9F89C59BC546408E874333BAB0AA433667A' +
                         'CCF949885520FCA578CF3900F5C9926070DA7066A953603720D8F990597FE9212748B2F9AB326922543FED45508AC79AE0357634';
    utils.colorPalette = function(i) {
        var charIndex = (i % 104) * 3;
        var chars = ColorPalette.substring(charIndex, charIndex+3);
        return '#' + chars;
    }

    //AJAX - http GET
    //http://stackoverflow.com/questions/247483/http-get-request-in-javascript
    utils.GET = function(url, onSuccess, onError) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() { 

            if (request.readyState === 4) {
                if (request.status === 200) {
                    onSuccess(request.responseText);
                }
                else if(onError) {
                    onError(request);
                }
            }

        }

        request.open("GET", url, true);            
        request.send( null );
    }
    
    
})(ABOUtils);


/* Global functions */

//http://codepen.io/michaelschofield/post/a-useful-function-for-making-queryselectorall-more-like-jquery
function $$(selector, context) {
    context = context || document;
    var elements = context.querySelectorAll(selector);
    return Array.from(elements);
}
function $$1(selector, context) {
    context = context || document;
    var element = context.querySelector(selector);
    return element;
}


/* Polyfills */

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
//http://stackoverflow.com/a/17551105/1869660
Math.trunc = Math.trunc || function(x) {
  return (x < 0) ? Math.ceil(x) : Math.floor(x);
};
//http://codesel.blogspot.no/2014/09/javascript-mathcsc-mathsec-and-mathcot.html
Math.csc = Math.csc || function(x) { return 1 / Math.sin(x); }
Math.sec = Math.sec || function(x) { return 1 / Math.cos(x); }
Math.cot = Math.cot || function(x) { return 1 / Math.tan(x); }

//http://stackoverflow.com/questions/7308627/javascript-calculate-the-nth-root-of-a-number
//http://cwestblog.com/2011/05/06/cube-root-an-beyond/
Math.nthRoot = Math.nthRoot || function(x, n, log) {
    function printError(msg) {
        if(log) { console.log('nthRoot error (' + n+'√'+x + '): ' + msg); }
    }
    var normX = x, root, testX;

    //https://en.wikipedia.org/wiki/Nth_root
    //"(...) the nth root of a number x, where n is a **positive integer** (...)"
    if(n <= 0) {
        printError('n must be a positive number');
        return;
    }

    if(x < 0) {
        //https://en.wikipedia.org/wiki/Nth_root
        //"if n is even and x is real and negative, none of the nth roots is real."
        if(n%2 === 0) {
            printError('No *real number* solution');
            return;
        }
        //Math.pow() doesn't handle negative values for x.
        //Make the input positive, and then we'll negate the result (see root below):
        normX = -x;
    }

    root = Math.pow(normX, 1/n);
    if(x < 0) { root = -root; }

    /*
    testX = Math.pow(possibleRoot, n);
    if (Math.abs(x - testX) > normX/1000) {
        printError("Calculation wasn't accurate enough. Control was " + testX);
        return;
    }
    */
    return root;
}
/*
function testNthRoot(startX, decrementor) {
    var x, n, xs, root, 
        controlX, diff, maxDiff = 0;

    startX = startX || 10000;
    decrementor = decrementor || 0.9;

    for(x = startX; x>Number.EPSILON; x*=decrementor) {
        //Test both positive and negative values for x, including integers:
        xs = [x];
        if(x>2) { xs.push(Math.trunc(x)); }
        xs = xs.concat(xs.map( xx => -xx));

        //console.log(xs);
        xs.forEach(function(x) {

            for(n = 1; n < 10; n++) {
                if((x<0) && (n%2 === 0)) { continue; }

                var root = Math.nthRoot(x,n);
                if(root === undefined) {
                    console.log(n+'√'+x+' FAILED');
                }
                else {
                    controlX = Math.pow(root, n);
                    diff = Math.abs( (x-controlX) / x );
                    maxDiff = Math.max(diff, maxDiff);
                    //console.log('    ' + diff.toFixed(20) + '\t\t(' + n+'√'+x);
                }
            }
        });
    }

    console.log('Max diff:  ', maxDiff.toFixed(20));
}
*/


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
Array.from = Array.from || function(list) {
    return Array.prototype.slice.call(list);
};

//Randomize array element order in-place.
//Using Durstenfeld shuffle algorithm.
//http://stackoverflow.com/a/12646864/1869660
Array.prototype.shuffle = Array.prototype.shuffle || function() {
    var array = this;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        if(i !== j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    return array;
}

module.exports = ABOUtils;
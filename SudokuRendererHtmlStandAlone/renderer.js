"use strict";

//Based on Bojan Banko's "Realtime Webcam Sudoku Solver":
//http://www.codeproject.com/Articles/238114/Realtime-Webcam-Sudoku-Solver
var BBSud = BBSud || {};

var kkkk = 0;

(function(bbs, undefined) {

    const DEG2RAD = 0.017453292519943295769236907684886; // PI*2/360
    const SQRT2 = 1.4142135623730950488016887242097; // sqr(2)
    // Lookup table of sin and cos values so we don't need to calculate sines and cosines all the time 
    const SINS = [0.0, 0.017452, 0.034899, 0.052336, 0.069756, 0.087156, 0.104528, 0.121869, 0.139173, 0.156434, 0.173648, 0.190809, 0.207912, 0.224951, 0.241922, 0.258819, 0.275637, 0.292372, 0.309017, 0.325568, 0.342020, 0.358368, 0.374607, 0.390731, 0.406737, 0.422618, 0.438371, 0.453990, 0.469472, 0.484810, 0.500000, 0.515038, 0.529919, 0.544639, 0.559193, 0.573576, 0.587785, 0.601815, 0.615662, 0.629320, 0.642788, 0.656059, 0.669131, 0.681998, 0.694658, 0.707107, 0.719340, 0.731354, 0.743145, 0.754710, 0.766044, 0.777146, 0.788011, 0.798636, 0.809017, 0.819152, 0.829038, 0.838671, 0.848048, 0.857167, 0.866025, 0.874620, 0.882948, 0.891007, 0.898794, 0.906308, 0.913545, 0.920505, 0.927184, 0.933580, 0.939693, 0.945519, 0.951057, 0.956305, 0.961262, 0.965926, 0.970296, 0.974370, 0.978148, 0.981627, 0.984808, 0.987688, 0.990268, 0.992546, 0.994522, 0.996195, 0.997564, 0.998630, 0.999391, 0.999848, 1.0, 0.999848, 0.999391, 0.998630, 0.997564, 0.996195, 0.994522, 0.992546, 0.990268, 0.987688, 0.984808, 0.981627, 0.978148, 0.974370, 0.970296, 0.965926, 0.961262, 0.956305, 0.951057, 0.945519, 0.939693, 0.933580, 0.927184, 0.920505, 0.913545, 0.906308, 0.898794, 0.891007, 0.882948, 0.874620, 0.866025, 0.857167, 0.848048, 0.838671, 0.829038, 0.819152, 0.809017, 0.798635, 0.788011, 0.777146, 0.766044, 0.754710, 0.743145, 0.731354, 0.719340, 0.707107, 0.694658, 0.681998, 0.669131, 0.656059, 0.642788, 0.629321, 0.615661, 0.601815, 0.587785, 0.573576, 0.559193, 0.544639, 0.529919, 0.515038, 0.500000, 0.484810, 0.469472, 0.453991, 0.438371, 0.422618, 0.406737, 0.390731, 0.374607, 0.358368, 0.342020, 0.325568, 0.309017, 0.292372, 0.275637, 0.258819, 0.241922, 0.224951, 0.207912, 0.190809, 0.173648, 0.156434, 0.139173, 0.121869, 0.104528, 0.087156, 0.069756, 0.052336, 0.034899, 0.017452];
    const COSS = [1.0, 0.999848, 0.999391, 0.998630, 0.997564, 0.996195, 0.994522, 0.992546, 0.990268, 0.987688, 0.984808, 0.981627, 0.978148, 0.974370, 0.970296, 0.965926, 0.961262, 0.956305, 0.951057, 0.945519, 0.939693, 0.933580, 0.927184, 0.920505, 0.913545, 0.906308, 0.898794, 0.891007, 0.882948, 0.874620, 0.866025, 0.857167, 0.848048, 0.838671, 0.829038, 0.819152, 0.809017, 0.798636, 0.788011, 0.777146, 0.766044, 0.754710, 0.743145, 0.731354, 0.719340, 0.707107, 0.694658, 0.681998, 0.669131, 0.656059, 0.642788, 0.629320, 0.615662, 0.601815, 0.587785, 0.573576, 0.559193, 0.544639, 0.529919, 0.515038, 0.500000, 0.484810, 0.469472, 0.453991, 0.438371, 0.422618, 0.406737, 0.390731, 0.374607, 0.358368, 0.342020, 0.325568, 0.309017, 0.292372, 0.275637, 0.258819, 0.241922, 0.224951, 0.207912, 0.190809, 0.173648, 0.156434, 0.139173, 0.121869, 0.104528, 0.087156, 0.069757, 0.052336, 0.034899, 0.017452, 0.0, -0.017452, -0.034899, -0.052336, -0.069756, -0.087156, -0.104529, -0.121869, -0.139173, -0.156434, -0.173648, -0.190809, -0.207912, -0.224951, -0.241922, -0.258819, -0.275637, -0.292372, -0.309017, -0.325568, -0.342020, -0.358368, -0.374607, -0.390731, -0.406737, -0.422618, -0.438371, -0.453990, -0.469472, -0.484810, -0.500000, -0.515038, -0.529919, -0.544639, -0.559193, -0.573576, -0.587785, -0.601815, -0.615661, -0.629320, -0.642788, -0.656059, -0.669131, -0.681998, -0.694658, -0.707107, -0.719340, -0.731354, -0.743145, -0.754710, -0.766044, -0.777146, -0.788011, -0.798635, -0.809017, -0.819152, -0.829037, -0.838671, -0.848048, -0.857167, -0.866025, -0.874620, -0.882948, -0.891006, -0.898794, -0.906308, -0.913545, -0.920505, -0.927184, -0.933580, -0.939693, -0.945519, -0.951056, -0.956305, -0.961262, -0.965926, -0.970296, -0.974370, -0.978148, -0.981627, -0.984808, -0.987688, -0.990268, -0.992546, -0.994522, -0.996195, -0.997564, -0.998630, -0.999391, -0.999848];

    bbs.OCRChar = function() {
        const Grayscale = '#==- ';
        var asciis = Array.from(arguments);
        
            kkkk++;
            console.log('kkkk -- ' + kkkk);

        this.zoneDensities = asciis.map(function(ascii) {
            var zone = ascii.map(function(row) {
                var densities = row.split('').map(function(gray) {
                    //Darker pixel - Higher density:
                    return {
                        '#': 1024,
                        '=': 650,
                        //'≡': 768,
                        //'=': 512,
                        '-': 256,
                        ' ': 0
                    }[gray];
                });
                return densities;
            });
            return zone;
        });
    }

    /*
    // Next array represents the result of the training of the zones intensity features.
    // Greater the number, the zone is darker.
    const OCR_ZON = [
        [
            [ 358,	678,	962,   1002,	794 ],
            [  43,	314,	945,	988,	565 ],
            [  51,	277,	909,	931,	404 ],
            [ 374,	604,   1024,	953,	449 ],
            [ 479,	767,	973,	821,	449 ]
        ],
        [
            [ 754, 1024,   1000,	993,	815 ],
            [ 274,	678,	736,	422,	218 ],
            [  25,	105,	549,	870,	379 ],
            [ 406,	362,	364,	958,	798 ],
            [ 568,	916,	994,	883,	440 ]
        ],
        [
            [ 650,	886,	841,	828,	494 ],
            [ 326,	310,	345,	907,	913 ],
            [  14,	224,	689,   1024,	568 ],
            [ 236,	314,	421,	920,	624 ],
            [ 512,	884,	881,	842,	421 ]
        ],
        [
            [  86,	 90,	253,	624,	514 ],
            [ 670,	763,	829,   1024,	805 ],
            [ 411,	683,	586,	834,	557 ],
            [  36,	321,	743,   1019,	567 ],
            [   0,	 33,	427,	814,	478 ]
        ],
        [
            [ 641,	886,	880,	788,	416 ],
            [ 399,	451,	344,	783,	968 ],
            [ 520,	735,	604,	876,	786 ],
            [ 667, 1024,	707,	501,	278 ],
            [ 349,	873,	902,	880,	617 ]
        ],
        [
            [ 505,	884,	861,	922,	537 ],
            [ 952,	755,	220,	846,	973 ],
            [1013,	981,	567,	752,	541 ],
            [ 716, 1024,	533,	332,	190 ],
            [ 189,	680,	938,	966,	639 ]
        ],
        [
            [ 221,	739,	697,	206,	  0 ],
            [ 202,	738,	963,	410,	 38 ],
            [  33,	269,	840,	738,	203 ],	
            [ 316,	395,	663,	944,	589 ],	
            [ 833, 1024,	982,   1008,	910 ]	
        ],
        [
            [ 529,	819,	752,	866,	609 ],
            [ 876,	812,	272,	777,   1024 ],
            [ 529,	940,	759,   1007,	721 ],
            [ 666, 1002,	606,	870,	798 ],
            [ 416,	799,	806,	855,	558 ]
        ],
        [
            [ 506,	865,	890,	628,	232 ],
            [ 197,	388,	510,	946,	740 ],
            [ 573,	855,	628,	978,   1024 ],
            [ 865,	891,	272,	726,	972 ],
            [ 422,	842,	842,	867,	450 ]
        ]
    ];
    */
    const OCR_ZON = [
        //1
        new bbs.OCRChar(['   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '   =##    ',
                '  -###=   '
            ],

            ['       =#=',
                '    -####=',
                '-=###=-##=',
                '==    -##=',
                '      -##=',
                '      -##=',
                '      -##=',
                '      -##=',
                '      -##=',
                '      -##='
            ],

            ['    =##-  ',
                ' =#####-  ',
                ' #===##-  ',
                '    =##-  ',
                '    =##   ',
                '    ##=   ',
                '    ##=   ',
                '    ##=   ',
                '    ##=   ',
                '-########='
            ],

            ['     =###=',
                ' -#######=',
                '=########=',
                '    #####=',
                '    #####=',
                '    #####=',
                '    #####=',
                '    #####=',
                '    #####=',
                '    #####='
            ],

            ['   -##    ',
                '###-##    ',
                '    ##    ',
                '    ##    ',
                '    ##    ',
                '    ##    ',
                '    ##    ',
                '    ##    ',
                '    ##    ',
                '##########'
            ]),
        //2
        new bbs.OCRChar(['  =####=  ',
                ' #=   =#= ',
                '=#=    ## ',
                '-#=    ## ',
                '      -## ',
                '     -#=  ',
                '   -#=    ',
                '  =-      ',
                '=#========',
                '=#########'
            ],

            ['  -####=  ',
                ' ##-   ## ',
                '-#-     #=',
                '       -#=',
                '       ## ',
                '     =#=  ',
                '   -##    ',
                '  ##-     ',
                ' ##       ',
                '=########='
            ],

            ['   #####  ',
                ' ###- =##=',
                '-#-     #=',
                '       ##-',
                '     =##= ',
                '   =##=   ',
                ' =##      ',
                '-#=       ',
                '=#--==##= ',
                '-#########'
            ],

            ['  ######  ',
                '=###==###=',
                '=###  ####',
                '=### =###=',
                '    -#### ',
                '   -####  ',
                '  -####   ',
                ' =####    ',
                '=####====-',
                '#########='
            ],

            ['=######=  ',
                '       ##-',
                '       =##',
                '       =#=',
                '      =#= ',
                '     ##-  ',
                '   =#=    ',
                '  ##      ',
                '-##       ',
                '#########='
            ]),
        //3
        new bbs.OCRChar(['  =####=  ',
                ' =    =## ',
                '       ## ',
                '      -=  ',
                '    =###  ',
                '      =##=',
                '        ##',
                '        #=',
                '       -# ',
                '=#####=   '
            ],

            ['  =#####  ',
                ' ######## ',
                '-##=  ###-',
                '      ### ',
                '    ####  ',
                '    ==###=',
                '       ###',
                '=##=  -###',
                ' ########-',
                '  =#####  '
            ],

            ['  =####=  ',
                ' ##=  =## ',
                '       -#-',
                '      -## ',
                '   ####-  ',
                '      =## ',
                '       -#=',
                '-=     -#=',
                '=##-  =## ',
                '  #####=  '
            ],

            ['  =####=  ',
                ' =     -= ',
                '        = ',
                '       -# ',
                '    ###=  ',
                '       == ',
                '        =-',
                '        -=',
                '=-      # ',
                '  #####=  '
            ],

            ['=######=  ',
                '      -## ',
                '       ## ',
                '      =#= ',
                '  ####=   ',
                '     -##= ',
                '       =#=',
                '       =#=',
                '      -## ',
                '=######=  '
            ]),
        //4
        new bbs.OCRChar(['      ##  ',
                '     ###  ',
                '    # ##  ',
                '  -=  ##  ',
                ' ==   ##  ',
                '=-    ##  ',
                '##########',
                '      ##  ',
                '      ##  ',
                '      ##  '
            ],

            ['     =##= ',
                '    =###= ',
                '   =####= ',
                '  =## ##= ',
                ' =##  ##= ',
                '-##   ##= ',
                '##########',
                '##########',
                '      ##= ',
                '      ##= '
            ],

            ['   =####= ',
                '   #####= ',
                '  =#####= ',
                '  ##-###= ',
                ' ### ###= ',
                '-##- ###= ',
                '###--#### ',
                '##########',
                '     ###= ',
                '     ###= '
            ],

            ['     -##- ',
                '    -= =- ',
                '    =  =- ',
                '   #   =- ',
                '  #    =- ',
                ' #     =- ',
                '=      =- ',
                '       =- ',
                '       =- ',
                '    -#####'
            ]),
        //5
        new bbs.OCRChar(['  ####### ',
                ' =#       ',
                ' ##       ',
                ' #==###-  ',
                '=##   =## ',
                '        #=',
                '        ##',
                '##      #=',
                '-##   -## ',
                '  =####=  '
            ],

            [' -####### ',
                ' =####### ',
                ' ###      ',
                ' ### ==   ',
                ' ######## ',
                ' =#=  ###=',
                '      -###',
                '==#=  =##=',
                ' ######## ',
                '  =####=  '
            ],

            [' ########=',
                ' #=       ',
                ' #=       ',
                ' #=       ',
                ' ---####  ',
                '      -##-',
                '       =#=',
                '       =#=',
                '      =## ',
                '=######-  '
            ],

            ['=######## ',
                '=#=       ',
                '=#=       ',
                '=#==##=-  ',
                '=#=--=### ',
                '       ##=',
                '       =#=',
                '       =#=',
                '-=    =## ',
                '-######-  '
            ]),
        //6
        new bbs.OCRChar(['   ####=  ',
                ' -#=   ## ',
                ' #=     =-',
                '-#  -==   ',
                '=#=#==##= ',
                '=#=    -#=',
                '=#-     ##',
                ' #=     #=',
                ' =#-   ## ',
                '  -####=  '
            ],

            ['  -####=  ',
                ' ######## ',
                '=##=  #== ',
                '###- ##   ',
                '######### ',
                '####  =##=',
                '###-  -###',
                '=##=  -##=',
                ' ######## ',
                '  =####=  '
            ],

            ['    -##   ',
                '   ##=    ',
                '  ##-     ',
                ' ##       ',
                '=#######  ',
                '###   -## ',
                '##     =#=',
                '=#     =#=',
                ' ##-  =## ',
                '  =####=  '
            ],

            ['   =##### ',
                '  ##      ',
                ' ##       ',
                '-#=       ',
                '=#-#####- ',
                '=##    =#-',
                '=#=     ##',
                ' #=     #=',
                ' =#-   =# ',
                '  -####=  '
            ]),
        //7
        new bbs.OCRChar(['#########=',
                '#-      # ',
                '=      #  ',
                '      =-  ',
                '     ==   ',
                '    -#    ',
                '    #     ',
                '   #      ',
                '  ==      ',
                ' ==       '
            ],

            ['##########',
                '       ## ',
                '      ##  ',
                '     ##   ',
                '    =#-   ',
                '   -#=    ',
                '   =#     ',
                '   #=     ',
                '  -#-     ',
                '  =#      '
            ],

            ['##########',
                '##########',
                '      ### ',
                '     ###  ',
                '    =##-  ',
                '   -###   ',
                '   ###    ',
                '   ###    ',
                '  =##=    ',
                '  =##=    '
            ],

            ['=########=',
                '=########=',
                '     ####-',
                '    =#### ',
                '    ####= ',
                '   =####- ',
                '   ####=  ',
                '  -####-  ',
                '  =####   ',
                '  ####=   '
            ],

            ['#########=',
                '       ## ',
                '      ##  ',
                '     =#-  ',
                '    -#=   ',
                '    ##    ',
                '   =#-    ',
                '   ##     ',
                '  ##      ',
                ' =#=      '
            ]),
        //8
        new bbs.OCRChar(['  -####=  ',
                ' ##    ## ',
                ' #=    =# ',
                ' ##-   #= ',
                '  =##==-  ',
                ' -# -=##= ',
                '=#     =#=',
                '##      #=',
                '-#-    =# ',
                '  #####=  '
            ],

            ['  =####=  ',
                ' ######## ',
                '=##=  =##=',
                '-###  ###-',
                ' -######- ',
                ' ###==### ',
                '###=  -###',
                '###=  =###',
                '=########=',
                '  ######- '
            ],

            ['  -####=  ',
                ' =#=  =#= ',
                ' #=    ## ',
                ' ##=  =#= ',
                '  #####-  ',
                ' ##=  =## ',
                '=#      #=',
                '=#      #=',
                '-##=  =## ',
                '  #####=  '
            ],

            ['  =####=  ',
                ' =      = ',
                '==      =-',
                '-#      # ',
                '  =##=#=  ',
                ' =-    -= ',
                '=-      ==',
                '=-      -=',
                ' #      # ',
                '  =####=  '
            ]),
        //9
        new bbs.OCRChar(['  =####-  ',
                '-##   -## ',
                '##     -#-',
                '##      #=',
                '=#     =##',
                ' ##=-=#=##',
                '   =#=  #=',
                '-=     =#-',
                '-#=   -#= ',
                '  #####   '
            ],

            ['  =####=  ',
                ' ######## ',
                '=##=  =##=',
                '###-  -###',
                '=##=  ####',
                ' #########',
                '   ## -###',
                ' ==#  =##=',
                ' ######## ',
                '  =####=  '
            ],

            ['  =####=  ',
                ' ##=  -## ',
                '=#=     #=',
                '=#=     ##',
                ' ##    ###',
                '  #######=',
                '       ## ',
                '     -##  ',
                '    =##   ',
                '   ##-    '
            ],

            ['  =####=  ',
                ' ##    ## ',
                '=#     -#=',
                '=#     -##',
                '-#=    =##',
                '  #####-##',
                '        #=',
                '       =#-',
                '      =#- ',
                ' #####=   '
            ])
    ];

    // Next array represents the result of the training of the (width*100/height) ratios features.
    // Note how all the values are similar (~64), except the first (46), which is number 1.
    const OCR_RATIOS = [46, 64, 64, 66, 64, 66, 60, 66, 66];

    bbs.Pixel = function(r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    };

    bbs.Point = function(x, y) {
        this.x = x;
        this.y = y;
    }

    bbs.SudBitmap = function(config) {

        var _img = config.image,
            _callbackSetPixel = config.setPixel;

        var _w = _img[0].length,
            _h = _img.length,
            _rhos = Math.trunc(((_w + _h) * SQRT2) / 2);

        var _mono = _img.map(function(row) {
            return row.map(function(pix) {
                return 255;
            });
        });

        // sudoku grid coordinates - 10x10 points - in pixels
        var _grid = ABOUtils.initArray({
            length: 10,
            factory: function() {
                return ABOUtils.initArray({
                    length: 10,
                    factory: function() {
                        return new bbs.Point();
                    }
                });
            }
        });
        // sudoku grid cell values
        var _cells = ABOUtils.initArray({
            length: 9,
            factory: function() {
                return ABOUtils.initArray({
                    length: 9,
                    value: 0
                });
            }
        });

        //////////////////////////////////////////////////////////////////////////
        // Function:	Monochrome()
        // Purpose:		Converts the color image to bitonal image.
        //				Uses "Mean Adaptive Thresholding" method. http://homepages.inf.ed.ac.uk/rbf/HIPR2/adpthrsh.htm
        //				Optimized algorithm with the use of integral image. http://people.scs.carleton.ca/~roth/iit-publications-iti/docs/gerh-50002.pdf.
        // Parameters:
        /////////////////////////////////////////////////////////////////////////
        function monochrome() {
            const C = 15; //2;	// it is better 1 in some cases
            const RECT = Math.round(_w / 20); //5;	// TODO dynamically adapt value from 3 to 8 based on image size
            const count = (RECT * 2 + 1) * (RECT * 2 + 1);

            var width = _w,
                height = _h,
                x, y,
                sum, mean, gray;
            var integral = []; // integral image (sums of the original image)

            // fill integral image. First step is to copy orig.image -> integral image
            _img.forEach(function(row) {
                row.forEach(function(pix) {
                    integral.push(getPixelGray(pix));
                });
            });
            sumIntegralImage(integral);

            // "Mean Adaptive Thresholding" method
            for (y = RECT + 1; y < height - RECT; y++) {
                for (x = RECT + 1; x < width - RECT; x++) {
                    // sum the surounding pixels RECTxRECT around x,y
                    sum = integral[(y + RECT) * width + x + RECT] - integral[(y - RECT - 1) * width + x + RECT] - integral[(y + RECT) * width + x - RECT - 1] + integral[(y - RECT - 1) * width + x - RECT - 1];
                    mean = (sum / count); // calculate mean value of RECTxRECT neighbours pixels

                    gray = getPixelGray(_img[y][x]);
                    if (gray < (mean - C)) { // original pixel intensity above or below the local threshold?
                        _mono[y][x] = 0; // black
                    }
                    //else {
                    //	_mono[y*width + x] = 255;					// white
                    //}
                }
            }

            return _mono;
        }

        function getPixelGray(pix) {
            return ((((pix.red * 77) + (pix.green * 150) + (pix.blue * 28)) >> 8) & 255); // 100% Intesity = 30% Red + 59% Green + 11% Blue
        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	SumIntegralImage()
        // Purpose:		Builds the integral image.
        // Parameters:	pIntegral - pointer to the integral image to build. Initially must be filled with the copy of original image. 
        /////////////////////////////////////////////////////////////////////////
        function sumIntegralImage(integral) {
            var width = _w,
                height = _h,
                x, y,
                indexA, indexB, indexC, indexD;

            // sum the first column
            indexA = 0;
            indexB = width;
            for (y = 1; y < height; y++) {
                integral[indexB] += integral[indexA];
                indexA += width;
                indexB += width;
            }

            // sum the first row
            indexA = 0;
            indexB = 1;
            for (x = 1; x < width; x++) {
                integral[indexB] += integral[indexA];
                indexA++;
                indexB++;
            }

            // sum all other pixels
            for (y = 1; y < height; y++) {
                indexA = y * width + 1;
                indexB = (y - 1) * width + 1;
                indexC = y * width;
                indexD = (y - 1) * width;
                for (x = 1; x < width; x++) {
                    integral[indexA] += integral[indexB] + integral[indexC] - integral[indexD];
                    indexA++;
                    indexB++;
                    indexC++;
                    indexD++;
                }
            }

        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	HoughTransformCenter()
        // Purpose:		Detects the image rotation angle by detecting the strongest line around the centre of the image.
        //				http://en.wikipedia.org/wiki/Hough_transform
        // Parameters:	pStrongestLine - pointer to the resulting detected strongest line.
        // Returns:		TRUE if strongest line detected, otherwise FALSE. 
        /////////////////////////////////////////////////////////////////////////
        function houghTransformCenter() {
            var width = _w,
                height = _h;
            var theta, rho, x, y, yOffset, strip;
            var accumulator = new Accumulator(width, height);
            var strongestLine = {};

            strip = Math.min(width, height) / 7;

            // fill accumulator from image
            // we will sweep the small portion at the the image center (not entire image) for better performance
            var maxY = 4 * strip,
                maxX = width - (width / 3);
            for (y = Math.trunc(3 * strip); y < maxY; y++) //image center strip, which is 1/7 of the height
            {
                for (x = Math.trunc(width / 3); x < maxX; x += 3) // 1/3 of the width; skip every 3 pixels
                {
                    if (_mono[y][x] === 0) // if black pixel
                    {
                        accumulator.add(x, y, 60, 120); // looking for horizontal lines around 90(+-30) degrees
                    }
                }
            }

            // search for strongest line in the accumulator
            strongestLine.vote = -1;
            for (rho = accumulator.rhosLow; rho < accumulator.rhosHigh; rho++) {
                yOffset = rho * accumulator.thetas;
                for (theta = 60; theta <= 120; theta++) {
                    if (accumulator.bins[yOffset + theta] > strongestLine.vote) {
                        strongestLine.vote = accumulator.bins[yOffset + theta];
                        strongestLine.theta = theta;
                        strongestLine.rho = rho;
                    }
                }
            }

            if (strongestLine.vote === -1) {
                return;
            }

            // Display the accumulator (of the hough transformation) to the screen
            // Nice to visualize what the accumulator is. Uncomment next block to visualize it.
            /*
            var byte,
                factor = height / ((width + height) * SQRT2);
            for (rho = accumulator.rhosLow; rho < accumulator.rhos; rho++)
            {
                for (theta = 0; theta < accumulator.thetas; theta++)
                {
                    byte = (accumulator.bins[rho*accumulator.thetas + theta]) * 5;
                    y = Math.trunc(rho * factor);
                    SetPixel(theta, y, RGB(byte,byte,byte));
                }
            }
            */

            return strongestLine;
        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	HoughTransform()
        // Purpose:		Detects the strongest line in the specific area.
        //				http://en.wikipedia.org/wiki/Hough_transform
        // Parameters:	inputLine - reference line (rho value) from which to detetect the strongest line.
        //				offset - parallel distance from inputLine where to search for the strongest line. Could be negative or positive, depending on the direction from the inputLine.
        //				loLimit - limit the line to search for the strongest line.
        //				hiLimit - limit the line to search for the strongest line.
        //				thetaOffset - limit the angle to search for the strongest line.
        //				isVertical - are we looking for a vertical or horizontal line?
        //				pStrongestLine - resulting strongest line.
        // Returns:		TRUE if strongest line detected, otherwise FALSE.
        /////////////////////////////////////////////////////////////////////////
        function houghTransform(inputLine, offset, loLimit, hiLimit, thetaOffset, isVertical) {
            var width = _w,
                height = _h;
            var rho, x, y, yOffset, start, end, vote, byte
            var accumulator = new Accumulator(width, height);
            var strongestLine = {};

            if (offset > 0) {
                start = inputLine.rho;
                end = start + offset;
            } else {
                end = inputLine.rho;
                start = end + offset;
            }
            var sina = Math.sin((inputLine.theta) * DEG2RAD),
                cosa = Math.cos((inputLine.theta) * DEG2RAD);

            inputLine.theta = 180 - inputLine.theta; // correct for bin orientation

            if (isVertical) {
                for (rho = start; rho < end; rho += 1) // try 5 for speed
                {
                    for (y = loLimit; y < hiLimit; y += 2) // try 4 for speed
                    {
                        x = Math.round((y * cosa + rho - _rhos) / sina);
                        if (x > 0 && x < width && y > 0 && y < height) {
                            //if (display->lineDetect)
                            //	SetPixel(x, y, RGB(200, 0, 255));

                            byte = _mono[y][x];
                            if (byte == 0) // if black pixel
                            {
                                accumulator.add(y, x, inputLine.theta - thetaOffset, inputLine.theta + thetaOffset); // sweep +- degrees
                            }
                        }
                    }
                }
            } else {
                for (rho = start; rho < end; rho += 1) // try 5
                {
                    for (x = loLimit; x < hiLimit; x += 2) // try 4
                    {
                        y = Math.round((x * cosa + rho - _rhos) / sina);
                        if (x > 0 && x < width && y > 0 && y < height) {
                            //if (display->lineDetect)
                            //	SetPixel(x, y, RGB(200, 0, 255));

                            byte = _mono[y][x];
                            if (byte == 0) // if black pixel
                            {
                                accumulator.add(x, y, inputLine.theta - thetaOffset, inputLine.theta + thetaOffset); // sweep +- degrees
                            }
                        }
                    }
                }
            }

            // search for strongest line in the accumulator (biggest vote)
            vote = -1;
            for (rho = accumulator.rhosLow; rho < accumulator.rhosHigh; rho++) {
                yOffset = rho * accumulator.thetas;
                for (x = inputLine.theta - thetaOffset; x <= inputLine.theta + thetaOffset; x++) {
                    if (accumulator.bins[yOffset + x] > vote) {
                        vote = accumulator.bins[yOffset + x];
                        strongestLine.theta = x;
                        strongestLine.rho = rho;
                    }
                }
            }
            if (vote == -1) {
                return;
            }

            // correct the angles for the outside world
            strongestLine.theta = 180 - strongestLine.theta;

            // Display the accumulator (of the hough transformation) to the screen.
            // Nice to visualize what the accumulator is. Uncomment next block to visualize it.
            /*
            //BYTE byte;
            float factor = height / ((width + height) * SQRT2);
            for (rho = accumulator.rhosLow; rho < accumulator.rhos; rho++)
            {	for (int theta = 0; theta < accumulator.thetas; theta++)
                {	{	byte = (BYTE)(accumulator.bins[rho*accumulator.thetas + theta]) * 5;
                        y = (int)(rho * factor);
                        SetPixel(theta, y, RGB(byte,byte,byte));
                    }
                }
            }*/
            return strongestLine;
        }

        // Result of the Hough transform
        function Accumulator(imgWidth, imgHeight) {
            var rhos = this.rhos = Math.trunc((imgWidth + imgHeight) * SQRT2); // Accumulator height

            this.rhosLow = Math.trunc(rhos / 7); // lower rhos(y axis) limit	because we ignore lines too close to ref.point
            this.rhosHigh = Math.trunc(rhos - rhos / 7); // upper rhos(y axis) limit because we ignore lines too far from ref.point
            this.thetas = 180; // Accumulator width

            // array of votes. Every point is a possible line. Greatest vote is the strongest line.
            //http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
            this.bins = ABOUtils.initArray({
                length: rhos * this.thetas,
                value: 0
            });

            var rhoOffset = Math.round(rhos / 2);

            // Increase votes for pixel x,y
            this.add = function(x, y, theta1, theta2) {
                if (theta1 === undefined) {
                    theta1 = 0;
                }
                if (theta2 === undefined) {
                    theta2 = this.thetas;
                }

                for (var theta = theta1; theta < theta2; theta += 1) {
                    var rho = Math.round(x * COSS[theta]) + Math.round(y * SINS[theta]) + rhoOffset;
                    this.bins[rho * 180 + theta]++;
                }
            }
        };

        //////////////////////////////////////////////////////////////////////////
        // Function:	DetectRect()
        // Purpose:		Step 1. Detects the rectangle around the sudoku grid
        //				Step 2. Detects the internal grid lines
        //				Step 3. Detects the intersection points of grid lines. Fills them in m_grid, which is the goal of this method.
        // Parameters:	theta - rotation angle of the image. 
        // Returns:		TRUE if a valid rectangle is detected, otherwise FALSE. 
        /////////////////////////////////////////////////////////////////////////
        function detectRect(theta) {
            var width = _w,
                height = _h,
                halfW = Math.trunc(_w / 2),
                halfH = Math.trunc(_h / 2);
            var x, y, xx, yy, rho, maxValue, targetValue, start, end;
            var sina, cosa;

            // lines forming the white rectangle around sudoku grid - this is what we're looking for the step 1
            //{
            //	rho,		// distance from the point (0,0)
            //	theta		// angle
            //}
            var left = {},
                top = {},
                right = {},
                bottom = {};
            var whiteV = [], // vertical uninterrupted white pixel counter
                whiteH = []; // horizontal uninterrupted white pixel counter

            //When searching for horizontal and vertical white stripes,
            //we sample a 3x3 rectangle around every 4th pixel.
            //To account for noise, we say the sample rectangle is white if less than a third of pixels are black.
            const SAMPLE_LEN = 3;
            const SAMPLE_DIST = 4;

            const SampleOffset = (SAMPLE_LEN - 1) / 2,
                SampleArea = SAMPLE_LEN * SAMPLE_LEN,
                SampleMaxBlack = SampleArea / 3;
            var sampledBlack;

            top.theta = bottom.theta = 180 - theta;
            left.theta = right.theta = theta;

            ////////////////////////////////////
            // HORIZONTAL white strips detection
            //
            sina = Math.sin(top.theta * DEG2RAD);
            cosa = Math.cos(top.theta * DEG2RAD);
            start = _rhos;
            end = _rhos + Math.trunc(height * sina);

            for (rho = start; rho < end; rho += SAMPLE_DIST) // todo: try with 5 for performance
            {
                // sweep down->up with parallel lines and count white pixels. Our goal is to find longest uninterrupted white strip line. Strip consists of rectangles 3x3 pixels.
                var whiteLen = 0,
                    longestwhiteLen = 0;

                for (x = SampleOffset; x < width - SampleOffset; x += SAMPLE_DIST) {
                    y = Math.trunc((x * cosa + rho - _rhos) / sina);
                    if (y >= SampleOffset && y < height - SampleOffset) {
                        sampledBlack = 0;
                        for (yy = y - SampleOffset; yy <= y + SampleOffset; yy++) {
                            for (xx = x - SampleOffset; xx <= x + SampleOffset; xx++) {
                                if (_mono[yy][xx] == 0) {
                                    sampledBlack++;
                                }
                                //SetPixel(xx, y, RGB(100,100,50));		// display the progress on screen
                            }
                        }

                        if (SampleMaxBlack > sampledBlack) { // white
                            whiteLen++;
                        } else { // black
                            if (longestwhiteLen < whiteLen) {
                                longestwhiteLen = whiteLen;
                            }
                            whiteLen = 0;
                        }
                    }

                    if (longestwhiteLen < whiteLen) {
                        longestwhiteLen = whiteLen;
                    }
                }
                whiteH[rho - start] = longestwhiteLen;
            }
            // Display whiteH array to screen
            if (_callbackSetPixel) {
                for (y = 0; y < height; y++) {
                    for (x = 0; x < whiteH[y]; x++) {
                        setPixel(x, y, new bbs.Pixel(100, 100, 150));
                    }
                }
            }

            // detect 2 peaks of white horizontal strips
            //..or if we find a strip that spans across more than half the image, we say that's good enough.
            targetValue = width / SAMPLE_DIST / 2;
            maxValue = 0;
            for (y = 1 + halfH; y > 0; y--) {
                if (maxValue < whiteH[y]) {
                    maxValue = whiteH[y];
                    bottom.rho = y + start;

                    if (maxValue >= targetValue) {
                        break;
                    }
                }
            }
            maxValue = 0;
            for (y = halfH; y < height - 1; y++) {
                if (maxValue < whiteH[y]) {
                    maxValue = whiteH[y];
                    top.rho = y + start;

                    if (maxValue >= targetValue) {
                        break;
                    }
                }
            }

            //////////////////////////////////
            // VERTICAL white strips detection
            //
            sina = Math.sin(left.theta * DEG2RAD);
            cosa = Math.cos(left.theta * DEG2RAD);
            start = _rhos;
            end = _rhos + Math.trunc(width * sina);

            for (rho = start; rho < end; rho += SAMPLE_DIST) // todo: try with 5 for performance
            {
                var whiteLen = 0,
                    longestwhiteLen = 0;

                //Above, we found the top and bottom of the sudoku grid.
                //There's no need to search the entire image here,
                //instead we only search between the Y coordinates for that top and bottom:
                var Ydown = Math.trunc(((rho - start) * Math.cos(bottom.theta * DEG2RAD) + bottom.rho - _rhos) / Math.sin(bottom.theta * DEG2RAD)),
                    Yup = Ydown + top.rho - bottom.rho;

                for (y = Ydown; y < Yup; y += SAMPLE_DIST) {
                    x = Math.trunc((y * cosa + rho - _rhos) / sina);
                    if (x >= SampleOffset && x < width - SampleOffset && y >= SampleOffset && y < height - SampleOffset) {
                        sampledBlack = 0;
                        for (yy = y - SampleOffset; yy <= y + SampleOffset; yy++) {
                            for (xx = x - SampleOffset; xx <= x + SampleOffset; xx++) {
                                {
                                    if (_mono[yy][xx] == 0) {
                                        sampledBlack++;
                                    }

                                    //if (display->whiteCandidates)
                                    //	SetPixel(x, yy, RGB(100,100,50));		// display tracing to screen
                                }
                            }
                        }
                        if (SampleMaxBlack > sampledBlack) { // white
                            whiteLen++;
                        } else { // black
                            if (longestwhiteLen < whiteLen) {
                                longestwhiteLen = whiteLen;
                            }
                            whiteLen = 0;
                        }
                    }
                    if (longestwhiteLen < whiteLen) {
                        longestwhiteLen = whiteLen;
                    }
                }
                whiteV[rho - start] = longestwhiteLen;
            }
            // Display whiteV array to screen
            if (_callbackSetPixel) {
                for (x = 0; x < width; x++) {
                    for (y = 0; y < whiteV[x]; y++) {
                        setPixel(x, y, new bbs.Pixel(100, 100, 150));
                    }
                }
            }

            // detect 2 peaks of white vertical strips
            //..or if we find a strip that spans across more than half the image, we say that's good enough.
            targetValue = height / SAMPLE_DIST / 2;
            maxValue = 0;
            for (x = 1 + halfW; x > 0; x--) {
                if (maxValue < whiteV[x]) {
                    maxValue = whiteV[x];
                    left.rho = x + start;

                    if (maxValue >= targetValue) {
                        break;
                    }
                }
            }
            maxValue = 0;
            for (x = halfW; x < width - 1; x++) {
                if (maxValue < whiteV[x]) {
                    maxValue = whiteV[x];
                    right.rho = x + start;

                    if (maxValue >= targetValue) {
                        break;
                    }
                }
            }

            ///////////////////////////////
            // calculate line intersections points of white rectangle
            //

            // intersection points to calculate
            var lt = new bbs.Point(),
                rt = new bbs.Point(),
                lb = new bbs.Point(),
                rb = new bbs.Point();
            var c1, c2, t1, t2;

            c1 = (left.rho - _rhos) / Math.sin(left.theta * DEG2RAD);
            c2 = (top.rho - _rhos) / Math.sin(top.theta * DEG2RAD);
            t1 = Math.cos(left.theta * DEG2RAD) / Math.sin(left.theta * DEG2RAD);
            t2 = Math.cos(top.theta * DEG2RAD) / Math.sin(top.theta * DEG2RAD);
            lt.x = Math.round((c2 * t1 + c1) / (1 - t1 * t2));
            lt.y = Math.round(lt.x * t2 + c2);

            //c1 = (left.rho - m_rhos)/sin(left.theta*DEG2RAD);
            c2 = (bottom.rho - _rhos) / Math.sin(bottom.theta * DEG2RAD);
            //t1 = cos(left.theta*DEG2RAD)/sin(left.theta*DEG2RAD);
            t2 = Math.cos(bottom.theta * DEG2RAD) / Math.sin(bottom.theta * DEG2RAD);
            lb.x = Math.round((c2 * t1 + c1) / (1 - t1 * t2));
            lb.y = Math.round(lb.x * t2 + c2);

            c1 = (right.rho - _rhos) / Math.sin(right.theta * DEG2RAD);
            //c2 = (bottom.rho - m_rhos)/sin(bottom.theta*DEG2RAD);
            t1 = Math.cos(right.theta * DEG2RAD) / Math.sin(right.theta * DEG2RAD);
            //t2 = cos(bottom.theta*DEG2RAD)/sin(bottom.theta*DEG2RAD);
            rb.x = Math.round((c2 * t1 + c1) / (1 - t1 * t2));
            rb.y = Math.round(rb.x * t2 + c2);

            //c1 = (right.rho - m_rhos)/sin(right.theta*DEG2RAD);
            c2 = (top.rho - _rhos) / Math.sin(top.theta * DEG2RAD);
            //t1 = cos(right.theta*DEG2RAD)/sin(right.theta*DEG2RAD);
            t2 = Math.cos(top.theta * DEG2RAD) / Math.sin(top.theta * DEG2RAD);
            rt.x = Math.round((c2 * t1 + c1) / (1 - t1 * t2));
            rt.y = Math.round(rt.x * t2 + c2);

            //if (display->whiteArea)
            //	DrawRect(left, top, right, bottom, lt, rt, lb, rb, RGB(170,0,230));

            if (Math.abs((lt.y - lb.y) - (rt.x - lt.x)) > Math.max(lt.y - lb.y, rt.x - lt.x) / 3) // check if result is not a square, even an ugly one.
            {
                return;
            }

            ///////////////////////////////////////////////////
            // detect the black lines closest to the white line. First the left and right lines. Then based on the distance between them, detect the third and the sixth line, which sometimes are bolded compared to other lines. To be image skew proof.
            // The goal is to find m_grid[][] points.
            //
            var linesHor = [],
                linesVer = [],
                lineTemp = {};

            // leftmost line
            var offb = Math.round(lb.y + (lt.y - lb.y) / 9),
                offt = Math.round(lt.y - (lt.y - lb.y) / 9);
            linesVer[0] = houghTransform(left, (right.rho - left.rho) / 9, offb, offt, 4, true);
            // rightmost line
            offb = Math.round(rb.y + (rt.y - rb.y) / 9);
            offt = Math.round(rt.y - (rt.y - rb.y) / 9);
            linesVer[9] = houghTransform(right, (left.rho - right.rho) / 9, offb, offt, 4, true);
            // third line
            lineTemp.theta = linesVer[0].theta + Math.round((linesVer[9].theta - linesVer[0].theta) * 3 / 9.0);
            lineTemp.rho = linesVer[0].rho + Math.round((linesVer[9].rho - linesVer[0].rho) * 3 / 9.0 - (linesVer[9].rho - linesVer[0].rho) / 26.0);
            offb = Math.round(lb.y + (rb.y - lb.y) / 3 + (lt.y - lb.y) / 7);
            offt = Math.round(lt.y + (rt.y - lt.y) / 3 - (lt.y - lb.y) / 7);
            linesVer[3] = houghTransform(lineTemp, Math.round((linesVer[9].rho - linesVer[0].rho) / 13.0), offb, offt, 2, true);
            // sixth line
            lineTemp.theta = linesVer[0].theta + Math.round((linesVer[9].theta - linesVer[0].theta) * 6 / 9.0);
            lineTemp.rho = linesVer[0].rho + Math.round((linesVer[9].rho - linesVer[0].rho) * 6 / 9.0 - (linesVer[9].rho - linesVer[0].rho) / 26.0);
            offb = Math.round(lb.y + 2 * (rb.y - lb.y) / 3 + (lt.y - lb.y) / 7);
            offt = Math.round(lt.y + 2 * (rt.y - lt.y) / 3 - (lt.y - lb.y) / 7);
            linesVer[6] = houghTransform(lineTemp, Math.round((linesVer[9].rho - linesVer[0].rho) / 13.0), offb, offt, 2, true);

            // topmost line
            var offl = Math.round(lt.x + (rt.x - lt.x) / 9),
                offr = Math.round(rt.x - (rt.x - lt.x) / 9);
            linesHor[9] = houghTransform(top, (bottom.rho - top.rho) / 11, offl, offr, 4, false);
            // bottom line
            offl = Math.round(lb.x + (rb.x - lb.x) / 9);
            offr = Math.round(rb.x - (rb.x - lb.x) / 9);
            linesHor[0] = houghTransform(bottom, (top.rho - bottom.rho) / 9, offl, offr, 4, false);
            // third line
            lineTemp.theta = linesHor[0].theta + Math.round((linesHor[9].theta - linesHor[0].theta) * 3 / 9.0);
            lineTemp.rho = linesHor[0].rho + Math.round((linesHor[9].rho - linesHor[0].rho) * 3 / 9.0 - (linesHor[9].rho - linesHor[0].rho) / 25.0);
            offl = Math.round(lb.x + (lt.x - lb.x) / 3 + (rb.x - lb.x) / 7);
            offr = Math.round(rb.x + (rt.x - rb.x) / 3 - (rb.x - lb.x) / 7);
            linesHor[3] = houghTransform(lineTemp, Math.round((linesHor[9].rho - linesHor[0].rho) / 12.0), offl, offr, 2, false);
            // sixth line
            lineTemp.theta = linesHor[0].theta + Math.round((linesHor[9].theta - linesHor[0].theta) * 6 / 9.0);
            lineTemp.rho = linesHor[0].rho + Math.round((linesHor[9].rho - linesHor[0].rho) * 6 / 9.0 - (linesHor[9].rho - linesHor[0].rho) / 25.0);
            offl = Math.round(lb.x + 2 * (lt.x - lb.x) / 3 + (rb.x - lb.x) / 7);
            offr = Math.round(rb.x + 3 * (rt.x - rb.x) / 3 - (rb.x - lb.x) / 7);
            linesHor[6] = houghTransform(lineTemp, Math.round((linesHor[9].rho - linesHor[0].rho) / 12.0), offl, offr, 2, false);

            //////////////////////////////////////////////////////////////////
            // calculate ver and hor line intersections of lines 0, 3, 6 and 9
            //
            for (y = 0; y < 10; y += 3) {
                c1 = (linesVer[y].rho - _rhos) / Math.sin(linesVer[y].theta * DEG2RAD);
                t1 = Math.cos(linesVer[y].theta * DEG2RAD) / Math.sin(linesVer[y].theta * DEG2RAD);
                for (x = 0; x < 10; x += 3) {
                    c2 = (linesHor[x].rho - _rhos) / Math.sin(linesHor[x].theta * DEG2RAD);
                    t2 = Math.cos(linesHor[x].theta * DEG2RAD) / Math.sin(linesHor[x].theta * DEG2RAD);
                    _grid[x][y].x = Math.round((c2 * t1 + c1) / (1 - t1 * t2));
                    _grid[x][y].y = Math.round(_grid[x][y].x * t2 + c2);
                }
            }
            // interpolate remaining intersection points
            for (y = 0; y < 10; y += 3) {
                _grid[y][1].x = _grid[y][0].x + (_grid[y][3].x - _grid[y][0].x) / 3;
                _grid[y][2].x = _grid[y][3].x - (_grid[y][3].x - _grid[y][0].x) / 3;
                _grid[y][4].x = _grid[y][3].x + (_grid[y][6].x - _grid[y][3].x) / 3;
                _grid[y][5].x = _grid[y][6].x - (_grid[y][6].x - _grid[y][3].x) / 3;
                _grid[y][7].x = _grid[y][6].x + (_grid[y][9].x - _grid[y][6].x) / 3;
                _grid[y][8].x = _grid[y][9].x - (_grid[y][9].x - _grid[y][6].x) / 3;
                _grid[y][1].y = _grid[y][0].y + (_grid[y][3].y - _grid[y][0].y) / 3;
                _grid[y][2].y = _grid[y][3].y - (_grid[y][3].y - _grid[y][0].y) / 3;
                _grid[y][4].y = _grid[y][3].y + (_grid[y][6].y - _grid[y][3].y) / 3;
                _grid[y][5].y = _grid[y][6].y - (_grid[y][6].y - _grid[y][3].y) / 3;
                _grid[y][7].y = _grid[y][6].y + (_grid[y][9].y - _grid[y][6].y) / 3;
                _grid[y][8].y = _grid[y][9].y - (_grid[y][9].y - _grid[y][6].y) / 3;
            }
            for (x = 0; x < 10; x += 3) {
                _grid[1][x].x = _grid[0][x].x + (_grid[3][x].x - _grid[0][x].x) / 3;
                _grid[2][x].x = _grid[3][x].x - (_grid[3][x].x - _grid[0][x].x) / 3;
                _grid[4][x].x = _grid[3][x].x + (_grid[6][x].x - _grid[3][x].x) / 3;
                _grid[5][x].x = _grid[6][x].x - (_grid[6][x].x - _grid[3][x].x) / 3;
                _grid[7][x].x = _grid[6][x].x + (_grid[9][x].x - _grid[6][x].x) / 3;
                _grid[8][x].x = _grid[9][x].x - (_grid[9][x].x - _grid[6][x].x) / 3;
                _grid[1][x].y = _grid[0][x].y + (_grid[3][x].y - _grid[0][x].y) / 3;
                _grid[2][x].y = _grid[3][x].y - (_grid[3][x].y - _grid[0][x].y) / 3;
                _grid[4][x].y = _grid[3][x].y + (_grid[6][x].y - _grid[3][x].y) / 3;
                _grid[5][x].y = _grid[6][x].y - (_grid[6][x].y - _grid[3][x].y) / 3;
                _grid[7][x].y = _grid[6][x].y + (_grid[9][x].y - _grid[6][x].y) / 3;
                _grid[8][x].y = _grid[9][x].y - (_grid[9][x].y - _grid[6][x].y) / 3;
            }
            for (var a = 1; a < 9; a++) {
                if ((a === 3) || (a === 6)) {
                    continue;
                }

                for (var b = 1; b < 9; b++) {
                    if (b === 1) {
                        _grid[a][b].x = _grid[a][0].x + (_grid[a][3].x - _grid[a][0].x) / 3;
                        _grid[b][a].y = _grid[0][a].y + (_grid[3][a].y - _grid[0][a].y) / 3;
                    } else if (b == 2) {
                        _grid[a][b].x = _grid[a][3].x - (_grid[a][3].x - _grid[a][0].x) / 3;
                        _grid[b][a].y = _grid[3][a].y - (_grid[3][a].y - _grid[0][a].y) / 3;
                    } else if (b == 4) {
                        _grid[a][b].x = _grid[a][3].x + (_grid[a][6].x - _grid[a][3].x) / 3;
                        _grid[b][a].y = _grid[3][a].y + (_grid[6][a].y - _grid[3][a].y) / 3;
                    } else if (b == 5) {
                        _grid[a][b].x = _grid[a][6].x - (_grid[a][6].x - _grid[a][3].x) / 3;
                        _grid[b][a].y = _grid[6][a].y - (_grid[6][a].y - _grid[3][a].y) / 3;
                    } else if (b == 7) {
                        _grid[a][b].x = _grid[a][6].x + (_grid[a][9].x - _grid[a][6].x) / 3;
                        _grid[b][a].y = _grid[6][a].y + (_grid[9][a].y - _grid[6][a].y) / 3;
                    } else if (b == 8) {
                        _grid[a][b].x = _grid[a][9].x - (_grid[a][9].x - _grid[a][6].x) / 3;
                        _grid[b][a].y = _grid[9][a].y - (_grid[9][a].y - _grid[6][a].y) / 3;
                    }
                }
            }

            // draw grid lines
            if (_callbackSetPixel) {
                for (var i = 0; i < 10; i++) {
                    for (x = _grid[i][0].x; x < _grid[i][9].x; x++) {
                        y = _grid[i][0].y + ((x - _grid[i][0].x) * (_grid[i][9].y - _grid[i][0].y)) / (_grid[i][9].x - _grid[i][0].x);
                        if (x > 0 && x < width && y > 0 && y < height) {
                            setPixel(x, y, new bbs.Pixel(255, 255, 0));
                        }
                    }
                }
                for (var i = 0; i < 10; i++) {
                    for (y = _grid[0][i].y; y < _grid[9][i].y; y++) {
                        x = _grid[0][i].x + ((y - _grid[0][i].y) * (_grid[9][i].x - _grid[0][i].x)) / (_grid[9][i].y - _grid[0][i].y);
                        if (x > 0 && x < width && y > 0 && y < height) {
                            setPixel(x, y, new bbs.Pixel(255, 255, 0));
                        }
                    }
                }
            }

            // check boundaries
            if (_grid[0][0].x < 0 ||
                _grid[0][0].y < 0 ||
                _grid[0][9].y < 0 ||
                _grid[0][9].x >= width ||
                _grid[9][0].x < 0 ||
                _grid[9][0].y >= height ||
                _grid[9][9].y >= height ||
                _grid[9][9].x >= width ||
                _grid[3][3].y < 0 ||
                _grid[6][6].y < 0) {
                return;
            }
            return _grid;
        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	OCR()
        // Purpose:		Performs OCR on all sudoku cells. If needed, fixes the OCR values based on sudoku rules.
        // Parameters:
        // Returns:		TRUE if OCR values are valid, otherwise FALSE
        /////////////////////////////////////////////////////////////////////////
        function ocr() {
            var x, y;

            for (y = 0; y < 9; y++)
                for (x = 0; x < 9; x++)
                    ocrCell(y, x);

            //_cells.Fixit();

            // display OCR result on screen
            if (_callbackSetPixel) {
                for (y = 8; y >= 0; y--)
                    for (x = 0; x < 9; x++)
                        if (_cells[y][x] != 0) {
                            //displayCellNumber(y, x, RGB(10, 50, 0), _cells[y][x]);
                        }
            }

            //return _cells.AreAllCellsValid();
            return _cells;
        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	OCRCell()
        // Purpose:		Recognize a cell. Cell value could be empty (which is 0) or number 1-9.
        // Parameters:	y, x - coordinates of the grid cell. Not pixel coordinates.
        // Returns:
        /////////////////////////////////////////////////////////////////////////
        function ocrCell(cellY, cellX) {
            var width = _w,
                height = _h,
                sum, yindex, xindex;

            var lt = _grid[cellY + 1][cellX],
                rt = _grid[cellY + 1][cellX + 1],
                lb = _grid[cellY][cellX],
                rb = _grid[cellY][cellX + 1],
                //cellWidth  = (rt.x-1) - (lt.x+2),
                //cellHeight = (lt.y-1) - (lb.y+2),
                cellWidth = (rt.x) - (lt.x) - 3,
                cellHeight = (lt.y) - (lb.y) - 3,
                cellHalfW = Math.round(cellWidth / 2),
                cellHalfH = Math.round(cellHeight / 2),
                cellThirdW = Math.round(cellWidth / 3),
                cellThirdH = Math.round(cellHeight / 3),
                cellQuartW = Math.round(cellWidth / 4),
                cellQuartH = Math.round(cellHeight / 4);

            if (cellWidth < 5 || cellHeight < 9) {
                return;
            }

            //When searching for blob boundaries:
            var pixelStack, visitedPixels, currPos, reachLeft, reachRight;

            // enclosing corners of the blob - it is the goal of this function to calculate it
            var reslb = new bbs.Point(),
                resrt = new bbs.Point();

            // bitmap of the cell - UNROTATED.
            // make it a little bigger than the cell to account for max rotation (45deg)
            var blobSize = Math.ceil(Math.max(cellWidth, cellHeight) * 1.5),
                blob = ABOUtils.initArray({
                    length: blobSize,
                    factory: function() {
                        return ABOUtils.initArray({
                            length: blobSize,
                            value: 255
                        });
                    }
                });
            var slantVert, slantHoriz;

            // detect if cell is empty. How: sum the black pixels from the center of the cell. Sum must be greater than the threshold.
            var x, y, X, Y;
            sum = 0;
            for (X = lt.x + 2 + cellQuartW; X < rt.x - 1 - cellQuartW; X++) {
                Y = Math.round(lb.y + ((X - lt.x) * (rt.y - lt.y)) / (rt.x - lt.x));
                for (y = Y + 2 + cellQuartH; y < Y + (lt.y - lb.y) - 1 - cellQuartH; y++) {
                    x = Math.round(X - (lt.x - lb.x) - ((y - Y) * (lb.x - lt.x)) / (lt.y - lb.y));
                    if (_mono[y][x] === 0) {
                        sum++;
                    }
                    // uncomment to display the testing area
                    if (_callbackSetPixel) {
                        setPixel(x, y, (_mono[y][x] === 0) ? new bbs.Pixel(100, 100, 255, 0.8) :
                            new bbs.Pixel(100, 100, 200, 0.3));
                    }
                }
            }
            if (sum < (cellWidth * cellHeight) / 31) // threshold between empty cell and cell with a digit inside. Obtained empirically.
            {
                // uncomment next to display empty cells on the screen
                /*for (int X = lt.x+2; X < rt.x-1; X++)
                {	int Y = lb.y + ((X - lt.x) * (rt.y - lt.y)) / (rt.x - lt.x);
                    for (int y=Y+2; y < Y+(lt.y-lb.y)-1; y++)
                    {	
                        x = Math.trunc(X - (lt.x-lb.x) - ((y - Y) * (lb.x - lt.x)) / (lt.y - lb.y));
                        if (_mono[y][x] !== 0)
                            SetPixel(x, y, RGB(100,100,100));
                    }
                }*/
                //console.log('Empty cell', [cellY, cellX]);
                return; // skip OCR if the cell is empty
            }

            // fill blob array. UNROTATE the image, so the blob is UNROTATED.
            slantVert = (Math.abs(lt.x - lb.x) > 1) ?
                (lt.x - lb.x) / (lt.y - lb.y)
                //If the cell is rotated by less than 1 pixel,
                //our nearest-neighbor (un)rotation does more harm than good...
                :
                0;
            slantHoriz = (Math.abs(rb.y - lb.y) > 1) ?
                (rb.y - lb.y) / (rb.x - lb.x) :
                0;
            yindex = 0;
            for (Y = lb.y + 2; Y < lt.y - 1; Y++) {
                xindex = 0;
                X = Math.round(lb.x + ((Y - lb.y) * slantVert));

                for (x = X + 2; x < X + (rb.x - lb.x) - 1; x++) {
                    y = Math.round(Y + ((x - X) * slantHoriz));

                    if (_mono[y][x] === 0) {
                        blob[yindex][xindex] = 0;
                    }
                    xindex++;
                }
                yindex++;
            }

            // detect the blob boundaries

            //The original approach will often fail on high-quality images,
            //because it only searches for black pixels in a limited area in the middle of the cell.
            //The images we feed this app are usually of good quality, 
            //so we'll try a different approach to isolate the digit blob:
            //  - Find a black pixel in the center of the cell, 
            //    and then collect all black pixels that are connected to that one

            /*
            // hor line scan
            // sweep bottom part (first 1/3 of the height). Start from the 1/3 of the height and go down to the bottom
            bIsFirstWhite = false;
            reslb.y = cellThirdH;
            for (y = cellThirdH; y >= 0; y--)
            {
                bIsWhite = true;
                for (x=cellThirdW; x < cellWidth-cellThirdW; x++)	// left->right
                {
                    if (blob[y][x] == 0)	// if at least one black pixel found in that line, go to next line
                    {	reslb.y = y;
                        bIsFirstWhite = false;
                        bIsWhite = false;
                        break;
                    }
                }

                if (bIsWhite == true)
                {
                    if (bIsFirstWhite == false)
                        bIsFirstWhite = true;
                    else
                        break;	// stop search after 2 consecutive white lines
                }
            }

            // sweep top part (3/3 of the height). Direction from center->top
            bIsFirstWhite = false;
            resrt.y = 2*cellThirdH;
            for (y = 2*cellThirdH; y < cellHeight; y++)
            {
                bIsWhite = true;
                for (x=cellThirdW; x < cellWidth-cellThirdW; x++)	// left->right
                {
                    if (blob[y][x] == 0)	// if at least one black pixel found in that line, go to next line
                    {	resrt.y = y;
                        bIsFirstWhite = false;
                        bIsWhite = false;
                        break;
                    }
                }

                if (bIsWhite == true)
                {
                    if (bIsFirstWhite == false)
                        bIsFirstWhite = true;
                    else
                        break;	// stop search after 2 white lines
                }
            }


            // vertical line scan
            // sweep right part. From the center to the right
            resrt.x = cellHalfW + 1;
            for (x = cellHalfW + 1; x < cellWidth; x++)
            {
                bIsWhite = true;
                for (y=reslb.y+2; y < resrt.y-1; y++)	// down->up
                {
                    if (blob[y][x] == 0)	// if at least one black pixel found in that line, go to next line
                    {	resrt.x = x;
                        bIsWhite = false;
                        break;
                    }
                }

                if (bIsWhite == true)
                {	break;	// stop search after first white line
                }
            }

            // sweep left part. From the center to the left
            reslb.x = cellHalfW;
            for (x = cellHalfW; x >= 0; x--)
            {
                bIsWhite = true;
                for (y=reslb.y+2; y < resrt.y-1; y++)	// down->up
                {
                    if (blob[y][x] == 0)	// if at least one black pixel found in that line, go to next line
                    {	reslb.x = x;
                        bIsWhite = false;
                        break;
                    }
                }

                if (bIsWhite == true)
                {	break;	// stop search after first white line
                }
            }
            */

            //Search outward from the center to find the first black pixel:
            y = cellHalfH;
            for (x = 1; x < cellHalfW; x++) // left->right
            {
                if (blob[y][cellHalfW - x] === 0) {
                    pixelStack = [
                        [cellHalfW - x, y]
                    ];
                    break;
                } else if (blob[y][cellHalfW + x] === 0) {
                    pixelStack = [
                        [cellHalfW + x, y]
                    ];
                    break;
                }
            }
            if (!pixelStack) {
                //Empty cell with lots of noise in the corners?
                return;
            }

            reslb.x = resrt.x = pixelStack[0][0];
            reslb.y = resrt.y = y;

            //Adapted version of William Malone's paint bucket algorithm:
            //http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
            //https://github.com/williammalone/HTML5-Paint-Bucket-Tool
            visitedPixels = {};

            function isNewBlobPixel(x, y) {
                return ((blob[y][x] === 0) && !visitedPixels[[x, y]]);
            }
            while (pixelStack.length) {
                currPos = pixelStack.pop();
                x = currPos[0];
                y = currPos[1];

                while ((y >= 0) && (blob[y][x] === 0)) {
                    y--;
                }

                reachLeft = false;
                reachRight = false;
                while ((++y < cellHeight) && isNewBlobPixel(x, y)) {
                    visitedPixels[[x, y]] = true;
                    reslb.x = Math.min(reslb.x, x);
                    reslb.y = Math.min(reslb.y, y);
                    resrt.x = Math.max(resrt.x, x);
                    resrt.y = Math.max(resrt.y, y);

                    if (x > 0) {
                        if (isNewBlobPixel(x - 1, y)) {
                            if (!reachLeft) {
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        } else if (reachLeft) {
                            reachLeft = false;
                        }
                    }

                    if (x < cellWidth) {
                        if (isNewBlobPixel(x + 1, y)) {
                            if (!reachRight) {
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        } else if (reachRight) {
                            reachRight = false;
                        }
                    }

                }
            }

            //Finally, OCR the blob !
            _cells[cellY][cellX] = ocrClassify(blob, reslb, resrt);

            /*// uncomment next block to save wrongly recognized blobs on disk (current directory) in BMP format
            // type your initial sudoku values in gold[][] array
            int gold[9][9] = {7,0,3,0,0,8,9,0,0,
                              0,6,2,0,0,0,4,0,0,
                              0,0,0,2,0,0,0,8,0,
                              0,0,0,0,0,0,2,9,0,
                              0,0,0,0,1,4,0,0,7,
                              9,7,0,3,0,0,6,0,0,
                              6,0,0,1,8,0,0,0,0,
                              0,0,0,2,0,0,0,0,5,
                              0,0,9,0,0,6,0,4,0};
            if (gold[8-yBottom][xLeft] != 0 && m_cells.cell[yBottom][xLeft].value != gold[8-yBottom][xLeft])
                SaveBitmapForTraining(&blob[0][0], reslb, resrt, yBottom, xLeft, gold[8-yBottom][xLeft]);
            */

            //*// uncomment next block to display UNROTATED blobs with boundaries on screen
            if (_callbackSetPixel) {
                var renderOffsetX = lb.x + 2,
                    renderOffsetY = lb.y + 2;

                var blobPixel = new bbs.Pixel(0, 255, 0, .5);
                for (yindex = 0; yindex < cellHeight; yindex++)
                    for (xindex = 0; xindex < cellWidth; xindex++) {
                        if (blob[yindex][xindex] === 0) {
                            setPixel(xindex + renderOffsetX, yindex + renderOffsetY, blobPixel);
                        }
                    }

                var boundingLinesPixel = new bbs.Pixel(200, 100, 100, 0.7);
                for (yindex = 0; yindex < cellHeight; yindex += 2) {
                    setPixel(resrt.x + renderOffsetX, yindex + renderOffsetY, boundingLinesPixel);
                    setPixel(reslb.x + renderOffsetX, yindex + renderOffsetY, boundingLinesPixel);
                }
                for (xindex = 0; xindex < cellWidth; xindex += 2) {
                    setPixel(xindex + renderOffsetX, reslb.y + renderOffsetY, boundingLinesPixel);
                    setPixel(xindex + renderOffsetX, resrt.y + renderOffsetY, boundingLinesPixel);
                }
            }
        }

        //////////////////////////////////////////////////////////////////////////
        // Function:	Classify()
        // Purpose:		Classifies the passed blob. It compares the blob to m_zon[] and m_ratios[]. Less difference is, more probable that this is the value.
        //				It is simple 'k-nearest neighbours' method with k=1.
        // Parameters:	blob - input blob to be OCR-ed
        //				lb, rt - pixel coordinates of the input blob
        //				cell - cell to update. Updated are members cell->OCR[] and cell->value.
        // Returns:		
        /////////////////////////////////////////////////////////////////////////
        function ocrClassify(blob, lb, rt) {
            //We will normalize the blob to an 10x10px image:
            const NORM_W = 10,
                NORM_H = 10,
                NORM_BLACK = 1024;

            var width = rt.x - lb.x + 1,
                height = rt.y - lb.y + 1;
            if (width < 2 || height < 5)
                return;

            var x, y, i, ocrDiffs = [],
                lowestDiff, result = -1;

            // create grid 5x5
            var sampleW = width / NORM_W,
                sampleH = height / NORM_H,
                normX, normY, sourceX, sourceXStart, sourceXEnd, sourceY, sourceYStart, sourceYEnd,
                weight, sum, count, normVal, maxNormVal = 0,
                normalized = ABOUtils.initArray({
                    length: NORM_H,
                    factory: function() {
                        return ABOUtils.initArray({
                            length: NORM_W,
                            value: 0
                        });
                    }
                });

            for (normY = 0; normY < NORM_H; normY++) {
                sourceYStart = lb.y + (normY * sampleH);
                sourceYEnd = sourceYStart + sampleH;

                for (normX = 0; normX < NORM_W; normX++) {
                    sourceXStart = lb.x + (normX * sampleW);
                    sourceXEnd = sourceXStart + sampleW;

                    sum = count = normVal = 0;

                    for (sourceY = Math.floor(sourceYStart); sourceY < Math.ceil(sourceYEnd); sourceY++) {
                        for (sourceX = Math.floor(sourceXStart); sourceX < Math.ceil(sourceXEnd); sourceX++) {

                            weight = 1;
                            if (sourceY < sourceYStart) {
                                weight *= (sourceY + 1 - sourceYStart);
                            }
                            if (sourceY === Math.floor(sourceYEnd)) {
                                weight *= (sourceYEnd - sourceY);
                            }
                            if (sourceX < sourceXStart) {
                                weight *= (sourceX + 1 - sourceXStart);
                            }
                            if (sourceX === Math.floor(sourceXEnd)) {
                                weight *= (sourceXEnd - sourceX);
                            }

                            count += weight;
                            if (blob[sourceY][sourceX] === 0) // black
                            {
                                sum += NORM_BLACK * weight;
                            }
                        }
                    }

                    //Note: Higher values = darker
                    normVal = sum / count;
                    normalized[normY][normX] = normVal;
                    if (maxNormVal < normVal) {
                        maxNormVal = normVal;
                    }
                }
            }

            if (maxNormVal === 0) {
                maxNormVal = 1; // avoid division by zero
            }

            /*
            //DEBUG
            var dbBlob = printBlob(blob.filter(function(r, i) {
                                            return (i >= (lb.y-1)) && (i <= (rt.y+1));
                                        }).map(function(r) {
                                            return r.slice(lb.x-1, rt.x+2)
                                        }));
            var nmBlob = printBlob(normalized, 1024, 0);
            console.log(dbBlob);
            console.log(nmBlob);
            //DEBUG
            */

            // "Stretch contrast": Make sure the darkest normalized "pixels" are black:
            for (y = 0; y < NORM_H; y++) {
                for (x = 0; x < NORM_W; x++) {
                    //normalized[y][x] = Math.round((normalized[y][x] * NORM_BLACK) / maxNormVal);
                }
            }

            // next loop compares the normalized[] with all nine m_zons[] by summing up the differences between test[] and m_zons[].
            // the goal is to detect the lowest difference.
            lowestDiff = Number.MAX_VALUE;

            for (i = 0; i < 9; i++) {
                //var zone = OCR_ZON[i];
                var ocrChar = OCR_ZON[i],
                    smallestSum = Number.MAX_VALUE;

                ocrChar.zoneDensities.forEach(function(zone) {
                    sum = 0;
                    for (y = 0; y < NORM_H; y++) {
                        for (x = 0; x < NORM_W; x++) {
                            sum += Math.abs(normalized[y][x] - zone[y][x]);
                        }
                    }
                    // include ratios comparing
                    sum += Math.abs(width * 100 / height - OCR_RATIOS[i]) * 300;

                    smallestSum = Math.min(sum, smallestSum);
                });

                //If this is the best match for a digit yet,
                //we update 'result' to the current digit:
                if (lowestDiff > smallestSum) {
                    lowestDiff = smallestSum;
                    result = i + 1;
                }
                ocrDiffs[i + 1] = smallestSum;;
            }

            // digit 1 needs a special handling
            if (result !== 1) {
                if ((width * 100) / height < 37) // if blob ratio (height:width) is less than 37% this is digit 1 for sure. Because is too slim to be anything else.
                {
                    result = 1;
                    ocrDiffs[1] = 0;
                }
            } else {
                /* After the nearest-neighbor rotation of monochrome pixels in ocrCell,
                   the serif at the top may just stretch past this limit...
                if ((width*100)/height > 53)	// if blob ratio (height:width) is more than 53% this can't be digit 1 for sure. It is too thick for 1.
                {
                    ocrDiffs[1] = Number.MAX_VALUE;
                    // find next probable result between digits 2-9
                    lowestDiff = Number.MAX_VALUE;
                    for (i=2; i<10; i++) {
                        if (lowestDiff > ocrDiffs[i]) {
                            lowestDiff = ocrDiffs[i];
                            result = i;
                        }
                    }
                }
                */
            }

            if (result === -1) {
                console.log('OCR calc error?', lb, rt, normalized, ocrDiffs);
            }
            return result;
        }

        function printBlob(blob, black, white) {
            const Grayscale = '#==- ',
                ShadeCount = Grayscale.length;
            var brightness;

            if (black === undefined) {
                black = 0
            };
            if (white === undefined) {
                white = 255
            };

            var print = blob.map(function(r) {
                var asciiRow = r.map(function(p) {
                    brightness = Math.abs(p - black) / (Math.abs(white - black) + 1);
                    var grayIndex = Math.floor(brightness * ShadeCount);
                    return Grayscale[grayIndex];
                }).join('');
                return asciiRow;
            }).join('\n');

            return print;
        }

        function setPixel(x, y, pixel) {
            if (_callbackSetPixel) {
                _callbackSetPixel(new bbs.Point(x, y), pixel);
            }
        }

        //Public methods:
        this.monochrome = monochrome;
        this.houghTransformCenter = houghTransformCenter;
        this.detectRect = detectRect;
        this.ocr = ocr;
    };

})(BBSud);

//
// Image file -> img -> canvas -> grayscale array
//
(function(undefined) {
    var _log = $$('#log')[0];

    var _sourceImage = new Image(); //$$('#source-image')[0];
    //http://stackoverflow.com/questions/18474727/canvas-has-been-tainted-by-cross-origin-data-work-around
    _sourceImage.crossOrigin = "anonymous";
    _sourceImage.onload = doSomeImageProcessing;

    const MaxNormWidth = 500;
    var _sourceCanvas = $$('#source')[0],
        _sourceContext = _sourceCanvas.getContext("2d"),
        _normCanvas = $$('#normalized')[0],
        _normContext = _normCanvas.getContext("2d");

    var _bbs, //BBSud.SudBitmap
        _board = $$('#board')[0],
        _stepSolve = $$('#step-solve')[0],
        _solve = $$('#solve')[0];

    //http://stackoverflow.com/questions/4067469/selecting-all-text-in-html-text-input-when-clicked
    ABOUtils.live('click', '#board .cell input', function() {
        this.select();
    });
    _solve.onclick = solveBoard;
    //new Draggabilly(_board, {
        //handle: '.handle'
    //});

    function initInputs() {
        var fileArea = document, //$$('#file-area')[0],
            fileInput = $$('#file-area input')[0];

        var inputAction = function(data) {
            clearLog();
            _stepSolve.style.display = 'none';

            doLog('Image dropped.');
            renderSource(data);
        };

        ABOUtils.dropImage(fileArea, inputAction);
        ABOUtils.dropImage(fileInput, inputAction);
    }

    function renderSource(imgSrc) {
        _sourceImage.src = imgSrc;
        _sourceImage.setAttribute('class', 'loaded');
    }

    function doSomeImageProcessing() {
        _bbs = normalizeImage();

        // detects the angle of rotation
        var strongestLine,
            grid, digits;

        if ((strongestLine = _bbs.houghTransformCenter()) &&
            (grid = _bbs.detectRect(strongestLine.theta))) {
            //console.log(strongestLine, grid);

            digits = _bbs.ocr();
            doLog("OCR-ed grid\n", digits.join('\n ')
                .replace(/,/g, ' ')
                .replace(/0/g, '.'));
        } else {
            doLog("Couldn't find a sudoku board in that image..");
            return;
        }

        //Recreate the grid using textboxes, and wait for manual OCR fixes:
        renderBoard(grid, digits);
        _stepSolve.style.display = 'block';
    }

    function renderBoard(grid, digits) {
        //Calculate width and angle from two opposite corners,
        //to get a decent overall fit:
        var topLeft = grid[0][0],
            topRight = grid[0][9],
            bottomLeft = grid[9][0],
            bottomRight = grid[9][9],
            dX = bottomRight.x - topLeft.x,
            dY = bottomRight.y - topLeft.y;

        var width = (findLength(topLeft, topRight) + findLength(bottomLeft, bottomRight)) / 2,
            height = (findLength(topLeft, bottomLeft) + findLength(topRight, bottomRight)) / 2,
            angles = [findAngle(topLeft, topRight),
                findAngle(bottomLeft, bottomRight),
                findAngle(topLeft, bottomLeft) - 90,
                findAngle(topRight, bottomRight) - 90
            ];

        var angle = angles.reduce(function(sum, a) {
            return sum + a;
        }) / angles.length;

        //Rotate and stretch the board..
        doLog('Adjusting board');
        var style = _board.style;
        style.top = topLeft.y + 'px';
        style.left = topLeft.x + 'px';
        style.transform = 'rotate(' + Math.round(angle) + 'deg)';
        style.width = Math.round(width) + 'px';
        // + 50: Make room for extra handle for drag & drop:
        style.height = Math.round(height) + 50 + 'px';
        style.fontSize = Math.round(height / 10) + 'px';

        //..and fill it with OCR'ed digits:
        doLog('Filling in values');
        traverseBoard(function(input, x, y) {
            var digit = digits[y][x] || '';
            input.value = digit;
        });

        function findLength(p1, p2) {
            var dX = p2.x - p1.x,
                dY = p2.y - p1.y;
            return Math.sqrt(dX * dX + dY * dY);
        }

        function findAngle(p1, p2) {
            var dX = p2.x - p1.x,
                dY = p2.y - p1.y,
                angle, degrees;

            //Clockwise, starting at 3 o'clock:
            //tan(θ) = dY / dX
            angle = Math.atan(dY / dX);
            if (dX < 0) {
                angle += Math.PI;
            }

            degrees = angle * 180 / Math.PI;

            //console.log('findAngle', p1, p2, [dX,dY], degrees);
            return degrees;
        }
    }

    function solveBoard() {
        var representation = '';
        traverseBoard(function(input, x, y) {
            representation += (Number(input.value) || '.');
        });
        console.log(representation);

        //https://attractivechaos.github.io/plb/kudoku.html
        //  (https://github.com/attractivechaos/plb/blob/gh-pages/kudoku.js)
        var solver = sudoku_solver()
        var solstr, solarr = solver(representation, 1);
        if (solarr && solarr.length) {
            solstr = solarr[0];
            traverseBoard(function(input, x, y) {
                input.value = solstr[y * 9 + x];
            });

            //Alternative library:
            //  https://github.com/pocketjoso/sudokuJS
        } else {
            doLog("Couldn't solve that sudoku. Double check the numbers.");
        }
    }

    function traverseBoard(work) {
        var rows = $$('.row', _board);
        rows.forEach(function(row, y) {
            var cells = $$('.cell', row);
            cells.forEach(function(cell, x) {
                var input = $$('input', cell)[0];
                work(input, x, y);
            })
        })
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
        doLog('Resizing', [imgW, imgH], '->', [w, h]);
        _normCanvas.width = _sourceCanvas.width = w;
        _normCanvas.height = _sourceCanvas.height = h;
        _sourceContext.drawImage(img, 0, 0, w, h);

        // Create 2D array with BBSud pixels
        //
        imgData = _sourceContext.getImageData(0, 0, w, h);
        doLog('Read image data...');
        pixels = [];
        //If anything, a bit slower...
        //  pixels = ABOUtils.initArray({ length: h, factory: function() {
        //    return ABOUtils.initArray({ length: w });
        //  }});
        index = 0;
        for (var y = 0; y < h; ++y) {
            if (!(y % 100)) {
                doLog('Reading row ' + y);
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
        doLog('Extracted pixels...');

        // Create a monochrome image and redraw:
        //
        bbs = new BBSud.SudBitmap({
            image: pixels,
            setPixel: renderPixel
        });
        pixelsMono = bbs.monochrome();
        doLog('B/W image...');

        for (var y = 0; y < h; ++y) {
            for (var x = 0; x < w; ++x) {
                var index = (y * w + x) * 4; // index of the current pixel
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

    function renderPixel(point, pixel) {
        var x = Math.round(point.x),
            y = Math.round(point.y);

        //_normContext.save();
        _normContext.fillStyle = (pixel.alpha === undefined) ?
            "rgb(" + [pixel.red, pixel.green, pixel.blue] + ")" :
            "rgba(" + [pixel.red, pixel.green, pixel.blue, pixel.alpha] + ")";
        _normContext.fillRect(x, y, 1, 1);
        //_normContext.restore()
    }

    function doLog() {
        var msg = getTimePrefix() + Array.prototype.join.call(arguments, ' ')
        _log.textContent += msg + '\n';
        console.log(msg);
    }

    function clearLog() {
        _log.textContent = '';
    }

    window.onerror = function(msg, url, linenumber) {
        alert(getTimePrefix() + 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
        //return true;
    }

    function getTimePrefix() {
        var d = new Date();
        //return d.toLocaleTimeString() + ' - ';
        var millis = '00' + d.getMilliseconds();
        millis = millis.substring(millis.length - 3);
        return d.toTimeString().split(' ')[0] + '.' + millis + ' - ';
    }

    initInputs();

})();
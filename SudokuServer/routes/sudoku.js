var express = require('express');
var router = express.Router();
var multer = require('multer');


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening here.');
    next(); // make sure we go to the next routes and don't stop here
});
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

/* POST image to be OCRed. */
var uploadImage = multer({ dest: './uploads/'}).single('imageFile');  
//router.post('/ocrFile/', function(req, res, next) {  
router.post('/ocrFile/', function(req, res) {
    uploadImage(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return
        }

    // Everything went fine
        console.log('here I am'); //form fields
        console.log(req.body);
        res.status(204).end();
  })
})
//  console.log('here I am'); //form fields
//  console.log(req.body);
	/* example output:
	{ title: 'abc' }
	 */
	//console.log(req.file); //form files
	/* example output:
            { fieldname: 'upl',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
	 */
	//res.status(204).end();
//});

module.exports = router;
var express = require('express');
var router = express.Router();
var multer = require('multer');
var SudokuRendererServer = require('../renderer/sudokuRendererServer');
//import {SudokuRendererServer} from '../renderer/sudokuRendererServer';
<<<<<<< HEAD
var MessageRepositoryRestServer = require('../servers/messageRepositoryRestServer');
=======
>>>>>>> 7913dd52435130319e2416066de9153dd9a84e0f
// middleware to use for all requests
router.use(function (req, res, next) {
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
<<<<<<< HEAD
=======
//var uploadImage = multer({ dest: './uploads/'}).single('imageFile');
>>>>>>> 7913dd52435130319e2416066de9153dd9a84e0f
var storageDisk = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '.' + file.originalname);
    }
});
var storageMem = multer.memoryStorage();
var uploadImage = multer({ storage: storageMem, limits: { fileSize: 1000000, files: 1 }, }).single('imageFile');
router.post('/ocrFile/', function (req, res) {
    uploadImage(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return;
        }
<<<<<<< HEAD
        // Everything is fine
        var recognitionResult = SudokuRendererServer.renderBoardImage(req.file, req, res);
    });
});
/*
 * GET one random message for the nasty player
 */
router.get('/nastyPlayerMessageRandom', function (req, res) {
    var singl = MessageRepositoryRestServer.getSingleton();
    MessageRepositoryRestServer.getSingleton().getNastyPlayerMessageRandom(req, res);
});
=======
        // Everything went fine
        console.log('here I am'); //form fields
        console.log(req.body);
        //var renderer = new SudokuRendererServer();
        //let recognitionResult = renderer.renderBoardImage(req.file);
        var recognitionResult = SudokuRendererServer.renderBoardImage(req.file, req, res);
        //var digits = [[1,2,3]];
        //res.json({digits: JSON.stringify(digits)});
        //res.status(204).end();
    });
});
>>>>>>> 7913dd52435130319e2416066de9153dd9a84e0f
module.exports = router;
//# sourceMappingURL=sudoku.js.map
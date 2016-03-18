var express = require('express');
var router = express.Router();
var multer = require('multer');
var SudokuRendererServer = require('../renderer/sudokuRendererServer');
//import {SudokuRendererServer} from '../renderer/sudokuRendererServer';
var MessageRepositoryRestServer = require('../servers/messageRepositoryRestServer');
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
module.exports = router;
//# sourceMappingURL=sudoku.js.map
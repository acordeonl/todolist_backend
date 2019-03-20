var fs = require('fs');
var fetch = require('node-fetch');
var verifyUser = require('../../middleware/auth/verifyUser');

var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./config/aws-credentials.js');
var s3 = new AWS.S3();

var express = require('express');
var router = express.Router();

const util = require('util');
const deleteFile = util.promisify(fs.unlink);

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp_files/');
    },
    filename: function (req, file, cb) {
        cb(null,'file_'+new Date().getTime()+'_'+file.originalname) ; 
    }
});
var upload = multer({
    storage: storage
});
var type = upload.single('file');

router.post('/' , verifyUser, type , async function (req, res,next) {
    try {
        let uploadRecordingPromise = new Promise(resolve => uploadRecordingPromiseR = resolve);
        fs.readFile('./tmp_files/'+req.file.filename , async function (err, data) {
            if (err)
                return next(err);
            deleteFile (`tmp_files/${req.file.filename}`) ; 
            
            params = {
                Bucket: 'key.conservation.org',
                Key: req.file.filename ,
                ACL:'public-read',
                Body: data
                // CacheControl = 'public, s-maxage=31536000, max-age=31536000' 
            };
            s3.putObject(params, async function (err, data) {
                if (err) {
                    console.log('S3Error: ', err) ; 
                    return next(err) ;
                } else {
                    uploadRecordingPromiseR() ;
                    // console.log("Successfully uploaded to assets "+req.file.filename);

                }
            });
            await uploadRecordingPromise ; 
            res.status(201).json({
                filename:req.file.filename
            }) ; 
        });
    } catch (err) { return next(err) ; }
});


module.exports = router;
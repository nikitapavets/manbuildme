var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');

var pool = mysql.createPool({
    "host": "eu-cdbr-west-01.cleardb.com",
    "user": "b0bd6590a971c5",
    "password": "5388152b",
    "database": "heroku_479693d37aa70d6",
    "connectionLimit": 10
});

router.post('/new', function (req, res) {
    var comment = {
        value: req.body.comment,
        comment_id: req.body.hash
    };
    pool.query('INSERT INTO comments SET ?', comment, function(err, result) {
        //todo
    });
});

module.exports = router;
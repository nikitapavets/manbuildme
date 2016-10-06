var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');

var pool = mysql.createPool({
    host: "eu-cdbr-west-01.cleardb.com",
    user: "b0bd6590a971c5",
    password: "5388152b",
    database: "heroku_479693d37aa70d6",
    connectionLimit: 10
});

router.post('/new', function (req, res) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var comment = {
            val: req.body.comment,
            component_id: req.body.hash,
            user_id: req.body.user_id
        };
        connection.query('INSERT INTO comments SET ?', comment, function (err, result) {
            connection.release();
        });
    });
});

router.post('/update', function (req, res) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var component_id = req.body.component_id;
        var count = req.body.count;

        var sql = 'SELECT c.id, c.val, c.user_id, u.first_name, u.second_name ' +
            'FROM comments c ' +
            'INNER JOIN db_users u ON u.id = c.user_id ' +
            'WHERE component_id = ' + component_id + ' ' +
            'ORDER BY id ASC';
        connection.query(sql, function (err, comments_rows) {
            res.send(comments_rows);
            connection.release();
        });
    });
});

router.post('/remove', function (req, res) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var comment_id = req.body.comment_id;

        var sql = 'DELETE FROM comments ' +
            'WHERE id = ' + comment_id;
        connection.query(sql, function (err, result) {
            connection.release();
            res.send("ok!");
        });
    });
});

module.exports = router;
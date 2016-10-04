var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');

/*var pool = mysql.createPool({
 host: "eu-cdbr-west-01.cleardb.com",
 user: "b0bd6590a971c5",
 password: "5388152b",
 database: "heroku_479693d37aa70d6",
 connectionLimit: 10,
 waitForConnections: true,
 queueLimit: 0
 });*/
var pool = mysql.createConnection({
    host     : 'eu-cdbr-west-01.cleardb.com',
    user     : 'b0bd6590a971c5',
    password : '5388152b',
    database: "heroku_479693d37aa70d6",
    multipleStatements: true
});

router.post('/new', function (req, res) {
    var comment = {
        value: req.body.comment,
        component_id: req.body.hash,
        user_id: req.body.user_id
    };
    pool.query('INSERT INTO comments SET ?', comment, function(err, result) {
        //todo
    });
});

router.post('/update', function (req, res) {
    var component_id = req.body.component_id;
    var count = req.body.count;

    var sql = 'SELECT c.id, c.value, c.user_id, u.first_name, u.second_name ' +
        'FROM comments c ' +
        'INNER JOIN users u ON u.id = c.user_id ' +
        'WHERE component_id = ' + component_id + ' ' +
        'LIMIT ' + count + ', 5';
    pool.query(sql, function(err, comments_rows) {
        res.send(comments_rows);
    });
});

module.exports = router;
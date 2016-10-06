var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var eachOf  = require('async/eachOf');
var async = require('async');

var pool = mysql.createPool({
  host: "eu-cdbr-west-01.cleardb.com",
  user: "b0bd6590a971c5",
  password: "5388152b",
  database: "heroku_479693d37aa70d6",
  connectionLimit: 10
});

router.get('/', function(req, res){
    res.render('index');
});

router.post('/auth', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var new_user = req.body;

        connection.query("SELECT * FROM db_users WHERE social_id=" + new_user.social_id + " LIMIT 1", function (error, rows) {
            var user = rows[0];
            if (rows.length == 0) {
                connection.query('INSERT INTO db_users SET ?', new_user, function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                        var user_id = result.insertId;
                        connection.query("SELECT * FROM db_users WHERE id=" + user_id + " LIMIT 1", function (error, rows) {
                            var user = rows[0];
                            res.send(user);
                            connection.release();
                        });
                    }
                });
            } else {
                res.send(user);
                connection.release();
            }
        });
    });

});

router.post('/search', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var data = req.body.search_data;

        var sql = 'SELECT NULL AS user_id, (SELECT site_id FROM db_pages WHERE id = (SELECT page_id FROM components WHERE id = component_id) ) AS site_id, (SELECT page_id FROM components WHERE id = component_id) AS page_id, val, "comment" AS type FROM comments c ' +
        'WHERE MATCH (c.val) AGAINST ("' +data+ '" IN BOOLEAN MODE) ' +
        'UNION ' +
        'SELECT NULL, id, NULL, title, "site" FROM sites s ' +
        'WHERE MATCH (s.title) AGAINST ("' +data+ '" IN BOOLEAN MODE) ' +
        'UNION ' +
        'SELECT id, NULL, NULL, first_name, "user" FROM db_users u ' +
        'WHERE MATCH (u.first_name) AGAINST ("' +data+ '" IN BOOLEAN MODE) ' +
        'UNION ' +
        'SELECT id, NULL, NULL, second_name, "user" FROM db_users u ' +
        'WHERE MATCH (u.second_name) AGAINST ("' +data+ '" IN BOOLEAN MODE) ' +
        'UNION ' +
        'SELECT NULL, site_id, id, title, "page" FROM db_pages p ' +
        'WHERE MATCH (p.title) AGAINST ("' +data+ '" IN BOOLEAN MODE)';
        connection.query(sql, function (error, result_rows) {

            console.log(result_rows);

            if(!error){

                connection.release();

                var result = new Object();
                result.users = [];
                result.sites = [];
                result.pages = [];
                result.comments = [];

                async.forEachOf(result_rows, function (res, index, callback) {

                    switch(res.type){
                        case 'comment':
                            result.comments.push(res);
                            break;
                        case 'user':
                            result.users.push(res);
                            break;
                        case 'site':
                            result.sites.push(res);
                            break;
                        case 'page':
                            result.pages.push(res);
                            break;
                    }

                    callback();
                }, function(error){
                    console.log(result);
                    res.send(result);
                });
            }else{
                throw error;
            }
        });
    })
})

router.post('/top_pages', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var sql = 'SELECT p.id, p.title, p.update_date, p.create_date, ' +
            's.id AS site_id, s.title AS site_name, s.theme, ' +
            'u.first_name, u.second_name, u.id AS user_id, ' +
            '(SELECT AVG(rate) FROM rate r WHERE r.page_id = p.id) AS rate ' +
            'FROM db_pages AS p ' +
            'INNER JOIN sites AS s ON p.site_id = s.id ' +
            'INNER JOIN db_users AS u ON s.user_id = u.id ' +
            'ORDER BY (SELECT AVG(rate) FROM rate r WHERE r.page_id = p.id) DESC';
        connection.query(sql, function (error, pages_rows) {

            if(!error){
                var last_pages = pages_rows;
                res.send(last_pages);
                connection.release();
            }else{
                throw error;
            }
        });
    })
})

router.post('/last_pages', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var sql = 'SELECT p.id, p.title, p.update_date, p.create_date, ' +
            's.id AS site_id, s.title AS site_name, s.theme, ' +
            'u.first_name, u.second_name, u.id AS user_id, ' +
            '(SELECT AVG(rate) FROM rate r WHERE r.page_id = p.id) AS rate ' +
            'FROM db_pages AS p ' +
            'INNER JOIN sites AS s ON p.site_id = s.id ' +
            'INNER JOIN db_users AS u ON s.user_id = u.id ' +
            'ORDER BY p.update_date DESC';
        connection.query(sql, function (error, pages_rows) {

            if(!error){
                var last_pages = pages_rows;
                res.send(last_pages);
                connection.release();
            }else{
                throw error;
            }
        });
    })
})

module.exports = router;

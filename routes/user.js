var express = require('express');
var router = express.Router();
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

router.get('/id:id/dashboard', function (req, res){

    pool.getConnection(function(err, connection) {

        if (err) {
            throw err;
        }

        var users = [];

        var sql = 'SELECT * ' +
            'FROM db_users ' +
            'ORDER BY rang';
        connection.query(sql, function (error, users_rows) {

            users = users_rows;
            res.render('user/dashboard', {users: users});
            connection.release();
        });
    });

});

router.post('/set_status', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var user_id = req.body.user_id;
        var status = req.body.status;

        var sql = 'UPDATE db_users ' +
            'SET db_users.lock = ? ' +
            'WHERE db_users.id = ?';
        connection.query(sql, [status, user_id], function (err, result) {
            if (err) {
                throw err;
            }
            res.send(true);
            connection.release();
        });
    });

});

router.post('/set_rang', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var user_id = req.body.user_id;
        var rang = req.body.rang;

        var sql = 'UPDATE db_users ' +
            'SET db_users.rang = ? ' +
            'WHERE db_users.id = ?';
        connection.query(sql, [rang, user_id], function (err, result) {
            if (err) {
                throw err;
            }
            res.send(true);
            connection.release();
        });
    });

});

router.post('/remove', function(req, res, next) {

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var user_id = req.body.user_id;

        var sql = 'DELETE FROM db_users ' +
            'WHERE db_users.id = ?';
        connection.query(sql, [user_id], function (err, result) {
            if (err) {
                throw err;
            }
            res.send(true);
            connection.release();
        });
    });

});

router.get('/id:id/profile', function (req, res){

    pool.getConnection(function(err, connection) {

        if(err){
            throw err;
        }

        var user_id = req.params.id;
        var user = new Object();

        var sql = 'SELECT * ' +
            'FROM db_users ' +
            'WHERE id = ' + user_id + ' ' +
            'LIMIT 1';
        connection.query(sql, function (error, users_rows) {

            user = users_rows[0];
            user.comments = [];

            var sql = 'SELECT * ' +
                'FROM comments ' +
                'WHERE user_id = ' + user_id;
            connection.query(sql, function (error, comments_rows) {

                user.comments = comments_rows;
                user.marks = [];

                var sql = 'SELECT * ' +
                    'FROM rate ' +
                    'WHERE user_id = ' + user_id;
                connection.query(sql, function (error, rates_rows) {

                    user.marks = rates_rows;
                    var sites = [];

                    // get user's site
                    var sql = 'SELECT * ' +
                        'FROM sites ' +
                        'WHERE user_id = ' + user_id + ' ' +
                        'ORDER BY id DESC';
                    connection.query(sql, function (error, sites_rows) {

                        sites = sites_rows;

                        // get site's pages
                        async.forEachOf(sites, function (site, index, callback) {
                            var site_id = site.id;
                            sites[index].pages = [];
                            var sql = 'SELECT * ' +
                                'FROM db_pages ' +
                                'WHERE site_id = ' + site_id + ' ' +
                                'ORDER BY update_date DESC';
                            connection.query(sql, function (error, pages_rows) {
                                if (!error) {
                                    sites[index].pages = pages_rows;
                                    callback();
                                } else {
                                    console.log(error);
                                }
                            });

                        }, function (error)  {

                            res.render('user/profile', {cur_user: user, sites: sites});
                            connection.release();
                        });

                    });
                });

            });

        });

    });

});

module.exports = router;

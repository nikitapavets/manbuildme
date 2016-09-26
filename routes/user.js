var express = require('express');
var router = express.Router();
var mysql       = require('mysql');
var eachOf  = require('async/eachOf');
var async = require('async');

var pool = mysql.createPool({
  "host": "eu-cdbr-west-01.cleardb.com",
  "user": "b0bd6590a971c5",
  "password": "5388152b",
  "database": "heroku_479693d37aa70d6",
  "connectionLimit": 10
});

router.get('/id:id/profile', function (req, res){

    var user_id = req.params.id;
    var sites = [];


    // get user's site
    var sql = 'SELECT * ' +
        'FROM sites ' +
        'WHERE user_id = ' + user_id + ' ' +
        'ORDER BY id DESC';
    pool.query(sql, function(error, sites_rows) {

        sites = sites_rows;

        // get site's pages
        async.forEachOf(sites, function (site, index, callback) {
            var site_id = site.id;
            sites[index].pages = [];
            var sql = 'SELECT * ' +
                'FROM pages ' +
                'WHERE site_id = ' + site_id + ' ' +
                'ORDER BY update_date DESC';
            pool.query(sql, function(error, pages_rows) {
                sites[index].pages = pages_rows;
                callback();
            });

        }, function (error) {

            res.render('user/profile', {sites: sites});
        });

    });


});


module.exports = router;

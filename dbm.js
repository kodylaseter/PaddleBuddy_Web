/**
 * Created by Kody on 3/21/2016.
 */

// can be run with:
// node dbm test
var mysql = require('mysql');

if (process.env.OPENSHIFT_MYSQL_DB_PASSWORD) {
    console.log('Openshift DB access');
    var connection = mysql.createConnection({
        host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
        user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
        password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
        port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
        database : process.env.OPENSHIFT_APP_NAME
    });
} else {
    console.log('Local DB access');
    var connection = mysql.createConnection({
        host: '127.0.0.1',
        port: '3307',
        user: 'adminkUDs7B1',
        password: '6iA5h6FM9QCb',
        database: 'paddlebuddy'
    });
}

var clearDB = function(){
    console.log('clear');
    var tables_to_clear = ['link', 'point', 'river'];
    for (var i = 0; i < tables_to_clear.length; i++) {
        var tableName = tables_to_clear[i];
        (function(i) {
            connection.query('TRUNCATE TABLE ' + tableName, function(error) {
                if (error) console.log(error);
                else {
                    if (i == tables_to_clear.length - 1) {
                        console.log('Finished!');
                        process.exit();
                    }
                }
            });
        })(i);
    }
};

process.argv.forEach(function (val) {
    if (val == 'clear') clearDB();
});

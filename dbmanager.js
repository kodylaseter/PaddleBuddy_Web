/**
 * Created by Kody on 3/21/2016.
 */
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'www.db4free.net',
    user: 'kodylaseter',
    password: 'password',
    database: 'pb_test'
});

var clearDB = function(){
    console.log('clear');
    var tables_to_clear = ['link', 'point', 'river'];
    for (var i = 0; i < tables_to_clear.length; i++) {
        var tableName = tables_to_clear[i];
        (function(i) {
            connection.query('TRUNCATE TABLE pb_test.' + tableName, function(error) {
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

/**
 * Created by Kody on 3/21/2016.
 */

var clearDB = function () {
    var tables_to_clear = ['link', 'point', 'river'];
    for (var i = 0; i < tables_to_clear.length; i++) {
        var tableName = tables_to_clear[i];
        connection.query('TRUNCATE TABLE pb_test.' + tableName, function(error) {
            if (error) console.log(error);
        })
    }
};
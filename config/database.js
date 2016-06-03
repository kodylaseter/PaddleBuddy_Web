/**
 * Created by KodyLaseter on 5/27/2016.
 */

var IsLocal = !process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
var port = 3307;
console.log(IsLocal ? 'Local db access on port ' + port : 'Openshift DB access');

module.exports = {
    'host' : IsLocal ? '127.0.0.1' : process.env.OPENSHIFT_MYSQL_DB_HOST,
    'port' : IsLocal ? port : process.env.OPENSHIFT_MYSQL_DB_PORT,
    'user' : IsLocal ? 'adminkUDs7B1' : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    'password' : IsLocal ? '6iA5h6FM9QCb' : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    'database' : IsLocal ? 'paddlebuddy' : process.env.OPENSHIFT_APP_NAME
}

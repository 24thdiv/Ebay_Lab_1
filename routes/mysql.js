var ejs = require('ejs');
var mysql = require('mysql');

function getConnection(){

	var connection = mysql.createPool({
	    connectionLimit : 20,
	    host     : 'localhost',
	    user     : 'root',
	    password : 'admin',
	    database : 'ebay_db',
	    port	 : 3306
	});
	return connection;

}

function fetchData(callback,query){

	console.log("Query is "+ query);

	var connection = getConnection();
	connection.getConnection(function(err,connection) {

		if (err){
			console.log(err);
			throw err;
		}
		else {

			connection.query(query, function (err, rows, fields) {
				connection.release();
				if (err) {
					console.log("ERROR: " + err.message);
					callback(err, rows);
				}
				else {

					
					callback(err, rows);
				}

			});
		}
	});


}

exports.fetchData = fetchData;
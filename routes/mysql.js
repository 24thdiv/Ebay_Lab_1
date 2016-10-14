var ejs = require('ejs');
var mysql = require('mysql');
var List  = require('collections/list');

var poolList;
function getConnection(){

	var connection = mysql.createConnection({
	    connectionLimit : 20,
	    host     : 'localhost',
	    user     : 'root',
	    password : 'admin',
	    database : 'ebay_db',
	    port	 : 3306
	});
	return connection;

}

function CreateConnectionPool(number) {

     poolList = new List();

    for(var i=0;i<number;i++){
        poolList.push(getConnection());
    }

}


var getConnectionFromPool = function (){
    if(poolList.length == 0){
        return getConnection();
    }else{
        return poolList.pop();
    }
};


function releaseConn(connection) {

    poolList.push(connection);

}

function fetchData(callback,query){

	console.log("Query is "+ query);
    var connection = getConnectionFromPool();

        connection.query(query, function (err, rows, fields) {
            releaseConn(connection);

            if (err) {
                console.log("ERROR: " + err.message);
                callback(err, rows);
            }
            else {
                callback(err, rows);
            }

        });


}



function storeData(callback,query,data){

	console.log("Query is "+ query);
    var connection = getConnectionFromPool();

	connection.query(query,data, function (err, rows, fields) {
				releaseConn(connection);
				if (err) {
					console.log("ERROR: " + err.message);
					callback(err, rows);
				}
				else {

					callback(err, rows);
				}

    });


}




exports.storeData= storeData;
exports.fetchData = fetchData;
exports.CreateConnectionPool= CreateConnectionPool;
/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), cp = require('child_process'), fs = require('fs'), Converter = require('csvtojson').core.Converter, eventEmitter = require('events').EventEmitter, mysql = require('mysql');

var app = express();

// MongoDB connection
var MongoClient = require('mongodb').MongoClient;
var eventEmmit = new eventEmitter;
var db;
// Mysql connection

eventEmmit.setMaxListeners(0);

MongoClient.connect('mongodb://127.0.0.1:27017/stats', function(err, database) {
	if (err)
		throw err;
	db = database;
});
function getStats(cluster, urlRequest, responseFile) {
	http.get(
			urlRequest,
			function(res) {
				console.log(new Date() + " GET response of haproxy: "
						+ res.statusCode);
				res.setEncoding('utf8');
				try {
					fs.unlinkSync(responseFile);
				} catch (err) {
					console.log(new Date()
							+ " Was unable to locate or delete file");
				}
				console.log(new Date() + ' Old txt file deleted');
				res.on('data',
						function(stats) {
							try {
								fs.appendFileSync(responseFile, stats);
							} catch (err) {
								console.log(new Date()
										+ " File not appended properly");
							}
						});
				res.on('end', function() {
					parsingJson(cluster, responseFile);
				});
			}).on('error', function(e) {
		console.log(new Date() + " Got error: " + e);
	});
	// setTimeout(function() {
	// getStats(cluster, urlRequest, responseFile);
	// }, 10000);
}

/** ** Parsing of csv to json ************** */

function CSVToArray(strData, strDelimiter) {
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");
	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp((
	// Delimiters.
	"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	// Quoted fields.
	"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	// Standard fields.
	"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [ [] ];
	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;
	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec(strData)) {
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[1];
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push([]);
		}
		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[2]) {
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"), "\"");
		} else {
			// We found a non-quoted value.
			var strMatchedValue = arrMatches[3];
		}
		// Now that we have our value string, let's add
		// it to the data array.
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	// Return the parsed data.
	return (arrData);
}

function CSV2JSON(csv, key) {
	var array = CSVToArray(csv);
	var objArray = [];
	for (var i = 1; i < array.length; i++) {
		objArray[i - 1] = {};
		for (var k = 0; k < array[0].length && k < array[i].length; k++) {
			var key = array[0][k];
			objArray[i - 1][key] = array[i][k]
		}
	}

	var json = JSON.stringify(objArray);
	var str = json.replace(/},/g, "},\r\n");
	eventEmmit.emit('json_parsed_zero');
	return str;
}

/** *****Parsing of csv to json*************** */

// The object to be rendered at on live request
function parsingJson(cluster, responseFile) {
	fs.readFile(responseFile, 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		try {
			var myObj = CSV2JSON(data, 0);
			var jsonObj = eval('(' + myObj + ')');
			eventEmmit.once('json_parsed_zero', addTodb);
			var index = 0;
			function addTodb() {
				if (!jsonObj[index]) {
					return;
				}
				var px_names = jsonObj[index]["# pxname"];
				var orignal_cluster = px_names.replace(/-/g, "_");
				jsonObj[index]["timestamp"] = Date.now();
				var cluster_name = cluster + '_' + orignal_cluster;
				var collection = db.collection(cluster_name);
				console.log(cluster_name);
				collection.insert(jsonObj[index], function(error, result) {
					if (error) {
						console.log(new Date() + ' ERROR INSERTION: ' + error);
					} else {
						console.log(new Date() + ' Data inserted in '
								+ cluster_name + ' collection with result '
								+ result);
						index++;
						addTodb(index);
					}
				});
			}

		} catch (err) {
			console.log(new Date() + ' ERROR : ' + err);
		}
	});
}

// getStats('prod', urlRequest, responseFile);
// getStats('api', urlRequest2, responseFile2);

// all environments
app.set('port', process.env.PORT || 8084);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var basicAuth = express.basicAuth;
var auth = function(req, res, next) {
	basicAuth(function(user, pass, callback) {
		callback(null, user === 'rahul' && pass === 'rahul@hk');
	})(req, res, next);
};

app.all('*', auth);

app.get('/', function(req, res) {
	res.render("index.html");
});

app.get('/rest/load/', function(req, res) {
	var svname = req.query['svname'];
	var orignal_cluster = req.query['pxname'].replace(/-/g, "_");
	var collection_name = req.query['box'] + '_' + orignal_cluster;
	var collection = db.collection(collection_name);
	collection.find({
		"svname" : svname
	}).toArray(function(err, result) {
		if (err) {
			console.log(new Date() + ' ERROR: ' + err);
			return;
		}
		var obj = {
			"name" : svname,
			"data" : []
		};
		for ( var index in result) {
			var rate = parseInt(result[index]["rate"]);
			var date = parseInt(result[index]["timestamp"]);
			obj["data"].push([ date, rate ]);
		}
		res.send(obj);
	});
});

app.get('/rest/live/', function(req, res) {
	console.log('request recived live');
	var svname = req.query['svname'];
	var requestFile = req.query['box'] + "-haproxy";
	console.log(requestFile);
	fs.readFile(requestFile, 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		try {
			var sendObj = {};
			var myObj = CSV2JSON(data, 1);
			//console.log(myObj);
			var rendObj = eval('(' + myObj + ')');
			eventEmmit.once('json_parsed_zero', function() {
				console.log(new Date() + ' File parsed for live request');
			});
			for ( var index in rendObj) {
				if (rendObj[index]['# pxname'] == req.query['pxname']
						&& rendObj[index]["svname"] == req.query['svname']) {
					sendObj['timestamp'] = Date.now();
					sendObj['rate'] = parseInt(rendObj[index]['rate']);
				}
			}
			res.send(sendObj);
		} catch (err) {
			console.log(err);
		}
	});
});

app.get('/new/', function(req, res) {
	res.render('add_new.html');
});

var mysql_connection;
function connect_to_mysql() {
	mysql_connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'k1hrL71oZY8X3AqkRf9f',
		database : 'haproxy_nodejs'
	});
}

app.get('/rest/new/', function(req, res) {
	var url = req.query["url"];
	var name = req.query["name"];
	var svname = req.query["svname"];
	var pxname = req.query["pxname"];
	connect_to_mysql();
	mysql_connection.connect();
	if (url != '' && name != '' && svname != '') {
		var query = "INSERT INTO url_haproxy(url, pxname, name, svname) VALUES(?,?,?,?)";
		var insert = [ url, pxname, name, svname ];
		mysql_connection.query(query, insert, function(err, results) {
			if (err) {
				console.log(new Date() + 'ERROR : ' + err);
				res.send('Not added sorry :(');
			} else {
				console.log(new Date() + results);
				res.send('<script>window.location=\'/\';</script>');
			}
			mysql_connection.end();
		});
	} else {
		mysql_connection.end();
	}
});

app.get('/rest/render/',function(req, res) {
	var name = req.query['name'];
	var pxname = req.query['pxname'];
	var level = req.query['level'];
	var query;
	connect_to_mysql();
	mysql_connection.connect();
	if (level == 0) {
		query = "SELECT DISTINCT(name) from url_haproxy";
		mysql_connection.query(query, function(err, rows) {
			if (err)
				mysq_connection.end();
			else
				res.send(rows);
		});
	} else if (level == 1) {
		query = "SELECT DISTINCT(pxname) from url_haproxy where name = ?";
		var params = [ name ];
		mysql_connection.query(query, params, function(err,rows) {
			if (err) {
				mysq_connection.end();
			} else {
				res.send(rows);
			}
		});
	} else if (level == 2) {
		query = "SELECT DISTINCT(svname) from url_haproxy where name = ? and pxname = ?";
		var params = [ name, pxname ];
		mysql_connection.query(query, params, function(err,rows) {
			if (err) {
				mysq_connection.end();
			} else {
				res.send(rows);
			}
		});
	}
	mysql_connection.end();
});

app.get('/rest/remove/',function(req, res) {
	connect_to_mysql();
	mysql_connection.connect();
	var query = "DELETE FROM url_haproxy where name=? and pxname=? and svname=?;";
	var param = [ req.query['name'], req.query['pxname'],req.query['svname'] ];
	mysql_connection.query(query, param, function(err, result) {
		if (err)
			console.log(new Date() + ' ERROR : ' + err);
		else
			console.log(new Date() + 'Success ' + result);
			mysql_connection.end();
			res.send('OK');
	});
});

/* Not in Use
 * 
 * app.get('/auth/', function(req, res) {
	connect_to_mysql();
	var query = "SELECT user FROM user_auth where user = ? and pass = ?;";
	var param = [ req.query['user'], req.query['pass']];
	mysql_connection.query(query, param, function(err, result){
		if(result.length > 0){
			res.render('index.html');
		}
		else{
			res.send('Access Denied');
		}
		mysql_connection.end();
	});
});*/

var db_rows;

function getVal(){
	connect_to_mysql();
	mysql_connection.connect();
	var query = "SELECT DISTINCT(name), url FROM url_haproxy";
        mysql_connection.query(query, function(err, rows) {
		if (err)
			console.log(err);
		else{
			db_rows = rows;
		}
		mysql_connection.end();
	});
}

function getData() {
	for ( var index in db_rows) {
		getStats(db_rows[index]['name'], db_rows[index]['url'], db_rows[index]['name'] + '-haproxy');
	}
	setTimeout(getData, 5000);
}

getVal();
getData();

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

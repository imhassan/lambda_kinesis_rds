// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var mysql = require('mysql');

/**
 * RDS credentials.
 * 
 */
var dbhost = "";
var dbuser = "";
var dbpass = "";
var dbname = "";

var Processor = {};
Processor.initializeConnection = function(callback) {
	console.log("initializeConnection: ");
	Processor.connection = mysql.createConnection({
		host : dbhost,
		user : dbuser,
		password : dbpass,
		database : dbname
	});
	Processor.connection.connect(function(err) {
		if (err) {
			console.error("couldn't connect", err);
			callback();
		} else {
			console.log("mysql connected");
			callback();
		}
	});
};

Processor.disconnect = function() {
	Processor.connection.end(function(err) {
		console.log("Disconnect.");
	});
};

Processor.insertData = function(seq_num, text, callback) {
	 console.log("Inserting seq_num: " + seq_num );
	Processor.connection.query("INSERT INTO `lambda_data` SET seq_num=?, kinesis_data=?", [ seq_num, text ], function(err, info) {
		// console.log("insert: " + info.msg + " /err: " + err);
		callback();
	});
};

exports.handler = function(event, context) {
	// console.log('Received event:', JSON.stringify(event, null, 2));
	Processor.initializeConnection(function() {
		async.each(event.Records, function(record, callback) {
			// Kinesis data is base64 encoded so decode here
			encodedPayload = record.kinesis.data;
			seq_num = record.kinesis.sequenceNumber;
			payload = new Buffer(encodedPayload, 'base64').toString('ascii');
			// console.log('Decoded data: ' + payload);
			Processor.insertData(seq_num, payload, function() {
				callback();
			});

		}, function() {
			context.succeed("Successfully processed " + event.Records.length + " records.");
			context.done();
		});

	});

};
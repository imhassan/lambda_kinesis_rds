# lambda_kinesis_rds
AWS Lambda function that attach with Kinesis event and store the data into RDS table.

### Initial Conifguration

* Open and add the RDS credentials in index.js file
```
var dbhost = "";
var dbuser = "";
var dbpass = "";
var dbname = "";
```
* Open the Remote session with RDS and Create a new table named as "lambda_data" with the following fields. 
```
	create table lambda_data (
	id INT AUTO_INCREMENT PRIMARY KEY,
	seq_num VARCHAR(255),
	kinesis_data TEXT
	);
```
* Create a IAM role for lamdba which allow permission to exectecode on Kinesis
* Zip the file "index.js" and Folder "node_modules" and upload it to Lambda.
* Test it with sample data from  Lambda panel and records should be inserted in db.

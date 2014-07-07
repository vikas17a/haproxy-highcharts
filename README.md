haproxy-highcharts
==================

Haproxy-Highcharts enables the graphical view of haproxy stats. This application unbale us to monitor behaviour of various application.

Requirements
============

1. Installed nodejs enviornment
2. Installed mongodb

Commands to install dependencies above on Ubuntu

1. sudo apt-get install nodejs
2. sudo apt-get install mongodb

About NodeJs
============

Node.js is a software platform for scalable server-side and networking applications. Node.js applications are written in JavaScript.Node.js applications are designed to maximize throughput and efficiency, using non-blocking I/O and asynchronous events. Node.js applications run single-threaded, although Node.js uses multiple threads for file and network events. Node.js is commonly used for real time applications due to its asynchronous nature, allowing applications to display information faster for users without the need for refreshing.

About MongoDb
=============

MongoDB is a cross-platform document-oriented database. Classified as a NoSQL database, MongoDB eschews the traditional table-based relational database structure in favor of JSON-like documents with dynamic schemas (MongoDB calls the format BSON), making the integration of data in certain types of applications easier and faster.

Code Documentation
==================

Directory Structure
-------------------
  - haproxy-stats   ## Home for project ##
     - .settings    ## Setting for new version of eclipse to debug the application ##      
     - db           ## Db folder contains the whole database of the haproxy it store ## 
     - node_modules ## Installed node modules ##
     - public       ## Some public accessbile code ##
     - routes       ## Used for routing purposes in reditections ##
     - views        ## Html directory which renders the html pages to the output ##

Files in Repository
-------------------
  - haproxy-stats 
    - .jshintrc ## NodeEclipse File  ##
    - .project ## NodeEclipse Project File ##
    - admin-haproxy ## File captures admin cluster this will be created automatically on runtime ##
    - api-haproxy ## File captures api cluster this will be created automatically on runtime ##
    - app.js ## This is the source file that have all functions and functionning of the whole project ##
    - dump.sql ## This is a mysql dump file to be dummpled onto th mysql to get this applicaiton running
    - nohup.out ## This is the log files of this application ##
    - pakage.json ## This is the package file which install all nodejs dependincies to run this application ##
    - prod-haproxy ## File caputures prod cluster this will be created automatically on runtime ##
    - stagnew-haproxy ## File captures stagnew cluster this will be created automatically on runtime ##
  
    - views
      - add_new.html ## This page is rendered when user is willing to add a new cluster
      - index.html ## This page is home page of this appliaction 
      - test_index.html ## This page is not in use only a test page
      
    - public
      - sytlesheets
      	- style.css ## This is the css of the html page need to be linked through html page.

Description of functions
------------------------

- MongoClient.connect 
		This connects the mongodb server with this application.
		Note: Start mongodb server with command as "mongod --dbpath /PATH/TO/DB/FOLDER/OF/THIS/PROJECT/"


- getStats
		This function requests h`onable haproxy to get the haproxy results and stores them in the repsective file ex api-haproxy. This functions by default take care of new files to be created for new cluster.


- CSVToArray && CSV2JSON 
		These functions parse the cvs formatted data just arrived from haproxy and will convert the parsed cvs into the JSON fformat to be intesrted in MONGODB. These functions will throw exceptions if data recieved from haproxy is not formatted properly


Note : Formatted data which these functions except to be in respective cluster file are as follows:

```
# pxname,svname,qcur,qmax,scur,smax,slim,stot,bin,bout,dreq,dresp,ereq,econ,eresp,wretr,wredis,status,weight,act,bck,chkfail,chkdown,lastchg,downtime,qlimit,pidid,throttle,lbtot,tracked,type,rate,rate_lim,rate_max,check_status,check_code,check_duration,hrsp_1xx,hrsp_2xx,hrsp_3xx,hrsp_4xx,hrsp_5xx,hrsp_other,hanafail,req_rate,req_rate_max,req_tot,cli_abrt,srv_abrt,comp_in,comp_out,comp_byp,comp_rsp,
http-in,FRONTEND,,,4,627,5000,34008887,9278122770,570299368822,0,0,3720,,,,,OPEN,,,,,,,,,1,1,0,,,,0,60,0,646,,,,0,34000463,0,4561,3775,84,,60,648,34008887,,,0,0,0,0,
healthkart,spkd-0210,0,1,1,39,40,8475211,2318727321,142177296395,,0,,0,95,278,35,UP,1,1,0,38,17,3795,1177,,1,2,1,,8466349,,2,14,,535,L7OK,200,1,8895,8473675,0,342,826,0,0,,,,8,12,,,,,
healthkart,spkd-0211,0,0,1,17,40,8476774,2319644869,142671307531,,0,,0,75,160,20,UP,1,1,0,27,12,3569,1191,,1,2,2,,8471054,,2,14,,218,L7OK,200,1,9100,8475461,0,213,844,0,0,,,,15,17,,,,,
healthkart,vmn-416,0,0,1,30,30,8422565,2300431170,142422357000,,0,,0,81,188,25,UP,1,1,0,80,12,3789,3143,,1,2,3,,8415623,,2,15,,410,L7OK,200,1,8798,8421307,0,160,838,0,0,,,,8,26,,,,,
healthkart,vmn-412,0,1,0,30,30,8439125,2303876641,142669278088,,0,,0,72,210,35,UP,1,1,0,126,14,3604,2119,,1,2,4,,8432976,,2,14,,220,L7OK,200,1,8705,8437673,0,107,1028,0,0,,,,6,29,,,,,
healthkart,BACKEND,0,585,3,626,500,33812800,9242680001,569940239014,0,0,,0,323,836,115,UP,4,4,0,,0,857893,0,,1,2,0,,33786002,,1,59,,648,,,,0,33808116,0,822,3775,84,,,,,37,84,0,0,0,0,
```

- parsingJson
		This function calls the above mentioned function for CVS to JSON parsing and will require paramters as the cluster name i.e admin, prod or api and the Name of the file where the data is fetched from haproxy.


- onLoad (app.get)
		This function will load all the one day back data from the mongoDb and return this as a json object in response.


- onLive (app.get)
		This function will fetch the live stats one point at a given time. This data point is appended to old chart.


- onNew (app.get)
		This will add new cluster to mysql database


- connectToMysql ()
		This function keep details of mysql database and connect the application to database whenever it is called


- onNew (app.get)
		This function update the mysql database with field entries entered by the user on the HTML page.


- onRemove (app.get)
		This function activates on remove request to delete cluster from mysql database.


- getVal
		This function extracts the url, proxy name etc from mysql datbase so that getStats & getData can request that url


- getData
		This function initiates the application


How to Run this application
===========================

This section discuss how to run this application
	
	1. Download this application and Extract to haproxy-highcharts.
	2. Install the NodeJs and Mongodb.
	3. Go to Haproxy-highcharts/haproxy-stats/
	4. Run command npm-install (require root permissions if directory is in root area, try using the sudo npm-install). 
	5. After installing all the packages run "node app.js".
	6. Application will start on port 8084 to change this port go to app.js and search for port and change that number to required one.


Credits and Regards
===================

Application Created by Vikas Aggarwal under guidance of Rahul Agarwal, Nitin Wadhawan and P Singh
Thanks to all of them for their esteem support to complete this project.

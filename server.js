// var ws = require("./nodejs-websocket/")
//
// // Scream server example: "hi" -> "HI!!!"
// var server = ws.createServer(function (conn) {
//     console.log("New connection")
//     conn.on("text", function (str) {
//         console.log("Received "+str)
//         conn.sendText(str.toUpperCase()+"!!!")
//     })
//     conn.on("close", function (code, reason) {
//         console.log("Connection closed")
//     })
// }).listen(8001)


var ws = require("./nodejs-websocket/")
var http = require("http")
var fs = require("fs")
var url = require("url")
var request = '';
var response = '';
var serialport = require("serialport").SerialPort;
var serialMessage = '';
var wstream = fs.createWriteStream("ecg.txt");
var streamCounter = 0;

var httpServer = http.createServer(function (req, res) {
  request = req;
  response = res;
  var path = url.parse(request.url).pathname;
  
  if (path.match(/^(.*)\.(js|css|eot|svg|ttf|woff|woff2)$/i)) {
    getAsset(path);
  } else if (path.match(/^(.*)\.(jpg|jpeg|gif|png|wav)$/i)) {
    getBinary(path);
  } else {
    getHtml(path);
  }
  
});

httpServer.listen(8080);

var server = ws.createServer(function (connection) {
	//connection.nickname = null
	//connection.on("text", function (str) {
	//		broadcast(str)
	//})
	//connection.on("close", function () {
		// broadcast(connection.nickname+" left")
	//})
})
server.listen(8081)



var serialPort = new serialport("/dev/ttyUSB0", {
  baudrate: 9600,
  //parser: serialport.parsers.readline("\n"),
});

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      //console.log(data);
      //serialMessage = serialMessage + data;
      //console.log(serialMessage);
      //if (serialMessage.match(/\-$/)) {
        //broadcast(serialMessage.replace(/[^\d]/g, ''));
        wstream.write(data + "\n");
        //wstream.write(data);
        //fs.appendFileSync("ecg.txt", data.toString());
        //fs.appendFileSync("ecg.txt", "\n");
        broadcast(data);
      //  serialMessage = '';
      //}
    });
  }
});


process.stdin.resume();

process.on('SIGINT', function () {
  console.log("ctr+c");
  wstream.end();
});

function getAsset(path) {
  var path = path.replace(/^\//, './');
  data = fs.readFileSync(path);
  response.writeHead(200, {'Content-Type': detectContentType(path)});
  response.write(data);
  response.end();
}

function getBinary(path) {
  var path = path.replace(/^\//, './');
  data = fs.readFileSync(path);
  response.writeHead(200, {'Content-Type': detectContentType(path)});
  response.write(data, "binary");
  response.end();
}

function parseQuery(query) {
  var q = query.split(/\&/);
  var value = '';
  for( var i=0; i<query.length; i++) {
    if (q[i].match(/^message=/)) {
      value = q[i].split(/^message=/)[1];
      break;
    }
  }
  
  return value;
}

function detectContentType(p) {
  var type = p.split('.');
  type = type[type.length - 1];
  //broadcast(type);
  
  switch (type) {
    case 'js':
      type = "text/javascript";
    break;

    case 'css':
      type = "text/css";
    break;

    case 'png':
      type = "image/png";
    break;

    case 'jpeg':
      type = "image/jpeg";
    break;

    case 'jpg':
      type = "image/jpeg";
    break;

    case 'gif':
      type = "image/gif";
    break;

    case 'wav':
      type = "audio/wav";
    break;

    default:
      type = "text/html";
    break;
    
  }

  return type;
}

function getHtml(path) {
  switch(path){
      case '/':
        fs.readFile("index.html", function(error, data){
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.write(data, "utf8");
          response.end();
        });
        break;
      case '/index.html':
        fs.readFile('index.html', function(error, data){
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.write(data, "utf8");
          response.end();
        });
        break;
      case '/socket.html':
          fs.readFile('socket.html', function(error, data){
              if (error){
                  response.writeHead(404);
                  response.write("opps this doesn't exist - 404");
                  response.end();
              }
              else {
                var query = url.parse(request.url).query
                //broadcast(parseQuery(query));
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
              }
          });
          break;
      default:
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
          response.end();
          break;
  }  
}

function broadcast(str) {
  try {
  	server.connections.forEach(function (connection) {
  		connection.sendText(str)
  	});
  } catch (error) {
    console.log(error);
  }
}

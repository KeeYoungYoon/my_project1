var express = require('express')
var app = express()
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydb'
})
connection.connect();

function time_Converter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp );
  var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year+' / '+month+' / '+ date + ' | ' + hour + ' : ' + min+' : '+sec ;
  return time;
}//for printing start and end time


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp );
  var months = [0,1,2,3,4,5,6,7,8,9,10,11];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year+','+month+','+ date + ',' + hour + ',' + min+','+sec ;
  return time;
}
//for converting timestamp into date
app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');

    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;

      var data = "";
      var comma = ""
      for (var i=0; i< rows.length; i++) {
         r = rows[i];

//console.log('%s',r.time);
//data+=omma+"";
//data += comma + "[new Date("+r.time+"),"+ r.value +"]";
//data += comma +  r.value;
data += comma + "[new Date("+timeConverter(r.time)+"),"+ r.value +"]";

        comma = ",";
      }
      var header = "data.addColumn('date', 'Date/Time');"
      header += "data.addColumn('number', 'Temp');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);

      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
 res.write('start time:'+time_Converter(rows[0].time)+'end time:'+time_Converter(rows[rows.length-1].time));
      res.end();
    });
  });
})

var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

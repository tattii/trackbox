var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');


app.get('/', function(req, res) {
	res.render('index', {
		shared: false,
		track_id: 0
	});
});

app.get('/track/:id', function(req, res) {
	res.render('index', {
		shared: true,
		track_id: req.param.id
	});
});


app.get('/get', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var id = req.param.id;
		console.log(id);
		client.query('SELECT * FROM track_table where id=$1', [id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				console.log(result.rows);
				res.send(result.rows);
			}
		});
	});
})


app.post('/post', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var data = req.body;
		console.log(data);
		client.query('', [id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			}else{
				response.send(result.rows);
			}
		});
	});
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

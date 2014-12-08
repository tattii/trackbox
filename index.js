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
		track_id: req.param("id")
	});
});


app.get('/get', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var id = req.param("id");
		console.log(id);
		client.query('SELECT * FROM track_table where id=$1', [id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				console.log(result.rows);
				res.send(result.rows[0].data);
			}
		});
	});
})


app.post('/post', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		function generateID() {
			var id = Math.random().toString(36).slice(-8);
			client.query('SELECT * FROM track_table where id=$1', [id], function(err, result) {
				done();
				if (err) {
					console.error(err);
					res.send("Error " + err);
				}else{
					if ( result.rows ){
						return generateID();
					}else{
						return id;
					}
				}
			});
		}

		var data = req.body;
		var id = generateID();

		 console.log([id, data])
		client.query('INSERT INTO track_table (id, data) VALUES ($1, $2)', [id, data], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				res.send(id);
			}
		});
	});
})

app.listen(app.get('port'), function() {
 	console.log("Node app is running at localhost:" + app.get('port'));
});

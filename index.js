// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/whoami", function (req, res) {
  const ipaddress = req.ip;
  //const language = req.language;
  res.json({'ipaddress': ipaddress, 'language': 'esp', 'software': 'ios'});
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Nueva ruta /api/:date? para manejar fechas
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;
  console.log(dateParam);
  
  let date;

  // Si no se proporciona una fecha, usa la fecha actual
  if (!dateParam) {
      date = new Date();
  } else {
      // Si el parámetro de fecha es un número (marca de tiempo)
      if (!isNaN(dateParam)) {
          date = new Date(parseInt(dateParam));
      } else {
          date = new Date(dateParam);
      }
  }

  // Verificar si la fecha es válida
  if (date.toString() === "Invalid Date") {
      return res.json({ error: "Invalid Date" });
  }

  // Devolver el formato Unix y UTC
  res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
  });
});

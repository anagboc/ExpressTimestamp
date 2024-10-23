// index.js
// where your node app starts

require('dotenv').config();
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const dns = require('dns'); // Importa el módulo dns
const cors = require('cors');
var express = require('express');
var app = express();

// Middleware para manejar datos codificados por URL
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Para manejar JSON

// Habilitar CORS
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Base de datos de URLs
let urlDatabase = {};
let currentId = 1;

// Función para generar un nuevo short_url
const generateShortUrl = (originalUrl) => {
  urlDatabase[currentId] = originalUrl;
  return currentId++;
};

// Ruta para acortar URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validar la URL
  if (!validUrl.isUri(originalUrl)) {
      return res.json({ error: 'invalid url' });
  }

  // Extraer el host de la URL
  const urlParts = new URL(originalUrl);
  const host = urlParts.hostname;

  // Verificar si el host es accesible
  dns.lookup(host, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Generar el short_url
    const shortUrl = generateShortUrl(originalUrl);
    
    // Responder con el objeto JSON
    res.json({
        original_url: originalUrl,
        short_url: shortUrl,
    });
  });
});

// Ruta para redirigir a la URL original
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  
  // Comprobar si el short_url existe en la base de datos
  if (urlDatabase[shortUrl]) {
      res.redirect(urlDatabase[shortUrl]);
  } else {
      res.status(404).send('Not Found');
  }
});

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
  res.json({'ipaddress': ipaddress, 'language': 'esp', 'software': 'ios'});
});

// Nueva ruta /api/:date? para manejar fechas
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;
  
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

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//require('dotenv').config();
const express  = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");
const nasaAPI = require('./app/functions/api');
const keys = require('./app/data/keys');

const port = 8081;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get("/test", (req, res) => {
  res.send({message: `https://api.nasa.gov/planetary/apod?api_key=${keys.keys.NASA}`});
});

app.get('/NASAPI', (req, res) => {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${keys.keys.NASA}`;
    nasaAPI.callAPI(url)
    .then(response => {
        res.json(response);
        res.send(response);
    })
    .catch(error => {
        res.send(error)
    })
});

routes(app);

const server = app.listen(port, (error) => {
  if(error){return console.log(`Error: ${error}`);}
  console.log(`Server listening on port ${server.address().port}`);
});

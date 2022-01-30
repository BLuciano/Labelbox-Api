const express  = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");

const port = 8081;
const app = express();

const {parse, stringify, toJSON, fromJSON} = require('flatted');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

routes(app);

const server = app.listen(port, (error) => {
  if(error){return console.log(`Error: ${error}`);}
  console.log(`Server listening on port ${server.address().port}`);
});

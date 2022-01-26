const router = app => {
  app.get("/", (req, res) => {
    res.send({message: "Labelbox REST API"});
  });

  app.get("/images", (req, res) => {
    res.send({message: "images here"});
  });

  // Display all users
  app.get('/users', (request, response) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
  });

  const pool = require('../data/config');
}

module.exports = router;

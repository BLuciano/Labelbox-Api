const router = app => {
  app.get("/", (req, res) => {
    res.send({message: "Labelbox REST API"});
  });

  app.get("/images", (req, res) => {
    pool.query('SELECT * FROM images', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
  });

  // Display all users
  app.get('/users', (request, response) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
  });

  // Display a single user by ID
  app.get('/users/:id', (request, response) => {
      const id = request.params.id;
      pool.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
          if(error){throw error;}
          response.send(result);
      });
  });

  // Add a new user
  app.post('/users', (request, response) => {
    pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
        if(error){throw error;}
        response.status(201).send(`User added with ID: ${result.insertId}`);
    });
  });

  // Delete a user
  app.delete('/users/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
        if(error){throw error;}
        response.send('User deleted.');
    });
  });
  
  const pool = require('../data/config');
}

module.exports = router;

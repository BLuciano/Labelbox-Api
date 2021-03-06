const router = app => {
  //Home
  app.get("/", (request, response) => {
    response.send({message: "Labelbox REST API"});
  });

  //Add image to database
  app.get('/NASAPI', async(req, res) => {
      let url = `https://api.nasa.gov/planetary/apod?api_key=${keys.keys.NASA}`;

      await request(url, (error, response, body) =>{
        if(error){
          res.send(`${error}: Error retrieving NASA API information`);
        }
        if(response.statusCode == 200){
          body = JSON.parse(body);
          let date = body["date"];
          let url = body["url"];
          let query1 = `INSERT INTO images (day, url) SELECT "${date}", "${url}" FROM DUAL WHERE NOT EXISTS (SELECT * FROM images WHERE day="${date}" LIMIT 1)`;

          // Add image to database if not already added
          pool.query(query1, (error, result) => {
            if(error){throw error;}
            if(result.affectedRows > 0){
              res.send("New image added.");
            } else {
              res.send("Sorry, image already uploaded to database.")
            }
          });
        } else {
          res.send(response.statusCode);
        }
      });
  });

  //Display all images in database
  app.get("/images", (request, response) => {
    pool.query('SELECT * FROM images', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
  });

  // Display all users in database
  app.get('/users', (request, response) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
  });

  // Display a single user by ID
  app.get('/users/:id', (request, response) => {
      const id = request.params.id;
      pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, result) => {
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
    pool.query(`DELETE FROM users WHERE id = ${id}`, (error, result) => {
        if(error){throw error;}
        response.send('User deleted.');
    });
  });

  // Show all user ratings
  app.get('/users/:id/ratings', (request, response) => {
      const id = request.params.id;
      pool.query(`SELECT ratings FROM users WHERE id = ${id}`, (error, result) => {
          if(error){throw error;}
          let tmp = JSON.parse(result[0].ratings);
          response.send(tmp);
      });
  });

  // Add Rating
  //taking into accout we are only given user id and image id.
  app.put('/users/:id/:imgId/:rating', (request, response) => {
    const userId = request.params.id;
    const imgId = request.params.imgId;
    const stars = request.params.rating;
    if(stars > 5 && stars < 0){
      response.send("Error: rating must be between 0 and 5");
    }

    let userRatings = pool.query(`SELECT ratings FROM users WHERE id = ${userId}`, (error, result) => {
        if(error){throw error;}
        let tmp = JSON.parse(result[0].ratings);
        if(tmp === null){
          return [{"imgId" : imgId, "stars" : stars }];
        } else {
          return tmp.push({"imgId" : imgId, "stars" : stars });
        }
    });

    //add new rating to users ratings object
    pool.query(`UPDATE users SET ratings = ${userRatings} WHERE ID = ${userId}`, (error, result) => {
        if(error){throw error;}
        response.send("New rating added!");
    });
  });

  //Update Rating
  app.put('/update/users/:id/:imgId/:rating', (request, response) => {
    const userId = request.params.id;
    const imgId = request.params.imgId;
    const stars = request.params.rating;
    let updated = false;
    if(stars > 5 && stars < 0){
      response.send("Error: rating must be between 0 and 5");
    }

    let userRatings = pool.query(`SELECT JSON_EXTRACT(ratings, '$.ratings') as rating FROM users WHERE id = ${userId}`, (error, result) => {
        if(error){throw error;}
        let tmp = JSON.parse(result[0].ratings);
        for(x = 0; x < tmp.length; x++){
          if(tmp[x]['imgId'] === imgId){
            tmp[x]['stars'] = stars;
            updated = true;
          }
        }
        return tmp;
    });

    response.send(userRatings);

    if(updated){
      pool.query("UPDATE users SET ratings = ? WHERE ID = ?", userRatings, userId, (error, result) => {
          if(error){throw error;}
          response.send("Rating updated!");
      });
    } else {
      response.send("Sorry, please add a rating first before updating it!")
    }
  });

  //Delete Rating
  app.put('/delete/users/:id/:imgId', (request, response) => {
    const userId = request.params.id;
    const imgId = request.params.imgId;
    let deleted = false;

    let userRatings = pool.query(`SELECT ratings FROM users WHERE id = ${userId}`, (error, result) => {
        if(error){throw error;}
        let tmp = JSON.parse(result[0].ratings);
        for(x = 0; x < tmp.length; x++){
          if(tmp[x]['imgId'] === imgId){
            tmp[x] = null;
            x--;
            deleted = true;
          }
        }
        return tmp;
    });

    if(deleted){
      pool.query(`UPDATE users SET ratings = ${userRatings} WHERE ID = ${userId}`, (error, result) => {
          if(error){throw error;}
          response.send("Rating deleted!");
      });
    } else {
      response.send("Sorry, you have no ratings for this image.")
    }
  });

  const pool = require('../data/config');
  const keys = require('../data/keys');
  const request = require("request");
  //const {parse, stringify, toJSON, fromJSON} = require('flatted');
}

module.exports = router;

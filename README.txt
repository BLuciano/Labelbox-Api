Express, Node, MYSQL

REST API Application that uses NASA API to grab the picture of 
the day and store in a database. Database contains two tables, one for images
and another for users. Users are allowed to leave 1-5 star rating on images, and 
can do CRUD operations such as delete/update rating. Users can also see all of the
ratings they have.  

Coming from a Front-End environment with some previous PHP experience,
My main complications were getting familiar with Express, setting up the 
environment, and working with json inside MYSQL.

I would like to further develope this app to include a front end with React.

---------------------- HOW TO USE-------------------------------------
//create databse
CREATE DATABASE Labelbox

//create tables
CREATE TABLE `users` (
  `id`       int(11)     unsigned NOT NULL AUTO_INCREMENT,
  `email`     varchar(50) DEFAULT '',
  `ratings`    json,
  PRIMARY KEY (`id`)
);
CREATE TABLE `images`(
    `id`       int(11)     unsigned NOT NULL AUTO_INCREMENT,
    `day`      varchar(10) DEFAULT '',
    `url`      varchar(100) DEFAULT '',
    `ratings`  json,
    PRIMARY KEY (`id`)
);

//inserting dummy values into users database
INSERT INTO users (email, ratings) 
     VALUES ('email1@yahoo.com', '[{"imgId" : "2", "Stars" : "2"},{"imgID" : "3", "Stars" : "3"}]'), 
            ('email2@yahoo.com', '[{"imgId" : "2", "Stars" : "3"},{"imgID" : "5", "Stars" : "2"}]'),
            ('email3@yahoo.com');

//insert dummy image value
INSERT INTO images (day, url, ratings) 
     VALUES ('20201224', 'https://apod.nasa.gov/apod/image/2201/RhoOphAntares_Cogo_1024.jpg',
     '[{"userId" : "1", "Stars" : "2"},{"userId" : "2", "Stars" : "3"}, 
        {"userId" : "3", "Stars" : "5"}]');


CURL AND VIEW COMMANDS/URLS

___ADD IMAGE
http://localhost:8081/nasapi

___DISPLAY ALL IMAGES
http://localhost:8081/images

___DISPLAY ALL USERS
http://localhost:8081/users

___DISPLAY USER BY ID
http://localhost:8081/users/ID#

___ADD NEW USER:
curl -d "email=newEmail.com" http://localhost:8081/users

___DELETE USER:
*use number instead of ID# for the ID of the user you want to delete
curl -X DELETE http://localhost:8081/users/ID#*

___ADD RATING:
curl -X PUT http://localhost:8081/users/USERID#/IMGID#/RATING#

___UPDATE RATING
curl -X PUT http://localhost:8081/update/users/USERID#/IMGID#/RATING#

___DELETE RATING
curl -X PUT http/localhost:8081/delete/users/USERID#/IMGID#

___SHOW ALL RATINGS
http://localhost:8081/users/ID#/ratings


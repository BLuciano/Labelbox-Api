const router = app => {
  app.get("/", (req, res) => {
    res.send({message: "Labelbox REST API"});
  });

  app.get("/images", (req, res) => {
    res.send({message: "images here"});
  });
}

module.exports = router;

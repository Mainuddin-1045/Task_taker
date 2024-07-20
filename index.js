const express = require("express");

const path = require("path");

const fs = require("fs");

const app = express();

const PORT = 9000;

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index",{files: files});
  })
})

app.get('/file/:filename', function (req, res) {
   fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err,filedata) {
    res.render('show',{filename:req.params.filename,filedata:filedata});
   })
  })

  app.get('/edit/:filename', function (req, res) {
    res.render('edit',{filename : req.params.filename});
   })

   app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.Previous}`,`./files/${req.body.New}`,function(err) {

      res.redirect("/");
      
    })
   })

app.post('/create', function (req, res) {
    console.log(req.body); // Log the request body for debugging
  const title = req.body.title;
  const details = req.body.details;

  if (typeof title === 'undefined' || typeof details === 'undefined') {
    return res.status(400).send('Title and details are required');
  }

 
  fs.writeFile(`./files/${title.split(' ').join('')}.txt`,details,function(err){
    if (err) {
        return res.status(500).send('Error writing file');
      }

    res.redirect('/')

  })
  });


app.listen(9000, function () {
  console.log("Server is running on port 9000");
});

var bodyParser = require('body-parser'),
    express    = require('express'),
    mongoose   = require('mongoose'),
    app        = express();

//APP CONFIG
mongoose.connect('mongodb://localhost/sample_blog');
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

app.get('/', function(req, res) {
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

//CREATE ROUTE
app.post('/blogs', function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  });
});

//SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      console.log(err);
    } else {
      res.render('show', {blog: foundBlog});
    }
  })
});

//DELETE
app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  })
});


//server
app.listen(3000, function() {
  console.log("server has started");
});

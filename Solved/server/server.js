const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
var bodyParser = require('body-parser')
const { authMiddleware } = require('./utils/auth');
var multer = require('multer')
var mongoose = require('mongoose')
var fs = require('fs')

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { join } = require('path')
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});




var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.name + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });
var Recipe = require('./models/Recipe')

app.get('/recipe', (req, res) => {
  Recipe.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      // res.render('imagesPage', { items: items });
      res.json(items)
    }
  });
});

app.post('/upload', upload.single('picture'), (req, res, next) => {
  console.log(req.body)
  var recipe = {
    recipeName: req.body.recipeName,
    ingredients: req.body.ingredients,
    cookingTime: req.body.cookingTime,
    instructions: req.body.instructions,
    equipment: req.body.equipment,
    picture: {
      data: fs.readFileSync(join(__dirname, 'uploads', req.file.filename)),
      contentType: 'image/png'
    }
  }


  Recipe.create(recipe, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      item.save();
      res.sendStatus(200);
    }
  });
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// app routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const MONGODB_URI = process.env.MONGODB_URI;

// handle cors
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

// control headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// static files
app.use('/uploads', express.static(__dirname + '/uploads'));

// connect to db
mongoose
  .connect(MONGODB_URI, {
    dbName: 'blog',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // listening port
    app.listen(4000, () => {
      console.log(`Server is listening on port 4000`);
    });
  })
  .catch(err => {
    console.log(err);
  });

// user routes
app.use('/user', userRoutes);

// blog routes
app.use('/blog', blogRoutes);

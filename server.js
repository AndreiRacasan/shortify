const express = require('express');
const mongoose = require('mongoose');
const shortURL = require('./models/shortURL');

const app = express();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/URL", {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const shortURLs = await shortURL.find();
  res.render('index', {shortURLs: shortURLs});
});

app.post('/shortURL', async (req, res) => {
  await shortURL.create({full: req.body.fullURL});
  res.redirect('/');
});

app.get('/:shortURL', async (req, res) => {
  const URL_shortened = await shortURL.findOne({short: req.params.shortURL});
  if (URL_shortened == null) return res.sendStatus(404);

  URL_shortened.clicks++;
  URL_shortened.save();

  res.redirect(URL_shortened.full);
})

app.listen(process.env.PORT || 3000);
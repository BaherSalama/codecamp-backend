require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser= require('body-parser');
var url = require("url");
// Basic Configuration
const port = process.env.PORT || 3000;

let list = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.use(bodyParser.urlencoded({ extended: true }))

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let original = req.body.url;
  let parsed = url.parse(original)
  console.log(parsed.protocol)
  dns.lookup(parsed.hostname,{},(err,addr)=>{
    if (err){
      res.json({ error: 'invalid url' });
    }
    else if (parsed.protocol != "https:" && parsed.protocol != "http:"){
        res.json({ error: 'invalid url' });
    }
    else{
      list.push(original)
      res.json({original_url:original,short_url: list.length-1});
    }
  })
});

app.get('/api/shorturl/:index', function(req, res) {
  res.redirect(list[req.params.index]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

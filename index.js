"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var filters = require('./filters.js')

// App Setup =========================

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Global Vars =====================

// Routes ===========================

app.get('/word-map/:map_name', function (req, res) {
  var file = './' + req.params.map_name + '.json';

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      res.status(400);
      res.send({'ERROR':'File does not exist!'});
      return;
    } else {
      res.send(JSON.parse(data));
      return;
    }
  });
});

app.post('/word-map/create', function (req, res) {

  if (!req.body.map_name) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'map_name\' in the request body!'});
    return;
  }


  var file = './' + req.body.map_name + '.json';

  fs.writeFile(file, '{}', function(err) {
    if(err) {
      res.status(400);
      res.send({'ERROR':'Failed to create file!'});
      return;
    } else {
      res.send({'SUCCESS':'Word map file [' + file + '] was successfully created'});
      return;
    }
  });
});

app.post('/word-map/add', function (req, res) {

  if (!req.body.word) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'word\' in the request body!'});
    return;
  }

  if (!req.body.map_name) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'map_name\' in the request body!'});
    return;
  }

  var word = req.body.word;
  var file = './' + req.body.map_name + '.json';

  fs.readFile(file, 'utf8', function (err, data) {
    
    if (err) {
      res.status(400);
      res.send({'ERROR':'File does not exist!'});
      return;
    } else {
      
      var word_map = JSON.parse(data);
      word_map[word] = true;
      
      fs.writeFile(file, JSON.stringify(word_map, null, 2), function(err) {
        if(err) {
          res.status(500);
          res.send({'ERROR':'Failed to write to file!'});
          return;
        } else {
          res.send({'SUCCESS':'Added word [' + word + '] to word map file [' + file + ']' });
          return;
        }
      });
    }
  });
});

app.post('/word-map/remove', function (req, res) {

  if (!req.body.word) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'word\' in the request body!'});
    return;
  }

  if (!req.body.map_name) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'map_name\' in the request body!'});
    return;
  }

  var word = req.body.word;
  var file = './' + req.body.map_name + '.json';

  fs.readFile(file, 'utf8', function (err, data) {
    
    if (err) {
      res.status(400);
      res.send({'ERROR':'File does not exist!'});
      return;
    } else {
      
      var word_map = JSON.parse(data);
      word_map[word] = undefined;
      
      var success = writeWordMapToFile(word_map,file);
      if(!success) {
        res.status(500);
        res.send({'ERROR':'Failed to write to file!'});
        return;
      } else {
        res.send({'SUCCESS':'Removed word [' + word + '] from word map file [' + file + ']' });
        return;
      }
    }
  });
});

app.get('/filter-names', function(req,res) {
  var filterNames = Object.keys(filters);
  res.send({'filterNames':filterNames});
  return;
});

app.post('/parse', function(req,res) {

  if (!req.body.sentence) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'sentence\' in the request body!'});
    return;
  }

  if (!req.body.filters) {
    res.status(400);
    res.send({'ERROR':'Must provide attribute \'filters\' in the request body!'});
    return;
  }

  var parsedSentence = req.body.sentence;
  console.log('--------------------------------------------');
  console.log('Parsing Sentence:');
  console.log(`[${parsedSentence}]\n`);

  //  filtersObj = [
  //    {
  //      filter_name: 'filterName',
  //      word_map: 'file-name'
  //    },
  //    ...
  //  ]

  var filterOptions = JSON.parse(req.body.filters);

  filterOptions.forEach(filterOption => {

    var filterName = filterOption['filter_name'];
    var wordMap = filterOption['word_map'];

    console.log(`Applying filter [${filterName}] with word map file [${wordMap}]`);

    var newParsedSentence = filters[filterName](parsedSentence,wordMap);

    if (newParsedSentence) {
      parsedSentence = newParsedSentence;
    }

    console.log(`Sentence after filter [${parsedSentence}]\n`);

  });

  console.log(`Final Parsed Sentence [${parsedSentence}]`);

  res.send({'parsedSentence':parsedSentence});
});

app.listen(3003, function () {
  console.log('dictionary-svc app listening on port 3003!');
});


// Helper Functions =========================

var writeWordMapToFile = function(word_map, file) {
  fs.writeFile(file, JSON.stringify(word_map, null, 2), function(err) {
    return err ? false : true;
  });
}
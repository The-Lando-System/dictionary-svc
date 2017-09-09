(function() { 'use strict';

var fs = require('fs');
var LinkedList = require('./linked-list.js');

module.exports = {
  
  // Find and return all words that start with '@'. 
  findReferences: function(sentence) {

    var references = sentence.split(' ')
    .filter(function(word) {
      return word.startsWith('@');
    })
    .map(function(word) {
      return removeCamelCase(word.replace('@',''));
    });

    console.log(`Found references: [${references.join(' ')}]`);
    return references.join(' ');
  },

  // Find and return all words that begin with a capital letter
  findCapitalizedWords: function(sentence) {

    var capitalWords = sentence.split(' ')
    .filter(function(word) {
      return isCapitalized(word);
    });

    console.log(`Capital Words: [${capitalWords.join(' ')}]`);
    return capitalWords.join(' ');
  },

  // Remove any words that are in the "common-words" map file
  removeCommonWords: function(sentence) {
    var wordMap = readJsonFile('./common-words.json');

    var uncommonWords = sentence.split(' ')
    .filter(function(word) {
      return !wordMap.hasOwnProperty(word.toLowerCase());
    });

    console.log(`Uncommon Words: [${uncommonWords.join(' ')}]`);
    return uncommonWords.join(' ');
  }

};

// Helper Functions ====================================

// Read a JSON file into an object
var readJsonFile = function(filename) {
  return JSON.parse(fs.readFileSync(filename));
}


// Given a camel-cased word, will return the word with spaces between the "humps"
var removeCamelCase = function(word) {
  var nonCamelCased = '';
  var characters = new LinkedList(word.split(''));
  while(true) {
    nonCamelCased += characters.getCurrentItem();
    if (characters.getNextItem() != null){
      if (isCapitalized(characters.getNextItem()))
        nonCamelCased += ' ';
    }
    if (characters.getNextItem() == null) break;

    characters.next();
  }
  return nonCamelCased;
}


// Return true if the first letter in the word is capitalized
var isCapitalized = function(word) {
  var firstLetter = word.split('')[0];
  return (firstLetter.toUpperCase() == firstLetter);
}

})();
(function() { 'use strict';

var fs = require('fs');
var LinkedList = require('./linked-list.js');

module.exports = {
  
  // Find and return all words that start with '@'. 
  findReferences: function(sentence) {
    return sentence.split(' ')
      .filter(function(word) {
        return word.startsWith('@');
      })
      .map(function(word) {
        return removeCamelCase(word.replace('@',''));
      })
      .join(' ');
  },

  // Find and return all words that begin with a capital letter
  findCapitalizedWords: function(sentence) {
    return sentence.split(' ')
      .filter(function(word) {
        return isCapitalized(word);
      })
      .join(' ');
  },

  // Remove any words that are in the provided map file
  removeWordsFromMap: function(sentence,wordMapFile) {
    var wordMap = readJsonFile(`./${wordMapFile}.json`);

    return sentence.split(' ')
      .filter(function(word) {
        return !wordMap.hasOwnProperty(word.toLowerCase());
      })
      .join(' ');
  },

  // Return any matches using the provided map file
  matchWordsInMap: function(sentence,wordMapFile) {
    var wordMap = readJsonFile(`./${wordMapFile}.json`);

    return sentence.split(' ')
      .filter(function(word) {
        return wordMap.hasOwnProperty(word.toLowerCase());
      })
      .join(' ');
  },

  // Remove punctuation characters
  removePunctuation: function(sentence) {
    return sentence.replace(/[\.\,\?\!]/g,'');
  },

  // Remove any character that is not alphanumeric from the sentence
  removeNonAlphanumerics: function(sentence) {
    return sentence.replace(/[^a-zA-Z\d\s\@\#]/g,'');
  },

  // Replace any space, newline, tab with just a single space character
  normalizeSpaces: function(sentence) {
    return sentence.replace(/\s+/g,' ');
  }

};

// Helper Functions ===========================================================

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
  if (!word) return false;
  var firstLetter = word.split('')[0];
  return (firstLetter.toUpperCase() == firstLetter);
}

})();
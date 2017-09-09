(function() { 'use strict';

var method = LinkedList.prototype;

function LinkedList(items) {

  this.firstNode = new Node(items[0]);
  this.currentNode = this.firstNode;
  this.lastNode = this.firstNode;

  for (var i=1; i<items.length; i++){
    this.addItemToBack(items[i]);
  }
}

method.getPreviousItem = function() {
  return this.currentNode.previous == null ? null : this.currentNode.previous.value;
}

method.getCurrentItem = function() {
  return this.currentNode.value;
}

method.getNextItem = function() {
  return this.currentNode.next == null ? null : this.currentNode.next.value;
}

method.previous = function() {
  if (this.currentNode.previous == null) return;
  this.currentNode = this.currentNode.previous;
}

method.next = function() {
  if (this.currentNode.next == null) return;
  this.currentNode = this.currentNode.next;
}

method.addItemToBack = function(value) {
  var tempNode = this.lastNode;
  this.lastNode = new Node(value);
  tempNode.next = this.lastNode;
  this.lastNode.previous = tempNode;
}


// Helper class to hold Node data
var Node = function(value) {
  this.value = value;
  this.previous = null;
  this.next = null;
}

module.exports = LinkedList;

})();
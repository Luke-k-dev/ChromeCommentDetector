var version = 1

var _log = []

function logMessage(msg){
    _log.push(msg);
}

var constructCommentObjectFrom = function(node){
  var commentBaseString = node.nodeValue;
  let commentDoc = new DOMParser().parseFromString(commentBaseString, 'text/html');
  var shouldRenderDoc = false;
  let textReults = findAllText(commentDoc);

  var comments = [];
  for (var i = textReults.length - 1; i >= 0; i--) {
    comments.push({text: textReults[i].nodeValue, type:textReults[i].nodeType})
  }

  if (comments.length > 0){
      shouldRenderDoc = true;
  }

  return {docSource:commentBaseString, comments:comments, shouldRenderDoc:shouldRenderDoc};
}

var findComments = function(el) {
    var arr = [];
    for(var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType === 8) {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
};

var findAllText = function(el){
  var arr = [];
    for(var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType === Node.TEXT_NODE) {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
}

var parseComment = function(commentNode){
  var out = [];
  commentNode.childNodes.forEach((childNode) => {
    if (childNode.childNodes.length > 0){
      out = out.concat(parseComment(childNode));
    }else{
      out.push(constructCommentObjectFrom(childNode))
    }
  });

  return out
};



var commentNodes = findComments(document);
var comments = [];

for (var i = commentNodes.length - 1; i >= 0; i--) {
  comments.push(constructCommentObjectFrom(commentNodes[i]));
}

logMessage('Chrome Comment Detector (C) 2020 by Lucas Klein');
logMessage('https://github.com/Luke-k-dev');
logMessage("Using version: " + version)
logMessage('Preparing Comments...');
logMessage("running on" + window.href);
var out = [comments, _log];
out
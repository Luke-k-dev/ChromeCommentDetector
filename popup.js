
var rowTemplateString = null

var loadRowFileTemplate = function(callback){
	const url = chrome.runtime.getURL('row.html');

	fetch(url).then(response => response.text()).then(text => callback(text));
}

var displayComments = function(comments){
	var tableContainer = document.getElementById("comment-table-container");
	tableContainer.innerHTML = ""
	if (rowTemplateString == null){
		loadRowFileTemplate(function(template){
			rowTemplateString = template;
			displayComments(comments);
		});
		return
	}

	if (comments == null || comments.length == 0){
		tableContainer.innerHTML = "<p>No comments on page.</p>"
	}else{
		for (var i = 0; i < comments.length; i++) {
	 		tableContainer.innerHTML += createCommentDisplayNode(comments[i], i)
		}
	}
	
	document.getElementById("loading").style.display = "none";
}


var createCommentDisplayNode = function (comment, index){
	console.log("loading comment", comment, index);
	if (rowTemplateString == null){
		console.log("template not avaliable")
		return;
	}

	var dc = new DOMParser().parseFromString(rowTemplateString, 'text/html');

	dc.getElementById("comment-title").innerHTML = "Comment #"+(index+1);

	dc.getElementById("comment-renderer").style.display = "block";
	dc.getElementById("comment-renderer").setAttribute("display", "block");
	dc.getElementById("comment-renderer").setAttribute("srcdoc", comment.docSource);

	if (comment.comments != undefined || comment.comments.length == 0){
		comment.comments = [comment.docSource];
	}

	var commenthtml = ""
	for (var i = comment.comments.length - 1; i >= 0; i--) {
		var sand = document.createElement('div');
		sand.innerText = comment.comments[i];

		var elm = "<tr><p>"+sand.innerHTML+"</p></tr>";
		commenthtml += elm;
	}
	dc.getElementById("comments-list").innerHTML = commenthtml;

	return dc.getElementById("row-frame").innerHTML;
}

function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

function isArray(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === true;
}

function isString(myVar){
	return typeof myVar === 'string' || myVar instanceof String
}

var loadCommments = function(reload){
	chrome.runtime.getBackgroundPage(function (backgroundPage){
  	console.log("got background page!");
  	backgroundPage.getComments(function(res){
  		var results = res[0];
  		if (results === null){
  			console.log("error results is null")
  			return
  		}

  		console.log(res);
  		console.log(results);

  		results.forEach(function(item) {
  			console.log(item);			
  			if(isArray(item) && (item.length == 0 || isString(item[0]) == false)){
  				console.log("comment block found,", item);
  				displayComments(item);
  			}else{
  				console.log("FROM LOG", item);
  			}			
		})	
  		
  	});
  });
}
document.addEventListener('DOMContentLoaded', function(event) {
  //the event occurred
  console.log("page loaded");
  loadCommments(false);
});



function changeVideo() {
	 var x = Math.floor((Math.random() * 24) + 1);
	 $.ajax({
	     url: "http://www.reddit.com/r/aww/top/.json",
	     dataType: "json",
	     success: function(data) {
	     	console.log(data.data.children[x].data.url);
	     	if((data.data.children[x].data.url).includes("gifv")) {
	     		var url = data.data.children[x].data.url;
	     		var point = data.data.children[x].data;
	 			url = url.substring(0,url.indexOf("gifv")-1) + ".mp4";
	 			console.log(url);
	     		document.getElementById("video").src = url;
	     		document.getElementById("title").innerHTML = point.title;
	     	}else{
	     		changeVideo();
	     	}
	     }
	 });
}

window.onload = function() {
	changeVideo();
}

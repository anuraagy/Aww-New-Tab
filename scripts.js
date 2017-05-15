// Cache time-to-live in milliseconds.
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

const CACHE_DATA_KEY = 'r_aww_top';
const CACHE_TS_KEY = 'r_aww_top_ts';

function setImage(url, title, permalink) {
	var elem = "";
	if (url.includes("gifv")) {
		elem = $("#video");
		url = url.substring(0, url.indexOf("gifv")-1) + ".mp4";
	} else {
		elem = $("#image");
	}
	elem[0].src = url;
	elem.toggleClass('hidden');
	var titleElem = $("#title")[0];
	titleElem.innerHTML = title;
	titleElem.href = 'http://reddit.com/' + permalink;
}

function setRandomImage(data) {
	var x = Math.floor((Math.random() * 24) + 1);
	var randomChild = data.data.children[x];
	var point = randomChild.data;
	var url = point.url;
	if (url.includes("imgur.com") && !url.includes("i.imgur.com")) {
		// imgur images require an extra hop to get the actual image.
		var elems = url.split('/');
		imgurApiUrl = 'https://api.imgur.com/3/image/' + elems[elems.length-1];
		$.ajax({
			url: imgurApiUrl,
			dataType: "json",
			success: function(data) {
				setImage(data.data.link, point.title, point.permalink);
			},
		 });
	} else {
		setImage(url, point.title, point.permalink);
	}
	return "";
}

function changeImage() {
	// Check local storage for top awws.
	var cache = localStorage.getItem(CACHE_DATA_KEY);
	var cache_ts = localStorage.getItem(CACHE_TS_KEY);
	var now_ts = (new Date().getTime());
	if (cache && cache_ts && cache.length > 0 && cache_ts.length > 0 && (now_ts - parseInt(cache_ts) <= CACHE_TTL)) {
		// Cache hit.
		var err = setRandomImage(JSON.parse(cache));
		if (err.length > 0) {
			console.log(err);
		}
		return;
	}

	// Cache miss or expired.
	$.ajax({
		url: "http://www.reddit.com/r/aww/top/.json",
		dataType: "json",
		success: function(data) {
			var err = setRandomImage(data);
			if (err.length > 0) {
				console.log(err);
				return;
			}
			// Store in cache.
			localStorage.setItem(CACHE_TS_KEY, (new Date().getTime()));
			localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(data));
		},
	 });
}

window.onload = function() {
	changeImage();
}

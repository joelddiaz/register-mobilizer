var {Cc, Ci} = require("chrome");

var nonMobilePattern = new RegExp("^http://w*\.?theregister");

var httpRequestObserver =
{
  observe: function(subject, topic, data)
  {
	var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
	url = subject.URI.spec;
	var res = nonMobilePattern.test(url);
	if (res) {
		//non-mobile detected...redirect to mobile here
		var ioService = Cc["@mozilla.org/network/io-service;1"]
			.getService(Ci.nsIIOService);
		var newUri = url.replace(/http:\/\/w*\.?theregister\.co\.uk/, "http://m.theregister.co.uk");
		httpChannel.redirectTo(ioService.newURI(newUri, null, null));
	}
  }
};

var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);

exports.main = function (options, callbacks) {
	console.log("Starting up register mobilizer due to " + options.loadReason);
	observerService.addObserver(httpRequestObserver, "http-on-modify-request", false);
	//observerService.addObserver(httpRequestObserver, "http-on-opening-request", false);
}

exports.onUnload = function (reason) {
	console.log("Unloading register mobilizer add-on because " + reason);
	observerService.removeObserver(httpRequestObserver, "http-on-modify-request");
}

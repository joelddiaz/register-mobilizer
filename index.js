/* vim: set expandtab ts=4 sw=4: */

var debug = false;

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
            if (debug)
                console.log("non-mobile detected...redirecting to mobile");
            var ioService = Cc["@mozilla.org/network/io-service;1"]
                            .getService(Ci.nsIIOService);
            var newUri = url.replace(/http:\/\/w*.?theregister.co.uk/,
                                    "http://m.theregister.co.uk");
            httpChannel.redirectTo(ioService.newURI(newUri, null, null));
        }
    }
};

var observerService = Cc["@mozilla.org/observer-service;1"]
                        .getService(Ci.nsIObserverService);

exports.main = function(options, callbacks) {
    if (debug)
        console.log("Starting up register mobilizer due to " +
                    options.loadReason);
    observerService.addObserver(httpRequestObserver, "http-on-modify-request",
                                false);
    // observerService.addObserver(httpRequestObserver, "http-on-opening-request", false);
}

exports.onUnload = function(reason) {
    if (debug)
        console.log("Unloading register mobilizer due to " + reason);
    observerService.removeObserver(httpRequestObserver,
                                    "http-on-modify-request");
}


// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

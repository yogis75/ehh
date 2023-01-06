import url from "url";

function Request(req) {
  const parsedUrl = url.parse(`${req.headers.host}${req.url}`, true);
  const keys = Object.keys(parsedUrl);
  keys.forEach((key) => (req[key] = parsedUrl[key]));

  // to Fetch Header
  req.get = req.header = function header(name) {
    if (!name) {
      throw new TypeError("name argument is required to req.get");
    }
    if (typeof name !== "string") {
      throw new TypeError("name must be a string to req.get");
    }
    var lc = name.toLowerCase();

    return req.headers[lc];
  };

  // check the content type of request
  req.is = function is(type) {
    var ct = req.get("Content-Type");
    if (!type) return ct;
    if (!~type.indexOf("/")) type = mime.lookup(type);
    if (!~type.indexOf("*")) return ct === type;
    var typeArray = acceptParams(type);
    var len = typeArray.length;
    while (len--) {
      if (mimeMatch(ct, typeArray[len])) {
        return true;
      }
    }
    return false;
  };

  // req.query implemented already

  // req.cookies => Cookie will be enabled via plugins

  // req.body => It will be enabled via plugins

  // req.accepts() => can be implemented easily via accept npm package
  // should be part of core

  // req.method implemented already

  req.ip = req.connection.remoteAddress;

}

export { Request };

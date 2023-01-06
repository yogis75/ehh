import fs from "fs";

function Response(res) {
  // we can use cookie-parser module to implement this easily
  // to be implemented later as plugin
  res.cookie = (name, data) => {
    res.writeHead(200, {
      "Set-Cookie": `${name}=${data}`,
    });
  };
  function end(content) {
    res.setHeader("Content-Length", content.length);
    res.end(content);
    return res;
  }
  // setting response as json
  res.json = (content) => {
    try {
      content = JSON.stringify(content);
    } catch (err) {
      throw err;
    }
    res.setHeader("Content-Type", "application/json");
    return end(content);
  };
  // Setting Response as text/Html
  res.send = (content) => {
    res.setHeader("Content-Type", "text/html");
    return end(content);
  };
  // redirect
  res.redirect = (url) => {
    res.setHeader("Location", url);
    res.status(301);
    res.end();
    return res;
  };
  // setting response code
  res.status = (code) => {
    res.statusCode = code || res.statusCode;
    return res;
  };
  // We can use Send Module to implement this easily
  // to be implemented later as plugin
  res.sendFile = (path) => {
    const filePath = path;
    fs.exists(filePath, function (exists) {
      if (exists) {
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment; filename=" + "file",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("ERROR File does not exist");
      return;
    });
  };
}

export { Response }
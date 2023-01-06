class Parser {
  constructor() {}
  getReqData(req) {
    return new Promise((resolve, reject) => {
      try {
        let body = "";
        // listen to data sent by client
        req.on("data", (chunk) => {
          // append the string version to the body
          body += chunk.toString();
        });
        // listen till the end
        req.on("end", () => {
          // send back the data
          resolve(body);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
      // each 'entry' is a [key, value] tupple
      result[key] = value;
    }
    return result;
  }

  // urlParser(req) {
  //   const url = req.url.split("/");
  //   let data = {};
  //   data.entity = url[1];
  //   data.action = url[2];
  //   let queries = url[3];

  //   const urlParams = new URLSearchParams(queries);
  //   const entries = urlParams.entries();
  //   data.queries = {};
  //   for (const iterator of entries) {
  //     if (iterator[1] != "") {
  //       data.queries[iterator[0]] = iterator[1];
  //     }
  //   }
  //   return data;
  // }

  async parse(req) {
    if (req.method != "GET") {
      let data = await this.getReqData(req);
      req.body = JSON.parse(data);
    }
  }
}

export { Parser };

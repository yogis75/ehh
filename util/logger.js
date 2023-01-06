class Logger {
  constructor(req, res) {
    this.start = Date.now();

    console.log("-------------------------");
    console.log("Method : " + req.method);
    console.log("Path : " + req.url);

    req.on("end", () => {
      console.log("Request Time : " + (Date.now() - this.start) + "ms");
      console.log("-------------------------");
    });

    res.on("finish", () => {
      console.log("status : " + res.statusCode);
      console.log("Response Time : " + (Date.now() - this.start) + "ms");
    });
  }
}

export { Logger };

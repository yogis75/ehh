import { Importable } from "./interface/importables.js";
import { serverConfig } from "../config/server/config.js";
import { clientConfig } from "../config/client/config.js";
import { Logger } from "../util/logger.js";
import { Parser } from "../util/parser.js";

class Ehh extends Importable {
  constructor(config) {
    console.log(config);
    if (config?.env?.toUpperCase() == "NODE") {
      super(serverConfig.Core);
      this.config = serverConfig;
    } else {
      super(clientConfig.Core);
      this.config = clientConfig;
    }
    this.userConfig = config;
    this.Components = {};
  }
  async start() {
    try {
      await this.init();
      if (this.userConfig?.env?.toUpperCase() == "NODE") {
        await this.startServer();
      } else {
        await this.startClient();
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }

  async startClient() {
    var firstTime = localStorage.getItem("first_time");

    addEventListener("hashchange", (event) => {
      this.instances.router.resolveEvent(event);
    });

    console.log("Client Started");
  }

  construct() {
    this.functions = {};
    this.classList = {};
    this.instances = {};
    this.activeComponents = {};

    // // classifying functions
    this.functions["response"] = this.imports?.["Response"]?.["Response"];
    this.functions["request"] = this.imports?.["Request"]?.["Request"];

    // // classifying vlasses
    this.classList["Router"] = this.imports?.["Router"]["Router"];

    // // creating instances
    this.instances["router"] = new this.classList["Router"]();

    // Adding All Routes
    let components = this.userConfig.Entity;
    for (const component in components) {
      let currComponent = this.Components[component][component];
      this.activeComponents[component] = currComponent;
    }
  }

  async loadComponents() {
    let componentList = this.userConfig.Entity;
    if (componentList) {
      for (const componentKey in componentList) {
        let component;
        if (this.userConfig.env.toUpperCase() == "NODE") {
          component = await import(this.path + componentList[componentKey]);
        } else {
          component = await import(componentList[componentKey]);
        }
        this.Components[componentKey] = component;
      }
    }
  }

  async startComponents() {
    this.instances.router.setHomePage(this.userConfig.homePage || "index.html");
    for (const component in this.activeComponents) {
      let entities = this.activeComponents[component];

      for (const key in entities) {
        let entity = entities[key];
        this.instances.router.addRoute(entity);
      }
    }
    this.instances.router.start()
  }

  async init() {
    await this.importModules({ importType: "pre" });
    // setting the root path for our core

    if (this.userConfig?.env?.toUpperCase() == "NODE") {
      this.setRoot(this.imports.Process.cwd());
    } else {
      this.setRoot(location.hostname + ":" + location.port);
    }

    // post modules are modules which needs some pre modules to be used
    await this.importModules({ importType: "post" });

    // loading the entities
    await this.loadComponents();

    // constructiong the modules
    this.construct();

    // adding the components to the router
    await this.startComponents();
  }

  async startServer() {
    const server = this.imports.Http.createServer();
    server.on("request", this.handleRequest);
    server.listen(this.userConfig.Port, () => {
      console.log(`Server is listening on port ${this.userConfig.Port}`);
    });
  }
  handleRequest = async (req, res) => {
    this.functions.request(req);
    this.functions.response(res);
    let logger = new Logger(req, res);

    if (!this.instances["router"]) {
      this.sendDefaultResponse(req, res);
    }

    await new Parser().parse(req);
    this.instances["router"].resolveRequest(req, res);
  };

  // Send Default Response Depending upon query
  // if query is empty send it depending upon what the requesting
  // machine accept

  sendDefaultResponse = (req, res) => {
    let accepts = req.headers.accept.split(",");
    let accept = accepts[0];
    let list = {
      text: "text/plain",
      json: "application/json",
      html: "text/html",
      file: "application/octet-stream",
    };

    let type = list[req.query?.type] || accept;

    switch (type) {
      case "text/plain":
        res.end("Hello World");
        break;
      case "application/json":
        res.json({ message: "Hello World" });
        break;
      case "text/html":
        res.end("<h1>Hello World</h1>");
        break;
      case "application/octet-stream":
        res.sendFile("./lib/sample/helloWorld.txt");
        break;
      default:
        res.end("<h1>Hello World</h1>");
    }
  };
}

export { Ehh };

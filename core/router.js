class Router {
  constructor() {
    this.routes = [];
    this.root = "index.html"
  }

  start(){
    if (typeof window != "undefined") {
      window.onload = () => {
        console.log("onLoad");
        window.location = this.root;
        this.resolveEvent();
      };
      this.resolveEvent()
    }
  }
  setHomePage(root){
    this.root = root
  }
  addRoute(entity) {
    this.routes.push(entity);
  }
  async resolveEvent(event) {
    let { hash } = window.location;
    if(window.location.pathname == "/" && window.location.hash == ""){
      hash = this.root;
    }

    const route = this.routes.find((route) => {
      return hash.match(new RegExp(route.path));
    });
    if (route) {
      console.log(route);
      let callback = route.controller.callback;
      let res = await callback(
        event,
        route.view,
        route.model,
        route.controller.callback
      );
    } else {
      // redirectiing t home page
      window.location = "/" + this.root
    }
  }

  async resolveRequest(request, response) {
    const route = this.routes.find((route) => {
      let res = this.matchPath(route.path, request.url);
      if (res.matched) {
        request.params = res.params;
        return res;
      }
    });

    if (!route) {
      console.log("Invalid Route");
      return response.json({
        Success: false,
      });
    }

    let result = await route.callback(request, response);
  }

  // for backend purpose
  matchPath = (setupPath, currentPath) => {
    const setupPathArray = setupPath.split("/");
    const currentPathArray = currentPath.split("/");
    const setupArrayLength = setupPathArray.length;
    let match = true;
    let params = {};
    for (let i = 0; i < setupArrayLength; i++) {
      var route = setupPathArray[i];
      var path = currentPathArray[i];
      if (route[0] === ":") {
        params[route.substr(1)] = path;
      } else if (route === "*") {
        break;
      } else if (route !== path) {
        match = false;
        break;
      }
    }
    return match ? { matched: true, params } : { matched: false };
  };
}
export { Router };

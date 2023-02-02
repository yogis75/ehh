class Router {
  constructor() {
    this.routes = [];
    this.root = "index.html";
  }

  start() {
    if (typeof window != "undefined") {
      window.onload = () => {
        console.log("onLoad");
        window.location = this.root;
        this.resolveEvent();
      };
      this.resolveEvent();
    }
  }
  setHomePage(root) {
    this.root = root;
  }
  addRoute(entity) {
    this.routes.push(entity);
  }

  async resolveEvent(event) {
    // this.currentRoute = window.location.hash.slice(1);
    // this.queryParams = this.getQueryParams();
    // console.log(this.currentRoute, this.queryParams);
    let arr = window.location.hash.split("?");
    let { hash } = window.location;
    let hashArr = hash.split("?");
    hash = hashArr[0];
    if (window.location.pathname == "/" && hash == "") {
      hash = this.root;
    }

    let search = hashArr[1] || null;
    let params = hashArr;
    // console.log(params);
    // if (search) {
    //   params = JSON.parse(
    //     '{"' +
    //       decodeURI(search)
    //         .replace(/"/g, '\\"')
    //         .replace(/&/g, '","')
    //         .replace(/=/g, '":"') +
    //       '"}'
    //   );
    // }

    const route = this.routes.find((route) => {
      return hash.match(new RegExp(route.path));
    });

    // console.log(route);
    if (route) {
      // console.log(route);
      let callback = route.controller.callback;
      let res = await callback(
        event,
        route.view,
        route.model,
        route.controller.callback,
        params
      );
    } else {
      // redirectiing t home page
      // window.location = "/" + this.root;
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

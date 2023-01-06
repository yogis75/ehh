const serverConfig = {
  Core: {
    imports: {
      pre: {
        Http: "http",
        Process: "process",
      },
      post: {
        Response: "../response.js",
        Request: "../request.js",
        Router: "../router.js",
      },
    },
  },
  Components: {},
};

export { serverConfig };

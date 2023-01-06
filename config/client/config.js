const clientConfig = {
  Core: {
    imports: {
      pre: {},
      post: {
        Router: "/node_modules/ehh/core/router.js",
      },
    },
  },
  Components: {},
};

export { clientConfig };

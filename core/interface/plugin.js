// plugin interface
// Every Class that is a plugin should extend it
class Plugin {
  constructor(priority) {
    // plugins need a pririty whether to call the inbuilt function or made by user
    // default priority is inbuilt
    this.pririty = priority || "core";
    // Core Methods
    // the methods that come alongside a plugin goes inside core
    this.core = {};

    // extended methods
    // the methods that comes by extendion inside plugins
    this.plugins = {};
  }
  // plugin should be called via this method
  call = async (name) => {
    let fun;
    if (this.priority == "core") {
      fun = this.core[name] || this.plugins[name] || undefined;
    } else {
      fun = this.plugins[name] || this.core[name] || undefined;
    }
    return fun
  };

  // a plugin functionality sould be registered via this functionality
  register(plugin) {
    const { name, exec } = plugin;
    this.plugins[name] = exec;
  }
}

export { Plugin };

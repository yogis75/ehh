class Importable {
  constructor(configurations) {
    this.importList = configurations?.imports;
    this.imports = {};
  }

  // used to set root path
  setRoot(path) {
    this.path = path;
  }

  // Used to import all modules from the import list and put into imports
  async importModules(options) {
    // only work when the scope is server
    const { importType } = options;
    let myImports = this.importList[importType];
    console.log(myImports);
    for (const key in myImports) {
      if (myImports[key][0] === "/") {
        this.imports[key] = await import(myImports[key]);
      } else {
        this.imports[key] = await import(myImports[key]);
      }
    }
  }
}

export { Importable };

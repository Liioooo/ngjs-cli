# NGJS-CLI
CLI for AngularJS by Liiiooo

### Installation:
```
npm install ngjs-cli -g
```

### Documentation:
- Usage: `ngjs-cli [command]` 

- Commands:
    ```
    gc, generate-component [name] Generates an AngularJS-Component, --routing: adds the component too router-config
    gs, generate-service [name]   Generates an AngularJS-Service
    gf, generate-filter [name]    Generates an AngularJS-Filter
    grc, generate-router-config   Generates config for the ui.router
    cp, create-project [name]     Creates an AngularJS-Material-Project, --routing: adds routing-config to the project
    gvf, generate-value-file      Generates a File were you can define values
    gfa, generate-factory [name]  Generates an AngularJS-Factory
    serve                         Serves the application, --proxyconfig [configFile]: proxies requests
    build                         Builds the application (You must serve the app one time before you can build it)
    ```
    
- Creating a project
    - run `ngjs-cli cp [name]`
    - `cd` into the new directory called `name`
    - run `npm install` to install angular and other dependencies
    
- Removing modules from the Template
    - Remove the dependency from package.json
    - Remove it from `angular.module('Template', [...])`
    - Remove every usage of it from app.js
    - Remove the files from `ngjs-cli.config.json` if there are any
 
- Adding custom modules
    - install it with npm
    - add the files you need to the `ngjs-cli.config.json` file 
    - if required add them to `angular.module('Template', [...])`
    
- Note
    - Every injected dependency has to be used with `this.dependency`
    
#### Configuration File
The file `ngjs-cli.config.json` file is the config-file and it is required for the CLI to work properly.<br>
- Everything inside of `"copyToVendor"` will be copied to `app/vendor` + what you specified in `to`
- If there is `"importToIndexHTML"`, the CLI will create a `script` or a `link` tag in index html to this file, this option is optional
- You can also copy entire directories as shown with `"/node_modules/material-icons/iconfont/**"` in the example file
- Files in `"createIndexHTMLImports"` are not copied anywhere they are just inserted into `index.html`
- They CLI will insert files without checking if they exist.
- Files will be added to `index.html` in the same order as specified in the config-file, css files will be added before script files regardless of the order
- Config File example
    ```json
    {
      "copyToVendor": [
        {
          "from": "/node_modules/angular/angular.min.js",
          "to": "/angularjs",
          "importToIndexHTML": "script"
        },    
        {
          "from": "/node_modules/angular-material/angular-material.min.css",
          "to": "/angular-material",
          "importToIndexHTML": "css"
        },
        {
          "from": "/node_modules/material-icons/iconfont/**",
          "to": "/material-icons"
        }
      ],
      "createIndexHTMLImports": [
         {
           "file": "vendor/material-icons/material-icons.css",
           "type": "css"
         }
      ]
    }
    ```

#### Proxy
It ist possible to proxy requests for some URLs to another Server.
- At first add a proxyconfig File to your Project
- To use the proxy add the `--proxyconfig [configFile]` flag to the serve command
- Config File example
    ```json
    {
      "/api/**": {
        "target": "http://localhost:80",
        "changeOrigin": true
      }
    }
    ```
    This config will proxy every path that starts with /api, to localhost:80<br>
    Example:<br>
    /api/users/getUser.php > http://localhost:80/api/users/getUsers.php
- To read more go to the [http-proxy-middleware Documentation](https://github.com/chimurai/http-proxy-middleware#options)

### Changes:
`3.0.1`<br>
Changed style to SCSS, there are know stylesheets for every component

`3.1.0`<br>
Added `ngjs-cli.config.json` File, The CLI now auto copies files referenced in the config file to '/vendor' and automatically creates imports for files in 'index.html'.
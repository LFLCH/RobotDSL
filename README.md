# RobotDSL
RobotDSL is a school project (ESIR3 - ASE) that aims to create a simple Domain Specific Language (DSL) for Robots.

Find more about the developpment process in the associated [file](documentation/devprocess.md).

# RobotScript
<p align="center">
  <img src="./assets/logo_name.png" alt="robotscript logo" width="400">
</p>
<p align="center">
    RobotScript is the name of this language. It is a <a href="https://langium.org"> Langium</a> project. 
</p>

### Interpret
From a program and a given environnment, this project is able to calculate the state that the robot will have at each instant.

### Compile
A RobotScript program into Arduino code for Omni4WD robots.

## Get Started
After cloning this repository, don't forget to install the dependencies.
```bash
npm install && npm run langium:generate
```

## Main Commands
### Use the CLI
Compile the necessary files
```bash
npm run build
```

Interpret
```bash
./bin/cli.js interpret  <filepath.rbs> 
```

Compile
```bash
./bin/cli.js compile  <filepath.rbs> 
```

### Resources
#### Documentation
Learn more about the language syntax by reading its [documentation](documentation/rbs.md) file.

#### Example files
Several Example files of valid RobotScript code are located in the ```examples/``` folder. 
They can be used as reference to understand the language and to verify the behavior of the different implemented processes (parsing, compiling, etc.), using the CLI.


### Use the Web version

Compile the necessary files
```bash
npm run build:web
```

Launch the server
```bash
npm run serve
```


### Update the AST from the grammar 
```bash
npm run langium:generate
``` 

## VScode 
The Langium project has been developped using VSCode as main IDE. We therefore coded some tools that ease the developpment. 

### Extension
```bash
npm run build:extension
```
Then install the extension that was produced.
<p align="center">
  <img src="./assets/vscode_extension_install.png" alt="vscode extension install" width="300">
</p>

You can find it in the extensions tab of vscode. 
It will activate the RobotScript language support for all you  ```.rbs``` files. 

<p align="center">
  <img src="./assets/extension_overview.png" alt="vscode extension install" width="300">
</p>

###  Launches
<p align="center">
  <img src="./assets/vscode-extension-run.png" alt="vscode extension run" width="300">
</p>

VScode enables to automate debug processes, thanks to the *Run & Debug* tab.
There you can select several options:
- **Run Extension** launches a new VScode workspace, where the ```.rbs``` will have a RobotScript language suport.
- **Start web server** will launch a web server in background. Then it will be possible to access to the web version at [```localhost:3000```](http://localhost:3000/)

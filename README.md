# RobotDSL
RobotDSL is a school project (ESIR3 - Advanced Software Engineering class) that aims to create a simple Domain Specific Language (DSL) for Robots.


## RobotScript
<p align="center">
  <img src="https://github.com/LFLCH/RobotDSL/assets/62034725/751f97e1-838f-4b40-bf3a-aff89487d674" alt="Logo name" width="400">
</p>
<p align="center">
    RobotScript is a programming language specialized for mobile robots. <br>
    This repository is a <a href="https://langium.org"> Langium</a> project. <br>
    It provides a CLI as well as a WEB IDE to compile and interpret RobotScript programs.
</p>

### Interpret
From a program and a given environment, the interpreter is able to calculate the state that the robot will have at each instant. It is possible to interpret a same program for several robots. 

<p align="center">
  <img src="https://github.com/LFLCH/RobotDSL/assets/62034725/37c81912-b6d8-4b3c-a0e4-51da07f74b28" alt="Demo squares" width="300">
</p>

### Compile
A RobotScript program can be translated into Arduino code using the compiler. Currently, it is specifically done for [Omni4WD](https://manualzz.com/doc/o/96ghj/manual-omni4wd) robots.
<p align="center">
<img src="https://github.com/LFLCH/RobotDSL/assets/62034725/f3789fe0-d5d5-474f-8d64-476e5a408397" alt="Robot Preview" width="150">
</p>

### Demonstration
<video src="https://github.com/LFLCH/RobotDSL/assets/62034725/906b660a-8045-4425-becb-3102c87b029d" title="Main demo"></video>

## Get Started
After cloning this repository, don't forget to install the dependencies.
```bash
npm install && npm run langium:generate
```
## Resources
### Documentation
The ```documentation/``` folder contains several documentation files.
- Read [rbs.md](documentation/rbs.md) to learn more about the language syntax.
- Read [devprocess.md](documentation/devprocess.md) to learn more about the steps the we followed to achieve this project.   

### Examples
Several example files of valid RobotScript code are located in the ```examples/``` folder. 
They can be used as reference to understand the language and to verify the behavior of the different implemented processes.


## Main commands
### Use of the CLI
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


### Use the Web IDE

Compile the necessary files
```bash
npm run build:web
```

Launch the server
```bash
npm run serve
```

Open  [```localhost:3001```](http://localhost:3001/) in the browser.


### Update the AST from the grammar 
```bash
npm run langium:generate
``` 
Some generated files will be in the ```src/language/generated```. You will need to place them in the ```src/language/representation``` folder. Before replacing ```src/language/representation/currentast.ts``` with the content of ```src/language/generated/ast.ts```, please read the file comments.

## VScode 
The Langium project has been developped using VSCode as main IDE. We therefore coded some tools that ease the developpment. 

### Extension
```bash
npm run build:extension
```
Then install the extension that was produced.
<p align="center">
  <img src="https://github.com/LFLCH/RobotDSL/assets/62034725/11b490cf-b9ad-4028-aa7d-afd199713ac0" alt="vscode extension install" width="300">
</p>

You can find it in the extensions tab of vscode. 
It will activate the RobotScript language support for all the  ```.rbs``` files. 

<p align="center">
  <img src="https://github.com/LFLCH/RobotDSL/assets/62034725/f1f836ac-37fe-4493-b582-c2bc4c3cecf9" alt="vscode extension overview" width="300">
</p>

###  Launches
<p align="center">
  <img src="https://github.com/LFLCH/RobotDSL/assets/62034725/b3198de1-16f1-416e-a914-feb88d7207db" alt="vscode extension run" width="300">
</p>

VScode enables to automate debug processes, thanks to the *Run & Debug* tab.
There you can select several options:
- **Run Extension** launches a new VScode workspace, where the ```.rbs``` will have a RobotScript language suport.
- **Start web server** will launch a web server in background.

# RobotScript

## CLI
Use the cli to interact rapidly with the DSL.
```bash
./bin/cli.js -h
```
Example files of the DSL are located in the ```examples/``` folder. You can give them as argument while running the cli commands.

## VScode launches
![VScode launches](assets/vscode-extension-run.png)
VScode enables to automate debug processes, thanks to the *Run & Debug* tab.
There you can select several options:
- **Run Extension** launches a new VScode workspace, where the syntax analysis of the RobotScript files  will be applied.
- **Start web server** will launch a web server in background. Then it will be possible to access to the web version at [```localhost:3000```](http://localhost:3000/)

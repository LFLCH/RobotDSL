# RobotDSL
A simple Domain Specific Language for Omni4WD Robots.

## Structure Overview

```c
.
├── model   // SVG Files representing the Metamodel
├── robotscript // langium project for the DSL
└── training // Folder for a better understanding of langium
    └── RPC  // Rock Paper Scissors basic DSL
```

## Main Commands
For the langium projects, the following commands are very usefull.

### Generate the necessary files handling the grammmar 
```bash
npm run langium:generate
```

### Compile for the cli
```bash
npm run build
```

### Compile for the web
```bash
npm run build:web
```

### Launch the web server
```bash
npm run serve
```

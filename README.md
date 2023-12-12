# RobotDSL
A simple Domain Specific Language for Omni4WD Robots.

## Structure

```
.
├── model   // SVG Files representing the Metamodel
├── robotscript // langium project for the DSL
│   ├── bin
│   ├── public
│   │   ├── monaco-editor-workers
│   │   │   └── workers
│   │   ├── monaco-editor-wrapper
│   │   │   └── assets
│   │   └── syntaxes
│   └── src
│       ├── cli
│       ├── extension
│       ├── language
│       ├── static
│       └── web
└── training // Folder for a better understanding of langium
    └── RPC  // Rock Paper Scissors basic DSL
        ├── bin
        ├── examples
        ├── generated
        ├── scripts
        └── src
            ├── cli
            ├── extension
            ├── generator
            ├── language
            ├── static
            └── web
```

## Commands
For the langium projects, the following commands are very usefull.
```bash
npm run langium:generate
```

```bash
npm run build:web
```

```bash
npm run serve
```

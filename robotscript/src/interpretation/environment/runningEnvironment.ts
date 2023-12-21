export interface RunningEnvironment {
    width: number,
    height: number,
    executors: string[],
    instructions: Instruction[]
}


export interface Instruction {
    timestamp: number,
    name: "move" | "rotate" | "speed" | "speak",
    value: any,
    executor?: string
}

export interface Executor {
    initPosition : [number, number],
    name : string
}
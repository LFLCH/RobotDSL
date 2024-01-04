import { VModel } from "../language/semantics/visitor.js";

export class Compiler {

    
    constructor(
        ) {
     }

    compile(model: VModel): string {
        return `void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
}
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
} 
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
          
void loop() {
   // put your main code here, to run repeatedly:
   Serial.println("Hello World!");
   delay(1000);
}           
`
    }
}
/**
 * Contains arduino pieces of code that are useful to generate the final code in the compilation process.
 */
export class InoCode {
   static get INCLUDES() : string { 
    return `#include <PinChangeInt.h>
#include <PinChangeIntConfig.h>
#include <EEPROM.h>
#define _NAMIKI_MOTOR	 //for Namiki 22CL-103501PG80:1
#include <fuzzy_table.h>
#include <PID_Beta6.h>
#include <MotorWheel.h>
#include <Omni4WD.h>
#include <SONAR.h>
#include <String.h>
`
};

    static get  DECLARATIONS() : string {  
    return `irqISR(irq1, isr1);
MotorWheel wheel1(3, 2, 4, 5, &irq1);

irqISR(irq2, isr2);
MotorWheel wheel2(11, 12, 14, 15, &irq2);

irqISR(irq3, isr3);
MotorWheel wheel3(9, 8, 16, 17, &irq3);

irqISR(irq4, isr4);
MotorWheel wheel4(10, 7, 18, 19, &irq4);

Omni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4);
// Init the omni speed to 0.01 m/s (1st args in mm, 2nd to be invisible)
Omni.setCarSpeedMMPS(10, 10);

SONAR sonar11(0x11), sonar12(0x12), sonar13(0x13), sonar14(0x14);
unsigned short distBuf[4];  `
    };

    static get  SETUP_CONTENT() : string {
        return `
//TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis()
TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz
TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz

Omni.PIDEnable(0.31, 0.01, 0, 10);
`
    }
    
    static get  LOOP_CONTENT() : string {
        // return `Omni.demoActions(30,1500,500,false);`
        return "";
    }

    static get ROBOT_METHODS() : string {
        return `

/**
 * We consider that the units are m, s and m/s
*/
void robotMove(String movement, double distance){
    switch(movement) {
        // Convert distance in mm
        distance *= 1000;

        // Get current speed
        unsigned int speed = Omni.getCarSpeedMMPS();

        // Compute the duration in MS to the Omni does the movement
        double duration = distance / speed;
        
        case "Forward":
            Omni.setCarAdvance(speed);
            Omni.delayMS(duration, false);
            break;
        case "Backward":
            Omni.setCarBackoff(speed);
            Omni.delayMS(duration, false);
            break;
        case "Left":
            Omni.setCarLeft(speed);
            Omni.delayMS(duration, false);
            break;
        case "Right":
            Omni.setCarRight(speed);
            Omni.delayMS(duration, false);
            break;
        default: 
            Serial.print("Wrong movement provided.");
    }
}

// angle in degrees
void robotRotate(double angle){
    // Convert angle to radians
    float angleRadians = angleDegree * (3.14159265358979323846 / 180.0);

    // Calculate arc length
    float arcLength = ROBOT_RADIUS * (angleRadians / (2 * 3.14159265358979323846));

    // Get current speed
    unsigned int speed = Omni.getCarSpeedMMPS();

    // Determine the rotation direction (left or right)
    int rotationDirection = (angle < 0) ? -1 : 1;

    // Call the appropriate rotation method based on the direction
    if (rotationDirection == -1) {
        Omni.setCarRotateRight(speed);
    }else{
        Omni.setCarRotateLeft(speed);
    }

    // Calculate time needed for rotation
    float timeInSeconds = arcLength / speedMMPS;

    Omni.delayMS(timeInSeconds * 1000);
}

/**
 * We consider that the units are m/s
 * The second argument of setCarSpeedMMPS is the uptime
 */
void setRobotSpeed(double speed){
   Omni.setCarSpeedMMPS(speed, 10);
}

void robotSpeak(String text){
    Serial.println(text);
}

unsigned char sonarsUpdate() { 
    static unsigned char sonarCurr = 1; // A variable save a data used to flag the state of sonar 
    if(sonarCurr==4) sonarCurr=1;  
    else ++sonarCurr;  
    if(sonarCurr==1) { // The condition is true?
        distBuf[1]=sonar12.getDist(); // Get the value of distance from sonar12         
        sonar12.trigger(); //  Trigger  sonar12  
    } else if(sonarCurr==2) {  
        distBuf[2]=sonar13.getDist();  
        sonar13.trigger();  
    } else if(sonarCurr==3){  
        distBuf[3]=sonar14.getDist();  
        sonar14.trigger();  
    } else { 
        distBuf[0]=sonar11.getDist();  
        sonar11.trigger();  
    } 
        return  sonarCurr; // Return the  value  
    } 

double getRobotDistance(){
    unsigned char currentSonar = 1;
    for(unsigned int i = 0; i < 4; i ++)
    {
        currentSonar = sonarsUpdate();
        Serial.println("Sonar %d acquires a distance of %d", currentSonar, distBuf[currentSonar]);
    }
}

double getRobotSpeed(){
    return Omni.getCarSpeedMMPS();
}`
    }

    static get AND() : string {
        return "&&";
    }

    static get OR() : string {
        return "||";
    }

    static get NOT() : string {
        return "!";
    }

    static get EQUAL() : string {
        return "==";
    }

    static get DIFFERENT() : string {
        return "!=";
    }

    static get GREATER() : string {
        return ">";
    }

    static get GREATER_EQUAL() : string {
        return ">=";
    }

    static get LESS() : string {
        return "<";
    }

    static get LESS_EQUAL() : string {
        return "<=";
    }

    static get PLUS() : string {
        return "+";
    }

    static get MINUS() : string {
        return "-";
    }

    static get TIMES() : string {
        return "*";
    }

    static get DIVIDE() : string {
        return "/";
    }

    static get MODULO() : string {
        return "%";
    }

    static get ASSIGN() : string {
        return "=";
    }

    static get TRUE() : string {
        return "true";
    }

    static get FALSE() : string {
        return "false";
    }

    static get BLOCK_START() : string {
        return "{\n";
    }

    static get BLOCK_END() : string {
        return "\n}";
    }

    static get PARAM_SEPARATOR() : string {
        return ", ";
    }

    static get METHOD_CALL_START() : string {
        return "(";
    }

    static get METHOD_CALL_END() : string {
        return ")";
    }

    static get METHOD_DECLARATION_START() : string {
        return "(";
    }

    static get METHOD_DECLARATION_END() : string {
        return ")";
    }

    static get COND_START() : string {
        return "(";
    }

    static get COND_END() : string {
        return ")";
    }

    static get VOID_TYPE() : string {
        return "void";
    }

    static get DOUBLE_TYPE() : string {
        return "double";
    }

    static get INT_TYPE() : string {
        return "int";
    }

    static get BOOLEAN_TYPE() : string {
        return "boolean";
    }

    static get RETURN() : string {
        return "return ";
    }

    static get IF() : string {
        return "if";
    }

    static get ELSE() : string {
        return "else";
    }

    static get ELSE_IF() : string {
        return "else if";
    }

    static get FOR() : string {
        return "for";
    }

    static get FOR_SEPARATOR() : string {
        return ";";
    }

    static get WHILE() : string {
        return "while";
    }

    static get MINUS_UNARY() : string {
        return "-";
    }


}
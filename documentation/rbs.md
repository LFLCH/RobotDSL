# RobotScript syntax
Find here all the keywords and how to use them.
The syntax of the main operations is very inspired from C, C++, Java & others. 

A RobotScript program is one document, composed of function definitions and statments. 
There is no main. <br>
Every directly written statement, or called statement via a function call will be read at execution. Unless it is commented (```//commented statement```). Moroever, each statment must end with a semicolon ```;```. 

You will find illustration examples in the [examples](../examples) folder.

Some examples are deliberately made more complex to demonstrate the expressiveness of our language.

The language is still recent, and currently, all the described rules are not necessarily verified before or during compilation or execution. We therefore encourage you to respect what is written here to have the most expected result.

## Types
Types are used for methods and variables.
There are 4 types.
- ```int``` : classical integer. Can be positive, null or negative (```-``` sign before).
- ```double``` : a number that can be decimal (```.``` sign as decimal separator)
- ```boolean``` : classical boolean. Can be whether ```true``` or ```false```.
- ```void``` : only on methods. It means there is no return from it.
## Variables
All variables are typed and declared with an assignement.
```ts
<Type> variablename = <expression>;
``` 
The variable available types are only  ```int```, ```double``` and  ```boolean``` . The type of the value from the expression should respect the type of the variable.

The scope of a variable is limited to a block and its subblocks. 

A variable can be ovewrote in a subblock. It will not affect the value of the parent variable.
- Example
```ts
int a=5;
int b=2;

void displayA(){
    Print a;
    int a = 12;
    Print a;
    int c = 55;
}

void displayB(){
    Print b;
    b = 8;
    Print b;
    // Print c; // ❌ cannot be done. c is not accessible.
}

displayA(); // 5, 12
displayB(); // 2, 8

Print a; // 5
Print b; // 8
//Print c; // ❌ cannot be done. c is not accessible
```

## Operations
Not much to say about the possible operations. They are very classical. 
All the unary operations are used like the following:
```ts
<operationSign> <expression>
``` 
And all the binary operations are used like the following : 
```ts
<expressionA> <operationSign> <expressionB> 
```
If you manage several operations in a same expression, you can use ```(``` ```)``` parenthesis to garanty their order of interpretation explicitly.
For instance ```(b+c)*a``` will solve ```b+c``` first, then multiply the result by ```a```.

### Boolean Operators
**unary**
- Not : ```!```
  
**binary**
- And : ```&&```
- Or : ```||```
- Comparisons  
  - Less than : ```<``` 
  - Less or equals : ```<=``` 
  - Greater than : ```>```
  - Greater or equals : ```>=``` 
  - Equals : ```==```
  - Differs : ```!=```
### Arithmetical Operators
**unary**
- Minus : ```-```

**binary**
- Sum : ```+```
- Substraction : ```-``` 
- Multiplication : ```*```
- Division : ```/```
- Modulo : ```%```

## Control structures
For each of them, a boolean condition is necessary. 
### ```if```, ```elseif```, ```else```
As usual, ```elseif``` and ```else``` are optional.
```ts
if (<boolean condition>){
    ...
}
elseif(<boolean condition>){
    ...
}
else {
    ...
}
```
### ```for``` 
```ts
for(<variable declaration or assignement> ; <boolean condition>; <variable update with assignement>){
    ...
}
```
Please not that the increment (```++```, ```+=```) and decrement (```--```, ```-=```) are not currently available, so it is necessary to use another arithmetical operation while writting the variable update.

Example
```ts
for(int i=0; i<5 ; i=i+1){
    Print i;
}
// 0 1 2 3 4
```

### ```while```
```ts
while(<boolean condition>){
    ...
}
```
Please garanty the while loop to have an end. 
```ts
int i=0;
while(i<5){
    Print i;
    i=i+1;
}
// 0 1 2 3 4
```

## Functions
Definition
```ts
<Type> functionname(<arguments>){

}
```
The arguments part can be whether empty, or contain one or several variable declarations (without assignation). Each argument is separated by a comma ```,```.

Call
```ts
functionname(<argumentvalues>)
```

Example
```ts
// Definition
void repeat(int value, int n){
    for(int i=0; i<n ; i=i+1){
        Print value;
    }
}
// Call
repeat(19, 3); // 19 19 19
```

## Sensors and robot actions
The sensors and the actions allow the developper to interact with the robot. They are not methods, just keywords. They can be used to send an operation to process for the robot (robot action), or to capture data from the robot (sensor). 
Thay all have the same aspect. 
```ts
<sensorOrAction> value in <sensorUnit> 
``` 
### Robot actions
- ```Forward```, ```Backward```, ```Left``` and ```Right``` : make the robot move, in the given direction. 
- ```ModifySpeed``` : change the speed of the robot
-  ```Clock```, ```Anticlock``` : rotate the robot, in degrees. They are the only robot action that do not require a conversion, therefore, they do not need the conversion part (```in <sensorUnit>```).

### Sensors
- ```CurrentTime``` : access the robot internal time. It is a relative time, that is computed since it began to run the program.  
- ```CurrentDistance``` : access the distance to the nearest obstacle in front of the robot. The returned value is negative if no obstacle was found.

### Robot Units
The units used are widespread and easily understable by everyone.

In this way, we manipulate :
- **Distance** in ```m``` (meters), ```dm``` (decimeters) , ```cm``` (centimeters), or ```mm``` (millimeters).
- **Time** in ```s``` (seconds) or ```ms``` (milliseconds).
- **Angles** in degrees only. The degrees are not explicitly expressed. 

We also manipulate **speed**, but it is always expressed as a distance unit, per second. For instance, if the robot says it has a speed of  ```25 m```, you should understand that it has a speed of ```25 m/s```. 

Example
```ts
Forward 5 in m;
ModifySpeed 5 in m;
Backward 12.3 in m;
Clock 45;
Left 564 in cm;
Anticlock -160;
Right 6 in m;
Print CurrentDistance in cm;
Print CurrentTime in s;
```
## Debugging
### ```Print```
Logs a value in the console.  
```ts
Print <value or existing variable>;
```
Reminder : this language doesn't currently support ```strings``` or ```char```, so you cannot print a message of this type.
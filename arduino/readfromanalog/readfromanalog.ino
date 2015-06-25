// These constants won't change.  They're used to give names
// to the pins used:
const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
const int analogOutPin = 9; // Analog output pin that the LED is attached to

int sensorValue = 0;        // value read from the pot
int outputValue = 0;        // value output to the PWM (analog out)
int minInputValue = 1024;
int maxInputValue = 0;
int learningMode = 0;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
}

void loop() {
  sensorValue = analogRead(analogInPin);
  if (learningMode < 1000) {
    if (maxInputValue < sensorValue) {
      maxInputValue = sensorValue;
    } else if (minInputValue > sensorValue) {
      minInputValue = sensorValue;
    }
    // Serial.print("learningMode: ");
    // Serial.println(learningMode);
    // Serial.println(maxInputValue);
    // Serial.println(minInputValue);
    learningMode++;
    delay(2);
  } else {
    // read the analog in value:
    sensorValue = analogRead(analogInPin);            
    // map it to the range of the analog out:
    outputValue = map(sensorValue, minInputValue, maxInputValue, 1, 100);
    // Serial.print("IN ");  
    // Serial.println(sensorValue);  
    // change the analog out value:
    //analogWrite(analogOutPin, outputValue);           
    
    // print the results to the serial monitor:
    //Serial.print("sensor = " );                       
    //Serial.print(sensorValue);      
    //Serial.print("\t output = ");      
    // Serial.print("OUT ");
    Serial.println(outputValue);
    //Serial.println("-M");   
    
    // wait 2 milliseconds before the next loop
    // for the analog-to-digital converter to settle
    // after the last reading:
    delay(20);
  }  
}

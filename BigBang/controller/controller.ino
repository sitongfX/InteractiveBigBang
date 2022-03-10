
#include <ArduinoJson.h>

  uint8_t buttonVal = 1;
  int joyX = 1700;
  int joyY = 1700;
  int potVal = 0;

void setup() {
  Serial.begin(250000);
  delay(8000); // give me time to bring up serial monitor
  
  while (!Serial) continue;
  pinMode(15, INPUT_PULLUP);

}

// button - ground and pin 15, pressed as 0, normal as 1
// potentiometer pin 12
// joystick VRy(27)-white Vrx(26) black
//

void loop(){

  buttonVal = map(digitalRead(15), 0, 1, 0.02,0.08); // size
  joyX = map(analogRead(26), 0, 4096, 2, 20); // branches
  joyY = map(analogRead(27), 0, 4096, 0, 2); // randomness
  potVal = map(analogRead(12), 0, 4096, 0, 10000);  // count of stars
  
  StaticJsonDocument<200> doc;

  doc["B"] = buttonVal;
  doc["P"] = potVal;
  doc["X"] = joyX;
  doc["Y"] = joyY;
  
  String s = "";
  serializeJson(doc, s);
  Serial.print(s);
  Serial.print("\n");
  

   
//  Serial.println(analogRead(12) ); // 0 to 4096
//
//  Serial.println(analogRead(27)); // 0, resting - 1750, 4095
//    
//  Serial.println(analogRead(26)); // 0, resting - 1723, 4095

  

}

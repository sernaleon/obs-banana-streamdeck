#define NUM_INPUTS 3
int pins[NUM_INPUTS] = {D0, D1,  D2};
bool lastValues[NUM_INPUTS] = {false,false,false};

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < NUM_INPUTS; i++ ) {
    pinMode(pins[i], INPUT);
  }
}

void loop() {
  for (int i = 0; i < NUM_INPUTS; i++ ) {
   bool value = digitalRead(pins[i]) == LOW;
   bool lastValue = lastValues[i];
   if (value != lastValue) {
      if (value) {
          Serial.println(i);
      }
      lastValues[i] = value;
   }
  }
  delay(10);
}

#define NUM_INPUTS 6
#define SENSITIVITY 20
#define BAUD_RATE 115200

int bananas[NUM_INPUTS] = {A0, A1, A2, A3, A4, A5};
int leds[NUM_INPUTS] = {11, 10, 9, 8, 7, 6};
bool lastValues[NUM_INPUTS] = {false, false, false, false, false};

void setup()
{
    Serial.begin(BAUD_RATE);
    for (int i = 0; i < NUM_INPUTS; i++)
    {
        pinMode(bananas[i], INPUT);
        pinMode(leds[i], OUTPUT);
    }
}

void loop()
{
    for (int i = 0; i < NUM_INPUTS; i++)
    {
        bool value = 1024 - analogRead(bananas[i]) >= SENSITIVITY;
        if (value != lastValues[i])
        {
            if (value)
            {
                Serial.println(i);
                digitalWrite(leds[i], HIGH);
            }
            else 
            {
                digitalWrite(leds[i], LOW);
            }
            lastValues[i] = value;
        }
    }
    delay(10);
}

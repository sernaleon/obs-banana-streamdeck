#include "UsbKeyboard.h"
int InData1 = 0, InData2 = 0, InData3 = 0, InData4 = 0, InData5 = 0, InData0 = 0; //touch input value
//temporary storage
int TouchSensitivity = 20; //touch sensitivity. 0~1023，the larger the value, the lower the sensitivity.
void setup()
{
for(int i = A0; i <= A5; i++)
{
pinMode(i, INPUT); //A0~A5 port as input port
}
for(int i = 6; i <= 12; i++)
{
pinMode(i, OUTPUT); //A0~A5 port as input port
}
TIMSK0 &= !(1 << TOIE0);
}
void loop()
{
UsbKeyboard.update();
//read out the voltage value of all pins, and because of pull-up resistor，
//the default of all pins of maximum level is 1023，decrease the level of pins though touch.
//so the value is by 1024-analogRead(A0);
InData0 = 1024 - analogRead(A0);
InData1 = 1024 - analogRead(A1);
InData2 = 1024 - analogRead(A2);
InData3 = 1024 - analogRead(A3);
InData4 = 1024 - analogRead(A4);
InData5 = 1024 - analogRead(A5);
//trigger keyboard events with various possibility
if(InData0 >= TouchSensitivity)
{
digitalWrite (11, HIGH);
UsbKeyboard.sendKeyStroke(4); //A
}
else digitalWrite(11, LOW);
if(InData1 >= TouchSensitivity)
{
digitalWrite(10, HIGH);
UsbKeyboard.sendKeyStroke(5); //B
}
else digitalWrite(10, LOW);
if(InData2 >= TouchSensitivity)
{
digitalWrite(9, HIGH);
UsbKeyboard.sendKeyStroke(6); //C
}
else digitalWrite(9, LOW);
if(InData3 >= TouchSensitivity)
{
digitalWrite(8, HIGH);
UsbKeyboard.sendKeyStroke(7); //D
}
else digitalWrite(8, LOW);
if(InData4 >= TouchSensitivity)
{
digitalWrite(7, HIGH);
UsbKeyboard.sendKeyStroke(8);//E
}
else digitalWrite(7, LOW);
if(InData5 >= TouchSensitivity)
{
digitalWrite(6, HIGH);
UsbKeyboard.sendKeyStroke(9);//F
}
else digitalWrite(6, LOW);
delay(100);
}

# OBS Banana Streamdeck

A banana based OBS scene switcher! It also works with potatoes.

[![demo](/demo.gif)](/demo.gif)

# Prerequisites

Buy:
- [Arduino UNO Rev3](https://store.arduino.cc/arduino-uno-rev3)
- [TouchKeyUSB Shield](https://www.keyestudio.com/free-shipping-new-keyestudio-touch-key-usb-shield-for-arduino-p0337.html). Alternatively, you could also [replicate the same circuit using 2MΩ resistors](https://threwthelookingglass.com/fakey-fakey-an-arduino-based-diy-makey-makey/#wiring).
- [Alligator clips](https://www.amazon.com/WGGE-WG-026-Pieces-Colors-Alligator/dp/B06XX25HFX)

Install:
- [Arduino IDE](https://www.arduino.cc/en/Main/Software)
- [OBS Studio](https://obsproject.com/download)
- [OBS WebSocket plugin](https://github.com/Palakis/obs-websocket/releases/latest)
- [Google Chrome](https://www.google.com/chrome/)

# Instructions
* Download this repo.
* Connect the bananas to the Arduino, and the Arduino to your computer.
  * Using Arduino IDE, upload the sketch inside the folder /BananaSrc.
  * Using alligator clips, plug the bananas into the shield.
* Open OBS and make sure the WebSocket plugin is installed.
* Using chrome, 
  * Browse to `chrome://flags/#enable-experimental-web-platform-features` and enable "Experimental Web Platform features". This will allow communication with Arduino via USB.
  * Open `index.html` and click connect.


That's it! You can now switch scenes by touching the banana connected to GND plus the scene you want to switch to:

| Touching the bananas connected to | will switch to | 
| -------------: |-------------:|
| GND+A0      | First scene |
| GND+A1      | Second scene |
| GND+A2      | Third scene |
| GND+A3      | Fourth scene |
| GND+A4      | Fifth scene |
| GND+A5      | Sixth scene |

# Disclaimer

DON'T WASTE FOOD.
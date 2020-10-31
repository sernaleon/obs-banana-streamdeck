import ComDevice from './ComDevice'
import View from './View'
import Obs from './Obs'
import SerialObsBridge from './SerialObsBridge'

window.view = new View() // Create view interactions
window.obs = new Obs() // Create OBS communication
window.comDevice = new ComDevice() // Create external device (Arduino) comunication
window.serialObsBridge = new SerialObsBridge() // Bridge between OBS and Serial

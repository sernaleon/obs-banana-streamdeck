/* global TextDecoderStream */
import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * Reads bananas from Arduino 
 * using the new Serial Api (see https://wicg.github.io/serial).
 * 
 * It listens to the 'Connect' event.
 * 
 * When a COM message is received from Arduino 
 * it sends the event 'ChangeScene'.
 */
export default class ComDevice {
  constructor (messenger = new Messenger()) {
    this.messenger = messenger
    this.messenger.subscribe(EventNames.Connect, () => this.connectAsync())
  }

  async connectAsync (baudRate = 115200) {
    console.log('Opening COM with baudRate: ' + baudRate)
    this.port = await navigator.serial.requestPort()
    await this.port.open({ baudRate: baudRate })
    const decoder = new TextDecoderStream()
    this.port.readable.pipeTo(decoder.writable)
    const inputStream = decoder.readable
    this.reader = inputStream.getReader()
    console.log('Serial port connected', this)
    this.startReadingAsync()
  }

  async startReadingAsync () {
    this.reading = true
    while (this.reading) {
      const { value, done } = await this.reader.read()
      if (value) {
        this.messenger.publish(EventNames.ChangeScene, parseInt(value))
      }
      if (done) {
        this.stopReading()
      }
    }
  }

  stopReading () {
    this.reader.releaseLock()
    this.reading = false
  }
}

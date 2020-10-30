/* global TextDecoderStream */
import Messenger from './Messenger'
import EventNames from './EventNames'

const DEFAULT_BAUD_RATE = 115200

/**
 * Reads bananas from Arduino
 * using the new Serial Api (see https://wicg.github.io/serial).
 *
 * It listens to the 'Connect' event.
 * Once connected, it fires 'SerialConnected'.
 * When a COM message is received from Arduino
 * it sends the event 'ChangeScene'.
 */
export default class ComDevice {
  constructor (messenger = new Messenger()) {
    this.messenger = messenger
    this.messenger.subscribe(EventNames.Connect, (data) => this.connectAsync(data.baudRate))
  }

  async connectAsync (baudRate = DEFAULT_BAUD_RATE) {
    console.log('Opening COM with baudRate: ' + baudRate)
    this.port = await navigator.serial.requestPort()
    await this.port.open({ baudRate: baudRate })
    const decoder = new TextDecoderStream()
    this.port.readable.pipeTo(decoder.writable)
    const inputStream = decoder.readable
    this.reader = inputStream.getReader()
    this.messenger.publish(EventNames.SerialConnected, this.port.getInfo())
    console.log('Serial port connected', this.port.getInfo())
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
        await this.stopReadingAsync()
      }
    }
  }

  async stopReading () {
    this.reader.releaseLock()
    await this.port.close()
    this.reading = false
  }
}

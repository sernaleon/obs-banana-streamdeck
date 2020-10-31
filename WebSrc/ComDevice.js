/* global TextDecoderStream */
import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * Reads numbers from a Serial Device
 * using the new Serial Api (see https://wicg.github.io/serial).
 *
 * Listens to Connect, Disconnect & Error.
 * Fires SerialConnected, SerialMessageReceived & Error.
 */
export default class ComDevice {
  constructor (messenger = new Messenger()) {
    this.messenger = messenger
    this.messenger.subscribe(EventNames.Connect, (data) => this.connectAsync(data.baudRate))
    this.messenger.subscribe(EventNames.Disonnect, () => this.disconnectAsync())
    this.messenger.subscribe(EventNames.Error, () => this.disconnectAsync())
  }

  async connectAsync (baudRate) {
    try {
      console.log('Opening Serial with baudRate ' + baudRate)
      this.port = await navigator.serial.requestPort()
      await this.port.open({ baudRate: baudRate })
      const decoder = new TextDecoderStream()
      this.inputDone = this.port.readable.pipeTo(decoder.writable)
      this.reader = decoder.readable.getReader()
      this.messenger.publish(EventNames.SerialConnected, this.port.getInfo())
      console.log('Serial port connected', this.port.getInfo())
      this.startReadingAsync()
    } catch (e) {
      console.error(e)
      this.messenger.publish(EventNames.Error, 'Cannot connect to Serial device.')
    }
  }

  async startReadingAsync () {
    try {
      this.reading = true
      while (this.reading) {
        const { value, done } = await this.reader.read()

        if (done) {
          return await this.disconnectAsync()
        }

        const id = parseInt(value)
        if (!isNaN(id)) {
          this.messenger.publish(EventNames.SerialMessageReceived, id)
        }
      }
    } catch (e) {
      console.error(e)
      this.messenger.publish(EventNames.Error, 'Error reading Serial device.')
    }
  }

  async disconnectAsync () {
    if (this.reading) {
      this.reading = false
      await this.reader.cancel()
      await this.inputDone.catch(() => {})
      await this.port.close()
      console.log('Serial disconnected')
    }
  }
}

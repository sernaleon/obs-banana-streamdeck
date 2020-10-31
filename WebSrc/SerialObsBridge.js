import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * Communication bridge between Serial and OBS.
 *
 * Listens SerialMessageReceived and fires ChangeScene.
 */
export default class SerialObsBridge {
  constructor (messenger = new Messenger()) {
    this.messenger = messenger
    this.bridge(EventNames.SerialMessageReceived, EventNames.ChangeScene)
  }

  bridge (eventIn, eventOut) {
    this.messenger.subscribe(eventIn, (data) => this.messenger.publish(eventOut, data))
  }
}

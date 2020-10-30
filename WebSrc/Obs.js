import OBSWebSocket from 'obs-websocket-js'
import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * OBS communicaion using WebSockets.
 *
 * It listens to the 'Connect' and 'ChangeScene' events.
 */
export default class Obs {
  constructor (obs = new OBSWebSocket(), messenger = new Messenger()) {
    this.obs = obs
    this.messenger = messenger
    this.messenger.subscribe(EventNames.Connect, (e) => this.connectAsync(e.address))
  }

  async connectAsync (address) {
    console.log('Connecting to obs on ' + address)
    this.messenger.subscribe(EventNames.ChangeScene, (e) => this.changeScene(e))
    await this.obs.connect({ address: address })
    const data = await this.obs.send('GetSceneList')
    this.scenes = data.scenes
    this.messenger.publish(EventNames.ReceivedScenes, data)
    console.log('Obs connected')
  }

  changeScene (index) {
    if (this.scenes[index] === undefined) {
      console.warn('Scene number', index, 'not found. Scenes: ', this.scenes)
      return
    }
    this.obs.send('SetCurrentScene', {
      'scene-name': this.scenes[index].name
    })
    console.log('Changed to scene', index)
  }
}

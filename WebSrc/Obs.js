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
    this.obs.connect({ address: address })
    this.obs.on('ConnectionOpened', () => {
      this.obs.send('GetSceneList').then(data => {
        this.scenes = data.scenes
        console.log('Obs connected', this)
        this.messenger.publish(EventNames.ReceivedScenes, data)
      })
    })
  }

  changeScene (index) {
    this.obs.send('SetCurrentScene', {
      'scene-name': this.scenes[index].name
    })
    console.log('Changed to scene', index, this)
  }
}

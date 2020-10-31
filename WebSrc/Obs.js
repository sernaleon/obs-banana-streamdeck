import OBSWebSocket from 'obs-websocket-js'
import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * OBS communicaion using WebSockets.
 *
 * Listens to Connect Disonnect & ChangeScene.
 * Fires ReceivedScenes & Error.
 */
export default class Obs {
  constructor (obs = new OBSWebSocket(), messenger = new Messenger()) {
    this.obs = obs
    this.messenger = messenger
    this.messenger.subscribe(EventNames.Connect, (e) => this.connectAsync(e.address))
    this.messenger.subscribe(EventNames.ChangeScene, (e) => this.changeScene(e))
    this.messenger.subscribe(EventNames.Disonnect, () => this.disconnect())
  }

  async connectAsync (address) {
    try {
      console.log('Connecting to OBS on ' + address)
      await this.obs.connect({ address: address })
      const data = await this.obs.send('GetSceneList')
      this.scenes = data.scenes
      this.messenger.publish(EventNames.ObsConnected, this.scenes)
      console.log('OBS connected')
    } catch (e) {
      console.error(e)
      this.messenger.publish(EventNames.Error, 'Cannot connect to OBS.')
    }
  }

  changeScene (index) {
    try {
      if (this.scenes[index] !== undefined) {
        this.obs.send('SetCurrentScene', { 'scene-name': this.scenes[index].name })
        console.log('Changed to scene', index)
      } else {
        console.warn('Scene number', index, 'not found. Scenes: ', this.scenes)
      }
    } catch (e) {
      console.error(e)
      this.messenger.publish(EventNames.Error, 'Error changing OBS scene.')
    }
  }

  disconnect () {
    if (this.scenes) {
      this.obs.disconnect()
      this.scenes = undefined
      console.log('Disconnected from obs')
    }
  }
}

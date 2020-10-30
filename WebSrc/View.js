import Messenger from './Messenger'
import EventNames from './EventNames'

/**
 * Handles interaction with page.
 *
 * Binds to the DOM and fires the events 'Connect' and 'ChangeScene'.
 */
export default class View {
  constructor (messenger = new Messenger()) {
    this.messenger = messenger
    this.messenger.subscribe(EventNames.ReceivedScenes, (e) => this.drawSceneButtons(e))
    document.getElementById('connect').addEventListener('click', () => this.connect())
  }

  connect () {
    this.messenger.publish(EventNames.Connect, {
      address: this.getAddress()
    })
  }

  drawSceneButtons (data) {
    const sceneListDiv = document.getElementById('scene_list')
    for (let i = 0; i < data.scenes.length; i++) {
      const sceneElement = document.createElement('button')
      sceneElement.textContent = data.scenes[i].name
      sceneElement.onclick = () => {
        this.messenger.publish(EventNames.ChangeScene, i)
      }
      sceneListDiv.appendChild(sceneElement)
    }
  }

  getAddress () {
    return document.getElementById('address').value
  }
}

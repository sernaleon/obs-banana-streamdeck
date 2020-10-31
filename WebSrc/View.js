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
    this.bindElements()
    this.bindEvents()
  }

  bindElements () {
    this.errorElement = document.getElementById('error')
    this.baudRateElement = document.getElementById('baudRate')
    this.addressElement = document.getElementById('address')
    this.connectElement = document.getElementById('connect')
    this.disconnectElement = document.getElementById('disconnect')
    this.sceneTitleElement = document.getElementById('sceneTitle')
    this.sceneListElement = document.getElementById('sceneList')
  }

  bindEvents () {
    this.messenger.subscribe(EventNames.ObsConnected, (e) => this.drawSceneButtons(e))
    this.messenger.subscribe(EventNames.SerialConnected, () => this.showDisconnectButton())
    this.messenger.subscribe(EventNames.Error, (e) => this.showError(e))
    this.connectElement.addEventListener('click', () => this.connect())
    this.disconnectElement.addEventListener('click', () => this.disconnect())
  }

  connect () {
    this.messenger.publish(EventNames.Connect, {
      address: this.addressElement.value,
      baudRate: this.baudRateElement.value
    })
  }

  disconnect () {
    this.messenger.publish(EventNames.Disonnect)
    this.resetPage()
  }

  showError (e) {
    this.errorElement.style.display = 'block'
    this.errorElement.innerHTML = e
    this.resetPage()
  }

  resetPage () {
    this.sceneListElement.innerHTML = ''
    this.sceneTitleElement.style.display = 'none'
    this.disconnectElement.style.display = 'none'
    this.connectElement.style.display = 'block'
  }

  showDisconnectButton () {
    this.connectElement.style.display = 'none'
    this.disconnectElement.style.display = 'block'
  }

  drawSceneButtons (scenes) {
    this.sceneTitleElement.style.display = 'block'
    for (let i = 0; i < scenes.length; i++) {
      const sceneElement = this.createSceneButton(scenes[i].name, i)
      this.sceneListElement.appendChild(sceneElement)
    }
  }

  createSceneButton (name, id) {
    const sceneElement = document.createElement('button')
    sceneElement.textContent = name
    sceneElement.onclick = () => this.messenger.publish(EventNames.ChangeScene, id)
    return sceneElement
  }
}

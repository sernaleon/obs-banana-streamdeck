const CHANGE_SCENE_EVENT = 'CHANGE_SCENE_EVENT';
const REVEICED_SCENE_LIST_EVENT = 'REVEICED_SCENE_LIST_EVENT';

class Messenger {
  publish(event, data) {    
    const message = new CustomEvent(event, {detail: data});
    window.dispatchEvent(message);
  }
  subscribe(event, callback) {
    window.addEventListener(event, (e) => {
        callback(e.detail);
    });
  }
}

class Obs {
  constructor(obs = new OBSWebSocket(), messenger = new Messenger()) {
    this.obs = obs;
    this.messenger = messenger;
  }

  async connectAsync(address){
    this.messenger.subscribe(CHANGE_SCENE_EVENT, (e) => this.changeScene(e));
    this.obs.connect({ address: address });
    this.obs.on('ConnectionOpened', () => {
        this.obs.send('GetSceneList').then(data => {
        this.scenes = data.scenes;
        console.log("Obs connected", this);
        this.messenger.publish(REVEICED_SCENE_LIST_EVENT, data);
      }); 
    });
  }

  changeScene(index) {
    this.obs.send('SetCurrentScene', {
      'scene-name': this.scenes[index].name
    });
    console.log("Changed to scene", index, this);
  }
}

class ComDevice {
  constructor(messenger = new Messenger()) {
    this.messenger = messenger;
  }

  async connectAsync(baudRate = 115200){
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: baudRate });
  
    const decoder = new TextDecoderStream();
    this.port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
  
    this.reader = inputStream.getReader();
    console.log('Serial port connected', this)
  }

  async startReadingAsync(){
    while (true) {
      const { value, done } = await this.reader.read();
      if (value) {
        var intValue = parseInt(value);
        this.messenger.publish(CHANGE_SCENE_EVENT, intValue);
      }
      if (done) {
        this.stopReading();
        break;
      }
    }
  }

  stopReading(){
    this.reader.releaseLock();
  }
}


class IndexView {
  constructor(messenger = new Messenger()){
    this.messenger = messenger;    
    this.messenger.subscribe(REVEICED_SCENE_LIST_EVENT,(e) => this.drawSceneButtons(e))
  }

  drawSceneButtons(data) {
    console.log('Drawing scences',data);
    const sceneListDiv = document.getElementById('scene_list');  
    for(let i = 0; i < data.scenes.length; i++){
      const sceneElement = document.createElement('button');
      sceneElement.textContent = data.scenes[i].name;
      sceneElement.onclick = () => {
        this.messenger.publish(CHANGE_SCENE_EVENT,i);
      };
      sceneListDiv.appendChild(sceneElement);
    }
  }

  getAddress(){
    return document.getElementById('address').value;
  }
}

async function start() {
  var view = new IndexView();
  var address = view.getAddress();

  var obs = new Obs();
  obs.connectAsync(address);

   var com = new ComDevice();
   await com.connectAsync();
   com.startReadingAsync();
}

document.getElementById('connect').addEventListener('click', start);
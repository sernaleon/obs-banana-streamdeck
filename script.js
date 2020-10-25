const EVENT_NAME = 'serial-value-received'

const elem = document.querySelector('body');

async function connectAsync(baudRate = 115200){
  console.log(navigator.serial)
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });

  const decoder = new TextDecoderStream();
  const inputDone = port.readable.pipeTo(decoder.writable);
  const inputStream = decoder.readable;

  const reader = inputStream.getReader();
  return reader;
}

async function readLoopAsync(reader) {
  while (true) {
    const { value, done } = await reader.read();
    if (value) {
      console.log(value);
      const event = new CustomEvent(EVENT_NAME, {detail: value});
      elem.dispatchEvent(event);
    }
    if (done) {
      console.log('[readLoop] DONE', done);
      reader.releaseLock();
      break;
    }
  }
}

async function start() {
  const address = document.getElementById('address').value;
  obs.connect({
    address: address
  });
  reader = await connectAsync();
  readLoopAsync(reader);
}


const obs = new OBSWebSocket();
var scenes;
var lastEvent;
elem.addEventListener(EVENT_NAME, function (e) {
  lastEvent = e;
  console.log('Received event', e, e.detail, scenes, scenes[parseInt(lastEvent.detail)])
  obs.send('SetCurrentScene', {
    'scene-name': scenes[parseInt(lastEvent.detail)].name
  });
}, false);

obs.on('ConnectionOpened', () => {
  obs.send('GetSceneList').then(data => {
    const sceneListDiv = document.getElementById('scene_list');
    console.log(data);
    scenes = data.scenes;
    data.scenes.forEach(scene => {
      const sceneElement = document.createElement('button');
      sceneElement.textContent = scene.name;
      sceneElement.onclick = function() {
        obs.send('SetCurrentScene', {
          'scene-name': scene.name
        });
      };

      sceneListDiv.appendChild(sceneElement);
    });
  })
});
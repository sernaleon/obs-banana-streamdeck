export default class Messenger {
  publish(event, data) {
    const message = new CustomEvent(event, { detail: data });
    window.dispatchEvent(message);
  }
  subscribe(event, callback) {
    window.addEventListener(event, (e) => {
      callback(e.detail);
    });
  }
}

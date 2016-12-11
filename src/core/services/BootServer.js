export default class BootServer {
  boot = async () => {
    await eventEmitter.emit('Boot:Initialize');

    await eventEmitter.emit('Boot:Database');

    await eventEmitter.emit('Boot:Pre');

    await eventEmitter.emit('Boot');

    await eventEmitter.emit('Boot:Post');

    await eventEmitter.emit('Boot:Finished');
  }
}

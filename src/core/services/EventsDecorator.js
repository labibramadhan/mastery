import _ from 'lodash';

export default class EventsDecorator {
  static Boot(type) {
    return (target) => {
      const classes = {
        target,
      };
      const inst = new classes['target'](); // eslint-disable-line

      let eventName = 'Boot';
      if (type) {
        const postFix = _.map(type.split(':'), val => _.capitalize(val)).join(':');
        eventName += `:${postFix}`;
      }
      eventEmitter.on(eventName, inst.boot);
    };
  }

  static Startup(target) {
    const classes = {
      target,
    };
    const inst = new classes['target'](); // eslint-disable-line
    eventEmitter.on('Startup', inst.boot);
  }
}

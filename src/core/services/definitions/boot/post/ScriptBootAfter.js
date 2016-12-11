const ScriptBootBase = requireF('core/services/ScriptBootBase');

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('post')
class ScriptBootAfter extends ScriptBootBase { // eslint-disable-line no-unused-vars
  constructor() {
    super('after');
  }
}

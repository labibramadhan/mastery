const ScriptBootBase = requireF('core/services/ScriptBootBase');

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('pre')
class ScriptBootBefore extends ScriptBootBase {} // eslint-disable-line no-unused-vars

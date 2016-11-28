import _ from 'lodash';
import Sequelize from 'sequelize';

const I18nExtended = requireF('services/_core/I18nExtended');

export default class HandlerErrorFormatter {
  constructor(request) {
    this.i18nExtended = new I18nExtended(request);
  }

  format(e) {
    const self = this;
    if (e instanceof Sequelize.ValidationError) {
      const errorsFormatted = [];
      if (_.has(e, 'errors') && _.size(e.errors)) {
        _.forEach(e.errors, (error) => {
          if (_.has(error, 'message')) {
            if (self.i18nExtended.has(error.message)) {
              errorsFormatted.push(self.i18nExtended.t(error.message));
            }
          }
        });
      }
      if (errorsFormatted.length) {
        return errorsFormatted.join(', ');
      }
    }
    return e.message;
  }
}

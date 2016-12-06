import Sequelize from 'sequelize';
import _ from 'lodash';

export default class HandlerErrorFormatter {
  constructor(request) {
    this.request = request;
  }

  format(e) {
    const self = this;
    if (e instanceof Sequelize.ValidationError) {
      const errorsFormatted = [];
      if (_.has(e, 'errors') && _.size(e.errors)) {
        _.forEach(e.errors, (error) => {
          if (_.has(error, 'message')) {
            if (self.request.t.has(error.message)) {
              errorsFormatted.push(self.request.t(error.message));
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

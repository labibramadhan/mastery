import _ from 'lodash';

export default class QueryParserOrder {
  constructor(models) {
    this.models = models;
  }

  parse(query) {
    const {
      models,
    } = this;
    const {
      order,
    } = query;

    if (!order) return [];

    const orders = _.castArray(order);

    return orders.map((o) => {
      const orderItem = _.clone(o);
      if (_.isObject(orderItem)) {
        const thisOrder = [];
        if (_.has(orderItem, 'model')) {
          orderItem.model = models[orderItem.model];
          thisOrder.push(_.pick(orderItem, ['model', 'as']));
        }
        thisOrder.push(orderItem.field);
        thisOrder.push(orderItem.sort);
        return thisOrder;
      }
      return o.split(' ');
    });
  }
}

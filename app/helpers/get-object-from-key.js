import Ember from 'ember';

export default Ember.Helper.extend({
  compute(params, hash) {
    const obj = params[0];
    const key = params[1];
    return obj[key];
  }
});

import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  const obj = params[0];
  const key = params[1];
  return obj[key];
});

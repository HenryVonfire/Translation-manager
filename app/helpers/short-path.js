import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  const path = params[0];
  const pathArray = path.split('.');
  return pathArray[pathArray.length-1];
});

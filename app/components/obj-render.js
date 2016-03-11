import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['marginado'],
  didReceiveAttrs(){
    this.set('keyList',Object.keys(this.get('obj')));
  }
});

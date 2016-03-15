import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['marginado'],
  path: Ember.computed('obj', function() {
    const path = this.get('obj')[0].path;
    if(path){
      const pathArray = path.split('.');
      return pathArray[pathArray.length-1];
    }
  }),
  actions: {
    save(item,objectIndex,newValue){
      this.get('save')(item,objectIndex,newValue);
    },
    removeKey(obj, item){
      this.get('removeKey')(obj, item);
    },
    addKey(obj, newKey){
      this.get('addKey')(obj, newKey);
      this.set('newKey','');
    }
  }
});

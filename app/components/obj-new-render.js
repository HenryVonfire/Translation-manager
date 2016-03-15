import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save(path,item,objectIndex,newValue){
      this.get('save')(path,item,objectIndex,newValue);
    },
    removeKey(path, obj, item){
      this.get('removeKey')(path, obj, item);
    },
    addKey(node, newKey){
      this.get('addKey')(node, newKey);
      this.set('newKey','');
    }
  }
});

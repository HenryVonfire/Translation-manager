import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['marginado'],
  path: Ember.computed('obj', function() {
    const path = this.get('obj').path;
    if(path){
      const pathArray = path.split('.');
      return pathArray[pathArray.length-1];
    }
  }),
  actions: {
    save(item,objectIndex,newValue){
      this.get('save')(item,newValue);
    },
    removeKey(item, objectIndex){
      this.get('removeKey')(item);
    },
    /*addKey(path, key, inputValue, objectIndex){
      this.get('addKey')(path, key, inputValue, objectIndex);
      this.set('inputValue','');
    }*/
  }
});

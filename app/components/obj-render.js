import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['marginado'],
  path: '',
  didReceiveAttrs(){
    this.set('keyList',Object.keys(this.get('obj')));
    const path = this.get('path');
    if(!path){
      this.set('path',this.get('lastKey'));
    } else {
      this.set('path', path + '.' + this.get('lastKey'));
    }
  },
  actions: {
    save(path,key,value,e){
      console.log(path, key,value,e);
    }
  }
});

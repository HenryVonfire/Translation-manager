import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    listOfFiles(files){
      this.set('fileList', files);
    },
    listOfObjects(objs){
      console.log(objs);
      this.set('listOfObjects', objs);
    }
  }
});

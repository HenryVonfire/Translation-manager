import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    listOfFiles(files){
      this.set('fileList', files);
    },
    listOfObjects(objs){
      this.set('listOfObjects', objs);
    },
    save(){
      console.log(this.get('fileList'), this.get('listOfObjects'));
    }
  }
});

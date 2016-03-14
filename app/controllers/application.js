import Ember from 'ember';

const Electron = require('electron');
const fs = require('fs');

export default Ember.Controller.extend({
  actions: {
    //FILE ACTIONS..............................................................
    openFile(){
      const dialog = Electron.remote.dialog;
      /*const filter = [
        {name: 'Translation file', extensions: ['yaml']}
      ];
      const options = {
        filters: filter
      };*/
      const fileList = dialog.showOpenDialog({ properties: [ 'openFile', 'multiSelections' ]});
      if(fileList){
        this.set('fileList',fileList);
        let objectList = [];
        fileList.forEach((file) => {
          let content;

          fs.readFile(file, "utf-8", (err, data) => {
              if (err) {
                throw err;
              }
              content = data;

              objectList.pushObject(YAML.parse(content));
          });
        });
        this.set('objectList', objectList);
      }
    },
    saveFile(){
      const objectList = this.get('objectList');
      const fileList = this.get('fileList');
      for(let i=0;i<objectList.length;i++){
        const yamlFormat = YAML.stringify(objectList[i], 4);
        fs.writeFile(fileList[i], yamlFormat, "utf-8", (err) => {
          if (err) {
            return console.log(err);
          }
          console.log('saved...hopefully');
        });
      }
    },

    // OBJECT ACTIONS...........................................................
    save(path, key,value,objectIndex,newValue){
      const pathArray = path.split('.');
      let obj = this.get('objectList')[objectIndex];
      for(let i=0;i<pathArray.length;i++){
        obj = obj[pathArray[i]];
      }
      obj[key] = newValue;
    },
    removeKey(path, key, objectIndex){
      const pathArray = path.split('.');
      let obj = this.get('objectList')[objectIndex];
      for(let i=0;i<pathArray.length;i++){
        obj = obj[pathArray[i]];
      }
      delete obj[key];
    }

  }
});

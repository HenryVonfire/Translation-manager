import Ember from 'ember';

const Electron = require('electron');
const fs = require('fs');

export default Ember.Controller.extend({
  objectList:[],
  numberOfFiles: Ember.computed('objectList.[]', function() {
    return this.get('objectList').length;
  }),

  _conversor(obj, path){
    let newObj = [];
    let numberOfFiles = obj.length;
    // obj will have at least one file and the rest should be the same because it
    // has no sense to have translation files with different set of keys
    const firstObj = obj[0];
    for (let i in firstObj){
      if (firstObj.hasOwnProperty(i)) {
        if(typeof firstObj[i] === 'object'){
          // if it's an object it means it's not a node leaf. Let's extract the path
          let tmpPath = !path? i : path+'.'+i;

          // saving the same node of the different files...
          let tmp = [];
          for (var j = 0; j < numberOfFiles; j++) {
            tmp.pushObject(obj[j][i]);
          }
          newObj.pushObject({
            isLeaf: false, // boolean
            path: tmpPath, // String
            children:this._conversor(tmp, tmpPath) // array
          });
        } else {
          let value = [];
          for(var j = 0; j < numberOfFiles; j++){
            value.pushObject(obj[j][i]);
          }
          newObj.pushObject({
            isLeaf: true, // boolean
            key:i,        // string
            value: value  // array
          });
        }
      }
    }
    return newObj;
  },

  _convertIntoSpecialObject(obj){
    let newObj = this._conversor(obj, '');
    this.set('renderList',newObj);
  },

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
        fileList.forEach(file => {
          const data = fs.readFileSync(file, "utf-8");
          const jsonObject = YAML.parse(data);
          objectList.pushObject(jsonObject);
        });
        this._convertIntoSpecialObject(objectList);
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
    save(path,item,objectIndex,newValue){
      const pathArray = path? path.split('.') : [];
      if(objectIndex === -1){
        let objectList = this.get('objectList');
        objectList.forEach(element => {
          for(let i=0;i<pathArray.length;i++){
            element = element[pathArray[i]];
          }
          const tmp = element[item.key];
          delete element[item.key];
          element[newValue] = tmp;
        });
        Ember.set(item,'key',newValue);
      } else {
        let objectList = this.get('objectList')[objectIndex];
        for(let i=0;i<pathArray.length;i++){
          objectList = objectList[pathArray[i]];
        }
        objectList[item.key] = newValue;
        item.value[objectIndex] = newValue;
      }
    },

    removeKey(path, obj, item){
      // deleting from original objects...
      const pathArray = path? path.split('.') : [];
      let objectList = this.get('objectList');
      for (let i=0;i<objectList.length;i++){
        let innerObj = objectList[i];
        for(let j=0;j<pathArray.length;j++){
          innerObj = innerObj[pathArray[j]];
        }
        delete innerObj[item.key];
      }
      // deleting from render objects...
      obj.removeObject(item);
    },

    addKey(node, newKey){
      let value = [];
      for(let i=0;i<this.get('numberOfFiles');i++){
        value.pushObject('value');
      }
      let item = {
        isLeaf:true,
        key:newKey,
        value:value
      };
      node.children.pushObject(item);
      for(let i=0;i<this.get('numberOfFiles');i++){
        this.send('save', node.path, item, i, 'value');
      }
    }
  }
});

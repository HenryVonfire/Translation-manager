import Ember from 'ember';

const Electron = require('electron');
const fs = require('fs');

export default Ember.Controller.extend({
  objectList:[],
  numberOfObjects: Ember.computed('objectList.[]', function() {
    return this.get('objectList').length;
  }),
  _conversor(obj, path){
    let newObj = [];
    for (let i in obj[0]){
      if (obj[0].hasOwnProperty(i)) {
        if(typeof obj[0][i] === 'object'){
          let tmpPath;
          if(!path){
            tmpPath = i;
          } else {
            tmpPath = path + '.' + i;
          }
          let tmp = [];
          for (var j = 0; j < obj.length; j++) {
            tmp.pushObject(obj[j][i]);
          }
          newObj.pushObject(this._conversor(tmp, tmpPath));
        } else {
          let item = {
            path: path,
            isNotObject:true,
            isDirty:false,
            key:i
          };
          for(var j = 0; j < obj.length; j++){
            item['value'+j] = obj[j][i];
          }
          newObj.pushObject(item);
        }
      }
    }
    return newObj;
  },

  _convertIntoSpecialObject(obj){
    let newObj = this._conversor(obj, '');
    this.set('renderList',newObj);
  },

  _removeFromRenderObj(item){
    /*const renderList = this.get('renderList');
    let tmp = [];
    const length = renderList.length;
    for(let i=0;i<length;i++){
      tmp.pushObject(renderList[i]);
    }
    while(tmp[objectIndex].indexOf(item) !== -1){

    }
    if(renderList[objectIndex].indexOf(item) !== -1){

    } else {

    }*/
  },

  _removeFromOriginalObj(pathArray, item){
    let objectList = this.get('objectList');
    for (let i=0;i<objectList.length;i++){
      let innerObj = objectList[i];
      for(let j=0;j<pathArray.length;j++){
        innerObj = innerObj[pathArray[j]];
      }
      delete innerObj[item.key];
    }
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
    save(item,newValue){
      const pathArray = item.path.split('.');
      let obj = this.get('objectList')[objectIndex];
      for(let i=0;i<pathArray.length;i++){
        obj = obj[pathArray[i]];
      }
      obj[item.key] = newValue;
      Ember.set(item,'value',newValue);
    },

    removeKey(item){
      // deleting from original objects...
      this._removeFromOriginalObj(item.path.split('.'), item);
      // deleting from render objects...
      this._removeFromRenderObj(item, objectIndex);
    },
    addKey(path, key, inputValue){
      let pathArray, obj=this.get('objectList')[objectIndex];
      if(path){
        pathArray = path.split('.');
        for(let i=0;i<pathArray.length;i++){
          obj = obj[pathArray[i]];
        }
      }
      obj = obj[key];
      obj[inputValue] = '';
    }
  }
});

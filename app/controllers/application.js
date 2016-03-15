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

  _removeFromRenderObj(item, list){
    list.forEach(element => {
      if(!element.isNotObject){
        if(element.indexOf(item) !== -1){
          element.removeObject(item);
        } else {
          this._removeFromRenderObj(item, element);
        }
      }
    });
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
    save(item,objectIndex,newValue){
      const pathArray = item.path.split('.');
      if(objectIndex === -1){
        let obj = this.get('objectList');
        obj.forEach(element => {
          for(let i=0;i<pathArray.length;i++){
            element = element[pathArray[i]];
          }
          const tmp = element[item.key];
          delete element[item.key];
          element[newValue] = tmp;
        });
        Ember.set(item,'key',newValue);
      } else {
        let obj = this.get('objectList')[objectIndex];
        for(let i=0;i<pathArray.length;i++){
          obj = obj[pathArray[i]];
        }
        obj[item.key] = newValue;
        Ember.set(item,'value',newValue);
      }
    },

    removeKey(item){
      // deleting from original objects...
      this._removeFromOriginalObj(item.path.split('.'), item);
      // deleting from render objects...
      const renderList = this.get('renderList');
      this._removeFromRenderObj(item, renderList);
    },

    addKey(obj, newKey){
      if(obj[0]){
        const tmp = obj[0];
        let item = {
          path: tmp.path,
          isNotObject:true,
          key:newKey
        };
        for(let i=0;i<this.get('numberOfObjects');i++){
          item['value'+i] = 'value';
        }
        obj.pushObject(item);
        for(let i=0;i<this.get('numberOfObjects');i++){
          this.send('save',item,i,'value');
        }
      }
    }
  }
});

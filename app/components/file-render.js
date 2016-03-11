import Ember from 'ember';

const fs = require('fs');

export default Ember.Component.extend({
  objectList:[],
  didReceiveAttrs(){
    const list = this.get('list');
    if(list){
      list.forEach((file) => {
        let content;

        fs.readFile(file, "utf-8", (err, data) => {
            if (err) {
                throw err;
            }
            content = data;

            this.get('objectList').pushObject(YAML.parse(content));
            //const jsonFormat = YAML.parse(content);
            //const yamlFormat = YAML.stringify(jsonFormat, 4);
            //console.log(content, jsonFormat, yamlFormat);
        });
      });

      this.get('listOfObjects')(this.get('objectList'));
    }
  },
  actions: {
    save(){
      this.get('listOfObjects')(this.get('objectList'));
    }
  }
});

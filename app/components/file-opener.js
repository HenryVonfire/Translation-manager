import Ember from 'ember';
const Electron = require('electron');
export default Ember.Component.extend({
  actions: {
    openFile(){
      const dialog = Electron.remote.dialog;
      /*const filter = [
        {name: 'Translation file', extensions: ['yaml']}
      ];
      const options = {
        filters: filter
      };*/
      this.get('listOfFiles')(dialog.showOpenDialog({ properties: [ 'openFile', 'multiSelections' ]}));
    }
  }
});

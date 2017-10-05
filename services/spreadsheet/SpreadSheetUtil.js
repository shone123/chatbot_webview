/**
 * Created by aashish_amber on 25/1/17.
 */

var spreadSheetReader = require('./SpreadSheetReader');

module.exports = {
    getData : function (id,range,func) {
        // TODO : Update the 'Consumer App Display Messages' spreadsheet
        // https://docs.google.com/spreadsheets/d/1EpEnH70OA7KMR979MSFt82IF1bBYCSxJsOd-U5ysHCE/edit#gid=0
        spreadSheetReader.readSheet(id,range, function (data) {
            try {
                func(data);
            }catch(e){
                console.log("Error occurred in spreadSheetReader:\t" + e)
            }
        });
    }
}



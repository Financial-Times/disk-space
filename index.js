var cp = require('child_process');

/**
 * @callback diskspaceCallback
 * @param {Error|null} error Will be an error if the call to `df` fails
 * @param {{usedSize: Number, totalSize: Number}} [result] An object where the property `usedSize` is the amount of kilobytes used and the property `totalSize` is the amount of kilobytes in total (used + available)
 * @return {void}
 */

/**
 * Find the used and total size of the file system that a given file is stored on in kilobytes
 *
 * @param {String} path The path to file whose file system you want to find the used and total size of
 * @param {diskspaceCallback} callback A NodeJS Error-first style callback which is called when the used and total size have been calculated
 */
module.exports  = function(path , callback){

    var dfArgs = process.platform === 'darwin' ? '-bk' : "-BK";
    var ps   = cp.spawn("df", [dfArgs , path]);
    var _ret = "";

    ps.stdout.on("data", function(data){
        _ret = data.toString();
    });

    ps.on('error' , function(err){
      callback(err)
    });

    ps.on('close', function() {
        var storageDeviceInfo = { usedSize: 0, totalSize: 0};
        if(_ret.split('\n')[1]){
          var arr = _ret.split('\n')[1].split(/[\s,]+/);
          var usedSize  = parseInt(arr[2].replace("K" , "")) * 1024;    // exp "300K" => 300
          var totalSize = parseInt(arr[3].replace("K" , ""))  * 1024 + usedSize;
          storageDeviceInfo.usedSize = usedSize;
          storageDeviceInfo.totalSize = totalSize;
        }
        callback(null, storageDeviceInfo);
    });
};

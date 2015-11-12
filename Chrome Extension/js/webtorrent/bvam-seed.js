// function bulkSeed (files, callback) {
//  var index = 0
//  function seeder () {
//    client.seed(files[index], function onseed (torrent) {
//    // do something with torrent
//    if (index < files.lenght) {
//      seeder()
//      index ++
//      }
//      else callback()
//    })
//    }
//    }

//$( document ).ready(function() {  
//
//    var files = [1, 2, 3, 4, 5, 6];
//
//    function bulkSeed (files, callback) {
//      var index = 0
//      function seeder () {
//        clientseed(files[index], function() {
//        // do something with torrent
//        if (index < files.length) {
//
//            index ++
//            seeder()
//
//          }
//          else callback()
//        })
//        }
//     }
//
//    function clientseed(file, callback){
//
//        $("#files").append(file+"<br>");
//
//        callback();
//
//    }
//    
//});

var client = new WebTorrent();

function startWebTorrents() {
    
    chrome.storage.local.get(function(data) {

        var enabled = data["bvamwt_enabled"];

        if (enabled == "yes") {
            
         console.log("calculating local bvam infohashes...");

         chrome.storage.local.get(function(data) {

            if(typeof(data["bvam"]) !== 'undefined') { 

                var allbvam = data["bvam"];
                
                var k = 0;

                for (var i = 0; i < allbvam.length; i++) {

                    var type = allbvam[i]["type"];

                    if (type == "BVAMWT") {

                        var filename_base58 = allbvam[i]["hash"];

                        var filename_base58_decode = Bitcoin.Base58.decode(filename_base58)
                        var hash = Crypto.util.bytesToHex(filename_base58_decode)

                        console.log(hash);

                        var assetid = allbvam[i]["data"]["asset"];
                        var assetname = allbvam[i]["data"]["assetname"];
                        var assetdesc = allbvam[i]["data"]["assetdescription"];
                        var assetweb = allbvam[i]["data"]["assetwebsite"];

                        var ownername = allbvam[i]["data"]["ownername"];
                        var ownertwitter = allbvam[i]["data"]["ownertwitter"];
                        var owneraddress = allbvam[i]["data"]["owneraddress"];

                        var prejsonform = {ownername: ownername, ownertwitter: ownertwitter, owneraddress: owneraddress, asset: assetid, assetname: assetname, assetdescription: assetdesc, assetwebsite: assetweb};

                        var filename = "BVAMWT.json";

                        var jsonstring = JSON.stringify(prejsonform);
                        var blob = new Blob([jsonstring], {type: "application/json"});

                        client.seed(blob, {name: filename}, function (torrent) {

                            console.log('Client is seeding ' + torrent.infoHash);


                            torrent.on('wire', function (wire, addr) {
                                console.log(torrent.infoHash + ' connected to peer with address ' + addr);
                            })



                        })   




                    }

                }
                
                console.log("start seeding!");

               

            }



         })


        } 

    })
    
}

function restartWebTorrents() {
    
//    client.destroy(function(){
        
        client = new WebTorrent();
        
        startWebTorrents();
        
//    })
  
}


chrome.runtime.onMessage.addListener(
    function(request) {

        if (request.bvamwt == "restart") {
            
            console.log("restarting...");
            
            restartWebTorrents();
        
        } else if (request.bvamwt == "end") {
            
            console.log("stop seeding!");
            
            client.destroy();
            
        } 
        
    }
);


startWebTorrents();


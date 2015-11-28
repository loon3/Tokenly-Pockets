function decodeUtf8(arrayBuffer) {
  var result = "";
  var i = 0;
  var c = 0;
  var c1 = 0;
  var c2 = 0;

  var data = new Uint8Array(arrayBuffer);

  // If we have a BOM skip it
  if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    i = 3;
  }

  while (i < data.length) {
    c = data[i];

    if (c < 128) {
      result += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      if( i+1 >= data.length ) {
        throw "UTF-8 Decode failed. Two byte character was truncated.";
      }
      c2 = data[i+1];
      result += String.fromCharCode( ((c&31)<<6) | (c2&63) );
      i += 2;
    } else {
      if (i+2 >= data.length) {
        throw "UTF-8 Decode failed. Multi byte character was truncated.";
      }
      c2 = data[i+1];
      c3 = data[i+2];
      result += String.fromCharCode( ((c&15)<<12) | ((c2&63)<<6) | (c3&63) );
      i += 3;
    }
  }
  return result;
}


function getBvamWT(bvamhasharray, callback) {
    
    chrome.storage.local.get(function(data) {
        
        if(typeof(data["bvam"]) === 'undefined') { 
            
            var allbvam = new Array();
            
        } else {
        
            var allbvam = data["bvam"];
            
        }
        
        
        
        for(var j = 0; j < allbvam.length; j++){
            
            for(var k = 0; k < bvamhasharray.length; k++){
            
                if (allbvam[j]["type"] == "BVAMWT" && allbvam[j]["hash"] == bvamhasharray[k]["hash"]) {
                     
                    displayBvamWTasset(bvamhasharray[k]["asset"], bvamhasharray[k]["amount"], allbvam[j]["data"]["assetname"])
                    
                    bvamhasharray.splice(k, 1)
                    
                }
                
            }
            
        }
                
                //({hash: bvamhash, asset: assetname, amount: assetbalance, data: ""})
                
                
//                
//    {
//		"added": 1442718500339,
//		"data": {
//			"asset": "A11130674620369256769",
//			"assetdescription": "",
//			"assetname": "Kitten Mittens",
//			"assetwebsite": "",
//			"owneraddress": "1Dhx3kGVkLaVFDYacZARheNzAWhYPTxHLq",
//			"ownername": "",
//			"ownertwitter": ""
//		},
//		"hash": "TC6aVqhcSDH77xtFAXpqPCBxw88x26MQgD",
//		"type": "TOKNID"
//	},
            
        console.log(bvamhasharray);

        checkBvamwtEnabled(function() {

            console.log("BVAM via webtorrent is on!");
            
//             var client = new WebTorrent();
             
            var datacount = bvamhasharray.length;

            if(bvamhasharray.length != 0) {
                
                console.log("looking for BVAM webtorrents...");
                
               
            
                $.each(bvamhasharray, function(m, item) {
                    
                    loadingBvamWTasset(bvamhasharray[m]["asset"]);

                    var filename_base58_decode = Bitcoin.Base58.decode(bvamhasharray[m]["hash"])
                    var infohash = Crypto.util.bytesToHex(filename_base58_decode)

                    var magnetUri = 'magnet:?xt=urn:btih:'+infohash;

                    console.log(magnetUri);

                    client.add(magnetUri, function (torrent) {

                      torrent.files.forEach(function (file) {

                            console.log(file.length);

                            if (file.length < 1500) {

                                file.getBuffer(function (err, buffer) {
                                    if (!err) {

                                          var jsonstring = decodeUtf8(buffer);
                                          var jsondata = JSON.parse(jsonstring)

                                          console.log(jsondata);

                                          var assetname = bvamhasharray[m]["asset"]
                                          var assetbalance = bvamhasharray[m]["amount"]
                                          var hash = bvamhasharray[m]["hash"];

                                          if(assetname == jsondata["asset"]) {

                                                displayBvamWTasset(assetname, assetbalance, jsondata["assetname"]);

                                                var time_date = new Date();
                                                var time_unix = time_date.getTime();

                                                var bvamdataforstorage = {hash: hash, type: "BVAMWT", data: jsondata, added: time_unix};

                                                addBvam(bvamdataforstorage);

                                          }
                                    

                                    //datacount--;
                                        
                                         //console.log(client.torrents);
                                    
                                    torrent.destroy(function(){
                              
                                          console.log(infohash + " destroyed!");
                                        
                                          console.log(client.torrents);

                                      })
                                    
                                    }

                                })

                            } 
//                          else {
//
//                                datacount--;
//
//                            }



//                            if (datacount == 0) {
//
//                                client.destroy(function(){
//
//                                    callback(status);
//
//                                })
//
//                            }

                          
                          
                          
                      })

                      
                      
//                      
//                      torrent.destroy(function(){
//                              
//                                          console.log(infohash + " destroyed!");
//                                        
//                                        //console.log(client.torrents);
//
//                                      })
                      
                      
                    })
                    
                   

                })
                
                console.log(client.torrents);
                
                 window.setTimeout( function() {
                                document.location.reload(true);
//                                client.destroy(function(){
//                                
//                                    console.log(client);
//                                    console.log("destroyed!");
//                                
//                                })
                                
//                                console.log(client);
                            }, 60000);
                
//                var p1 = new Promise(function(resolve, reject) {  
//                    
//                        if(client.torrents.length > 0) {
//                           
//                            console.log("promise countdown...");
//                            console.log(client.torrents);
//                            
//                            window.setTimeout( function() {
//                                // We fulfill the promise !
//                                resolve(client);
//                            }, 60000);
//                        
//                        }
//
//                    });
//                
//                p1.then(function(torrents){
//                    
//                    console.log("promise made!");
//                    
//                    document.location.reload(true);
//                    
////                    torrents[0].destroy(function(){
////                        
////                        console.log("destroyed!");
////                        console.log(torrents);
////                        
////                    })
//                    
////                    torrent.destroy(function(){
////
////                        console.log("destroyed!");
////
////                    });
//                    
//                });
                
                //client.destroy works here!
                
//                client.destroy(function(){
//                
//                    console.log("destroyed!");
//                
//                });

            }
        
        
        })


    });


    
}


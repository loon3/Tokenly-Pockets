function getExchangeRatesList() { 
    
   
    
    chrome.storage.local.get(function(data) {
        
        var btcperusd = parseFloat(data.btcperusd);
        
        //console.log(data);
        
     
        
        $("#ExchangeRate").html("");
        
        var ratedisplay = "<table class='table table-condensed' style='margin-top: 20px;'><thead class='small tokenlistingheader' style='cursor: pointer;'><th>Symbol</th><th>Token</th><th style='text-align:center;'>Market Price per Token</th></thead><tbody>";
        
        ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='BTC'><td style='vertical-align:middle'><div style='width: 50px;'><img src='bitcoin_48x48.png' width='36' height='36px'></div></td><td style='vertical-align:middle'>BTC</td><td style='vertical-align:middle; text-align:center;'>1 BTC<br>$"+parseFloat(1/btcperusd).toFixed(2)+"</td></tr>"; 
        
        //<th>Price USD</th>

        $.each(data.assetrates, function(i, item) {

            var assetname = data.assetrates[i]["assetname"];   

            var assetprice = parseFloat(data.assetrates[i]["assetprice"]);

            if (assetprice <= 1) {
                var assetpricedisplay = assetprice.toFixed(6);
            } else {
                var assetpricedisplay = assetprice.toFixed(2);
            }

            var assetbtcprice = (btcperusd * assetprice).toFixed(8);

            var iconname = assetname.toLowerCase();
            
            ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='"+assetname+"'><td style='vertical-align:middle'><div style='width: 50px;'><img src='http://counterpartychain.io/content/images/icons/"+iconname+".png' width='36' height='36px'></div></td><td style='vertical-align:middle'>"+assetname+"</td><td style='vertical-align:middle; text-align:center;'>"+assetbtcprice+" BTC<br>$"+assetpricedisplay+"</td></tr>"; 
            
            //<td>$"+assetpricedisplay+"</td>
            

            //var ratedisplay = "<div class='assetratedisplay' align='center'><img src='http://counterpartychain.io/content/images/icons/"+iconname+".png'><div class='lead' style='padding: 20px 0 0 0; font-size: 30px;'>"+assetname+"</div><div style='border: 1px solid #ccc; background-color: #fff; padding: 15px 5px 5px 5px; margin: 5px;'><div style='padding: 5px 0 0 0; font-size: 14px; font-style: italic;' class='lead'>Market Rate per Token</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>$"+assetpricedisplay+"</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>"+assetbtcprice+" BTC</div></div></div>"; 
            
            

        });
        
        ratedisplay += "</tbody></table><div style='padding-bottom: 10px; align='center'>Market Data provided by Coincap.io</div><div style='padding-bottom: 30px;' align='center'>";
        
        chrome.storage.local.get(function(data) {
            
            if(typeof(data["assetrates_updated"]) !== 'undefined') { 
               //already set
              
                var ratesupdated = "Last Updated " + data["assetrates_updated"];
                
            } else {
                
                var ratesupdated = "API ERROR";
                
            }

            ratedisplay += "<span id='assetratesupdated' class='small' style='font-style: italic;'>" + ratesupdated + "</span></div>";

            $("#ExchangeRate").html(ratedisplay);
            
        });
        
         
    
    });
}


function getNews(){
     var source_html = "https://letstalkbitcoin.com/api/v1/blog/posts?limit=5";
      
    $("#newsStories").html("<div align='center' style='padding-top: 30px;'>Loading...</div>");
    
    $.getJSON( source_html, function( data ) {
    
        $("#newsStories").html("");
        
        $.each(data.posts, function(i, item) {
           
        var date = data.posts[i]["publishDate"];
            
        var title = data.posts[i]["title"];
        var url = data.posts[i]["url"];
        var image = data.posts[i]["coverImage"];
        
        //console.log(image);
        
        var title_display = "<a class='newslink' href='https://letstalkbitcoin.com/blog/post/"+url+"'><div class='newsArticle' align='center'><img src='"+image+"' height='240px' width='240px'><div class='lead' style='padding: 20px 0 0 0;'>"+title+"</div><div style='padding: 5px 0 10px 0;' class='small'>Published "+date.substring(0,10)+"</div></div></a>";
        
        //console.log(data); 
        
        $("#newsStories").append(title_display);
            
        });
        
    });
}

function searchLTBuser(username){

     var source_html = "https://letstalkbitcoin.com/api/v1/users?search="+username;
      
    $("#ltbDirectorySearchResults").html("<div align='center' style='padding-top: 10px;'>Loading...</div>");
    
    $.getJSON( source_html, function( data ) {
    
        $("#ltbDirectorySearchResults").html("");

        $.each(data.users, function(i, item) {
            
            var username = data.users[i]["username"];
            
            var avatar = data.users[i]["avatar"];
            
            var registered = data.users[i]["regDate"];
            
            if (i > 0) {
                $("#ltbDirectorySearchResults").append("<hr>");
            }
            
            
            $("#ltbDirectorySearchResults").append("<div style='display: inline-block; padding: 0 20px 10px 0;'><img src='"+avatar+"' height='64px' width='64px'></div>");        
            $("#ltbDirectorySearchResults").append("<div style='display: inline-block;' class='ltbDirectoryUsername'>"+username+"</div>");  
            $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>Date Registered:</i><br>"+registered.substring(0,10)+"</div>");
            
            if(data.users[i]["profile"] == null || data.users[i]["profile"]["ltbcoin-address"] == undefined) {
                $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>LTBCOIN Address:</i><br>No Address Listed</div>");
            } else {
                var ltbaddress = data.users[i]["profile"]["ltbcoin-address"]["value"];
                $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>LTBCOIN Address:</i><br><div class='movetosend' style='display: inline-block;' data-user='"+username+"'>"+ltbaddress+"</div></div>");  
            }
            
            
            
        });
        
    });      
            
}


function setEncryptedTest() {
    
    chrome.storage.local.set(
                    {
                        'encrypted': true
                    }, function () {
                    
                       getStorage();
                    
                    });
    
}


function setPinBackground() {

                    var randomBackground = Math.floor(Math.random() * 5);
            
                    var bg_link = "url('/pin_bg/"+randomBackground+".jpg')";
            
                    $("#pinsplash").css("background-image", bg_link);
                    $("#pinsplash").css("background-size", "330px 350px"); 

}
    
    
    
function getStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
            
            $(".bg").css("min-height", "200px");
            
            $("#welcomesplash").hide();
        
            if ( data.encrypted == false) {
            
                existingPassphrase(data.passphrase);
            
            } else if ( data.encrypted == true) {
            
                $(".hideEncrypted").hide();
            
                $("#pinsplash").show();
                $("#priceBox").hide();
        
            } else {
                
                newPassphrase();
                
            }
       
        } else {
            
            $("#welcomesplash").show();
            
        }
            
    });
}






function copyToClipboard(text){
                var copyDiv = document.createElement('div');
                copyDiv.contentEditable = true;
                document.body.appendChild(copyDiv);
                copyDiv.innerHTML = text;
                copyDiv.unselectable = "off";
                copyDiv.focus();
                document.execCommand('SelectAll');
                document.execCommand("Copy", false, null);
                document.body.removeChild(copyDiv);
            }

//function getBlockHeight(){
//     var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//        return block;
//        
//    });
//}


function showBTCtransactions(transactions) {
            
            //$("#btcbalance").html("<div style='font-size: 12px;'>You can perform "+transactions.toFixed(0)+" transactions</div><div id='depositBTC' align='center' style='margin: 5px; cursor: pointer; text-decoration: underline; font-size: 11px; color: #999;'>Deposit bitcoin for transaction fees</div>");
    
    if (transactions == 0) {
              
        $("#btcbalance").html("<div style='font-size: 12px;'>Deposit bitcoin to send tokens from this address.<span id='txsAvailable' style='display: none;'>"+transactions.toFixed(0)+"</span></div>");        
                
    } else {
        
        chrome.storage.local.get(function (data) { 
            
            //var ratenum = (0.00015470 * (1/data["btcperusd"]));
            //var txrate = " at $" + ratenum.toFixed(2) + " / tx";
       
            $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>"+transactions.toFixed(0)+"</span> transactions");
        }); 
    
        
        
        
                
    }
        
            //var titletext = data + " satoshis";

            //$("#btcbalbox").prop('title', titletext);       
            $("#btcbalbox").show();
}

function qrdepositDropdown() {
            
            var currentaddr = $("#xcpaddress").html();
            
            $("#btcbalance").html("Deposit bitcoin for transaction fees<div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>"+currentaddr+"</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div><div>Cost per transaction is 0.00015470 BTC</div></div>");
                                  
            var qrcode = new QRCode(document.getElementById("btcqr"), {
    			text: currentaddr,
    			width: 100,
    			height: 100,
    			colorDark : "#000000",
    			colorLight : "#ffffff",
    			correctLevel : QRCode.CorrectLevel.H
				});
            
            
            //$("#btcbalbox").prop('title', ""); 
            $("#btcbalbox").show();
}



function getBTCBalance(pubkey) {

    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;  
    var source_html = "http://btc.blockr.io/api/v1/address/info/"+pubkey;  //blockr
    
    $("#isbtcloading").html("true");
    
    //$.getJSON( source_html, function( data ) { //insight
    $.getJSON( source_html, function( apidata ) {  //blockr
        
        //var bitcoinparsed = parseFloat(data) / 100000000; //insight
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
        var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
             
        $("#isbtcloading").html("false"); 
        $("#btcbalhide").html(bitcoinparsed);
        
        //var transactions = (parseFloat(data) / 15470) ; //insight
        //var transactions = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance))/ 0.0001547; //chainso
        var transactions = (parseFloat(apidata.data.balance) / 0.0001547) ; //blockr
        
        if (transactions < 1) {
            transactions = 0;
        }
        
        showBTCtransactions(transactions);
       
    });
}

function getPrimaryBalanceXCP(pubkey, currenttoken) {
    
//    var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//              
//    });
    
    
//    chrome.storage.local.get('unconfirmedtx', function (data)
//        {
//            if(isset(data)){
//                $.each(data.tx
//        }, function(){
//        
//        });
    //console.log(pubkey);
    //console.log(currenttoken);
    
    
if (currenttoken == "XCP") {
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
   var source_html = "http://counterpartychain.io/api/address/"+pubkey;
    
    
    $.getJSON( source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var assetbalance = data.xcp_balance;
        
        if (typeof assetbalance === 'undefined') {
            assetbalance = 0;
        }
        
        assetbalance = parseFloat(assetbalance).toString(); 
        
        $("#isdivisible").html("yes");
    
        $("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'><span id='currenttoken'>" + currenttoken + "</span>");
        $('#assetbalhide').html(assetbalance);
        
        getRate(assetbalance, pubkey, currenttoken);
        
    });
    
} else {  
    
    
    var source_html = "https://counterpartychain.io/api/balances/"+pubkey;
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
    
    $.getJSON( source_html, function( data ) {     
        
        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            
            if(assetname == currenttoken) {
                var assetbalance = data.data[i].amount; 
                
                if(assetbalance.indexOf('.') !== -1)
                {
                    $("#isdivisible").html("yes");
                } else {
                    $("#isdivisible").html("no");
                }
                
                assetbalance = parseFloat(assetbalance).toString(); 
                
  
                //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance);   
                $("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'><span id='currenttoken'>" + currenttoken + "</span>");
                $('#assetbalhide').html(assetbalance);
                
                
                
                getRate(assetbalance, pubkey, currenttoken);
                     
            }
        });
                    
        currenttokenpending(currenttoken);
    });
    
}
    
    if (typeof assetbalance === 'undefined') {
            $("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
            $('#assetbalhide').html(0);
            getRate(0, pubkey, currenttoken);
    }

}

function getPrimaryBalanceBTC(pubkey){
        
    //var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;    
    var source_html = "http://btc.blockr.io/api/v1/address/info/"+pubkey;
    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    
    $.getJSON( source_html, function( apidata ) {  //blockr
    //$.getJSON( source_html, function( data ) {  //insight
        
        //var bitcoinparsed = parseFloat(data) / 100000000; //insight
        var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
        
        $("#xcpbalance").html(bitcoinparsed + "<br><div style='font-size: 22px; font-weight: bold;'>BTC</div>");
        
//        if (bitcoinparsed.toFixed(8) == 0) {
//            $("#btcsendbox").hide();
//        } else {
//            $("#btcsendbox").show();
//        }
        
        getRate(bitcoinparsed, pubkey, "BTC");
        
        
    });
}

function getPrimaryBalance(pubkey){
    
    var addressbox = $("#sendtoaddress").val();
    
    if (addressbox.length == 0) {
        $("#btcsendbox").hide();   
    }
    
    var currenttoken = $(".currenttoken").html();
   
    if (currenttoken != "BTC") {
        
        getPrimaryBalanceXCP(pubkey, currenttoken);
        
    } else {
    
        getPrimaryBalanceBTC(pubkey);
    
    }
        
}


function getRate(assetbalance, pubkey, currenttoken){
    
    if ($("#ltbPriceFlipped").html() == "...") {
        
                                   //$.getJSON( "http://joelooney.org/ltbcoin/ltb.php", function( data ) {
        $.getJSON( "https://api.bitcoinaverage.com/ticker/USD/", function( data ) {

                    //        var ltbprice = 1 / parseFloat(data.usd_ltb);     
                    //        $("#ltbPrice").html(Number(ltbprice.toFixed(0)).toLocaleString('en'));

                    //        $("#ltbPrice").data("ltbcoin", { price: ltbprice.toFixed(0) });


                            var btcprice = 1 / parseFloat(data.last);

                            $("#ltbPrice").html(Number(btcprice.toFixed(4).toLocaleString('en')));
                            
                            var btcpriceflipped = data.last;
                            
                            $("#ltbPriceFlipped").html("$"+parseFloat(Math.round(btcpriceflipped * 100) / 100).toFixed(2));

                            $("#ltbPrice").data("btc", { price: btcprice.toFixed(6) });




                            if (currenttoken == "BTC") {
                                var usdValue = parseFloat(data.last) * parseFloat(assetbalance);

                                $("#xcpfiatValue").html(usdValue.toFixed(2)); 
                                $("#switchtoxcp").hide();
                                $("#fiatvaluebox").show();
                            } else {
                                $("#fiatvaluebox").hide();
                                $("#switchtoxcp").show();
                            }
                            
                           chrome.storage.local.set(
                                {
                                    'btcperusd': btcprice

                                }, function () {
                        
                    

                                }); 
        
              $.getJSON( "http://www.coincap.io/front/xcp", function( data ) {

                  var assetrates = new Array();     

                 $.each(data, function(i, item) {
                        var assetname = data[i].short;
                        var assetprice = data[i].price;  

                        if (assetname == "LTBC"){ 
                            assetname = "LTBCOIN";
                        }

                        assetrates[i] = {assetname, assetprice};
                 });
                  
                  var currentdate = new Date(); 
                  var datetime = (currentdate.getMonth()+1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":" + padprefix(currentdate.getMinutes(), 2);
                  
                  
                  

                  chrome.storage.local.set(
                        {
                            'assetrates': assetrates,
                            'assetrates_updated': datetime

                        });

                });
        });
    
    } else {
        
        if (currenttoken == "BTC") {
            var ltbrate = $("#ltbPrice").data("btc").price;
            var usdrate = 1 / parseFloat(ltbrate);
            var usdValue = usdrate * parseFloat(assetbalance);
            $("#xcpfiatValue").html(usdValue.toFixed(2));
            $("#switchtoxcp").hide();
            $("#fiatvaluebox").show();
        
            
        } else {
            $("#fiatvaluebox").hide();
            $("#switchtoxcp").show();
        }        
        
    
    }
    
    getBTCBalance(pubkey);
}


function convertPassphrase(m){
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();    
    
    $("#xcpaddressTitle").show();
    $("#xcpaddress").html(pubkey);
    
    getPrimaryBalance(pubkey);
    
}

function assetDropdown(m)
{
    $(".addressselect").html("");
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
     
    chrome.storage.local.get(function(data) {
              
        var totaladdress = data["totaladdress"];
        
        var addresslabels = data["addressinfo"];
        
        for (var i = 0; i < totaladdress; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
  
        $(".addressselect").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
        
        if (i == 0) {
            $(".addressselect").attr("title",pubkey);    
        }
            //.slice(0,12)

        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
    }
    
    $(".addressselect").append("<option label='--- Add New Address ---'>add</option>");
        
    }); 
                 
    
}


function dynamicAddressDropdown(addresslabels, type)
{
      
    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    
    var currentsize = $('#walletaddresses option').size(); 
    
    if (type == "newlabel") {
        currentsize = currentsize - 1;
        var addressindex = $("#walletaddresses option:selected").index();
    } 
    
    $(".addressselect").html("");  
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
                     
    for (var i = 0; i < currentsize; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
        
        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
        
        $(".addressselect").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
    }
    
  
    
    
    $(".addressselect").append("<option label='--- Add New Address ---'>add</option>");
       
    if (type == "newaddress") {
        getBTCBalance(pubkey);
        var newaddress_position = parseInt(currentsize) - 1;
        var newaddress_select = "#walletaddresses option:eq("+newaddress_position+")";
        var newaddress_val = $(newaddress_select).val();
        $("#xcpaddress").html(newaddress_val);
        getPrimaryBalance(newaddress_val);
    } else {
        var newaddress_position = addressindex;
    }
    
    
    var newaddress_select = "#walletaddresses option:eq("+newaddress_position+")";
    $(newaddress_select).attr('selected', 'selected');
    
}

function newPassphrase()
{
     
    m = new Mnemonic(128);
    m.toWords();
    var str = m.toWords().toString();
    var res = str.replace(/,/gi, " ");
    var phraseList = res; 
    
    $("#newpassphrase").html(phraseList);
    $("#yournewpassphrase").html(phraseList);
    
    var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];        
    
    chrome.storage.local.set(
                    {
                        'passphrase': phraseList,
                        'encrypted': false,
                        'firstopen': false,
                        'addressinfo': addressinfo,
                        'totaladdress': 5
                        
                    }, function () {
                        
                        //resetFive();
                        $(".hideEncrypted").show();
                        convertPassphrase(m);
                        assetDropdown(m);
                        $('#allTabs a:first').tab('show');
                    
                    });

}

function existingPassphrase(string) {
    
    
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    convertPassphrase(m2);
    assetDropdown(m2);
    
    $('#allTabs a:first').tab('show')
}



function manualPassphrase(passphrase) {
//    var string = $('#manualMnemonic').val().trim().toLowerCase();
//    $('#manualMnemonic').val("");
    
    
    var string = passphrase.trim().toLowerCase();
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    
    
    chrome.storage.local.set(
                    {
                        'passphrase': string,
                        'encrypted': false,
                        'firstopen': false
                    }, function () {
                    
                        convertPassphrase(m2);
                        assetDropdown(m2);
    
                        $(".hideEncrypted").show();
                        $("#manualPassBox").hide();
                        
                        
                         $('#allTabs a:first').tab('show')
                      
                    
                    });
}





function loadAssets(add) {
      
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;
    
    var source_html = "https://counterpartychain.io/api/balances/"+add;
    
    var xcp_source_html = "http://counterpartychain.io/api/address/"+add;
    
    var btc_source_html = "https://insight.bitpay.com/api/addr/"+add+"/balance";
    
    $( "#alltransactions" ).html("");
    
    
    $.getJSON( xcp_source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);    
        
        if (xcpbalance == 'NaN' || typeof xcpbalance === 'undefined') {
            xcpbalance = 0;
        }
    
        $.getJSON( source_html, function( data ) {
        
            $( "#allassets" ).html("<div class='btcasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='bitcoin_48x48.png'></div><div class='col-xs-10'><div class='assetname'>BTC</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty' id='btcassetbal'></div></div></div></div>");
            
            
            var isbtcloading = $("#isbtcloading").html();
            
            if (isbtcloading == "true") {
    
                var btcbalance = "...";
                
                $("#btcassetbal").html(btcbalance);

                $.getJSON( btc_source_html, function( data_btc ) { 
      
                    var bitcoinparsed = parseFloat(data_btc) / 100000000;
         
                    $("#isbtcloading").html("false");
        
                    $("#btcassetbal").html(bitcoinparsed);
                    
                });
                
            } else {
                
                var btcbalance = $("#btcbalhide").html();
                $("#btcassetbal").html(btcbalance);
                
            }
            
            
            var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";
            
            if (xcpbalance != 0) {
            
                $( "#allassets" ).append("<div class='xcpasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+xcpicon+"'></div><div class='col-xs-10'><div class='assetname'>XCP</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty'>"+xcpbalance+"</div>  <div class='XCP-pending assetqty-unconfirmed'></div></div></div></div>");
        
            }
        

        
                $.each(data.data, function(i, item) {
                    var assetname = data.data[i].asset;
                    var assetbalance = data.data[i].amount; //.balance for blockscan
                    if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}

                    var iconname = assetname.toLowerCase();
                    var iconlink = "http://counterpartychain.io/content/images/icons/"+iconname+".png";

                    if (assetname.charAt(0) != "A") {
                        var assethtml = "<div class='singleasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+iconlink+"'></div><div class='col-xs-10'><div class='assetname'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty'>"+assetbalance+"</div> <div class='"+assetname+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";

                    } 

                    $( "#allassets" ).append( assethtml );

                });
            
            
            var xcp_mempool_html = "https://counterpartychain.io/api/mempool";
            
            $.getJSON( xcp_mempool_html, function( data ) {  
            
                if (data.success == 1 && data.total > 0) {

                    var currentaddr = $("#xcpaddress").html();

                    $.each(data.data, function(i, item)  {

                        if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {

                            if (currentaddr == data.data[i].source) {var debitorcredit = "-";};                    
                            if (currentaddr == data.data[i].destination) {var debitorcredit = "+";};

                            var assetqty = debitorcredit + (data.data[i].quantity * 1);          
                            var assetname = data.data[i].asset;
                            var assetnameclass = "."+assetname+"-pending";
                            
                            if($(assetnameclass).html() != '') {
                            
                                var currentunconf = $(assetnameclass).html();
                                
                                var result = currentunconf.substring(1, currentunconf.length-1);
                                
                                console.log(result);
                                
                                var combinetxs = parseFloat(result) + parseFloat(assetqty);
                                
                                console.log(combinetxs);
                                
                                if (combinetxs > 0) { 
                                    
                                    var unconftxs = "+" + combinetxs;
                                    
                                    
                                    
                                } else {
                                    
                                    var unconftxs = combinetxs;
                            
                                }
                                
                                $(assetnameclass).html("("+unconftxs+")")
                                
                            } else {

                                $(assetnameclass).html("("+assetqty+")");
                                
                            }
                            
                            
                            var currentunconf = $(assetnameclass).html();
                                
                            var result = parseFloat(currentunconf.substring(1, currentunconf.length-1));
                            
                            if( result > 0 ) {
                                
                                $( ".assetqty-unconfirmed" ).css( "color", "#9CFFA7" );
                                
                            } else {
                                
                                $( ".assetqty-unconfirmed" ).css( "color", "#FA9B9B" );
                                    
                            }

                        }

                    });

                }
            
            });
            
            
            
            $( "#allassets" ).append("<div style='height: 20px;'></div>");
        
            loadTransactions(add);
        
        });
        
    });
}

/*function updateBTC(pubkey){

    var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    
    $.getJSON( source_html, function( data ) { 
        $("#xcpbalance").html(data);
    });
};*/




    		function makedSignedMessage(msg, addr, sig)
    		{
        		var qtHdr = [
      			"<pre>-----BEGIN BITCOIN SIGNED MESSAGE-----",
      			"-----BEGIN BITCOIN SIGNATURE-----",
      			"-----END BITCOIN SIGNATURE-----</pre>"
    			];
                
                return qtHdr[0]+'\n'+msg +'\n'+qtHdr[1]+'\nVersion: Bitcoin-qt (1.0)\nAddress: '+addr+'\n\n'+sig+'\n'+qtHdr[2];
    		}
    		
    		function getprivkey(inputaddr, inputpassphrase){
    			//var inputaddr = $('#inputaddress').val();
    			
    			//var string = inputpassphrase.val().trim().toLowerCase();
                //string = string.replace(/\s{2,}/g, ' ');
                var array = inputpassphrase.split(" ");
                
                m2 = new Mnemonic(array);
                
                var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m2.toHex(), bitcore.Networks.livenet);
                
                 
                        for (var i = 0; i < 50; i++) {
                            
                            var derived = HDPrivateKey.derive("m/0'/0/" + i);
                            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
                            var pubkey = address1.toString();
                            
                            if (inputaddr == pubkey) {
                            var privkey = derived.privateKey.toWIF();
                            break;
                            
                            }
                        }
                
                return privkey;
    		}
    		
    		
    		
    		function signwith(privkey, pubkey, message) {
    			
    			
    			
    			//var message = "Message, message";
      			var p = updateAddr(privkey, pubkey);
      			
      			if ( !message || !p.address ){
        		return;
      			}

      			message = fullTrim(message);

      			
        		var sig = sign_message(p.key, message, p.compressed, p.addrtype);
   

      			sgData = {"message":message, "address":p.address, "signature":sig};

      			signature_final = makedSignedMessage(sgData.message, sgData.address, sgData.signature);
    			
    			return signature_final;
    
    		}

function twodigits(n){
    return n > 9 ? "" + n: "0" + n;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = twodigits(month) + '-' + twodigits(date) + '-' + year + ' | ' + twodigits(hour) + ':' + twodigits(min) + ':' + twodigits(sec) ;
  return time;
}



function loadTransactions(add) {

    //{"address":"1CWpnJVCQ2hHtehW9jhVjT2Ccj9eo5dc2E","asset":"LTBCOIN","block":348621,"quantity":"-50000.00000000","status":"valid","time":1426978699,"tx_hash":"dc34bbbf3fa02619b2e086a3cde14f096b53dc91f49f43b697aaee3fdec22e86"}

    var source_html = "https://counterpartychain.io/api/transactions/"+add;
    
    $.getJSON( source_html, function( data ) {
        
        
        
        $.each(data.data, function(i, item) {
            
            var assetname = data.data[i].asset;
            
            if (assetname.charAt(0) != "A") {
            
            var address = data.data[i].address;
            
            var quantity = data.data[i].quantity;
            var time = data.data[i].time;
            
            var translink = "https://counterpartychain.io/transaction/"+data.data[i].tx_hash;
            var addlink = "https://counterpartychain.io/address/"+address;
            
            if (parseFloat(quantity) < 0) {
                var background = "senttrans";
                var transtype = "<span class='small'>Sent to </span>";
            } else {
                var background = "receivedtrans";
                var transtype = "<span class='small'>Received from </span>";
            }
             
  
            var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>"+assetname+"</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='addresstrans'>"+transtype+"<br><a href='"+addlink+"' style='color: #fff;'>"+address.substring(0, 12)+"...</a></div><div class='small' style='bottom: 0;'><a href='"+translink+"' style='color: #fff;'>"+timeConverter(time)+"</a></div></div></div></div>";
             
    
            $( "#alltransactions" ).append( assethtml );
                
            }

        });
        
        $( "#alltransactions" ).append("<div style='height: 20px;'></div>");
             
    });
    
    
}

function sendtokenaction() {
    
    $("#sendtokenbutton").html("Sending...");
            $("#sendtokenbutton").prop('disabled', true);
             
            var assetbalance = $("#xcpbalance").html();
            var array = assetbalance.split(" ");
            var currentbalance = parseFloat(array[0]);
      
            var pubkey = $("#xcpaddress").html();
            var currenttoken = $(".currenttoken").html();
            
            var sendtoaddress = $("#sendtoaddress").val();
            var sendtoamount_text = $("#sendtoamount").val();
            var sendtoamount = parseFloat(sendtoamount_text);
                       
            if($("#isdivisible").html() == "no"){
            
                sendtoamount = Math.floor(sendtoamount) / 100000000;
            
            } 
            
            console.log(sendtoamount);
            
            var minersfee = 0.0001;
            
            var totalsend = parseFloat(sendtoamount) + minersfee;
     
            if (bitcore.Address.isValid(sendtoaddress)){
                
                if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric( sendtoamount ) == false) {
                
                    $("#sendtoamount").val("Invalid Amount");
                    $("#sendtokenbutton").html("Refresh to continue");
                
                } else {
            
                    if (totalsend > currentbalance) {
            
                        $("#sendtoamount").val("Insufficient Funds");
                        $("#sendtokenbutton").html("Refresh to continue");
                
                    } else {
                        
                        var txsAvailable = $("#txsAvailable").html();
                        
                        if (currenttoken == "BTC") {
                    
                            sendBTC(pubkey, sendtoaddress, sendtoamount, minersfee);
                        
                        } else if (txsAvailable > 1) {
                            
                            var btc_total = 0.0000547;  //total btc to receiving address
                            var msig_total = 0.000078;  //total btc to multisig output (returned to sender)
                            var mnemonic = $("#newpassphrase").html();
                            
                            $("#sendtokenbutton").html("Sending...");
                            
                            //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic); 
                                         
                            sendXCP_opreturn(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, minersfee, mnemonic); 
                                                 
                            //setUnconfirmed(pubkey, currenttoken, sendtoamount);
                            
                        }
                        
                         $("#sendtoaddress").prop('disabled', true);
                         $("#sendtoamount").prop('disabled', true);
                
                        //$("#sendtokenbutton").html("Sent! Refresh to continue...");
                
                    }
                
                }
                
            } else {
                
                
                    var success = false;

                    var userid = $("#sendtoaddress").val().toLowerCase();

                    $.getJSON( "https://letstalkbitcoin.com/api/v1/users/"+userid, function( data ) {

                            success = true;
                            $("#sendtoaddress").val(data.profile.profile["ltbcoin-address"]["value"]);
                            sendtokenaction();

                    });

                    setTimeout(function() {
                        if (!success) {
                            $("#sendtoaddress").val("Invalid Address");
                            $("#sendtokenbutton").html("Refresh to continue");
                        }
                    }, 1500);


            }
            
}


function resetFive() {
    
    var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];
    
    chrome.storage.local.set(
                    {
                        'totaladdress': 5,
                        'addressinfo': addressinfo
                    }, function(){
                    
                    
                    var string = $("#newpassphrase").html();
                    var array = string.split(" ");
                    m = new Mnemonic(array);
                        
                    assetDropdown(m);
                    $('#allTabs a:first').tab('show');
                    
                    });
    
}

function setChainsoOn() {

    chrome.storage.local.get(function(data) {
        
        if(typeof(data["chainso_detect"]) !== 'undefined') { 
               //already set
                
                var detect = data["chainso_detect"];

                if (detect == "no") {

                    var detect = "no";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Enable Chain.so Token Detection");

                            });


                } else {

                    var detect = "yes";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Disable Chain.so Token Detection");

                            });

                }
            
            } else {
            
                var detect = "yes";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Disable Chain.so Token Detection");

                            });
            
        }

            
    })

}

function setInitialAddressCount() {
    
       setChainsoOn();
    
       chrome.storage.local.get(function(data) {
        
        if(typeof(data["totaladdress"]) !== 'undefined') { 
           //already set
            var newtotal = parseInt(data["totaladdress"]);
        } else {
            var newtotal = 5;
            
        }
           
        if(typeof(data["addressinfo"]) !== 'undefined') { 
           //already set
           var addressinfo = data["addressinfo"]; 
        } else {
            
            var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];
            
        }

       
       chrome.storage.local.set(
                    {
                        'totaladdress': newtotal,
                        'addressinfo': addressinfo
                        
                    }, function () {
                    
                       //show new address
                    
                    });  
    });  
    
    
}

function addTotalAddress(callback) {
    
    chrome.storage.local.get(function(data) {
        
        
        var newtotal = parseInt(data["totaladdress"]) + 1;
        
        var addressinfo = data["addressinfo"];
        var newlabel = "Address "+newtotal;
        
        addressinfo.push({label:newlabel});
      
        chrome.storage.local.set(
                    {
                        'totaladdress': newtotal,
                        'addressinfo': addressinfo
                    }, function () {
                    
                       callback(addressinfo, "newaddress");
                    
                    });   
        
        
    });
        
}

function insertAddressLabel(newlabel, callback) {
     
    chrome.storage.local.get(function(data) {
        
        var addressinfo = data["addressinfo"];
        
        var addressindex = $("#walletaddresses option:selected").index();

        addressinfo[addressindex].label = newlabel;
      
        chrome.storage.local.set(
                    {
                        'addressinfo': addressinfo
                    }, function () {
                    
                       
                            $("#addresslabeledit").toggle();
                            $("#pocketdropdown").toggle();
                            
                            callback(addressinfo, "newlabel");
                    
                    });   
        
        
    });
        
}

function currenttokenpending(token) {

            var xcp_mempool_html = "https://counterpartychain.io/api/mempool";
            
            $.getJSON( xcp_mempool_html, function( data ) {  
            
            if (data.success == 1 && data.total > 0) {
                
                var currentaddr = $("#xcpaddress").html();
                
                var totalunconfirmed = 0;
                
                $.each(data.data, function(i, item)  {
                    
                    if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {
                    
                        var assetname = data.data[i].asset;
                        
                        if (token == assetname) {
                        
                            if (currentaddr == data.data[i].source) {
                                totalunconfirmed -= parseFloat(data.data[i].quantity);
                            };
                        
                            if (currentaddr == data.data[i].destination) {
                                totalunconfirmed += parseFloat(data.data[i].quantity);
                            };
                            
                            if(totalunconfirmed > 0) {
                                
                                    $( "#currenttoken-pending" ).css( "color", "#679967" );
                                    
                                } else {
                                    
                                    $( "#currenttoken-pending" ).css( "color", "#FA7A7A" );
                                    
                                }
                            
                            
                        }
                          
                    }
                    
                });
                
                var totalqty = totalunconfirmed * 1;
                
                if (totalunconfirmed > 0) {
                
                    $("#currenttoken-pending").html("(+"+totalqty+")");
                    
                } else if (totalunconfirmed < 0) {

                    $("#currenttoken-pending").html("("+totalqty+")");
                    
                }
                
            }
            
            });

}


//function setUnconfirmed(sendaddress, sendasset, sendamount) {
//    
//    var currentbalance = parseFloat($("#assetbalhide").html());
//    var finalbalance = currentbalance - parseFloat(sendamount);
//    var unconfirmedamt = parseFloat(sendamount)*(-1);
//    
//    
//    
//    var tx = {asset: sendasset, txamount: unconfirmedamt, postbalance: finalbalance};
//    
//    var txfinal = {address: sendaddress, tx: tx};
//      
//    chrome.storage.local.get(function(data) {
//        if(typeof(data["unconfirmedtx"]) !== 'undefined' && data["unconfirmedtx"] instanceof Array) { 
//            data["unconfirmedtx"].push(txfinal);
//        } else {
//            data["unconfirmedtx"] = [txfinal];
//        }
//        
//        chrome.storage.local.set(data); 
//        
//        
//        
//    });
//
//}

function loadAddresslist() {

    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    
    var currentsize = $('#walletaddresses option').size(); 
    
   
    currentsize = currentsize - 1;
    var addressindex = $("#walletaddresses option:selected").index();
    
    
    $(".addressselectnoadd").html("");  
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    
    
    chrome.storage.local.get(function(data) {
    
        var addresslabels = data.addressinfo;
        
                    
    
                     
    for (var i = 0; i < currentsize; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
        
        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
        
        $(".addressselectnoadd").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
    }
    
    });
};

function loadSwapbots() {


    
     var swapbots_public_html = "http://swapbot.tokenly.com/api/v1/public/bots";
            
            $.getJSON( swapbots_public_html, function( data ) {  

                if (data.length > 0) {
                    
                    var allbots = [];

                    $.each(data, function(i, item)  {

                            allbots.push(data[i].id);

                    });
                    
                    console.log(allbots);
                }
            });

}

function loadFeatureRequests() {

        var issues_public_html = "https://api.github.com/repos/loon3/Tokenly-Pockets/issues";
    
        
            
        $.getJSON( issues_public_html, function( data ) {  
            
            $("#FundDevBody").html("");

            if (data.length > 0) {
                
                $("#FundDevBody").append("<div class='h3' style='padding: 10px 0 10px 0;'>Fund Development</div><div style='padding: 10px 15px 15px 15px;'>Below is a list of proposed features for Tokenly Pockets. When a proposed feature reaches its funding goal, it is added to the <span style='font-weight: bold;'><a href='https://github.com/loon3/Tokenly-Pockets/labels/feature%20queue'>feature queue</a></span> and completed in the order in which it's added.</div><div>To fund the features below,<br>you need <a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'><span style='font-weight: bold;'>POCKETCHANGE</span> <img src='pc-icon.png'></a></div><hr><div style='padding: 15px 0 5px 0; font-size: 24px; text-decoration: underline;'>Proposed Features:</div>");

                var allfeatures = [];

                $.each(data, function(i, item)  {

                    var info = data[i].labels[2];

                    if (info != undefined) {

                         if (info['name'] == "new feature") {
                             
                             var address = data[i].labels[0]['name'];
                             
                             var budget = data[i].labels[1]['name'];

                             var title = data[i].title;
                             var body = data[i].body;
                             var url = data[i].html_url;
                             var propnum = data[i].number;
                             
                             //color: #fff; background-color: #2d3c93;

                             $("#FundDevBody").append("<div style='margin: 20px; padding: 10px 10px 5px 10px; border: 3px solid #aaa; background-color: #f8f8f8;'><div style='padding: 5px; background-color: #fff; border: 2px solid #aaa;'><div style='padding: 5px 0 0 0; font-size: 24px;'>"+title+"</div><div class='small' style='padding: 10px 0 0 0; margin-top: -10px; font-weight: bold;'><a href='"+url+"'>View on Github</a></div><div style='padding: 20px 10px 10px 10px;'>"+body+"</div></div><div style='margin: 10px -4px 5px -4px;'><div style='padding: 5px; font-size: 14px; height: 28px;'>Goal: <span style='font-weight: bold; font-size: 16px;'>"+addCommas(budget.substr(1))+"</span> <div style='display: inline-block;'><img src='pc-icon.png'></div></div><div style='padding: 5px; font-size: 14px; height: 28px;'>Funded: <span style='font-style: italic;'><span style='font-weight: bold; font-size: 18px;' class='pct-"+address+"'></span></span> ( <span style='font-weight: bold; font-style: italic; font-size: 16px;' class='"+address+"'>0</span> <div style='display: inline-block;'><img src='pc-icon.png'> )</div></div></div><div style='padding: 10px 0 5px 0; font-size: 12px; font-style: italic;'>Contribute to Feature:</div><div class='btn-group' role='group' aria-label='...'><button data-address='"+address+"' data-token='POCKETCHANGE' data-title='"+title+"' class='btn btn-warning  movetosendFundDev'>Send POCKETCHANGE <img src='pc-icon-white.png'></button></div><div style='padding: 5px; font-size: 11px; font-weight: bold;'><a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'>Get POCKETCHANGE</a></div></div>");
                             
                             returnTokenBalance(address, "POCKETCHANGE", function(pcbalance){
                             
                                var issueclass = "."+address;
                                 
                                var issuepctclass = ".pct-"+address;
                                 
                                var pcbalnum = parseInt(pcbalance);
                                var budgetnum = parseInt(budget.substr(1));
                             
                                var fundedpct = (pcbalnum / budgetnum) * 100;
                                 
                                //if (fundedpct < 1) {
                                fundedpct = fundedpct.toFixed(1);
                                //}
                                 
                                console.log(fundedpct);
                                 
                                $(issueclass).html(addCommas(pcbalance));
                                
                                $(issuepctclass).html(fundedpct + "%"); 
                                 
                                allfeatures.push({title: title, body: body, url: url, pocketchange: pcbalance});
                             
                             });
                             
                             

                             

                         }

                    }

                });


                console.log(allfeatures);
                
                $("#FundDevBody").append("<div style='height: 20px; line-height: 20px; margin: 10px 0 50px 0;'>Have an idea for a new feature?<br><a href='https://github.com/loon3/Tokenly-Pockets/issues/new' style='font-weight: bold;'>Create an issue on Github!</a></div>");

//                   return allfeatures;

            }
        });

}

function returnTokenBalance(address, currenttoken, callback) {

    var source_html = "https://counterpartychain.io/api/balances/"+address;
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
    
    $.getJSON( source_html, function( data ) {     
        
        if (data.data != undefined) {
        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            
            if(assetname == currenttoken) {
                
                var assetbalance = data.data[i].amount; 
                
                assetbalance = parseFloat(assetbalance).toString(); 
                
                callback(assetbalance);
                     
            }
        });
            
        } else {
            
            callback(0);
                    
        }
    });
     
    
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


//function FindAsset(asset) {

//                    var string = $("#newpassphrase").html();
//                    var array = string.split(" ");
//                    m = new Mnemonic(array);
//    
//                    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
//
//                        for (var i = 0; i < 5; i++) {
//                            
//                            
//                            
//                            var derived = HDPrivateKey.derive("m/0'/0/" + i);
//                            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//                           
//                            var pubkey = address1.toString();
//                            
//                            var source_html = "https://counterpartychain.io/api/balances/" + pubkey; //counterpartychain api
//      
//                            $.getJSON( source_html, function( data ) {
//                                
//                                console.log(data);
//                                
//                                if(data.success == 1){
//                                
//                                 $.each(data.data, function(i, item) {
//
//                                    var assetname = data.data[0]["asset"];  
//                                     
//                                    if (assetname == asset) { //asset from API
//                                       
//                                        return pubkey;
//                                        
//                                    }
//                                     
//                                 });
//                            
//                                }
//                           
//                            
//                            
//                                
//                            });
//                        }
//    
//    

//}
 

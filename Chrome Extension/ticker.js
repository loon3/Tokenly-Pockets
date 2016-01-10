var bitcore = require('bitcore');

var client = new WebTorrent();

var INSIGHT_SERVER = getInsightServer();

var idleTime = 0;
$( document ).ready(function() { 
    
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 10000); // 5 seconds

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
    
    window.resizeTo(324,400);
    
//    getImageHash("pockets-48.png", function(hash){
//    
//        console.log("local: "+hash);
//        
//    });
//    
//    getImageHash("http://joelooney.org/ltbcoin/pockets-16.png", function(hash){
//    
//        console.log("remote: "+hash);
//        
//    });
    
    setBvamwtOff();
    
    setInitialAddressCount();
    
    setPinBackground();
    
    
                

    $(window).resize(function(){
        if($("body").data("resizebypass") == "glidera"){
            window.resizeTo(382,610);
        } else if($("body").data("resizebypass") == "tall"){
            window.resizeTo(324,610);
        } else {
            window.resizeTo(324,400);
        }
    })
    
    $('#alltransactions').hide();
    
    $('#yourtxid').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
    
    
    $('#alltransactions').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
    
    
     $('#newsStories').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
    
    $('#FundDevBody').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
    

    $( "#tutorial_splash" ).click(function() {
  		$("#tutorial_splash").hide();
  	});

    
    $('#ninjaButton').click(function(){
         
        //chrome.tabs.create({url: "http://xcp.ninja"});
        
        $("#errorIssue").html("");
        $("#errorReview").html("");
        
        $("#reviewIssueButton").prop('disabled', false);
        $("#reviewIssueButton").html('Issue Token');
        
        clearIssueInputs();
        
        $("#IssueBody").show();
        
        $("#reviewIssueBody").hide();
        $("#afterIssueBody").hide();
        
        
        var newasset = create_new_assetid();
	
	   $("#assetIssue").val(newasset);
        
              
   });
    
//    $("li").click(function(){
//        
//        if (this.id != "inventoryTab"){
//        
//            client.remove("magnet:?xt=urn:btih:1d1c88903daa90b27107251d4a3462a63b5d2f8e", function(err){
//            
//                client.remove("magnet:?xt=urn:btih:5eebd992b799b0577ebc922e40fa765d096f8d6c", function(err){
//            
//                    console.log("all done!");
//                    
//                })
//                
//            })
//            
//        };
//    
//    //
//    
//    });
  
    
    $('#shapeshiftStartButton').click(function(){
         
        $("#shapeshiftbuttonbox").hide();
        $("#shapeshiftselectadd").show();
        
   });
    
    $('#shapeshiftButton').click(function(){
        
        var selectedaddress = $("#getbtcAddress").val();
        
        chrome.tabs.create({url: "https://shapeshift.io/shifty.html?destination="+selectedaddress+"&amp;apiKey=da63a102dd3dbbf683d7123c90ce66dad4b7b9c5636bb5c842b6bf207be84195b2a8199dc933aeb7e83ca3a234551673753b0e9c6e53f529e37abc919d108691&amp;amount="});
        
   });
    
    $("#pinsplash").hide();
    $('#alltransactions').hide();

    getStorage();
    //setEncryptedTest();
    
    //on open
    var manifest = chrome.runtime.getManifest();
    
    var infobutton = "<div style='display: inline-block; padding-left: 5px;'><a id='infoButton' href='#infoPage' data-toggle='tab'><img src='info-icon.png' height='16' width='16'></a><div id='helpButton' style='display: inline-block; cursor: pointer; margin-left: 3px;'><img src='images/help-icon.png' height='16' width='16'></div><div id='openinwindowbutton' style='display: inline-block; cursor: pointer; margin-left: 2px;'><img src='images/expand-icon.png' height='20' width='20'></div></div>";
    
    $("#nameversion").html("Tokenly Pockets v" + manifest.version + infobutton);
  
    
       var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            return cipherParams;
        }
        };
    
    $("form").submit(function (e) {
      e.preventDefault();
    //};

   // $("#pinButton").click(function () {
        
        var pin = $("#inputPin").val();
        
        $("#inputPin").val("");
        
        chrome.storage.local.get(["passphrase"], function (data)
        {         
            var decrypted = CryptoJS.AES.decrypt(data.passphrase, pin, { format: JsonFormatter });          
            var decrypted_passphrase = decrypted.toString(CryptoJS.enc.Utf8);
            
            console.log(decrypted_passphrase.length);
            
            if (decrypted_passphrase.length > 0) {
                
                $("#pinsplash").hide();
                
                $(".hideEncrypted").hide();
                
                $("#priceBox").show();
            
                infoalertstart();
                
                existingPassphrase(decrypted.toString(CryptoJS.enc.Utf8));
                
            } 
        });
    });
    
    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
    
    $( "#walletaddresses" ).change(function () {
        
        
        
        $( "#btcbalance" ).html("<div style='font-size: 12px;'>Thinking...</div>");
    
        var addr = $(this).val();
        
        $( ".addressselect" ).attr("title", addr)
        
        if (addr == "add") {
        
//            chrome.storage.local.get(function(data) {
//
//                var addresslabels = data["addressinfo"];
                
                //dynamicAddressDropdown(addresslabels);
                
                addTotalAddress(dynamicAddressDropdown);

//            }); 
            
        } else {
        
            console.log(addr);

    //    chrome.storage.local.set(
    //                    {
    //                        'lastAddress': addr
    //                    }, function () {

            $("#xcpaddress").html(addr);

            //getPrimaryBalance(addr);
                    
            $('#refreshWallet').trigger('click');
//                    });
        }
    
    });
    
    
    
    
    $('#yesEncryptButton').click(function (){
        
        $('#encryptquestion').hide();  
        $('#encryptyes').show();  
    
    });
    
    $('#setpinatsplash').click(function (){
         
        
                        
        chrome.storage.local.get(["passphrase"], function (data)
            {       
            
                var password = $("#inputSplashPass").val();
                
                var encrypted = CryptoJS.AES.encrypt(data.passphrase, password, { format: JsonFormatter });
               
                chrome.storage.local.set(
                {
                        
                    'passphrase': encrypted,
                    'encrypted': true
                        
                }, function () {
                
                    $("#welcomesplash").hide();
                    //$("#tutorial_splash").show();
                    $(".hideEncrypted").hide();
                    $(".bg").css("min-height", "200px");
                    infoalertstart();
                
                });
        
            });
                                          
                  
    });
    
    $('#setupWalletButton').click(function (){
        $('#walletquestion').show();  
        $('#initialsplash').hide();  
    });
    
    $('#yesExistingWallet').click(function (){
        $('#walletquestion').hide();  
        $('#walletyes').show();  
    });
    
    $('#noExistingWallet').click(function (){
         newPassphrase();
        
        $('#walletquestion').hide();  
        $('#walletno').show();  
    });
    
    $('#writeDownButton').click(function (){
        $('#walletno').hide();  
        $('#encryptquestion').show();  
    });
    
   
    
    $('#copyButton').click(function (){
        
        var address = $("#xcpaddress").html();
        
        copyToClipboard(address);
        
        $('#xcpaddressTitle').hide(); 
        $('#addresscopied').show();
        setTimeout(function(){ 
            $('#addresscopied').hide(); 
            $('#xcpaddressTitle').show();
        }, 1500);
        
    });
    
    $('#exportAddresses').click(function(){
        exportAddresses();
        
    });
    
    $('#importAddresses').click(function(){
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "js/import_addresses.js"}, function(){
            
            if (chrome.extension.lastError){
                var errorMsg = chrome.extension.lastError.message;
                if (errorMsg == "Cannot access a chrome:// URL"){
                    $("#hiddenaddlab").show();
                }
            }
                
            });
        });
        
        
    });
    
    
      
    
    $('#AddressesAndLabels').click(function(){
        $('#AddressesAndLabelsOptions').toggle();
        
        $('#hiddenaddlab').hide();
    });
   
    
    $('#setpassphraseatsplash').click(function (){
        $('#walletyes').hide();  
        $('#encryptquestion').show();  
        
        var passphrase = $('#inputSplashPassphrase').val();
        
        manualPassphrase(passphrase);
    });
    
    $('#noEncryptButton').click(function (){
       
            chrome.storage.local.set(
                    {
                        
                        'firstopen': false
                        
                    }, function () {
                    
                        getStorage();
                        $("#welcomesplash").hide();
                        //$("#tutorial_splash").show();
                                          
                    });
        
    
    });
    
    $('#assettransactiontoggle').click(function ()
        { 
                
            var currentaddr = $("#xcpaddress").html();
            
            if ($('#assettransactiontoggle').html() == "View Tokens") {
                
                $('#assettransactiontoggle').html("View Token Transaction History");
                $('#alltransactions').hide();
                $('#allassets').show();
                
                loadAssets(currentaddr);
                
            } else {
                
                $('#assettransactiontoggle').html("View Tokens");
                $('#alltransactions').show();
                $('#allassets').hide();

                loadTransactions(currentaddr);
            }
            
        });
    
    $('.resetAddress').click(function ()
        {
           
                   
                        newPassphrase();
                        
            
                                          

        });
    
    $('.addlabbuttons').click(function ()
        {
           
                   
                        $('#AddressesAndLabelsOptions').hide();
                        
                                          

        });
    
    $('.resetFive').click(function ()
        {
            resetFive();
        });
    
    $('#revealPassphrase').click( function ()
        {
            if($("#newpassphrase").is(":visible")) {
                $("#passphrasebox").hide();
                $("#revealPassphrase").html("Reveal Passphrase");
            } else {
                $("#passphrasebox").show(); 
                $("#revealPassphrase").html("Hide Passphrase");
            }
        });
    
    $('#manualPassphrase').click( function ()
        {
            if($("#manualPassBox").is(":visible")) {
                $("#manualPassBox").hide();
                //$("#revealPassphrase").html("Reveal Passphrase");
            } else {
                $("#manualPassBox").show(); 
                //$("#newpassphrase").hide();
                //$("#revealPassphrase").html("Hide Passphrase");
            }    
        });
    
     $('#encryptPassphrase').click( function ()
        {
            if($("#encryptPassphraseBox").is(":visible")) {
                $("#encryptPassphraseBox").hide();
                //$("#revealPassphrase").html("Reveal Passphrase");
            } else {
                $("#encryptPassphraseBox").show(); 
                //$("#newpassphrase").hide();
                //$("#revealPassphrase").html("Hide Passphrase");
            }    
        });
    
    $('#sendAssetButton').click( function () {
        
        
        
        $("#btcsendbox").toggle(function(){
            
            if($("#btcsendbox").is(":visible")) {
                
                $("body").data("resizebypass", "tall");
                window.resizeTo(324,610);
                
            } else {
             
                $("body").data("resizebypass", "false");
                window.resizeTo(324,400);
                
            }
            
        });
        
        
        
        if($("#moreBTCinfo").is(":visible")) {
            $("#moreBTCinfo").hide();

        }
            
            
    });
    
    $('#manualAddressButton').click( function ()
        {
            var passphrase = $('#manualMnemonic').val();
            $('#manualMnemonic').val("");
            manualPassphrase(passphrase);
        });
 
      $(document).on("click", '#depositBTC', function (event)
  {
            if($("#btcsendbox").is(":visible")) {
                $("#btcsendbox").hide();
               
            }
      
      
        if ($("#moreBTCinfo").length){
          
            $("#moreBTCinfo").toggle(function(){
            
                if($("#moreBTCinfo").is(":visible")) {

                    $("body").data("resizebypass", "tall");
                    window.resizeTo(324,610);

                } else {
                    
                    $("body").data("resizebypass", "false");
                    window.resizeTo(324,400);
                    
                }
            
            });
            
            
          
        } else {
      
            var currentaddr = $("#xcpaddress").html();
            $("#btcbalance").append("<div id='moreBTCinfo'><div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>"+currentaddr+"</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div><div>Cost per transaction is 0.0001547 BTC</div></div>");  
            var qrcode = new QRCode(document.getElementById("btcqr"), {
    			text: currentaddr,
    			width: 100,
    			height: 100,
    			colorDark : "#000000",
    			colorLight : "#ffffff",
    			correctLevel : QRCode.CorrectLevel.H
				});
            
            $("body").data("resizebypass", "tall");
            window.resizeTo(324,610);
        }
        });

    
    $(document).on("click", '#saveLabelButton', function (event)
      {
          
          var newlabel = $("#newPocketLabel").val();
          
          var labelfixed = newlabel.replace(/'/g, '');

          insertAddressLabel(labelfixed, dynamicAddressDropdown); 
          
      });
 
     $(document).on("click", '#newLabelButton', function (event)
      {
          
          var currentlabel = $('select option:selected').attr('label');
          $("#newPocketLabel").val(currentlabel); //.slice(0, -18)
          $("#addresslabeledit").toggle();
          $("#pocketdropdown").toggle();
          
      });
    

    $(document).on("click", '#helpButton', function (event)
  {
      var ontab = $("ul#allTabs li.active a#walletLink").html();
      
      if(ontab !== undefined) {
          
            $( "#infoalertstatus" ).click();
          
            $("body").data("resizebypass", "false");
            window.resizeTo(324,400);
          
            $("#btcsendbox").hide();
            $("#moreBTCinfo").hide();
            $( "#tutorial_splash" ).show(); 
          
      }
  });
    
    
    
    $(document).on("click", '.tokenlistingheader', function (event)
  {
      
            $( ".tokenlistingbody" ).remove(); 
  });
    
     $(document).on("click", '.swapbotselect', function (event)
  { 
      console.log($(this).data("url"));
      
      
            chrome.tabs.create({url: $(this).data("url")});
            return false; 
  });
    
$(document).on("click", '.tokenlisting', function (event)
  {
        
      var currenttoken = $(this).data("token"); 
      
      if ($( "div:contains('"+currenttoken+" Swapbots')" ).length) {
      
          $( ".tokenlistingbody" ).remove(); 
      
      } else {
      
          if ($('.tokenlistingbody').length) {

                $( ".tokenlistingbody" ).remove(); 

          } 

          var row = $(this).closest('tr');

         $("<tr class='tokenlistingbody' style='background-color: #2EA1CC;'><td colspan='3'><div class='lead' style='text-align: center; width: 100%; color: #fff; margin: 17px 0 0 0; padding: 3px; font-size: 24px;'>"+currenttoken+" Swapbots</div><div class='swaplistbody' style='width: 100%; margin: auto; text-align: center;'><div style='padding: 20px; color: #fff;'><i class='fa fa-cog fa-spin fa-5x'></i></div></div></td></tr>").insertAfter(row);
          
          
           loadSwaplist(currenttoken);
      
      
      }
      
  });
    
  $(document).on("click", '#refreshWallet', function (event)
  {
      
      window.resizeTo(324,400);
      $("body").data("resizebypass", "false");
      
      $("#shapeshiftbuttonbox").show();
      $("#shapeshiftselectadd").hide();
      
      $("#currenttoken-pending").html("");

      $("#ltbDirectorySearchResults").html("");
      $("#ltbUserSearch").val("");
      //$("#searchLTBuser").text("Search");

      $("#freezeUnconfirmed").css("display", "none");
      $("#mainDisplay").css("display", "block");
      
      //$("#sendtokenbutton").html("Send Token");
      $("#sendtokenbutton").prop('disabled', false);
      $("#sendtoaddress").prop('disabled', false);
      $("#sendtoamount").prop('disabled', false);
      
      $("#sendtoaddress").val("");
      $("#sendtoamount").val("");
      $(".sendlabel").html("");
      
      var assetbalance = $("#xcpbalance").html();
      var array = assetbalance.split(" ");
      
      
      var pubkey = $("#xcpaddress").html();
      var currenttoken = $(".currenttoken").html();
      
      $("#sendtokenbutton").html("Send "+currenttoken);
      
      getRate(array[0], pubkey, currenttoken);
      
      getPrimaryBalance(pubkey);
      
      currenttokenpending(currenttoken);
  });
    
  $('#switchtoxcp').click(function ()
  {
      $("#currenttoken-pending").html("");
      $(".currenttoken").html("BTC"); 
      $("#sendtokenbutton").html("Send BTC");
      var pubkey = $("#xcpaddress").html();
      getPrimaryBalance(pubkey);
      $('#allTabs a:first').tab('show');
  });


//  $('#txHistory').click(function ()
//  {
//    var address = $("#xcpaddress").html();
//    chrome.tabs.create(
//    {
//      url: "http://blockscan.com/address/" + address
//    });
//  });

  $('#contact').click(function ()
  {
    chrome.tabs.create({ url: "mailto:support@letstalkbitcoin.com" });
  });

    
  $('#refresharrow').click(function ()
  {
    var pubkey = $("#xcpaddress").html();
    getPrimaryBalance(pubkey);
  });
    
  
   $(document).on("click", '.movetowallet', function (event)
  {  
      $("#currenttoken-pending").html("");
      
      var $assetdiv = $( this ).prev();
      
      var isnumeric = $assetdiv.data("numeric");
      
      if (isnumeric != undefined) {
          
          var currentasset = isnumeric;
          
          var enhancedassetfullname = $assetdiv.html();
          
//          if (enhancedassetfullname.length > 24) {
//          
//            var enhancedassetname = enhancedassetfullname.substr(0, 24) + "...";
//              
//          } else {
              
            var enhancedassetname = enhancedassetfullname;
              
//          }      
          
          $("#xcpbalance").data("enhanced", enhancedassetname);
          
          $("#sendtokenbutton").html("Send");

      } else {
      
          var currentasset = $assetdiv.html();
          
          $("#sendtokenbutton").html("Send "+currentasset);
          
      }
      
      $(".currenttoken").html(currentasset);
      
      var qtypending = $("."+currentasset+"-pending").html();
      
      $("#currenttoken-pending").html(qtypending);
      
      //$(".currenttoken").html("WORKS");
      
      
      
      var pubkey = $("#xcpaddress").html();
      
      
      getPrimaryBalance(pubkey);
      
      
      window.resizeTo(324,400);
      $("body").data("resizebypass", "false");
      
      $('#allTabs a:first').tab('show');
      
  });
    
    
    
    
     $(document).on("click", '.movetosend', function (event)
  {  
  
      var sendaddress = $( this ).text();
      
      var username = $( this ).data("user");
      
      $("#sendtoaddress").val(sendaddress);
      
      $(".sendlabel").html(username);
      
      $("#btcsendbox").show();
      $("#moreBTCinfo").hide();

      $('#allTabs a:first').tab('show');
      
  });
    
     $(document).on("click", '.movetosendFundDev', function (event)
  {    
      
      $("#currenttoken-pending").html("");
      
      var currentasset = $( this ).data("token");
      var title = $( this ).data("title");
      $(".currenttoken").html(currentasset);
      
      var qtypending = $("."+currentasset+"-pending").html();
      
      $("#currenttoken-pending").html(qtypending);
      
      //$(".currenttoken").html("WORKS");
      
      $("#sendtokenbutton").html("Send "+currentasset);
      
      var pubkey = $("#xcpaddress").html();
      
      //var pubkey = FindAsset(currentasset);
      
      $(".sendlabel").html(title);
      
      getPrimaryBalance(pubkey);
      
      var sendaddress = $( this ).data("address");
      
      $("#sendtoaddress").val(sendaddress);
      
      $("#btcsendbox").show();
      $("#moreBTCinfo").hide();
      
      
      
      $('#allTabs a:first').tab('show');
      
  });



  $('#inventoryTab').click(function ()
  {
    
    //$('.bg').css({"width":"320px"});  
      
      $('#buysellTab').css({"margin-left":"12px"});
      $("#priceBox").show();
      $("#priceBoxBank").hide();
      $("#buysellTab").data("hovercheck", "on");
      
      $('.bg').animate({
            width: "320px"
        }, 100 );
      window.resizeTo(324,610);
      $("body").data("resizebypass", "tall");
    var address = $("#xcpaddress").html();
        
    if ($('#assettransactiontoggle').html() == "View Tokens") {
        loadTransactions(address);
    } else {
        loadAssets(address);
    }
      
  });  
    
    $("#ltbUserSearch").keyup(function(event){
    if(event.keyCode == 13){
        var search_input = $("#ltbUserSearch").val();
        
        searchLTBuser(search_input);
    }
    });
    
    $('#searchLTBuser').click(function (){
        
        var search_input = $("#ltbUserSearch").val();
        
        searchLTBuser(search_input);
        
    });
    
    
    $('#newsApp').click(function (){
        
        getNews();
        
    });
     
    $("#buysellTab").data("hovercheck", "on");
            
    $( "#buysellTab" ).hover(function() {
        
        var hovercheck = $("#buysellTab").data("hovercheck");
        
        if (hovercheck == "on") {
        
        $("#priceBox").toggle();
        $("#priceBoxBank").toggle();
            
        
            
        }
        
    });
    

        

    
    $( "#infoalertstatus" ).click(function () {
        
        chrome.storage.local.set(
                    {
                        
                        'infoalert': "disabled"
                        
                    }, function () {
                    
                        
                    
                    });
        
    });
    
    $( "#nevershow-infoalert" ).click(function () {
        
        chrome.storage.local.set(
                    {
                        
                        'infoalert': "never"
                        
                    }, function () {
                    
                        $("#infoalert").hide();
                    
                    });
        
    });

    
    $(document).on('click', '#buysellTab', function () {
        
       // $('.bg').css({"width":"320px"});
//        $('.bg').animate({
//            width: "320px"
//        }, 100 );
        
        //$('#buysellTab').css({"margin-left":"12px"});
        
        $("#priceBox").hide();
        $("#priceBoxBank").show();
        
         $("#buysellTab").data("hovercheck", "off");
             
    });
    
    $(document).on('click', '#glideraButton', function () {        
        $('.bg').animate({
            width: "378px"
        }, 100 );
        
        $('#buysellTab').css({"margin-left":"70px"});
        
        //$('.bg').css({"width":"378px"});
        
        $("body").data("resizebypass", "glidera");
        
        window.resizeTo(382,610);
        
    });
    
    
    $(document).on('click', '#walletTab', function () {
        
        //$('.bg').css({"width":"320px"});
        $('.bg').animate({
            width: "320px"
        }, 100 );

     
        window.resizeTo(324,400);
        $("body").data("resizebypass", "false");
        $('#buysellTab').css({"margin-left":"12px"});
        $("#priceBox").show();
        $("#priceBoxBank").hide();
        $("#buysellTab").data("hovercheck", "on");
        
    });
    
        $(document).on('click', '#settingsTab', function () {
        
        //$('.bg').css({"width":"320px"});
        $('.bg').animate({
            width: "320px"
        }, 100 );
            window.resizeTo(324,610);
            $("body").data("resizebypass", "tall");
        $('#buysellTab').css({"margin-left":"12px"});
        $("#priceBox").show();
        $("#priceBoxBank").hide();
        $("#buysellTab").data("hovercheck", "on");
    });
    
$(document).on('click', '#toolsTab', function () {
    
            //$('.bg').css({"width":"320px"});
        
        $('.bg').animate({
            width: "320px"
        }, 100 );
    window.resizeTo(324,610);
    $("body").data("resizebypass", "tall");
    $('#buysellTab').css({"margin-left":"12px"});
        $("#priceBox").show();
        $("#priceBoxBank").hide();
    $("#buysellTab").data("hovercheck", "on");
    
    var $link = $('li.active a[data-toggle="tab"]');
    $link.parent().removeClass('active');
    var tabLink = $link.attr('href');
    $('#allTabs a[href="' + tabLink + '"]').tab('show');
    
    loadAddresslist();
});
    
   
    
   $(document).on("click", '#encryptPasswordButton', function (event) 
    {
        chrome.storage.local.get(["passphrase"], function (data)
        {       
            
            var password = $("#encryptPassword").val();
            $("#encryptPassword").val("");
            var encrypted = CryptoJS.AES.encrypt(data.passphrase, password, { format: JsonFormatter });
               
            chrome.storage.local.set(
                    {
                        
                        'passphrase': encrypted,
                        'encrypted': true
                        
                    }, function () {
                    
                        $(".hideEncrypted").hide();
                    
                    });
        
        });
    });

    $('.signMessageButton').click(function ()
        {
            var inputaddr = $("#signPubAddress").val();
            var inputpassphrase = $("#newpassphrase").html();
            var message = $("#messagetosign").val();
            
            var privkey = getprivkey(inputaddr, inputpassphrase);
            var signed = signwith(privkey, inputaddr, message);
            
            
            if($(this).hasClass("copy")){
                copyToClipboard(signed);
            }
            
            $("#postSign").html(signed);
            
            $("#postSign").show();
            $("#resetsignbox").show();
            
            $("#preSign").hide();
             
        });
    
    $('#resetSignButton').click(function ()
        {
            $("#messagetosign").val("");
            $("#resetsignbox").hide();
            $("#postSign").hide();
            
            $("#preSign").show();            
        });   
    
    $('#sendtokenbutton').click(function ()
        {
            sendtokenaction();      
        });
    
    $(document).on("keyup", '#sendtoaddress', function (event)
    { 
        
        $(".sendlabel").html("");
    });
    
    
    $(document).on("keyup", '#sendtoamount', function (event)
    { 
        
        var sendamount = parseFloat($("#sendtoamount").val());
        var currenttoken = $(".currenttoken").html();
        
        if (currenttoken == "BTC") {
            var currentbalance = parseFloat($("#btcbalhide").html());
        } else {
            var currentbalance = parseFloat($("#assetbalhide").html());
        }
        
        //console.log(sendamount);
        //console.log(currentbalance);
        
        if (sendamount > currentbalance) {
            $('#sendtokenbutton').prop('disabled', true);
       	} else {
            $("#sendtokenbutton").removeAttr("disabled");
        }
        
        
        if (currenttoken == "BTC") {
            
            if (isNaN(sendamount) == false && $("#sendtoamount").filter(function() { return $(this).val(); }).length > 0){
            
                var ltbtousd = $("#ltbPrice").data("btc").price;
                var sendinusd = sendamount / parseFloat(ltbtousd);
            
                $("#sendUSD").html("($"+sendinusd.toFixed(2)+")");
 
            } else {
            
                $("#sendUSD").html("");
            }
            
        } else {
            
            $("#sendUSD").html("");
            
        }
        
    });
    
//    $(document).on("click", '.primarytokenoption', function (event) {  
//        
//        var clickedtoken = $(this).html();
//        
//        $(".currentprimarytoken").html(clickedtoken);
//        
//        $("#currenttoken").html(clickedtoken);
//        
//    });
//    
    $('#ExchangeRateApp').click(function(){
        
        getExchangeRatesList();
        
   });
    
    
    $('#FundDevApp').click(function(){
        
        loadFeatureRequests();

        
   });
    
    
     $('#hashjsonIssueTOKNID').click(function(){
        
        var assetid = $("#assetIssue").val();
        var assetname = $("#assetnameIssue").val();
        var owneraddress = $("#owneraddressIssue").val();
		
		if (bitcore.Address.isValid(owneraddress)){
		
			is_asset_unique_init(assetid, function(result){
                
                var assetname = $("#assetnameIssue").val();
			
				if (result == true && assetname.length > 0) { 
                    
                        var assetid = $("#assetIssue").val();
                        var assetname = $("#assetnameIssue").val();
                        var assetdesc = $("#assetdescriptionIssue").val();
                        var assetweb = $("#assetwebsiteIssue").val();

                        var ownername = $("#ownernameIssue").val();
                        var ownertwitter = $("#ownertwitterIssue").val();
                        var owneraddress = $("#owneraddressIssue").val();

                        var divisible = $('#divisibleIssue').val();
                        var amount = $('#amountIssue').val();	   
 
                        var prejsonform = {asset: assetid, assetdescription: assetdesc, assetname: assetname, assetwebsite: assetweb, owneraddress: owneraddress, ownername: ownername, ownertwitter: ownertwitter};
		
                        var jsonform = JSON.stringify(prejsonform);

                        console.log(jsonform);

                        var firstSHA = Crypto.SHA256(jsonform);
                        var hash160 = Crypto.RIPEMD160(Crypto.util.hexToBytes(firstSHA))
                        var version = 0x41 // "T"
                        var hashAndBytes = Crypto.util.hexToBytes(hash160)
                        hashAndBytes.unshift(version)

                        var doubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(hashAndBytes)))
                        var addressChecksum = doubleSHA.substr(0,8)

                        var unencodedAddress = "41" + hash160 + addressChecksum

                        var hash = Bitcoin.Base58.encode(Crypto.util.hexToBytes(unencodedAddress))

                        var description = "TOKNID-"+hash;	
		
                        var reviewinfo = "<div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Token Name:</div><div class='col-xs-12' style='text-align: left;'>"+assetname+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Issuing Address:</div><div class='col-xs-12' style='text-align: left;'>"+owneraddress+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Token ID:</div><div class='col-xs-12' style='text-align: left;'>"+assetid+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Divisible:</div><div class='col-xs-12' style='text-align: left;'>"+divisible+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Amount to be Issued:</div><div class='col-xs-12' style='text-align: left;'>"+amount+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Description:</div><div class='col-xs-12' style='text-align: left;' id='descriptionReview'>"+description+"</div></div>";
                            
                        //<div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>BVAM json:</div><div class='col-xs-12' style='text-align: left;'>"+jsonstring+"</div></div>
                        $("#reviewIssueBodyInfo").data("bvam_cache", jsonform);
                        $("#reviewIssueBodyInfo").data("hash_cache", hash);
                    
                        $.post( "http://xcp.ninja/logasset.php", { jsonpayload: jsonform, assetid: assetid, hash: hash } );

                        $("#reviewIssueBodyInfo").html(reviewinfo);

                        $("#IssueBody").hide();
                        $("#reviewIssueBody").show();
                    
                    
                    } else {
				
					$("#errorIssue").html( "You must provide a token name!" );
				
				}
        
            })
        }
         
   });         
    
    
    $('#hashjsonIssue').click(function(){
        
        console.log("yo");
        
        var assetid = $("#assetIssue").val();
        var assetname = $("#assetnameIssue").val();
        var owneraddress = $("#owneraddressIssue").val();
		
		if (bitcore.Address.isValid(owneraddress)){
		
			is_asset_unique_init(assetid, function(result){
                
                var assetname = $("#assetnameIssue").val();
			
				if (result == true && assetname.length > 0) { 
                    
                        var assetid = $("#assetIssue").val();
                        var assetname = $("#assetnameIssue").val();
                        var assetdesc = $("#assetdescriptionIssue").val();
                        var assetweb = $("#assetwebsiteIssue").val();

                        var ownername = $("#ownernameIssue").val();
                        var ownertwitter = $("#ownertwitterIssue").val();
                        var owneraddress = $("#owneraddressIssue").val();

                        var divisible = $('#divisibleIssue').val();
                        var amount = $('#amountIssue').val();	

                        var prejsonform = {ownername: ownername, ownertwitter: ownertwitter, owneraddress: owneraddress, asset: assetid, assetname: assetname, assetdescription: assetdesc, assetwebsite: assetweb};
                    
                        var jsonstring = JSON.stringify(prejsonform);
                    
                        console.log(prejsonform);
                    
				        var blob = new Blob([jsonstring], {type: "application/json"});
                        console.log(blob);
                    
                        //chrome.runtime.sendMessage({bvamwt: "end"});

                        var clienthash = new WebTorrent()    

                        clienthash.seed(blob, {name: "BVAMWT.json"}, function (torrent) {
                            
                            console.log("getting token infohash...");

                            var hash = torrent.infoHash;
                            
                            console.log(hash);

                            var hash_base58 = Bitcoin.Base58.encode(Crypto.util.hexToBytes(hash))

                            var description = "BVAMWT-"+hash_base58;	
                            
                            var reviewinfo = "<div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Token Name:</div><div class='col-xs-12' style='text-align: left;'>"+assetname+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Issuing Address:</div><div class='col-xs-12' style='text-align: left;'>"+owneraddress+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Token ID:</div><div class='col-xs-12' style='text-align: left;'>"+assetid+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Divisible:</div><div class='col-xs-12' style='text-align: left;'>"+divisible+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Amount to be Issued:</div><div class='col-xs-12' style='text-align: left;'>"+amount+"</div></div><div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>Description:</div><div class='col-xs-12' style='text-align: left;' id='descriptionReview'>"+description+"</div></div>";
                            
                            //<div class='row' style='padding: 5px 0 5px 0;'><div class='col-xs-12' style='text-align: left; font-weight: bold;'>BVAM json:</div><div class='col-xs-12' style='text-align: left;'>"+jsonstring+"</div></div>
                            $("#reviewIssueBodyInfo").data("bvam_cache", jsonstring);
                            $("#reviewIssueBodyInfo").data("hash_cache", hash_base58);

                            $("#reviewIssueBodyInfo").html(reviewinfo);
                            
                            $("#IssueBody").hide();
                            $("#reviewIssueBody").show();

                            clienthash.destroy()

                        })

				} else {
				
					$("#errorIssue").html( "You must provide a token name!" );
				
				}
        
            })
        }
         
   });
    
    
    $("#reviewIssueButton").click(function(){
        
        var add_from = $("#owneraddressIssue").val();
        
        var source_html = "http://btc.blockr.io/api/v1/address/info/"+add_from;  //blockr
        
        $.getJSON( source_html, function( apidata ) {  //blockr
        
            var bitcoinparsed = parseFloat(apidata.data.balance); //blockr

            console.log(bitcoinparsed);
            
            if(bitcoinparsed >= 0.00025600) {

                var bvamjson = $("#reviewIssueBodyInfo").data("bvam_cache");
                var hash = $("#reviewIssueBodyInfo").data("hash_cache");

                writeBvamIssue(hash, bvamjson, function(){

                    console.log("bvam infohash "+hash+" written to local storage!");
                    //console.log("bvam TOKNID hash "+hash+" written to local storage!");

                    $("#reviewIssueButton").prop('disabled', true);
                    $("#reviewIssueButton").html("Issuing... <i class='fa fa-spinner fa-spin'></i>");

                    var mnemonic = $("#newpassphrase").html();

                    var assetidval = $("#assetIssue").val();
                    var add_from = $("#owneraddressIssue").val();

                    var divisible = $('#divisibleIssue').val();
                    var quantity = $('#amountIssue').val();	

                    var description = "BVAMWT-"+hash;
                    //var description = "TOKNID-"+hash;

                    var btc_total = 0.0000547;  //total btc to receiving address
                    var msig_total = 0.000078;  //total btc to multisig output (returned to sender)

                    var transfee = 0.0001;  //bitcoin tx fee

                    var msig_outputs = 2;

                    if(description.length <= 41) {

                        createIssuance(add_from, assetidval, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs);
                        //console.log(description);

                    }

                });
                
            } else {
             
                console.log("not enough btc at this address!");
                
                $("#errorReview").html("Not enough BTC at this address!");
                
            }
        
        }); 
        
    });  
    
    
    $('#hideshowpass').click(function(){
            
        var status = $('#hideshowpass').html();
        
        if (status == "Hide Passphrase") {
            
            $('#hideshowpass').html("Show Passphrase");
            
            $('#inputSplashPassphrase').prop('type', 'password');
            
        } else {
            
            $('#hideshowpass').html("Hide Passphrase");
            
            $('#inputSplashPassphrase').prop('type', 'text');
            
        }
        
   });
    
    
   $('#hideshowpassSettings').click(function(){
       
        var status = $('#hideshowpassSettings').html();
        
        if (status == "Hide") {
            
            $('#hideshowpassSettings').html("Show");
            
            $('#manualMnemonic').prop('type', 'password');
            
        } else {
            
            $('#hideshowpassSettings').html("Hide");
            
            $('#manualMnemonic').prop('type', 'text');
            
        }
                
   });    
    
       $('#chainsobutton').click( function ()
        {
            var state = $('#turnoffchainso').html();
            

            
            if (state == "Disable Chain.so Token Detection") {
                
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
        });
    
     $('#bvamwtbutton').click( function ()
        {
            
            var state = $('#bvamwttoggle').html();
              
            if (state == "Disable Asset Metadata via Webtorrent") {
                
                //chrome.runtime.sendMessage({bvamwt: "end"});
                
                var enabled = "no";

                chrome.storage.local.set(
                        {
                            'bvamwt_enabled': enabled
                        }, function () {
                            
                            $('#bvamwttoggle').html("Enable Asset Metadata via Webtorrent");
                        
                        });
                
                
            } else {
                
                //chrome.runtime.sendMessage({bvamwt: "restart"});
                
                var enabled = "yes";

                chrome.storage.local.set(
                        {
                            'bvamwt_enabled': enabled
                        }, function () {
                            
                            $('#bvamwttoggle').html("Disable Asset Metadata via Webtorrent");
                        
                        });
                
            }
        });
    
         $('#bvamseedbutton').click( function ()
        {
                
                chrome.runtime.sendMessage({bvamwt: "create_seed_tab"});

        });
    
    
    $('#openinwindowbutton').click( function ()
        {
            chrome.windows.create({ url: 'popup.html', type: 'popup', width: 324, height: 380, left: 500, top: 150 }, function(data){
    
                console.log(data);

            });
        });
//loadSwapbots();
    
//loadFeatureRequests();
       
});
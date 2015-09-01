//var address = $(".companion-tip-address").text();

var iconpathblue = chrome.extension.getURL('images/paywithpockets-blue.png');
var iconpathyellow = chrome.extension.getURL('images/paywithpockets-yellow.png');
var iconpathgreen = chrome.extension.getURL('images/paywithpockets-green.png');
var tipsplash = chrome.extension.getURL('tipsplash.html');

$('.pockets-url').html(tipsplash);
$('.pockets-image').html(iconpathblue);
$('.pockets-image-yellow').html(iconpathyellow);
$('.pockets-image-green').html(iconpathgreen);

$('.pockets-payment-button').each(function(i, obj) {
    
    var buttoncolor = $(this).attr("data-color");

    if (buttoncolor == "yellow") {
        var iconcolor = "yellow";
        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
    } else if (buttoncolor == "green") {
        var iconcolor = "green";
        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
    } else {
        var iconcolor = "blue";
        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
    }
    
    var address = $(this).attr("data-address");
    var label = $(this).attr("data-label");
//    var isxcp = $(this).attr("data-isxcp");
    var tokens = $(this).attr("data-tokens");
    var amount = $(this).attr("data-amount");
    
    var labelurl = encodeURIComponent(label).replace(/[!'()*]/g, escape);
    var tokensurl = encodeURIComponent(tokens);
    
    var tipbutton = "<div style='display: inline-block; padding: 5px;'><a href='"+tipsplash+"?address="+address+"&label="+labelurl+"&tokens="+tokensurl+"&amount="+amount+"' target='_blank'><img src='"+iconpath+"' width='160px'></a></div>";
    
    //"&isxcp="+isxcp+

    $(this).html(tipbutton);
    
});





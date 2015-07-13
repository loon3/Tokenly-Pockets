var address = "1LrM4bojLAKfuoFMXkDtVPMGydX1rkaMqH"; //send to address
var paymentlabel = "Token Slot Demo"; //payment 'Send to:' label
var tokensaccepted = "tokenly,ltbcoin,btc"; //tokens accepted for payment

var pocketsurl = $('.pockets-url').text();
var pocketsimage = $('.pockets-image').text();

var label_encoded = encodeURIComponent(paymentlabel).replace(/[!'()*]/g, escape);
var urlattributes = "?address="+address+"&label="+label_encoded+"&tokens="+tokensaccepted;
					
$('#payment-button').html("<a href='"+pocketsurl+urlattributes+"' target='_blank'><img src='"+pocketsimage+"' height='24px' width='24px'></a>"); //assumes payment button location is <span id="payment-button"></span>


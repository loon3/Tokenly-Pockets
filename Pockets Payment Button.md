Pockets Payment Button
----------------------

The Pockets Payment Button can be added to any web page and provides an interface with Tokenly Pockets that eliminates the need for users to copy and paste token addresses and amounts.

Developers can define the following parameters:

- Payment Address
- Payment Label
- Payment Amount
- Tokens Accepted

There are two ways to include the Pockets Payment Button on your web site...


**Static Method**

The first method is to use the `.pockets-payment-button` class.  This HTML method only works if your parameters are known upon initial page load. See example below.

`<span class="pockets-payment-button" data-address="1EUgmNoALra2YSCGcqdpLCNnGYAFQeLEp9" data-label="Payment Button Demo" data-tokens="TOKENLY" data-amount="100"></span>`

The `data-tokens` attribute is used to indicate what tokens are accepted.  There are three options: a single token `data-tokens="TOKENLY"`, multiple tokens `data-tokens="TOKENLY,LTBCOIN,BTC"` or all tokens `data-tokens="all"` (this includes BTC).


**Dynamic Method**

In addition to the Static Method, you can also generate a Pockets Payment Button dynamically using Javascript.

First, you must include two hidden tags within your page.  The hidden tags are assigned the classes `pockets-url` and `pockets-image`.  These are necessary to store the user's Tokenly Pockets extension url as well as the Tokenly Pockets icon.  Below is an example of how this should look in the page source.

```
<div class="pockets-url" style="display: none;"></div>
<div class="pockets-image" style="display: none;"></div>
```

Next, to generate the payment button, you need only reference the information stored in the hidden tags created in the previous step.  See the Javascript/jQuery example below which defines the Payment Button parameters and inserts a Pockets Payment Button into a tag with the id `#mydynamicpocketsbutton`.

```
var address = "1EUgmNoALra2YSCGcqdpLCNnGYAFQeLEp9"; //payment address
var pocketsurl = $('.pockets-url').text(); //Pockets extension url
var pocketsimage = $('.pockets-image').text(); //Pockets icon
var tokensaccepted = "TOKENLY,LTBCOIN,BTC";

var paymentlabel = "Token Slot Demo";
var label_encoded = encodeURIComponent(paymentlabel).replace(/[!'()*]/g, escape); //URI encode label and remove special characters

var urlattributes = "?address="+address+"&label="+label_encoded+"&tokens="+tokensaccepted;

$('#mydynamicpocketsbutton').html("<a href='"+pocketsurl+urlattributes+"' target='_blank'><img src='"+pocketsimage+"' height='24px' width='24px'></a>");
```

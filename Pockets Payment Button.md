Pockets Payment Button
----------------------

The Pockets Payment Button can be added to any web page and provides a user interface with Tokenly Pockets that eliminates the need to copy and paste token addresses and amounts.

Users can define the following parameters:

- Payment Address
- Payment Label
- Payment Amount
- Tokens Accepted

There are two ways to include the Pockets Payment Button into your web page...

**Static Method**

The first method is to use the *pockets-payment-button* class.  This method only works if your parameters are known upon initial page load. See example below.

`<span class="pockets-payment-button" data-address="1EUgmNoALra2YSCGcqdpLCNnGYAFQeLEp9" data-label="joelooney.org tips" data-tokens="dough" data-amount="100"></span>`

The data-tokens attribute is used to indicate what tokens are accepted.  There are three options: a single token `data-tokens="DOUGH"`, multiple tokens `data-tokens="DOUGH,LTBCOIN,BTC"` or all tokens `data-tokens="all"`.



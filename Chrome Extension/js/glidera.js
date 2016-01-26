document.addEventListener('DOMContentLoaded', function() {
	$("#glideraSetupIframe").load(function() {
		$('#loadingGif').hide();
		$('#glideraSetupIframe').show();
	});
	$("#glideraTransactionsIframe").load(function() {
		$('#loadingGif').hide();
		$('#glideraTransactionsIframe').show();
	});
});

$(document).on('click', '.glideralink', function(event) {
	$('#glideraNavBar').removeClass('in');
	glidera.showGlideraTab($(event.target).data('glideratab'));
});
$(document).on('click', '#buysellTab', function() {
	loadAddresslist();
});
$(document).on('click', '#glideraButton', function() {
	glidera.checkOAuthCredentials();
});
$(document).on('click', '#glideraLoginButton', function() {
	glidera.loginOrRegister();
});
$(document).on('click', '#glideraSignUpButton', function() {
	glidera.loginOrRegister();
});
$(document).on('keyup mouseup', '.buyInput', function(event) {
	glidera.updateBuyPrice(event.target);
});
$(document).on('click', '#btnBuy2FA', function() {
	glidera.buyPrecheck();
});
$(document).on('click', '#btnBuyBTC', function() {
	glidera.buy();
});
$(document).on('keyup mouseup', '.sellInput', function(event) {
	glidera.updateSellPrice(event.target);
});
$(document).on('click', '#btnSell2FA', function() {
	glidera.sellPrecheck();
});
$(document).on('click', '#btnSellBTC', function() {
	glidera.sell();
});

//TESTNET CREDENTIALS
//var GLIDERA_URL = 'https://localhost:8181';
//var TOKENLY_CLIENT_ID = '6d030d594df17e9e2bceb4b7cd95b858';
//var TOKENLY_SECRET = '092a99d7c01e2bd30d218d971e062639';

//SANDBOX CREDENTIALS
//var GLIDERA_URL = 'https://sandbox.glidera.io';
//var TOKENLY_CLIENT_ID = '6b1c4f1bf968f49ae0017a2165fc1e29';
//var TOKENLY_SECRET = '9ecb432a0403baa274b91393c09e93e9';

//PRODUCTION CREDENTIALS
var GLIDERA_URL = 'https://www.glidera.io';
var TOKENLY_CLIENT_ID = '3d57e15259393ba79be5c88e5acee0e5';
var TOKENLY_SECRET = '52a72c5038848c04daeb8d9860346e93';

var GLIDERA_STORAGE_KEY = 'glideraStorageKey';
var GLIDERA_API_URL = GLIDERA_URL + '/api/v1/';
var REDIRECT_URI = GLIDERA_URL + "/blank";

var INSIGHT_SERVER = "insight.bitpay.com";

if (!glidera) {
	var glidera = {
		buyQuote: '',
		buyTimer: undefined,
		sellQuote: '',
		sellTimer: undefined,
		sellTransaction: undefined,
		updateAddressListWithBalance: function() {
			$('.glideraAddressList > option').each(function(index, element) {
				var bitpayUtxos = "https://" + (getNetwork().name === 'testnet' ? 'test-' : '') + INSIGHT_SERVER + "/api/addr/" + $(element).text() + "/utxo";
				$.getJSON(bitpayUtxos, function(utxoData) {
					var totalSeen = 0;
					$.each(utxoData, function(index, utxo) {
						totalSeen += utxo.amount * 100000000;
					});
                    
                    totalSeen = totalSeen / 100000000;
                    
					$(element).attr('label', $(element).attr('label').replace(/\(\d*\.?\d*\WBTC\)/g, '') + ' (' + totalSeen + ' BTC)');
				});
			});
		},
		showGlideraTab: function(elementId) {
			//console.log("showGlideraTab");
			glidera.removeAllMessages();
			glidera.removeAllUncloseableMessages();
			var targetPage = $('#' + elementId);
			if (targetPage !== undefined && targetPage !== null) {
				$('.glideratab').hide();
				$('#loadingGif').show();
				glidera.getGlideraStorage(function(glideraStorage) {
					$('li>.glideralink').parent().removeClass('active');
					$('.glideralink[data-glideratab=' + elementId + ']').parent().addClass('active');
					var accessToken = glideraStorage['accessToken'];
					if (accessToken !== undefined) {
						if (elementId === 'glideraSetup') {
                            var glideraSetupIframe = $('#glideraSetupIframe');
                            glideraSetupIframe.hide();
							$('#loadingGif').show();
                            glideraSetupIframe.attr('src', GLIDERA_URL + "/user/setup?access_token=" + accessToken);
						} else if (elementId === 'glideraTransactions') {
                            var glideraTransactionsIframe = $('#glideraTransactionsIframe');
                            glideraTransactionsIframe.hide();
							$('#loadingGif').show();
                            glideraTransactionsIframe.attr('src', GLIDERA_URL + "/user/transactions?access_token=" + accessToken);
						} else {
							$('#loadingGif').hide();
							if (elementId === 'glideraSell') {
								glidera.updateAddressListWithBalance();
							}
							if (elementId === 'glideraSell' || elementId === 'glideraBuy') {
								glidera.glideraAPIEndpoint('user/status', 'GET', function(data) {
									if (data !== undefined && data !== null && data['userCanTransact'] !== undefined && data['userCanTransact'] === true) {
										$('#btnSell2FA').removeProp('disabled');
										$('#btnBuy2FA').removeProp('disabled');
									} else {
										glidera.addUncloseableMessage('alert-warning', null, 'Complete setup to enable buy/sell.');
										$('#btnSell2FA').prop('disabled', true);
										$('#btnBuy2FA').prop('disabled', true);
									}
								}, function() {
									glidera.addUncloseableMessage('alert-warning', null, 'Complete setup to enable buy/sell.');
									$('#btnSell2FA').prop('disabled', true);
									$('#btnBuy2FA').prop('disabled', true);
								});
							}
						}
					} else {
						$('#loadingGif').hide();
					}
					if (elementId === 'glideraRegister') {
						$('#glideraNavBarButton').hide();
					} else {
						$('#glideraNavBarButton').show();
					}
					var pageTitle = targetPage.data('pagetitle');
					var pageTitleElement = $('#glideraPageTitle');
					if (pageTitle !== undefined) {
						pageTitleElement.text(pageTitle);
						pageTitleElement.show();
					} else {
						pageTitleElement.hide();
                        pageTitleElement.text('');
					}
					targetPage.show();
				});
			}
		},
		checkOAuthCredentials: function() {
			//console.log("checkOAuthCredentials");
			$('.glideratab').hide();
			$('#loadingGif').show();
			glidera.getGlideraStorage(function(glideraStorage) {
				if (glideraStorage['accessToken'] !== undefined) {
					//console.log("checkOAuthCredentials access token found");
					glidera.validateAccessToken(glideraStorage['accessToken']);
				} else {
					//console.log("checkOAuthCredentials no credentials found");
					glidera.showOAuthPage();
				}
			});
		},
		showOAuthPage: function() {
			//console.log("showOAuthPage");
			glidera.showGlideraTab('glideraRegister');
		},
		showBuySell: function() {
			//console.log("showBuySell");
			glidera.showGlideraTab('glideraBuy');
		},
		showSetup: function() {
			//console.log("showSetup");
			glidera.showGlideraTab('glideraSetup');
		},
		loginOrRegister: function() {
			//console.log("loginOrRegister");
			chrome.windows.create({
				'url': GLIDERA_URL + '/oauth2/auth?client_id=' + TOKENLY_CLIENT_ID + '&response_type=code&scope=personal_info&required_scope=transact transaction_history&redirect_uri=' + REDIRECT_URI,
				'type': 'popup',
				'width': 400,
				'height': 615
			}, function(window) {});
		},
		validateAccessToken: function() {
			//console.log("validateAccessToken");
			glidera.glideraAPIEndpoint('oauth/token', 'GET', function() {
				glidera.checkSetup();
			}, function() {
				glidera.removeKey('accessToken', glidera.showOAuthPage);
			});
		},
		checkSetup: function() {
			//console.log("checkSetup");
			glidera.glideraAPIEndpoint('user/status', 'GET', function(data) {
				if (data !== undefined && data !== null && data['userCanTransact'] !== undefined && data['userCanTransact'] === true) {
					glidera.showBuySell();
				} else {
					glidera.showSetup();
				}
			}, function() {
				glidera.showSetup();
			});
		},
		getGlideraStorage: function(fCallback) {
			//console.log("getGlideraStorage");
			chrome.storage.local.get(GLIDERA_STORAGE_KEY, function(data) {
				if ($.isEmptyObject(data) || !data.hasOwnProperty(GLIDERA_STORAGE_KEY)) {
					fCallback({});
				} else {
					fCallback(data[GLIDERA_STORAGE_KEY]);
				}
			});
		},
		glideraAPIEndpoint: function(endpoint, type, fSuccess, fError, data, twoFactorAuthentication) {
			//console.log("glideraAPIEndpoint: " + type + " " + endpoint);
			glidera.getGlideraStorage(function(glideraStorage) {
				var ajaxObject = {
					url: GLIDERA_API_URL + endpoint,
					type: type,
					headers: {
						'Authorization': 'Bearer ' + glideraStorage['accessToken']
					},
					success: function(data) {
						if (fSuccess !== undefined && fSuccess !== null) {
							fSuccess(data);
						}
					},
					error: function(data) {
						if (fError !== undefined && fError !== null) {
							fError(data);
						}
					}
				};
				if (data !== undefined) {
					ajaxObject.dataType = 'json';
					ajaxObject.contentType = 'application/json';
					ajaxObject.data = JSON.stringify(data);
				}
				if (twoFactorAuthentication !== undefined && twoFactorAuthentication !== '') {
					ajaxObject.headers['2FA_CODE'] = twoFactorAuthentication;
				}
				$.ajax(ajaxObject);
			});
		},
		addKey: function(key, value, fCallback) {
			//console.log("save: [" + key + "]=" + value);
			glidera.getGlideraStorage(function(glideraStorage) {
				glideraStorage[key] = value;
				var saveObject = {};
				saveObject[GLIDERA_STORAGE_KEY] = glideraStorage;
				chrome.storage.local.set(saveObject, function() {
					if (fCallback !== undefined && fCallback !== null) {
						fCallback();
					}
				});
			});
		},
		removeKey: function(key, fCallback) {
			//console.log("delete: [" + key + "]");
			glidera.getGlideraStorage(function(glideraStorage) {
				delete glideraStorage[key];
				var saveObject = {};
				saveObject[GLIDERA_STORAGE_KEY] = glideraStorage;
				chrome.storage.local.set(saveObject, function() {
					if (fCallback !== undefined && fCallback !== null) {
						fCallback();
					}
				});
			});
		},
		addMessage: function(styleClass, strongMessage, message) {
			glidera.removeAllMessages();
			var div = $('<div class="alert ' + styleClass + ' alert-dismissible" role="alert" style="margin-top: 10px;margin-bottom: 10px;">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + (strongMessage !== undefined && strongMessage !== null && strongMessage !== '' ? '<strong>' + strongMessage + '</strong> ' : '') + message + '</div>');
			$("#glideraMessage").append(div);
		},
		addUncloseableMessage: function(styleClass, strongMessage, message) {
			glidera.removeAllMessages();
			var div = $('<div class="alert ' + styleClass + '" role="alert" style="margin-top: 10px;margin-bottom: 10px;">' + (strongMessage !== undefined && strongMessage !== null && strongMessage !== '' ? '<strong>' + strongMessage + '</strong> ' : '') + message + '</div>');
			$("#glideraUncloseableMessage").append(div);
		},
		removeAllMessages: function() {
			$("#glideraMessage").empty();
		},
		removeAllUncloseableMessages: function() {
			$("#glideraUncloseableMessage").empty();
		},
		formatBTC: function(value) {
			var theAmount = parseFloat(value);
			if (isNaN(theAmount)) {
				return "";
			} else {
				var aAmount = theAmount.toString().split(".");
				var bitcoin = "<i class='fa fa-btc' fa-1></i>";
				if (aAmount.length == 2 && aAmount[1].length > 4) {
					return "<nobr>" + bitcoin + theAmount.toFixed(Math.max(4, (theAmount.toString().split('.')[1] || []).length)) + "</nobr>";
				} else {
					return "<nobr>" + bitcoin + theAmount + "</nobr>";
				}
			}
		},
		formatUSD: function(price) {
			if (isNaN(parseFloat(price))) {
				return "";
			} else {
				return "<nobr><i class='fa fa-usd fa-1'></i>" + parseFloat(price).toFixed(2) + "</nobr>";
			}
		},
		formatDate: function(date) {
			var formattedDate = new Date(date);
			var month = formattedDate.getMonth() + 1;
			var day = formattedDate.getDate();
			var year = formattedDate.getFullYear().toString().substr(2, 2);
			return month + "/" + day + "/" + year;
		},
		updateBuyPrice: function(element) {
			//console.log("updateBuyPrice");
			var updateBasedOnUSD;
			if ($(element).attr('id') === 'buyUSD') {
				updateBasedOnUSD = true;
			} else if ($(element).attr('id') === 'buyBTC') {
				updateBasedOnUSD = false;
			}
			var ajaxData = {};
			if (updateBasedOnUSD) {
				var fiat = $('#buyUSD').val();
				var fiatFloat = parseFloat(fiat);
				if (!isNaN(fiatFloat) && fiatFloat >= 0.01) {
					ajaxData['fiat'] = fiat;
					glidera.startLoadingInput($('#buyBTC'));
				} else {
					$('#buyBTC').val('');
					$('#buySummaryBitcoin').html('');
					$('#buySummarySubtotal').html('');
					$('#buySummaryFee').html('');
					$('#buySummaryTotal').html('');
					return;
				}
			} else {
				var qty = $('#buyBTC').val();
				var qtytFloat = parseFloat(qty);
				if (!isNaN(qtytFloat) && qtytFloat >= 0.00000001) {
					ajaxData['qty'] = qty;
					glidera.startLoadingInput($('#buyUSD'));
				} else {
					$('#buyUSD').val('');
					$('#buySummaryBitcoin').html('');
					$('#buySummarySubtotal').html('');
					$('#buySummaryFee').html('');
					$('#buySummaryTotal').html('');
					return;
				}
			}
			glidera.glideraAPIEndpoint('prices/buy', 'POST', function(data) {
				//console.log("getBuyPrice success: " + JSON.stringify(data));
				glidera.removeAllMessages();
				glidera.endLoadingInput($('#buyBTC'));
				glidera.endLoadingInput($('#buyUSD'));
				$('.glideraNumber').removeClass('glideraloadinggif');
				if (updateBasedOnUSD) {
					$('#buyBTC').val(data['qty']);
				} else {
					$('#buyUSD').val(data['subtotal']);
				}
				$('#buySummaryBitcoin').html(glidera.formatBTC(data['qty']));
				$('#buySummarySubtotal').html(glidera.formatUSD(data['subtotal']));
				$('#buySummaryFee').html(glidera.formatUSD(data['fees']));
				$('#buySummaryTotal').html(glidera.formatUSD(data['total']));
				$('#ltbPriceFlipped').html('$'+data['price']);
				glidera.buyQuote = data['priceUuid'];

				if( glidera.buyTimer !== undefined) {
				  clearTimeout(glidera.buyTimer);
				}

				glidera.buyTimer = setTimeout(function() {
  				  if($('#buyUSD').is(":visible") && glidera.buyQuote === data['priceUuid'] ) {
  				    glidera.updateBuyPrice();
  				  }
				}, new Date(data['expires']) - new Date() - 15000);

				glidera.glideraAPIEndpoint('user/limits', 'GET', function(limitsData) {
					//console.log("user/limits success: " + JSON.stringify(limitsData));
					if (limitsData['transactDisabledPendingFirstTransaction']) {
						glidera.addMessage('alert-warning', null, "Your first transaction is currently pending. " + "The first transaction must clear before you can transact again.");
					} else if (limitsData !== undefined && limitsData['dailySellRemaining'] !== undefined && data['subtotal'] > limitsData['dailyBuyRemaining']) {
						glidera.addMessage('alert-warning', null, "Your buy is over your remaining daily limit of " + glidera.formatUSD(limitsData['dailyBuyRemaining']));
					}
				});
			}, function(data) {
				//console.log("getBuyPrice failure: " + JSON.stringify(data));
				glidera.endLoadingInput($('#buyBTC'));
				glidera.endLoadingInput($('#buyUSD'));
				if (data !== undefined && data['status'] == 400 && data['responseJSON'] !== undefined && data['responseJSON.code'] == 1101) {
					glidera.addMessage('alert-danger', null, "The purchase amount is too large, try a smaller amount.");
				} else {
					glidera.addMessage('alert-danger', null, "An error occured while getting a quote for your purchase, please try again.");
				}
			}, ajaxData);
		},
		startLoadingInput: function(element) {
			$(element).val('');
			$(element).removeAttr('placeholder');
			$(element).addClass('glideraloadinggif');
		},
		endLoadingInput: function(element) {
			$(element).removeClass('glideraloadinggif');
			$(element).attr('placeholder', '0.00');
		},
		buyPrecheck: function() {
			//console.log("buyPrecheck");
			glidera.removeAllMessages();
			var errorMessage = '';
			var usd = $('#buyUSD').val();
			var btc = $('#buyBTC').val();
			var address = $('#glideraBuyAddress').val();
			if (isNaN(parseFloat(usd)) && isNaN(parseFloat(btc))) {
				errorMessage += "Please enter an amount to purchase";
			} else if (isNaN(parseFloat(usd))) {
				errorMessage += "Please enter a valid USD amount";
			} else if (isNaN(parseFloat(btc))) {
				errorMessage += "Please enter a valid BTC amount";
			} else if (address === undefined || address === '') {
				errorMessage += "Please select an address";
			} else if (parseFloat(usd) <= 0 || parseFloat(btc) <= 0) {
				errorMessage += "Purchase amount is too small";
			}
			if (errorMessage !== '') {
				glidera.addMessage('alert-danger', null, errorMessage);
			} else {
				glidera.glideraAPIEndpoint('user/limits', 'GET', function(data) {
					//console.log("user/limits success: " + JSON.stringify(data));
					if (data !== undefined && data['dailyBuyRemaining'] !== undefined) {
						if (data['transactDisabledPendingFirstTransaction']) {
							glidera.addMessage('alert-danger', null, "Your first transaction is currently pending. " + "The first transaction must clear before you can transact again.");
						} else if (parseFloat(usd) > data['dailyBuyRemaining']) {
							glidera.addMessage('alert-danger', null, "Your purchase is over your remaining daily limit of " + glidera.formatUSD(data['dailyBuyRemaining']));
						} else {
							glidera.sendBuy2FA();
							$('#buy2FABTC').html(glidera.formatBTC(btc));
							$('#buy2FAUSD').html(glidera.formatUSD(usd));
							$('#buy2FA').modal('show');
						}
					} else {
						glidera.addMessage('alert-danger', null, "An error occured while preparing your purchase, please try again");
					}
				}, function(data) {
					//console.log("user/limits error: " + JSON.stringify(data));
					glidera.addMessage('alert-danger', null, "An error occured while preparing your purchase, please try again.");
				});
			}
		},
		buy: function() {
			//console.log("buy");
			$('#btnBuyBTC').prop('disabled', true);
			var ajaxData = {};
			ajaxData['destinationAddress'] = $('#glideraBuyAddress').val();
			ajaxData['qty'] = $('#buyBTC').val();
			ajaxData['priceUuid'] = glidera.buyQuote;
			ajaxData['useCurrentPrice'] = false;
            var buy2FACode = $('#buy2FACode');
			glidera.glideraAPIEndpoint('buy', 'POST', function(data) {
				//console.log("buy success: " + JSON.stringify(data));
				glidera.addMessage('alert-info', "Success!", "Your bitcoin should be delivered on " + glidera.formatDate(data['estimatedDeliveryDate']));
				$('#btnBuyBTC').prop('disabled', false);
				$('#buyUSD').val('');
				$('#buyBTC').val('');
				glidera.updateBuyPrice();
			}, function(data) {
				//console.log("buy failure: " + JSON.stringify(data));
				if (data !== undefined && data['responseJSON'] !== undefined && data['responseJSON']['code'] == 2006) {
					glidera.addMessage('alert-danger', null, "Invalid 2FA code, please try again.");
				} else if (data !== undefined && data['responseJSON'] !== undefined && data['responseJSON']['code'] == 3114) {
					glidera.addMessage('alert-danger', null, "The market demand for Bitcoin is too high.  Please try again later.");
				} else {
					glidera.addMessage('alert-danger', null, "An error occured while processing your purchase, please try again.");
				}
				$('#btnBuyBTC').prop('disabled', false);
			}, ajaxData, buy2FACode.val());
            buy2FACode.val('');
			$('#buy2FA').modal('hide');
		},
		updateSellPrice: function(element) {
			//console.log("updateSellPrice");
			var updateBasedOnUSD;
			if ($(element).attr('id') === 'sellUSD') {
				updateBasedOnUSD = true;
			} else if ($(element).attr('id') === 'sellBTC') {
				updateBasedOnUSD = false;
			}
			var ajaxData = {};
			if (updateBasedOnUSD) {
				var fiat = $('#sellUSD').val();
				var fiatFloat = parseFloat(fiat);
				if (!isNaN(fiatFloat) && fiatFloat >= 0.01) {
					glidera.startLoadingInput($('#sellBTC'));
					ajaxData['fiat'] = fiat;
				} else {
					$('#sellBTC').val('');
					$('#sellSummaryBitcoin').html('');
					$('#sellSummarySubtotal').html('');
					$('#sellSummaryFee').html('');
					$('#sellSummaryTotal').html('');
					return;
				}
			} else {
				var qty = $('#sellBTC').val();
				var qtytFloat = parseFloat(qty);
				if (!isNaN(qtytFloat) && qtytFloat >= 0.00000001) {
					glidera.startLoadingInput($('#sellUSD'));
					ajaxData['qty'] = qty;
				} else {
					$('#sellUSD').val('');
					$('#sellSummaryBitcoin').html('');
					$('#sellSummarySubtotal').html('');
					$('#sellSummaryFee').html('');
					$('#sellSummaryTotal').html('');
					return;
				}
			}
			glidera.glideraAPIEndpoint('prices/sell', 'POST', function(data) {
				//console.log("getSellPrice success: " + JSON.stringify(data));
				glidera.removeAllMessages();
				glidera.endLoadingInput($('#sellBTC'));
				glidera.endLoadingInput($('#sellUSD'));
				if (updateBasedOnUSD) {
					$('#sellBTC').val(data['qty']);
				} else {
					$('#sellUSD').val(data['subtotal']);
				}
				$('#sellSummaryBitcoin').html(glidera.formatBTC(data['qty']));
				$('#sellSummarySubtotal').html(glidera.formatUSD(data['subtotal']));
				$('#sellSummaryFee').html(glidera.formatUSD(data['fees']));
				$('#sellSummaryTotal').html(glidera.formatUSD(data['total']));
				$('#ltbPriceFlipped').html('$'+data['price']);
				glidera.sellQuote = data['priceUuid'];

				if( glidera.sellTimer !== undefined) {
				  clearTimeout(glidera.sellTimer);
				}

				glidera.sellTimer = setTimeout(function() {
  				  if($('#sellUSD').is(":visible") && glidera.sellQuote === data['priceUuid'] ) {
  				    glidera.updateSellPrice();
  				  }
				}, new Date(data['expires']) - new Date() - 15000);

				glidera.glideraAPIEndpoint('user/limits', 'GET', function(limitsData) {
					//console.log("user/limits success: " + JSON.stringify(limitsData));
					if (limitsData['transactDisabledPendingFirstTransaction']) {
						glidera.addMessage('alert-warning', null, "Your first transaction is currently pending. " + "The first transaction must clear before you can transact again.");
					} else if (limitsData !== undefined && limitsData['dailySellRemaining'] !== undefined && data['subtotal'] > limitsData['dailySellRemaining']) {
						glidera.addMessage('alert-warning', null, "Your sell is over your remaining daily limit of " + glidera.formatUSD(limitsData['dailySellRemaining']));
					} else {
						var fromAddress = $('#glideraSellAddress').val();
						var bitpayUtxos = "https://" + (getNetwork().name === 'testnet' ? 'test-' : '') + INSIGHT_SERVER + "/api/addr/" + fromAddress + "/utxo";
						$.getJSON(bitpayUtxos, function(utxoData) {
							//console.log(utxoData);
							var totalSeen = 0;
							$.each(utxoData, function(index, utxo) {
								totalSeen += utxo.amount;
							});
							if (totalSeen < data['qty']) {
								glidera.addMessage('alert-warning', null, "This address has insufficient funds to sell " + glidera.formatBTC(data['qty']) + ", current balance is " + glidera.formatBTC(totalSeen));
							}
						});
					}
				});
			}, function(data) {
				//console.log("getSellPrice failure: " + JSON.stringify(data));
				glidera.endLoadingInput($('#sellBTC'));
				glidera.endLoadingInput($('#sellUSD'));
				if (data !== undefined && data['status'] == 400 && data['responseJSON'] !== undefined && data['responseJSON']['code'] == 1101) {
					glidera.addMessage('alert-danger', null, "The sell amount is too large, try a smaller amount.");
				} else {
					glidera.addMessage('alert-danger', null, "An error occured while getting a quote for your sell, please try again.");
				}
			}, ajaxData);
		},
		sellPrecheck: function() {
			//console.log("sellPrecheck");
			glidera.removeAllMessages();
			var errorMessage = '';
			var usd = $('#sellUSD').val();
			var btc = $('#sellBTC').val();
			var address = $('#glideraSellAddress').val();
			if (isNaN(parseFloat(usd)) && isNaN(parseFloat(btc))) {
				errorMessage += "Please enter an amount to sell";
			} else if (isNaN(parseFloat(usd))) {
				errorMessage += "Please enter a valid USD amount";
			} else if (isNaN(parseFloat(btc))) {
				errorMessage += "Please enter a valid BTC amount";
			} else if (address === undefined || address === '') {
				errorMessage += "Please select an address";
			} else if (parseFloat(usd) <= 0 || parseFloat(btc) <= 0) {
				errorMessage += "Sell amount is too small";
			}
			if (errorMessage !== '') {
				glidera.addMessage('alert-danger', null, errorMessage);
			} else {
				glidera.glideraAPIEndpoint('user/limits', 'GET', function(data) {
					//console.log("user/limits success: " + JSON.stringify(data));
					if (data !== undefined && data['dailySellRemaining'] !== undefined) {
						if (data['transactDisabledPendingFirstTransaction']) {
							glidera.addMessage('alert-danger', null, "Your first transaction is currently pending. " + "The first transaction must clear before you can transact again.");
						} else if (parseFloat(usd) > data['dailySellRemaining']) {
							glidera.addMessage('alert-danger', null, "Your sell is over your remaining daily limit of " + glidera.formatUSD(data['dailySellRemaining']));
						} else {
							//All the prechecks look good, try creating the transaction
							glidera.createTransaction(btc, address, function(sellTransaction) {
								glidera.sellTransaction = sellTransaction;
								glidera.sendSell2FA();
								$('#sell2FABTC').html(glidera.formatBTC(btc));
								$('#sell2FAUSD').html(glidera.formatUSD(usd));
								$('#sell2FA').modal('show');
							});
						}
					} else {
						glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again");
					}
				}, function(data) {
					//console.log("user/limits error: " + JSON.stringify(data));
					glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again.");
				});
			}
		},
		createTransaction: function(amountToSend, fromAddress, fSuccess) {
			//console.log("createTransaction from " + fromAddress);
			glidera.glideraAPIEndpoint('user/create_sell_address', 'GET', function(data) {
				if (data !== undefined && data['sellAddress'] !== undefined) {
					//Successful created sell address
					//console.log("user/create_sell_address success: " + JSON.stringify(data));
					var transaction = new bitcore.Transaction().to(data['sellAddress'], bitcore.Unit.fromBTC(amountToSend).toSatoshis()).change(fromAddress);
					if (transaction._hasDustOutputs()) {
						glidera.addMessage('alert-danger', null, "The bitcoin amount is too small, you must sell at least " + glidera.formatBTC(0.00000543));
						return;
					}
					var bitpayUtxo = "https://" + (getNetwork().name === 'testnet' ? 'test-' : '') + INSIGHT_SERVER + "/api/addr/" + fromAddress + "/utxo";
					$.getJSON(bitpayUtxo, function(data) {
						//console.log(data);
						data.sort(function(a, b) {
							return b.amount - a.amount;
						});

						var totalSeen = 0;
						$.each(data, function(index, utxo) {
							totalSeen += bitcore.Unit.fromBTC(utxo.amount).toSatoshis();
                            var change = transaction._getUnspentValue() - transaction.getFee();
							if (transaction._getUnspentValue() >= transaction.getFee() && !transaction._hasDustOutputs() && (change === 0 || change > bitcore.Transaction.DUST_AMOUNT)) {
								//We already have enough
								return;
							}
							transaction.from(utxo);
							//console.log("found " + (utxo.amount * 100000000) + " satoshis, still missing " + (0 - transaction._getUnspentValue()) + " satoshis");
						});

                        var change = transaction._getUnspentValue() - transaction.getFee();
						if (transaction._getUnspentValue() < 0) {
                            //Insufficient funds gatherered
							var total = bitcore.Unit.fromSatoshis(totalSeen).toBTC();
							glidera.addMessage('alert-danger', null, "This address has insufficient funds to sell " + glidera.formatBTC(amountToSend) + ", current balance is " + glidera.formatBTC(total));
						} else if (transaction._getUnspentValue() < transaction.getFee()) {
                            //Sufficient funds gathered for output, but not for fee
                            var fee = bitcore.Unit.fromSatoshis(transaction.getFee()).toBTC();
                            glidera.addMessage('alert-danger', null, "A transaction fee of " + glidera.formatBTC(fee) + " is required, try selling a lower amount.");
                        } else if (transaction._hasDustOutputs() ) {
                            //Output results in dust
                            glidera.addMessage('alert-danger', null, "The amount to sell is below the minimum threshold.");
                        } else if (change !== 0 && change <= bitcore.Transaction.DUST_AMOUNT) {
							//change results in dust
							glidera.addMessage('alert-danger', null, "The change from this sell is below the minimum threshold.");
						} else {
                            //We have collected enough bitcoin
                            transaction.sign(getprivkey(fromAddress, $("#newpassphrase").html()));
                            if (fSuccess !== undefined) {
                                fSuccess(transaction);
                            }
                        }
					}).fail(function(jqxhr, textStatus, error) {
						glidera.addMessage('alert-danger', null, "An error occured while confirming your balance, please try again.");
					});
				} else {
					//No sell address was returned
					//console.log("user/create_sell_address error: " + JSON.stringify(data));
					glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again");
				}
			}, function(data) {
				//An error happened while requesting sell address
				//console.log("user/create_sell_address error: " + JSON.stringify(data));
				glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again");
			});
		},
		sell: function() {
			//console.log("sell");
			$('#btnSellBTC').prop('disabled', true);
			var refundAddress = $('#glideraSellAddress').val();
			if (glidera.sellTransaction === undefined) {
				glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again");
			}
			var signedTransaction = glidera.sellTransaction.serialize(false);
			var ajaxData = {};
			ajaxData['refundAddress'] = refundAddress;
			ajaxData['signedTransaction'] = signedTransaction;
			ajaxData['priceUuid'] = glidera.sellQuote;
			ajaxData['useCurrentPrice'] = false;
            var sell2FACode = $('#sell2FACode');
			glidera.glideraAPIEndpoint('sell', 'POST', function(data) {
				//console.log("sell success: " + JSON.stringify(data));
				glidera.addMessage('alert-info', "Success!", "Your USD should be delivered on " + glidera.formatDate(data['estimatedDeliveryDate']));
				$('#btnSellBTC').prop('disabled', false);
				$('#sellUSD').val('');
				$('#sellBTC').val('');
				glidera.updateSellPrice();
				glidera.updateAddressListWithBalance();
			}, function(data) {
				//console.log("sell failure: " + JSON.stringify(data));
				if (data !== undefined && data['responseJSON'] !== undefined && data['responseJSON']['code'] == 2006) {
					glidera.addMessage('alert-danger', null, "Invalid 2FA code, please try again.");
				} else if (data !== undefined && data['responseJSON'] !== undefined && data['responseJSON']['code'] == 5002) {
					glidera.addMessage('alert-danger', null, "An error occured while publishing your transaction, please try again.");
				} else {
					glidera.addMessage('alert-danger', null, "An error occured while processing your sell, please try again.");
				}
				$('#btnBuyBTC').prop('disabled', false);
				$('#btnSellBTC').prop('disabled', false);
			}, ajaxData, sell2FACode.val());
            sell2FACode.val('');
			$('#sell2FA').modal('hide');
		},
		sendBuy2FA: function() {
			$('#buy2FASMS').hide();
			$('#buy2FAAuthenticator').hide();
			glidera.glideraAPIEndpoint('authentication/get2faCode', 'GET', function(data) {
				//console.log(data);
				if (data['mode'] === "SMS") {
					$('#buy2FASMS').show();
				} else if (data['mode'] === "AUTHENTICATOR") {
					$('#buy2FAAuthenticator').show();
				}
			}, function() {
				glidera.addMessage('alert-danger', null, "An error occured while preparing your purchase, please try again");
			});
		},
		sendSell2FA: function() {
			$('#sell2FASMS').hide();
			$('#sell2FAAuthenticator').hide();
			glidera.glideraAPIEndpoint('authentication/get2faCode', 'GET', function(data) {
				//console.log(data);
				if (data['mode'] === "SMS") {
					$('#sell2FASMS').show();
				} else if (data['mode'] === "AUTHENTICATOR") {
					$('#sell2FAAuthenticator').show();
				}
			}, function() {
				glidera.addMessage('alert-danger', null, "An error occured while preparing your sell, please try again");
			});
		}
	};
}
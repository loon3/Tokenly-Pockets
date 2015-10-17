window.addEventListener('load', onLoad);

function onLoad() {
	var parameters = [], hash;
	var querystring = document.URL.split('?')[1];
	if (querystring !== undefined) {
		querystring = querystring.split('&');
		for (var i = 0; i < querystring.length; i++) {
			hash = querystring[i].split('=');
			parameters.push(hash[1]);
			parameters[hash[0]] = hash[1];
		}
	}

	console.log(JSON.stringify(parameters));

	var grantCode = parameters['code'];

	if (grantCode !== undefined) {
		tradeGrantCodeForAccessToken(grantCode);
	} else if (parameters['error'] === 'access_denied') {
		self.close();
		$('#denied').show();
	} else {
		$('#error').show();
	}

	$(document).on('click', '.btn', function() {
		self.close();
	});

}

function tradeGrantCodeForAccessToken(grantCode) {
	console.log("tradeGrantCodeForAccessToken");

	accessTokenRequest(grantCode, REDIRECT_URI, function(data) {
		// chrome.extension.sendRequest({
		// redirect: 'popup.html'
		// });
		$('#success').show();
	}, function(data) {
		$('#error').show();
	});
}

function accessTokenRequest(grantCode, redirect_uri, fSuccess, fError) {
	$.ajax({
		url : GLIDERA_API_URL + "oauth/token",
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json',
		data : JSON.stringify({
			"grant_type" : "authorization_code",
			"code" : grantCode,
			"redirect_uri" : redirect_uri,
			"client_id" : TOKENLY_CLIENT_ID,
			"client_secret" : TOKENLY_SECRET
		}),
		success : function(data) {
			console.log("tradeGrantCodeForAccessToken success"
					+ JSON.stringify(data));
			glidera.addKey("accessToken", data.access_token, function() {
				if (fSuccess !== undefined && fSuccess !== null) {
					fSuccess(data);
				}
			});
		},
		error : function(data) {
			console.log("tradeGrantCodeForAccessToken failure: "
					+ JSON.stringify(data));
			glidera.removeKey("accessToken", function() {
				glidera.removeKey("grantCode", function() {
					if (fError !== undefined && fError !== null) {
						fError(data);
					}
				});
			});

		}
	});
}
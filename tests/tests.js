/**
 * All unit tests
 */

(function (window, document) {

	var API_KEY = '930654c3382ff89252affc02b485ae094f97de6d',
		PROXY_URL = 'proxy.php',
		ZIPCODE = '4814DC',
		STATIC_REPSONSE = {
			"street": "Reduitlaan",
			"postcode": "4814DC",
			"town": "Breda",
			"municipality": "Breda",
			"province": "Noord-Brabant",
			"latitude": 51.5906875,
			"longitude": 4.7621075,
			"x": 111682,
			"y": 400390
		},

		// Nifty IE detection
		// Courtesy of James Padolsey
		ie = (function(){
		
			var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');
		
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);
		
			return v > 4 ? v : undef;
		
		}());

	window.log = function () {
		if ( typeof window.console === 'object' ) {
			console.log((arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments)));
		}
	};

	QUnit.module('Fundamentals');

	QUnit.test('Setting the API key', function () {
		try {
			$.papi.setApiKey();
		} catch(e) {
			ok( e.message !== '', '.setApiKey throws an error when not passing a key' );
		}

		try {
			$.papi.setApiKey(123456789);
		} catch(e) {
			ok( e.message !== '', '.setApiKey throws an error when passing anything other than a string' );
		}

		$.papi.setApiKey( API_KEY );
		strictEqual( $.papi.apiKey, API_KEY, 'Successfully stored API key' );
	});

	QUnit.test('Setting a proxy URL (preferably for IE)', function () {
		$.papi.proxy('');
		ok( !$.papi.proxyUrl, 'Passing an empty string as URL won\'t work' );

		$.papi.proxy( PROXY_URL );
		strictEqual( $.papi.proxyUrl, PROXY_URL, 'The proxy URL is successfully stored' );

		// Reset proxy URL
		$.papi.proxyUrl = null;
	});

	QUnit.test('Internal caching', function () {
		try {
			$.papi.cache.setItem( ZIPCODE, JSON.stringify(STATIC_REPSONSE) );
			ok( $.papi.isCached(ZIPCODE), 'Zipcode and corresponding data successfully cached (.isCached)' );

			$.papi.lookup( ZIPCODE );
			strictEqual($.papi.activeZipcode, ZIPCODE, 'Active zipcode successfully set' );

			// Reset cache
			$.papi.cache.clear();
		} catch(e) {}
	});

	QUnit.module('Plugin');

	QUnit.test('Basic plugin call', function (assert) {
		var done = assert.async();

		assert.expect(2);

		$.papi.setApiKey( API_KEY );

		$('#zipcode1').papi({
			placeholders: {
				street: $('#street1')[0],
				town: $('#town1')[0]
			}
		});

		$('#zipcode1').val('4814DC').trigger('change'); // Trigger API call

		setTimeout(function () {
			assert.strictEqual( $('#street1')[0].value, 'Reduitlaan', 'Successfully fetched corresponding street' );
			assert.strictEqual( $('#town1')[0].value, 'Breda', 'Successfully fetched corresponding town' );
			done();
		}, 1500);

		$.papi.cache.clear();		
	});

	QUnit.test('Basic plugin call based on house number', function (assert) {
		var done = assert.async();

		$.papi.cache.clear();
		$.papi.setApiKey( API_KEY );

		$('#housenr').papi({
			source: $('#zipcode4'),
			event: 'change',
			placeholders: {
				street: $('#street4')[0],
				town: $('#town4')[0]
			}
		});

		$('#zipcode4').val('4814DC');
		$('#housenr').val('29').trigger('change'); // Trigger API call

		setTimeout(function () {
			assert.ok( $.papi.cache.getItem('4814DC').indexOf('house_number') !== -1, 'House number is successfully passed as argument' );
			assert.strictEqual( $('#street4')[0].value, 'Reduitlaan', 'Successfully fetched corresponding street' );
			assert.strictEqual( $('#town4')[0].value, 'Breda', 'Successfully fetched corresponding town' );
			done();
		}, 1500);
	});

	QUnit.test('Request BAG info via plugin call', function (assert) {
		var done = assert.async();

		$.papi.cache.clear();

		$('#housenr').papi({
			bag: true,
			source: $('#zipcode4'),
			event: 'change',
			placeholders: {
				street: $('#street4')[0],
				town: $('#town4')[0]
			}
		});

		$('#zipcode4').val('4814DC');
		$('#housenr').val('29').trigger('change'); // Trigger API call

		setTimeout(function () {
			var res = $.parseJSON( $.papi.cache.getItem('4814DC') );
			assert.ok( res.hasOwnProperty('bag'), 'Successfully received BAG info in API response' );
			assert.ok( res.bag.id, 'Successfully received BAG id data' );
			assert.ok( res.bag.purpose, 'Successfully received BAG purpose data' );
			assert.ok( res.bag.type, 'Successfully received BAG type data' );
			done();
		}, 1500);
	});

	QUnit.module('Static API');

	QUnit.test('Basic API lookup', function () {
		$.papi.cache.clear();
		expect(3);
		stop();

		$.papi.setApiKey( API_KEY );

		$.papi
			.lookup( ZIPCODE )
			.ok(function (data) {
				ok( 1, 'The .ok callback is successfully dispatched' );
				ok( this.hasOwnProperty('setValue'), 'The `this` context of the .ok callback points to the static API' );
				strictEqual( typeof data, 'object', 'The first argument in the callback is an object' )
				start();	
			});
	});

	QUnit.test('Basic API lookup with an invalid zipcode', function (assert) {
		var done = assert.async();
		
		$.papi.cache.clear();
		$.papi.setApiKey( API_KEY );

		$.papi
			.lookup( '1337AA' )
			.notfound(function (xhr) {
				assert.ok( 1, 'The .notfound callback is successfully dispatched' );
				assert.ok( this.hasOwnProperty('setValue'), 'The `this` context of the .notfound callback points to the static API' );
				done();
			});	
	});

	QUnit.module('Validation');

	QUnit.test('Validating several zipcode deviations', function (assert) {
		assert.ok( $.papi.isValidZipcode('4814 DC'), 'Passing a zipcode with space' );
		assert.ok( $.papi.isValidZipcode('4814DC'), 'Passing a zipcode without space' );
		assert.ok( !$.papi.isValidZipcode('XX14DC'), 'Passing an invalid zipcode should return false' );
	});

}(window, window.document));
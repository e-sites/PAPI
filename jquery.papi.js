/*
 *  Project: PAPI - Postcode API
 *  A lightweight jQuery plugin that makes working with the Postcode API (@postcodeapi) easy as pie.
 *
 *  @author  : Boye Oomens <github@e-sites.nl>
 *  @version : 0.5.2
 *  @license : MIT
 *  @see     : http://api.postcodeapi.nu/docs/
 *  @see     : http://github.e-sites.nl/papi/
 */

;(function ($, window, document, undefined) {

	'use strict';

	// Create the defaults once
	var pluginName = 'papi',
		defaults = {
			event: 'change',
			source: null,
			placeholders: {},
			bag: false
		},

		// Don't change this, the API only accepts GET requests,
		// this counts also for the datatype
		ajaxSetup = {
			type: 'GET',
			dataType: 'json',
			crossDomain: true // FF needs this
		},

		// Zipcode regular expression
		reZipcode = '^[1-9][0-9]{3} ?[a-zA-Z]{2}$',

		// Available properties in the repsonse.resource object
		props = [
			'latitude', 'longitude', 'municipality', 'postcode', 'province',
			'street', 'town', 'house_number', 'x', 'y', 'bag'
		],

		// Misc constants
		API_URL = 'https://api.postcodeapi.nu/',
		BAG_PARAM = '?view=bag';

	/**
	 * Validates the response data and is called if the request succeeded.
	 *
	 * @param {object} body
	 * @private
	 */
	function _validateResponse(body) {
		if ( typeof body === 'string' ) {
			body = JSON.parse(body);
		}
		if ( body.hasOwnProperty('success') && body.hasOwnProperty('resource') ) {
			_createResponse(body);
		}
	}

	/**
	 * Handles the data sent back from the server and invokes the appropriate callback
	 * Also, stores fetched data in cache
	 *
	 * @param {object}  body The actual response body
	 * @param {Boolean} sim whether we are simulating a response
	 * @private
	 */
	function _createResponse(body, sim) {
		if ( body.success ) {
			if ( !sim ) {
				$.papi.cache.setItem( $.papi.activeZipcode, JSON.stringify(body.resource) );
			}
			$.papi._ok.apply($.papi, [body.resource]);
		}
	}

	/**
	 * Handles failed requests
	 * Note: you should consider to log this kind of errors externally
	 *
	 * @private
	 */
	function _handleError(xhr) {
		var error;

		switch (xhr.status) {
		case 401:
			error = 'authorization required, please check your api-key';
			break;
		case 0:
		case 404:
			error = 'no additional data found';
			if ( $.papi._notfound ) {
				return $.papi._notfound.apply($.papi, [xhr]);
			}
			break;
		case 500:
			error = 'server error, shit has hit the fan yo! Contact @postcodeapi';
			break;
		}

		throw new Error('PAPI error: ' + error);
	}

	/**
	 * Public (static) API
	 */
	$.papi = {

		/**
		 * OK callback
		 *
		 * @type {Function}
		 */
		_ok: null,

		/**
		 * Notfound callback
		 *
		 * @type {Function}
		 */
		_notfound: null,

		/**
		 * API key
		 *
		 * @type {String}
		 */
		apiKey: null,

		/**
		 * Proxy URL (can be used for IE)
		 *
		 * @type {String}
		 */
		proxyUrl: null,

		/**
		 * Feature detect + local reference (courtesy of Mathias Bynens)
		 * Used for internal caching based on zipcode
		 *
		 * @type {Object}
		 */
		cache: (function () {
			var uid = new Date(),
				storage,
				result;
			try {
				(storage = window.localStorage).setItem(uid, uid);
				result = storage.getItem(uid) == uid;
				storage.removeItem(uid);
				return result && storage;
			} catch(e) {}
		}()),

		/**
		 * Small helper to see if the given zipcode is cached
		 *
		 * @param  {String}  zipcode
		 * @return {Boolean}
		 */
		isCached: function (zipcode) {
			return (this.cache.getItem(zipcode));
		},

		/**
		 * Zipcode that is used in last API call
		 * @type {String}
		 */
		activeZipcode: null,

		/**
		 * Guess what, it sets the API key
		 *
		 * @param  {String|Object} key
		 * @return {Object} $.papi
		 */
		setApiKey: function (key) {
			if ( !key || key.constructor !== String ) {
				throw new Error('PAPI error: no valid api-key given');
			}

			this.apiKey = key;

			$.extend(ajaxSetup, {
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Api-Key', key);
				}
			});

			return this;
		},

		/**
		 * Sets proxy location
		 *
		 * @param  {String} url location of the proxy file
		 * @return {Object} $.papi
		 */
		proxy: function (url) {
			if ( url && typeof url === 'string' ) {
				this.proxyUrl = url;
			}
			return this;
		},

		/**
		 * Initiates the actual request to the API
		 * If there is a matching resultset in the cache, it'll return it
		 * Also, a small check is performed to see if we're dealing with a valid zipcode
		 *
		 * @param  {String} zipcode
		 * @param  {String} houseNr
		 * @param  {Boolean} bag
		 * @return {Object} $.papi
		 */
		lookup: function (zipcode, houseNr, bag) {
			var zip = zipcode.replace(/\s+/g, ''),
				url = API_URL + [zip, houseNr].join('/') + (bag ? '/' + BAG_PARAM : '');

			this.activeZipcode = zip;

			if ( this.isCached(zip) ) {
				return this;
			}

			if ( !zip || !this.isValidZipcode( zip ) ) {
				return this;
			}

			if ( this.proxyUrl ) {
				url = this.proxyUrl + '?' + $.param({zipcode: zip, houseNr: houseNr, bag: bag, apikey: this.apiKey});
				ajaxSetup.crossDomain = false;
			}

			$.extend(ajaxSetup, {
				url: url
			});

			$.ajax(ajaxSetup)
				.success( _validateResponse )
				.error( _handleError );

			return this;
		},

		/**
		 * Simply stores the 'OK' callback
		 * When validating the response we decide if it needs to be invoked
		 *
		 * @param  {Function} callback
		 * @return {Object} $.papi
		 */
		ok: function (callback) {
			if ( callback && $.isFunction(callback) ) {
				this._ok = callback;
				if ( this.isCached( this.activeZipcode ) ) {
					_createResponse({
						success: true,
						resource: JSON.parse( this.cache.getItem( this.activeZipcode ) )
					}, true);
				}
			}
			return this;
		},

		/**
		 * Simply stores the 'notfound' callback
		 * It is invoked when we get a 404 as answer from the API
		 *
		 * @param  {Function} callback
		 * @return {Object} $.papi
		 */
		notfound: function (callback) {
			if ( callback && $.isFunction(callback) ) {
				this._notfound = callback;
			}
			return this;
		},

		/**
		 * Sets the cached value to the given placeholder (HTMLElement) based on the given key
		 *
		 * @param  {[type]} key         key that corresponds with the data
		 * @param  {[type]} placeholder target element
		 * @return {Object} $.papi
		 */
		setValue: function (key, placeholder) {
			if ( !placeholder ) {
				return this;
			}
			if ( placeholder.nodeName.toLowerCase() === 'input' ) {
				placeholder.value = JSON.parse(this.cache.getItem(this.activeZipcode))[key];
			}
			return this;
		},

		/**
		 * Fills placeholders with data
		 * The keys of the placeholders should map to the available properties
		 *
		 * @param  {Object} placeholders object with placeholders
		 * @return {Object} $.papi
		 */
		setValues: function (placeholders) {
			var i = props.length;
			while (i--) {
				if ( placeholders.hasOwnProperty(props[i]) ) {
					this.setValue( props[i], placeholders[props[i]] );
				}
			}
			return this;
		},

		/**
		 * Runs the given zipcode against a regular expression
		 *
		 * @param  {String} zipcode
		 * @return {Boolean} whether the zipcode is valid or not
		 */
		isValidZipcode: function (zipcode) {
			return (new RegExp(reZipcode)).test(zipcode);
		}

	};

	/**
	 * Plugin wrapper
	 *
	 * @param  {Object} options custom plugin settings
	 * @return {Object} jQuery wrapped set
	 */
	$.fn[pluginName] = function (options) {
		var self = this;

		return self.each(function () {
			var o = $.extend({}, defaults, options);

			// Small to check see if the api-key is already set
			if ( !$.papi.apiKey ) {
				throw new Error('PAPI error: no valid api-key given');
			}

			// We use event delegation over the traditional event listener,
			// this way we are prepared for live HTML as well
			$(document).on(o.event, self.selector, function () {
				var zipcode = this.value,
					houseNr;

				// If there is a zipcode source passed as option
				// we know we're dealing with a house number as main target
				if ( o.source ) {
					zipcode = (o.source.constructor === HTMLInputElement ? o.source.value : $(o.source).val());
					houseNr = this.value;
				}

				$.papi
					.lookup( zipcode, houseNr, o.bag )
					.ok(function () {
						this.setValues( o.placeholders );
					});
			});
		});
	};

})(jQuery, window, document);

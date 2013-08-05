/**
 * All events needed for the demonstrations
 */

(function (window, document, $) {

	'use strict';

	$(document).ready(function () {

		// Needed for proper authorization
		$.papi.setApiKey('930654c3382ff89252affc02b485ae094f97de6d');

		// Most basic usage
		$('#zipcode1').papi({
			event: 'change',
			placeholders: {
				street: $('#street1')[0],
				town: $('#town1')[0]
			}
		});
		
		// Custom stuff
		$(document)

			// Second example: listen for submit, do a lookup and handle data
			.on('click', '#example-2', function (e) {
				var $elem = $('#zipcode2'),
					api = $.papi; // internal reference

				api
					.lookup( $elem[0].value )
					.ok(function (data) {
						this
							.setValue('street', $('#street2')[0])
							.setValue('town', $('#town2')[0]);
					})
					.notfound(function (data) {
						$('#notfound').html('Sorry man, we have found nothing...');
					});
			})

			// Third example: output full API response after onchange
			.on('change', '#zipcode3', function () {
				$.papi
					.lookup( this.value )
					.ok(function (data) {
						$('#output').html( JSON.stringify(data) ).removeAttr('hidden');
					})
					.notfound(function (data) {
						$('#output').html( JSON.stringify(data) ).removeAttr('hidden');
					});
			});

			// Fourth example: fetch data based on zipcode and house number
			$('#housenr').papi({
				source: $('#zipcode4')[0],
				event: 'change',
				placeholders: {
					street: $('#street4')[0],
					town: $('#town4')[0]
				}
			});

			// Fifth example: fetch BAG data
			$('#housenr2').on('change', function () {
				$.papi
					.lookup($('#zipcode5')[0].value, this.value, true)
					.ok(function (data) {
						this
							.setValue('street', $('#street5')[0])
							.setValue('town', $('#town5')[0]);

						$('#bag-output').html( JSON.stringify(data.bag) ).removeAttr('hidden');
					});
			});

	});

}(window, window.document, jQuery));
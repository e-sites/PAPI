# PAPI

> A lightweight jQuery plugin that makes working with the [Postcode API](http://www.postcodeapi.nu/) easy as pie.

More info, documentation and examples @ http://github.e-sites.nl/papi/

## The Postcode API
The Postcode API is developed by [Freshheads](http://www.freshheads.com/). Check out the docs: http://api.postcodeapi.nu/docs/.

## Why PAPI?
Well, for starters, because:

* it's lightweight (only 0.5kb minified w/ gzip) and developed with high performance in mind;
* it caches results internally, so no unecessary API calls;
* it validates the actual zipcode that is used to fetch the data;
* it handles responses internally so you can focus on processing the data in the available callbacks;
* it comes with a fully fledged static API (`$.papi`), so you can write your custom logic as well
* it offers internal error handling (401, 404 and 500)

## Getting started
First download the plugin via Bower by running `bower install papi` (or download it manually). Second, include the plugin as such (or lazy-load it):
```html
<script src="jquery.min.js"></script>
<script src="jquery.papi.min.js"></script>
```

### Setting the API key
It's important you authorize yourself by setting the API key. Use the static `.setApiKey` method for this:
```js
$.papi.setApiKey('4815162342');
```
## Docs
Basically, there are two routes you can follow. First, you can simply call the plugin on an element and pass some options.
This way the whole process of fetching and handling the data will be done for you.

Also, you can use the static API to handle the data yourself, this gives you more freedom and possibilities.

### Plugin
Example plugin call:

```js
$('#housenr').papi({
    source: $('#zipcode4')[0],
    event: 'change',
    placeholders: {
        street: $('#street4')[0],
        town: $('#town4')[0]
    }
});
```

### Options
<table class="table table-bordered table-striped bs-table">
	<colgroup>
		<col class="col-lg-1">
		<col class="col-lg-1">
		<col class="col-lg-7">
	</colgroup>
	<thead>
	<tr>
		<th>Property</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<code>source</code>
			</td>
			<td><code>null</code></td>
			<td>
				When working with a house number this needs to point to the source element of the zipcode
			</td>
		</tr>
		<tr>
			<td>
				<code>event</code>
			</td>
			<td><code>String</code></td>
			<td>Event type that triggers the actual lookup</td>
		</tr>
		<tr>
			<td>
				<code>placeholders</code>
			</td>
			<td><code>Object</code></td>
			<td>
				The given and will be mapped against available properties that are returned by the API <br>
				Available placeholders are: <br>
				latitude, longitude, municipality, postcode, province, street, town, house_number, x, y, bag.</code>
			</td>
		</tr>
		<tr>
			<td>
				<code>bag</code>
			</td>
			<td><code>Boolean</code></td>
			<td>
				This will add an additional querystring (<code>?view=bag</code>) to the call and will return <a href="http://bag.vrom.nl/" target="_blank">BAG</a> info (if available)<br>
			</td>
		</tr>
	</tbody>
</table>

### Static API

#### `.setApiKey(apikey)`
Guess what, it sets the API key for authorization :-)

#### `.lookup(zipcode, [houseNr], [bag])`
Initiates the actual `GET` request to the API.

#### `.ok(callback)`
When all went good, this callback will be invoked.
The data will be available through the first argument. The `this` context will point to the `$.papi` object.

#### `.notfound(callback)`
When no results are found, the API will return a 404 and this callback will be invoked.

#### `.setValue(key, placeholder)`
Fills the given placeholder with available data

#### `.setValues(placeholders)`
Fills all placeholders with available data.

#### `.isValidZipcode(zipcode)`
Small helper to see if the given zipcode is valid

## Browser support
Tested in the latest versions of Google Chrome, Mozilla Firefox, Opera and Safari. As for Internet Explorer, it only works
in IE10+ due to the lack of proper CORS functionality. I have tried to work around this with `XDomainRequest`, unfortunately
[you can't set custom request headers](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx)
when using XDR, so authorization can't be realized.

**Update:** as from 0.3.0 I have included a PHP proxy to provide support for &lt;IE10 as well. 

Also, if you polyfill `JSON.parse` / `JSON.stringify` and `window.localStorage` you can support even IE7.

## License
Copyright (C) 2015 E-sites, http://www.e-sites.nl/ Licensed under the MIT license.

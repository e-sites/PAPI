PAPI
====
<blockquote>
<p>A lightweight jQuery plugin that makes working with the <a href="http://www.postcodeapi.nu/" target="_blank">Postcode API</a> easy as pie.</p>
</blockquote>

More info, docmentation and examples @ http://boye.e-sites.nl/papi/

##The Postcode API
The Postcode API is developed by <a href="http://www.freshheads.com/" target="_blank">Freshheads</a>. Check out the docs: <a href="http://api.postcodeapi.nu/docs/" target="_blank">http://api.postcodeapi.nu/docs/</a>

##Why PAPI?
Well, for starters, because:

<ul>
<li>it's lightweight (only 0.5kb minified w/ gzip) and developed with high performance in mind;</li>
<li>it caches results internally, so no unecessary API calls;</li>
<li>it validates the actual zipcode that is used to fetch the data;</li>
<li>it handles responses internally so you can focus on processing the data in the available callbacks;</li>
<li>it comes with a fully fledged static API (<code>$.papi</code>), so you can write your custom logic as well</li>
<li>it offers internal error handling (401, 404 and 500)</li>
</ul>

##Getting started
First and foremost, include the plugin as such (or lazy-load it):
```html
<script src="jquery.min.js"></script>
<script src="jquery.papi.min.js"></script>
```

###Setting the API key
It's important you authorize yourself by setting the API key. Use the static .setApiKey method for this:
```js
$.papi.setApiKey('4815162342');
```
##Docs
Basically, there are two routes you can follow. First, for the lazy folk, you can simply call the plugin on an element and pass some options.
This way the whole process of fetching and handling the data will be done for you.

Also, you can use the static API to handle the data yourself, this gives you more freedom and possibilities.

###Plugin
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
###Options</h4>
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
				Indicates a successful or positive action
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
				Available placeholders are: <br>
				latitude, longitude, municipality, postcode, province, street, town, house_number, x, y, bag.</code>
			</td>
		</tr>
	</tbody>
</table>
<h3>Static API</h3>
<h4><code>.setApiKey(apikey)</code></h4>
<p>Guess what, it sets the API key for authorization :-)</p>
<h4><code>.lookup(zipcode, [houseNr], [bag])</code></h4>
<p>Initiates the actual <code>GET</code> request to the API.</p>
<h4><code>.ok(callback)</code></h4>
<p>
	When all went good, this callback will be invoked. <br>
	The data will be available through the first argument. The <code>this</code> context will point to the <code>$.papi</code> object.
</p>
<h4><code>.notfound(callback)</code></h4>
<p>
	When no results are found, the API will return a 404 and this callback will be invoked.
</p>
<h4><code>.setValue(key, placeholder)</code></h4>
<p>
	Fills the given placeholder with available data
</p>
<h4><code>.setValues(placeholders)</code></h4>
<p>
	Fills all placeholders with available data.
</p>
<h4><code>.isValidZipcode(zipcode)</code></h4>
<p>Small helper to see if the given zipcode is valid</p>

##Browser support
Tested in the latest versions of Google Chrome, Mozilla Firefox, Opera and Safari. As for Internet Explorer, it only works in IE10+ due to the lack of proper CORS functionality.
I have tried to work around this with <code>XDomainRequest</code>, unfortunately <a href="http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx" target="_blank">you can't set custom request headers</a> when using XDR, so authorization can't be realized.

<strong>Update:</strong> as from 0.3.0 I have included a PHP proxy to provide support for &lt;IE10 as well. <br>
Also, if you polyfill <code>JSON.parse</code> / <code>JSON.stringify</code> and <code>window.localStorage</code> you can also support IE7.

##Road map
<p>You know, the usual stuff ;-)</p>
<ul>
	<li>Internal logging / debugging</li>
	<li>More documation</li>
	<li>Unit testing</li>
	<li>More demo's / examples</li>
</ul>

##License
Copyright (c) 2013 <a href="http://www.linkedin.com/in/boyeoomens">Boye Oomens</a> Licensed under the MIT license.

PAPI
====
<blockquote>
				<p>A lightweight jQuery plugin that makes working with the <a href="http://www.postcodeapi.nu/" target="_blank">Postcode API</a> easy as pie.</p>
			</blockquote>

##The Postcode API
The Postcode API is developed by <a href="http://www.freshheads.com/" target="_blank">Freshheads</a>. Check out the docs: <a href="http://api.postcodeapi.nu/docs/" target="_blank">http://api.postcodeapi.nu/docs/</a>

##Implementation
First and foremost, include the plugin as such (or lazy-load it):

##Why PAPI?
Well, for starters, because:

<ul>
				<li>it's lightweight (only 0.5kb minified w/ gzip) and developed with high performance in mind;</li>
				<li>it caches results internally, so no unecessary API calls;</li>
				<li>it validates the actual zipcode that is used to fetch the data;</li>
				<li>it handles responses internally so you can focus on processing the data in the available callbacks;</li>
				<li>it comes with a fully fledged static API (<code>$.papi</code>), so you can write your custom logic as well</li>
			</ul>

##Road map
<p>You know, the usual stuff ;-)</p>
<ul>
	<li>Internal logging / debugging</li>
	<li>More documation</li>
	<li>Unit testing</li>
	<li>More demo's / examples</li>
	<li>Use localStorage for more persistent caching</li>
</ul>

##License
Copyright (c) 2013 <a href="http://www.linkedin.com/in/boyeoomens">Boye Oomens</a> Licensed under the MIT license.
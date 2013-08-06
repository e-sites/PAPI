<?php
/**
 * PHP proxy to provide <IE10 support for PAPI
 * 
 * @author Boye Oomens <github@jussay.in>
 */

// Always reply in JSON
header('Content-Type: application/json; charset="utf-8"');

// Inform the client about the type of request he should be making
header('Allow: GET');
header('Accept-Charset: utf-8');

// We at least need a zipcode and an API key
if (empty($_GET['zipcode']) || empty($_GET['apikey'])) {
	return false;
}

$sApiUrl = 'http://api.postcodeapi.nu/';
$sZipcode = $_GET['zipcode'];
$sHouseNr = (!empty($_GET['houseNr']) ? $_GET['houseNr'] : '');
$sBagParam = (!empty($_GET['bag']) ? '?view=bag' : '');
$sApiKey = $_GET['apikey'];
$sUrl = $sApiUrl . $sZipcode . '/' . $sHouseNr . $sBagParam;
$mHandler = curl_init($sUrl);

// Initiate request
if ($mHandler) {
	curl_setopt($mHandler, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($mHandler, CURLOPT_HEADER, false);
	curl_setopt($mHandler, CURLOPT_VERBOSE, false);
	curl_setopt($mHandler, CURLOPT_CONNECTTIMEOUT, 10);
	curl_setopt($mHandler, CURLOPT_TIMEOUT, 10);
	curl_setopt($mHandler, CURLOPT_HTTPHEADER, array('Api-Key:' . $sApiKey));

	$mResult = curl_exec($mHandler);
	$mReturn = 'Received invalid response from API';

	if ($mResult && curl_getinfo($mHandler, CURLINFO_HTTP_CODE) === 200) {
		$mReturn = json_encode($mResult);
	}

	curl_close($mHandler);

	echo $mReturn;
}
?>
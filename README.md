### Webhook Manager

Make it easier to POST information to Homey from external sources, using Webhooks.

You first need to create a Webhook at https://developers.athom.com/webhooks/ (don't forget to change "return false;" to "return true" in the box below).

Copy the URL, ID and Secret into the app in Homey.

Afterwards registering the Webhook in the app, you can post to the URL from external sources. For example, in PHP using CURL;

```
<?php
	$data = array("event" => "MyEvent", "data1" => "test1", "data2" => "test2", "data3" => "test3");                                                                    
	$data_string = json_encode($data);
	
	$ch = curl_init('https://webhooks.athom.com/webhook/.../');
	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
	    'Content-Type: application/json',                                                                                
	    'Content-Length: ' . strlen($data_string))                                                                       
	);                                                                                                                   
	                                                                                                                     
	$result = curl_exec($ch);
	
	var_dump ($result);
?>
```


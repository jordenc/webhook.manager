### Webhook Manager

Make it easier to POST information to Homey from external sources, using Webhooks.

After installing the app, go to the 'Settings' page and see the Webhook Manager settings. It shows the URL you can POST to and example code in PHP with the correct URL for your installation.

For example, in PHP using CURL;

```
<?php
	$data = array("event" => "MyEvent", "data1" => "test1", "data2" => "test2", "data3" => "test3");                                                                    
	$data_string = json_encode($data);
	
	$ch = curl_init('https://webhooks.athom.com/webhook/57274085acb3bd6d24b3d200/?token=');
	
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


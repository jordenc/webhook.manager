### Webhook Manager

Make it easier to POST information to Homey from external sources, using Webhooks.

**Want to show your appreciation for this app? A donation is possible via http://www.d2c.nl **

After installing the app, go to the 'Settings' page and see the Webhook Manager settings. It shows the URL you can POST to and example code in PHP with the correct URL for your installation.

For example, in PHP using CURL:

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

(You only have to fill in the token= part)

**Want to show your appreciation for this app? A donation is possible via http://www.d2c.nl **

# Changelog
**Version 0.2.4**
- Bugfix (all events were triggered)

**Version 0.2.3**
- SDK v2 version

**Version 0.2.2**
- Webhook now also supports GET command, just call an URL in the form of:
https://webhooks.athom.com/webhook/57274085acb3bd6d24b3d200/?token=&lt;token as shown in app&gt;&event=&lt;event name&gt;&data1=&lt;data&gt;&data2=&lt;data&gt;&data3=&lt;data&gt;

**Version 0.2.1**
- Initial release
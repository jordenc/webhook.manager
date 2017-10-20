"use strict";

const Homey 	=	require('homey');

let device_id 	=	Homey.ManagerSettings.get('device_id');
    
class App extends Homey.App {
			
	onInit() {

		let eventTrigger = new Homey.FlowCardTrigger('event')
			.register()
		    .registerRunListener( (args, state ) => {

		        // If true, this flow should run
		        return Promise.resolve( args.location === state.location );
		
		    })
		   

		
		if (device_id) {

			this.log ('We still remembered device_id: ' + device_id);

		} else {

			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			device_id = '';
		    for( var i=0; i < 10; i++ )
		        device_id += possible.charAt(Math.floor(Math.random() * possible.length));

			this.log('new device_id: ' + device_id);
			device_id = Homey.ManagerSettings.set('device_id', device_id);

		}
		
		// Register initial webhook
		if (Homey.env.CLIENT_ID && Homey.env.CLIENT_SECRET) {

			// Register webhook
			let myWebhook = new Homey.CloudWebhook(Homey.env.CLIENT_ID, Homey.env.CLIENT_SECRET, {device_id: device_id});
			
			myWebhook
		        .on('message', args => {
					this.log('Got a webhook message!');
		            this.log('headers:', args.headers);
		            this.log('query:', args.query);
		            this.log('body:', args.body);
		            
		            if (typeof args.body.event === "undefined" || args.body.event == "") {
			
						var event = args.query.event;
						var data1 = args.query.data1;
						var data2 = args.query.data2;
						var data3 = args.query.data3;
						
					} else {
					
						var event = args.body.event;
						var data1 = args.body.data1;
						var data2 = args.body.data2;
						var data3 = args.body.data3;
						
					}
					
					// trigger a Flow//event: event
			        eventTrigger
			        	.trigger({
			                data1: data1 || '',
							data2: data2 || '',
							data3: data3 || ''
		                }, {event: event})
		                .then( console.log( 'event triggered') )
		                .catch( this.error )
			
		        })
		        .register()
		        .then(() => {
		             this.log('Webhook registered!');
		             
				})
		        .catch( this.error )

		} else {
			
			this.log ("No env details found");
				
		}

	}
	
};

module.exports = App;
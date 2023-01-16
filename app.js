"use strict";

const Homey 	=	require('homey');
    
class App extends Homey.App {
			
	async onInit() {

		let device_id 	=	this.homey.settings.get('device_id');

		this.eventTrigger = this.homey.flow.getTriggerCard('event');

		this.eventTrigger.registerRunListener(async (args, state ) => {
				
		        // If true, this flow should run
		        return args.event === state.event;
		
		    });

		if (device_id) {
			this.log ('We still remembered device_id: ' + device_id);
		} else {
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			device_id = '';
		    for( var i=0; i < 10; i++ )
		        device_id += possible.charAt(Math.floor(Math.random() * possible.length));

			this.log('new device_id: ' + device_id);
			device_id = this.homey.settings.set('device_id', device_id);
		}
		
		// Register initial webhook
		if (Homey.env.CLIENT_ID && Homey.env.CLIENT_SECRET) {

			// Register webhook
			this.myWebhook = await this.homey.cloud.createWebhook(Homey.env.CLIENT_ID, Homey.env.CLIENT_SECRET, {device_id: device_id});

			this.myWebhook
		        .on('message', args => {
					this.log('Got a webhook message!');
		            this.log('headers:', args.headers);
		            this.log('query:', args.query);
		            this.log('args:', args);
		            //this.log('state:', state);
		            
		            if (typeof args.body.event === "undefined" || args.body.event == "") {
			
						var event = args.query.event;
						var data1 = args.query.data1 || '';
						var data2 = args.query.data2 || '';
						var data3 = args.query.data3 || '';
						
					} else {
					
						var event = args.body.event;
						var data1 = args.body.data1 || '';
						var data2 = args.body.data2 || '';
						var data3 = args.body.data3 || '';
						
					}

					// trigger a Flow//event: event
			        this.eventTrigger
			        	.trigger({
			                data1: data1 || '',
							data2: data2 || '',
							data3: data3 || ''
		                }, {'event': event})
		                .then( console.log( 'event triggered: ' + event) )
		                .catch( this.error )
			
		        })

		} else {
			this.log ("No env details found");
		}
	}
};

module.exports = App;
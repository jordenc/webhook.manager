"use strict";
var webhookID;
var device_id;

var self = module.exports = {
	init: function () {

		device_id = Homey.manager('settings').get('device_id');

		if (device_id) {

			Homey.log ('We still remembered device_id: ' + device_id);

		} else {

			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			device_id = '';
		    for( var i=0; i < 10; i++ )
		        device_id += possible.charAt(Math.floor(Math.random() * possible.length));

			Homey.log('new device_id: ' + device_id);
			device_id = Homey.manager('settings').set('device_id', device_id);

		}

		// On triggered flow
		Homey.manager('flow').on('trigger.event', function (callback, args, state) {

			// Check if event triggered is equal to event send in flow card
			callback( null, args.event === state.event );
		});

		// Register initial webhook
		if (Homey.env.CLIENT_ID && Homey.env.CLIENT_SECRET) {

			// Register webhook
			self.registerWebhook(Homey.env.CLIENT_ID, Homey.env.CLIENT_SECRET);

		}

	},
	registerWebhook: function (id, secret, callback) {

		// Register webhook
		Homey.manager('cloud').registerWebhook(id, secret, {device_id: device_id}, self.incomingWebhook,
			function (err, result) {
				if (err || !result) {

					Homey.log('registering webhook failed');

					// Return failure
					if (callback)callback(true, null);
				}
				else {
					// Unregister old webhook
					if (webhookID && webhookID !== id) Homey.manager('cloud').unregisterWebhook(webhookID);

					Homey.log('registering webhook succeeded');

					// Return success
					if (callback)callback(null, true);
				}
			});

		// Store used webhook internally
		webhookID = id;
	},
	incomingWebhook: function (args) {


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
		
		Homey.log('incoming webhook: ' + event + ' / ' + JSON.stringify(args));

		// Trigger event
		Homey.manager('flow').trigger('event', {
			data1: data1 || '',
			data2: data2 || '',
			data3: data3 || ''
		}, {
			event: event
		});
	}
};
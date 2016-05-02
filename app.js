"use strict";
var webhookID;
var triggeredEvent;

var self = module.exports = {
	init: function () {

		// On triggered flow
		Homey.manager('flow').on('trigger.event', function (callback, args) {

			// Check if event triggered is equal to event send in flow card
			if (args.event === triggeredEvent) {
				callback(null, true);
			}
			else {
				callback(true, null);
			}
		});

		// Register initial webhook
		if (Homey.manager("settings").get("url") && Homey.manager("settings").get("id") && Homey.manager("settings").get("secret")) {

			// Register webhook
			self.registerWebhook(Homey.manager("settings").get("id"), Homey.manager("settings").get("secret"));

		}

		// Listen for settings change
		var counter = 0;
		Homey.manager('settings').on('set', function () {
			counter++;
			if (counter == 3) {
				// Register new webhook
				self.registerWebhook(Homey.manager("settings").get('id'), Homey.manager("settings").get('secret'));

				// Reset counter
				counter = 0;
			}
		});
	},
	registerWebhook: function (id, secret, callback) {

		// Register webhook
		Homey.manager('cloud').registerWebhook(id, secret, {device_id: 12345}, self.incomingWebhook,
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

		// Store triggered event
		triggeredEvent = args.body.event;
		
		Homey.log('incoming webhook: ' + triggeredEvent + ' / ' + JSON.stringify(args));

		// Trigger event
		Homey.manager('flow').trigger('event', {
			data1: args.body.data1,
			data2: args.body.data2,
			data3: args.body.data3
		});
	}
};
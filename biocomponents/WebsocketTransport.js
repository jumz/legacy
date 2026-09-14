/**
 * Returns an object that is used to communicate to the BioComponents servers over a websocket.
 */
var createWebsocketTransport = (function (websocketHandle) {

    var ws = websocketHandle;

    // Associates a channel name to the channel callback
    var channelCallbacks = {};

    // Records the callback function for the specified channel
    var register = function (channel, onMessageCallback) {
        if (channelCallbacks.hasOwnProperty(channel))
            throw "Channel:" + channel + " already registered";
        channelCallbacks[channel] = onMessageCallback;
    };

    // Sends a message over the websocket
    var send = function (messageObject) {
        if (typeof messageObject !== 'object'){
            throw "Parameter must be of type object";
        }
        ws.send(JSON.stringify(messageObject));
    };

    // Parses the Websocket message to JSON and routes the message to the
    // appropriate callback
    var onMessage = function (message) {
        var data = JSON.parse(message.data);
        if (data.hasOwnProperty("channel") && channelCallbacks.hasOwnProperty(data.channel)) {
            channelCallbacks[data.channel](data);
        } else {
            console.log("No destination found for:" + message)
        }
    };

    // Set onMessage to be called when a message from the server arrives over the Websocket
    ws.onmessage = onMessage;

    return {
        register: register,
        send: send
    }
});
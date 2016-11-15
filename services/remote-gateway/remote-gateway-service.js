let TS = require("../../diagnostics/trace-sources").get("Remote-Gateway-Service");

let Message = require("../../contracts/message");

let constants = require("../../resources/constants").Gateway;

// Proxy for gateway service
class RemoteGatewayService {
	constructor() {
		TS.traceVerbose(__filename, "Initializing service...");
		this.initialize();
		TS.traceVerbose(__filename, "Finished initializing service");
	}
	
	initialize() {
        this.webClient = require("../web/web-client");
		this.configurationService = require("../configuration/configuration-service");
		
        this.REMOTE_GATEWAY_ENDPOINT = this.configurationService.get("GATEWAY_URL");
        this.LOCAL_ENDPOINT = "http://" + require("os").hostname() + ":" + this.configurationService.get("PORT");
	}

    register(symbol) {
		TS.traceVerbose(__filename, `Registering '${symbol}' with service gateway...`);
        let msg = new Message(constants.Actions.Register);
        msg.addArgument("Symbol", symbol);
        msg.addArgument("RequestURL", this.LOCAL_ENDPOINT);
        let registerPromise = this.webClient.sendRequest("POST", this.REMOTE_GATEWAY_ENDPOINT, msg);
		TS.traceVerbose(__filename, `Finished registering ${symbol}`);
		return registerPromise
    }

	dispatch(msg) {
		TS.traceVerbose(__filename, `Dispatching '${msg.Symbol}' via service gateway...`);
        let dispatchMessage = new Message(constants.Actions.Dispatch);
        dispatchMessage.addArgument("Symbol", msg.Symbol);
		dispatchMessage.addArgument("Arguments", msg.Arguments);
       	let dispatchPromise = this.webClient.sendRequest("POST", this.REMOTE_GATEWAY_ENDPOINT, dispatchMessage);
		TS.traceVerbose(__filename, `Finished dispatching '${msg.Symbol}'`);
		return dispatchPromise;
	}

    broadcast(msg) {
		TS.traceVerbose(__filename, `Broadcasting '${msg.Symbol}' via service gateway...`);
        let broadcastMessage = new Message(constants.Actions.Broadcast);
        broadcastMessage.addArgument("Symbol", msg.Symbol);
		broadcastMessage.addArgument("Arguments", msg.Arguments);
        let broadcastPromise = this.webClient.sendRequest("POST", this.REMOTE_GATEWAY_ENDPOINT, broadcastMessage);
		TS.traceVerbose(__filename, `Finished broadcasting '${msg.Symbol}'`);
		return broadcastPromise;
    }
}
module.exports = new RemoteGatewayService();
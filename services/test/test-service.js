let TS = require("../../diagnostics/trace-sources").get("Test-Service");

let Message = require("../../contracts/message");

let gatewayConstants = require("../../resources/constants").Gateway;
let testConstants = require("../../resources/constants").Test;

class TestService {
	constructor() {
		TS.traceVerbose(__filename, "Initializing service...");
		this.initialize();
		TS.traceVerbose(__filename, "Finished initializing service");
	}
	
	initialize() {
        this.webClient = require("../web/web-client");
        this.commandService = require("../command/command-service");
		this.configurationService = require("../configuration/configuration-service");
        this.registerCallbacks();
	}

    registerCallbacks() {
        this.ENDPOINT = "http://" + require("os").hostname() + ":" + this.configurationService.get("PORT");
        this.GATEWAY = this.configurationService.get("GATEWAY_URL");

        this.commandService.register(testConstants.Events.TestMe, (msg) => this.onTestMe);
        this.registerCallbackWithGateway(testConstants.Events.TestMe);
        this.commandService.register(testConstants.Events.TestYou, (msg) => this.onTestYou);
        this.registerCallbackWithGateway(testConstants.Events.TestYou);
    }

    registerCallbackWithGateway(symbol) {
        var msg = new Message(gatewayConstants.Actions.Register);
        msg.addArgument("Symbol", symbol);
        msg.addArgument("RequestURL", this.ENDPOINT);
        this.webClient.sendRequest("POST", this.GATEWAY, msg);
    }

    onTestMe(msg) {
        TS.traceVerbose("onTestMe");
    }

    onTestYou(msg) {
        TS.traceVerbose("onTestYou");
    }

    publishTestMe() {
        this.publishEvent(testConstants.Events.TestMe);
    }

    publishTestYou() {
        this.publishEvent(testConstants.Events.TestYou);
    }

    publishEvent(symbol) {
        var msg = new Message(gatewayConstants.Actions.Broadcast);
        msg.addArgument("Symbol", symbol);
        this.webClient.sendRequest("POST", this.GATEWAY, msg);
    }
}
module.exports = new TestService();
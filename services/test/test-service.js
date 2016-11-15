let TS = require("../../diagnostics/trace-sources").get("Test-Service");

let constants = require("../../resources/constants").Test;

let Message = require("../../contracts/message");

let Q = require("q");

class TestService {
	constructor() {
		TS.traceVerbose(__filename, "Initializing service...");
		this.initialize();
		TS.traceVerbose(__filename, "Finished initializing service");
	}
	
	initialize() {
        this.commandService = require("../command/command-service");
        this.gatewayService = require("../remote-gateway/remote-gateway-service");
        this.registerCallbacks();
	}

    registerCallbacks() {
        // Each event handler that is registered with the service gateway must have a corresponding command handler
        //  otherwise it won't be routed here
        this.commandService.register(constants.Events.OnTestMe, (msg) => this.onTestMe(msg));
        this.gatewayService.register(constants.Events.OnTestMe);

        this.commandService.register(constants.Events.OnTestYou, (msg) => this.onTestYou(msg));
        this.gatewayService.register(constants.Events.OnTestYou);

        // ...but local commands don't necessarily have to be registered with the gateway:
        this.commandService.register(constants.Actions.RaiseEvent, (msg) => this.publish(msg));
        this.commandService.register(constants.Actions.DispatchCommand, (msg) => this.dispatch(msg));
    }

    onTestMe(msg) {
        TS.traceVerbose(__filename, "+event: onTestMe");
        return Q.fcall(() => {
            let response = new Message(constants.Responses.TestMe);
            TS.traceVerbose(__filename, "-event: onTestMe");
            return response;
        });
    }

    onTestYou(msg) {
        TS.traceVerbose(__filename, "+event: onTestYou");
        return Q.fcall(() => {
            let response = new Message(constants.Responses.TestYou);
            TS.traceVerbose(__filename, "-event: onTestYou");
            return response;
        });
    }

    publish(msg) {
        let eventSymbol = msg.getArgument("EventSymbol");
		TS.traceVerbose(__filename, `Publishing event '${eventSymbol}'...`);
        return Q.fcall((symbol) => {
            let m = new Message(symbol);
            let promise = this.gatewayService.broadcast(m);
		    TS.traceVerbose(__filename, `Event '${eventSymbol}' published`);
            return promise;
        }, eventSymbol);
    }

    dispatch(msg) {
        let commandSymbol = msg.getArgument("CommandSymbol");
		TS.traceVerbose(__filename, `Dispatching command '${commandSymbol}'...`);
        return Q.fcall((symbol) => {
            var m = new Message(symbol);
            let promise = this.gatewayService.dispatch(m);
		    TS.traceVerbose(__filename, `Command '${commandSymbol}' dispatched`);
            return promise;
        }, commandSymbol);
    }

    test() {
        let msg = new Message(constants.Actions.RaiseEvent);
        msg.addArgument("EventSymbol", constants.Events.OnTestMe);
        this.publish(msg);

        msg = new Message(constants.Actions.RaiseEvent);
        msg.addArgument("EventSymbol", constants.Events.OnTestYou);
        this.publish(msg);
    }
}
module.exports = new TestService();
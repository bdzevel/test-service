module.exports = {
    Config: {
        AppName: "TESTSERVICE"
    },
    Gateway: {
        Actions: {
            Register: "GATEWAY.COMMAND.REGISTER",
            Dispatch: "GATEWAY.COMMAND.DISPATCH",
            Broadcast: "GATEWAY.COMMAND.BROADCAST"
        },
        Responses: {
            Register: "GATEWAY.RESPONSE.REGISTER",
            Dispatch: "GATEWAY.RESPONSE.DISPATCH",
            Broadcast: "GATEWAY.RESPONSE.BROADCAST"
        }
    },
    Test: {
        Actions: {
            RaiseEvent: "TEST.COMMAND.RAISE_EVENT",
            DispatchCommand: "TEST.COMMAND.DISPATCH_COMMAND"
        },
        Events: {
            OnTestMe: "TEST.EVENT.ONTESTME",
            OnTestYou: "TEST.EVENT.ONTESTYOU"
        },
        Responses: {
            TestMe: "TEST.RESPONSE.TESTME",
            TestYou: "TEST.RESPONSE.TestYou"
        }
    }
 };
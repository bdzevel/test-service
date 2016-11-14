module.exports = {
    Config: {
        AppName: "TESTSERVICE"
    },
    Gateway: {
        Actions: {
            Register: "GATEWAY.COMMAND.REGISTER",
            Broadcast: "GATEWAY.COMMAND.BROADCAST"
        },
        Responses: {
            Register: "GATEWAY.RESPONSE.REGISTER",
            Broadcast: "GATEWAY.RESPONSE.BROADCAST"
        }
    },
    Test: {
        Events: {
            TestMe: "TEST.EVENT.ONTESTME",
            TestYou: "TEST.EVENT.ONTESTYOU"
        }
    }
 };
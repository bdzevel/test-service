let testService = require("../services/test/test-service");

let webServer = require("../services/web/web-listener");
webServer.start();

testService.test();
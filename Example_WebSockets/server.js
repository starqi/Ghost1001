var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: 8888});

var pa = false, pb = false;

function closeBoth() {
    try {
        if (pa) pa.close();
        if (pb) pb.close();
    } catch (e) {}
    pa = false;
    pb = false;
}

wss.on("connection", function (ws) {
    if (!pa) {
        pa = ws;
        console.log("Player A connected");
    } else if (!pb) {
        pb = ws;
        console.log("Player B connected");
    } else {
        ws.close();
        console.log("Additional player rejected");
        return;
    }
    if (pa && pb) {
        pa.on("message", function (m) {
            pb.send(m);
        });
        pa.on("error", function (c, m) {
            console.log("Player A error: " + m);
            closeBoth();
        });
        pa.on("close", function (m) {
            console.log("Player A close: " + m);
            closeBoth();
        });
        pb.on("message", function (m) {
            pa.send(m);
        });
        pb.on("error", function (c, m) {
            console.log("Player B error: " + m);
            closeBoth();
        });
        pb.on("close", function (m) {
            console.log("Player B close: " + m);
            closeBoth();
        });
        pa.send("g");
        pb.send("g");
    }
});

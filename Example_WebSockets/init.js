var msgDiv, urlBox, canvas;

function init() {
    msgDiv = document.getElementById("msgDiv");
    urlBox = document.getElementById("urlBox");
    canvas = document.getElementById("canvas");

    if (!("WebSocket" in window)) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "WebSockets not supported";
    } else {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "Enter server URL:";
        urlBox.style.display = "block";
    }

    Sound.load("ding", "../Example_Resources/ding.mp3");
}

function urlBoxKey(e) {
    if (e.keyCode == 13) {
        try {
            globals.ws = new WebSocket(urlBox.value);
            msgDiv.innerHTML = "Connecting...";
            urlBox.style.display = "none";
            globals.ws.onclose = function () {
                msgDiv.style.display = "block";
                msgDiv.innerHTML = "Connection closed or failed";
                urlBox.style.display = "none";
                canvas.style.display = "none";
                globals.ws.close();
            }
            globals.ws.onopen = function () {
                msgDiv.style.display = "block";
                msgDiv.innerHTML = "Connected - Waiting for another player";
                urlBox.style.display = "none";
                canvas.style.display = "none";
            }
            globals.ws.onmessage = function (e) {
                if (canvas.style.display == "none") {
                    msgDiv.style.display = "none";
                    canvas.style.display = "block";
                    go();
                } else {
                    process(e.data);
                }
            }
        } catch (e) {
            msgDiv.style.display = "block";
            msgDiv.innerHTML = "Connection error";
            urlBox.style.display = "none";
            canvas.style.display = "none";
            throw err;
        }
    }
}

var globals = {
    killsToWin: 10,
	controller: false,
	enemy: false,
	me: false,
	ws: false,
	myKills: 0,
	enemyKills: 0
};

function emit() {
    globals.ws.send(globals.me.aimX + " " +
            globals.me.aimY + " " +
            globals.me.x + " " +
            globals.me.y + " " + 
            globals.me.vx + " " +
            globals.me.vy + " " +
            (globals.me.firing ? "1" : "0"));
}

function resetCharacters() {
    globals.me.x = 250;
    globals.me.y = 250;
    globals.me.hp = globals.me.maxHp;
    globals.enemy.x = 250;
    globals.enemy.y = 250;
    globals.enemy.hp = globals.enemy.maxHp;
}

function displayKillReset() {
    globals.controller.grid.enumerateDots(function (d) {
        globals.controller.grid.unregisterDot(d);
    });
    globals.controller.dialogueText = globals.myKills + "-" + globals.enemyKills;
    globals.controller.dialogueRemaining = 2000;
    resetCharacters();
}

function process(d) {
    if (d == "w") {
        globals.enemyKills++;
        displayKillReset();
    } else if (d == "l") {
        globals.myKills++;
        displayKillReset();
    } else {
        var dd = d.split(" ");
        globals.enemy.aimX = parseInt(dd[0]);
        globals.enemy.aimY = parseInt(dd[1]);
        globals.enemy.x = parseInt(dd[2]);
        globals.enemy.y = parseInt(dd[3]);
        globals.enemy.vx = parseInt(dd[4]);
        globals.enemy.vy = parseInt(dd[5]);
        globals.enemy.firing = parseInt(dd[6]) == 1;
    }
}

function go() {
    
    var controls = registerControls(canvas);

    // Tiles
    var player1 = new AnimatedTileSheet('../Example_Resources/player1.png', 148, 97, 2, 1);
    player1.autoTick = true;
    var floor1 = new AnimatedTileSheet('../Example_Resources/floor1.jpeg', 75, 68, 1, 1);
    var floor2 = new AnimatedTileSheet('../Example_Resources/floor2.png', 346, 196, 1, 1);

    // Characters
    var weapon = new Weapon();
    globals.me = new Character('You', weapon, 15);
    globals.me.tileSheets = [player1];
    globals.me.tileIndex = 0;
    globals.me.name = 'Me';
    globals.enemy = new Character('Enemy', weapon, 15);
    globals.enemy.tileSheets = [player1];
    globals.enemy.tileIndex = 0;
    globals.enemy.name = 'Enemy';
    resetCharacters();

    // Blocks
    var objA = new Thing(300, 300, true);
    objA.width = 176;
    objA.height = 100;
    objA.tileSheets = [floor2];
    objA.tileIndex = 0;
    var objB = new Thing(100, 100, true);
    objB.width = 176;
    objB.height = 100;
    objB.tileSheets = [floor2];
    objB.tileIndex = 0;

    // Floor
    var tileRects = [{ x1: 2, y1: 2, x2: 7, y2: 7 }];
    var tile = new Tile(tileRects); 
    tile.tileX = tile.tileY = 0;
    tile.tileSheet = floor1;

    // Fighting scene
    var data = new InfantrySceneData();
    data.onCharacterBulletHit = function (controller, character, bullet) {
        Sound.play("ding");
        character.hp -= bullet.damage;
        if (character.hp <= 0) {
            character.hp = 0;
            if (character == globals.me) {
                globals.enemyKills++;
                globals.ws.send("l");
            }
            else if (character == globals.enemy) {
                globals.myKills++;
                globals.ws.send("w");
            }
            displayKillReset();
        }
    };
    data.onUpdate = function (controller) {
        globals.controller = controller;
        if (globals.myKills > globals.killsToWin) {
            controller.finished = true;
            return;
        }
        if (globals.enemyKills > globals.killsToWin) {
            controller.finished = true;
            return;
        }
        emit();
    };
    data.onFinish = function () {
        var msg = globals.myKills > globals.enemyKills ? "You win" : "You lose";
        var endData = new DialogueSceneData();
        endData.lines.push(msg);
        var dScene = createDialogueScene(endData);
        playScene(60, controls, canvas, dScene);
    };
    data.onBegin = function (controller) {
        controller.dialogueText = "READY TO DUEL";
        controller.dialogueRemaining = 1500;
    }
    data.things.push(globals.me);
    data.things.push(globals.enemy);
    data.things.push(objA);
    data.things.push(objB);
    data.tiles.push(tile);
    data.player = globals.me;

    // Go
    var scene = createInfantryScene(data);
    playScene(30, controls, canvas, scene);
}

function init() {
    var canvas = document.getElementById("canvas");
    var controls = registerControls(canvas);
    var dData1 = new DialogueSceneData();
    Sound.load("ding", "../Example_Resources/ding.mp3");
    dData1.percentageSpeed = 0.0002;
    dData1.lifetime = 2500;
    dData1.lines.push("The best Infantry dueller in history");
    dData1.lines.push("First to 25 kills wins");
    dData1.onFinish = function () {
        var weapon = new Weapon();
        weapon.damage = 75;
        var playerT = new AnimatedTileSheet("../Example_Resources/player1.png", 148, 97, 2, 1);
        playerT.autoTick = true;
        var sheet1 = new AnimatedTileSheet('../Example_Resources/example.jpeg', 400, 400, 1, 1);
        var floor1 = new AnimatedTileSheet('../Example_Resources/floor1.jpeg', 75, 68, 1, 1);
        var floor2 = new AnimatedTileSheet('../Example_Resources/floor2.png', 346, 196, 1, 1);
        var me = new Character("a", weapon, 15);
        me.name = "Me";
        me.tileSheets = [playerT];
        me.tileIndex = 0;
        me.x = 50;
        me.y = 50;
        var computer = new Character("b", weapon, 15);
        computer.name = "Best Dueller";
        computer.tileSheets = [playerT];
        computer.tileIndex = 0;
        computer.x = 400;
        computer.y = 400;
        computer.horizontal = 1;
        computer.firing = true;
        var objA = new Thing(75, 315, true);
        objA.tileSheets = [floor2];
        objA.tileIndex = 0;
        objA.width = 176;
        objA.height = 100;
        var objB = new Thing(290, 115, true);
        objB.tileSheets = [floor2];
        objB.tileIndex = 0;
        objB.width = 176;
        objB.height = 100;
        var data = new InfantrySceneData();
        var meKills = 0, computerKills = 0;
        data.onCharacterBulletHit = function (controller, character, bullet) {
            Sound.play("ding");
            character.hp -= bullet.damage;
            if (character.hp <= 0) {
                character.hp = 0;
                if (character == me) meKills++;
                else if (character == computer) computerKills++;
                controller.dialogueText = meKills + "-" + computerKills
                controller.dialogueRemaining = 1500;
                me.hp = me.maxHp;
                computer.hp = computer.maxHp;
                me.x = 50;
                me.y = 50;
                computer.x = 400;
                computer.y = 400;
                controller.grid.enumerateDots(function (d) {
                    controller.grid.unregisterDot(d);
                });
            }
        };
        data.onUpdate = function (controller) {
            if (meKills >= 25 || computerKills >= 25) {
                controller.finished = true;
            }
        };
        data.things.push(me);
        data.things.push(computer);
        data.things.push(objA);
        data.things.push(objB);
        data.player = me;
        var tileRects = [{ x1: 0, y1: 0, x2: 9, y2: 3 }, { x1: 0, y1: 7, x2: 9, y2: 9 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet1;
        data.tiles.push(tile);
        var tileRects2 = [{ x1: 0, y1: 4, x2: 9, y2: 6 }];
        var tile2 = new Tile(tileRects2);
        tile2.tileX = tile2.tileY = 0;
        tile2.tileSheet = floor1;
        data.tiles.push(tile2);
        data.backgroundProcesses.push(createDuelBot(me, computer, 50, true));
        data.onBegin = function (controller) {
            controller.dialogueText = "READY?";
            controller.dialogueRemaining = 1000;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.percentageSpeed = 0.0002;
            dData1.lifetime = 3000;
            if (meKills >= computerKills) {
                dData1.lines.push("Do you honestly think");
                dData1.lines.push("you can defeat the best dueller");
                dData1.lines.push("in history?");
            } else {
                dData1.lines.push("Had to hack to win, nerd");
            }
            var dScene = createDialogueScene(dData1);
            playScene(60, controls, canvas, dScene);
        }
        var scene = createInfantryScene(data);
        playScene(60, controls, canvas, scene);
    };
    var dScene = createDialogueScene(dData1);
    playScene(60, controls, canvas, dScene);
}

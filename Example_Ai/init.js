function init() {
    var canvas = document.getElementById('canvas');
    var controls = registerControls(canvas);
    var dData1 = new DialogueSceneData();
    Sound.load("2pac", "../Example_Resources/2pac.mp3", function () {
        Sound.playAndFade("2pac", 60000, 10000, 15);
    });
    Sound.load("ding", "../Example_Resources/ding.mp3");
    dData1.lines.push('Once upon a time');
    dData1.lines.push('In a galaxy far, far, near');
    dData1.lines.push('Mace Windu and Darth Sidious fought');
    dData1.lines.push('But Anakin had other ideas...');
    dData1.onFinish = function () {
        var weapon = new Weapon();
        weapon.damage = 50;
        var playerT = new AnimatedTileSheet('../Example_Resources/player1.png', 148, 97, 2, 1);
        playerT.autoTick = true;
        var sheet = new AnimatedTileSheet('example2.jpeg', 400, 400, 1, 1);
        var sheet2 = new AnimatedTileSheet('example.jpeg', 400, 400, 2, 2);
        sheet2.autoTick = true;
        var character = new Character('a', weapon, 15);
        character.name = "Anakin";
        character.tileSheets = [playerT];
        character.tileIndex = 0;
        var computer = new Character('b', weapon, 15);
        computer.name = "Mace Windu";
        computer.tileSheets = [playerT];
        computer.tileIndex = 0;
        computer.x = 150;
        computer.y = 150;
        computer.firing = true;
        var computer2 = new Character('c', weapon, 15);
        computer2.name = "Darth Sidious";
        computer2.x = 250;
        computer2.y = 250;
        computer2.firing = true;
        computer2.tileSheets = [playerT];
        computer2.tileIndex = 0;
        var objA = new Thing(115, 245, true);
        objA.tileSheets = [sheet];
        objA.tileIndex = 0;
        var objB = new Thing(315, 245, true);
        objB.tileSheets = [sheet];
        objB.tileIndex = 0;
        var data = new InfantrySceneData();
        var shotByTupac = false;
        data.onCharacterBulletHit = function (controller, character, bullet) {
            Sound.play("ding");
            character.hp -= bullet.damage;
            if (character.hp < 0) {
                character.hp = 0;
                shotByTupac = true;
                controller.fadeStart = controller.fadeRemaining = 3000;
                controller.fadeDarkerElseLighter = true;
                controller.dialogueText = 'OH NO, MURDER!';
                controller.dialogueRemaining = 4000;
            }
        };
        data.onUpdate = function (controller) {
            if (shotByTupac) {
                controller.finished = true;
            }
        };
        data.things.push(character);
        data.things.push(computer);
        data.things.push(computer2);
        data.things.push(objA);
        data.things.push(objB);
        data.player = character;
        var tileRects = [{ x1: 0, y1: 0, x2: 9, y2: 3 }, { x1: 0, y1: 7, x2: 9, y2: 9 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet2;
        data.tiles.push(tile);
        data.backgroundProcesses.push(createDuelBot(computer2, computer, 150, false));
        data.backgroundProcesses.push(createDuelBot(computer, computer2, 150, true));
        data.onBegin = function (controller) {
            controller.dialogueText = 'Sidious, you are under arrest';
            controller.dialogueRemaining = 1500;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.lines.push('And the story ends');
            dData1.lines.push('And a new age begins');
            var dScene = createDialogueScene(dData1);
            playScene(60, controls, canvas, dScene);
        }
        var scene = createInfantryScene(data);
        playScene(60, controls, canvas, scene);
    };
    var dScene = createDialogueScene(dData1);
    playScene(60, controls, canvas, dScene);
}

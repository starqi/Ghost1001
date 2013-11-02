function init() {
    var canvas = document.getElementById('canvas');
    var controls = registerControls(canvas);
    var dData1 = new DialogueSceneData();
    dData1.lines.push('Once upon a time');
    dData1.lines.push('In a galaxy far, far, near');
    dData1.onFinish = function () {
        var weapon = new Weapon();
        var sheet = new AnimatedTileSheet('example.jpeg', 400, 400, 2, 2);
        var sheet2 = new AnimatedTileSheet('example2.jpeg', 400, 400, 2, 2);
        sheet.autoTick = true;
        var character = new Character('a', weapon, 15);
        character.tileSheets = [sheet];
        character.tileIndex = 0;
        var computer = new Character('b', weapon, 15);
        computer.tileSheets = [sheet];
        computer.tileIndex = 0;
        computer.x = 45;
        computer.y = 45;
        var retard = new Character('c', weapon, 15);
        retard.x = 15;
        retard.y = 15;
        retard.tileSheets = [sheet];
        retard.tileIndex = 0;
        var data = new InfantrySceneData();
        var shotByTupac = false;
        data.onCharacterBulletHit = function (controller, character, bullet) {
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
        data.things.push(retard);
        data.player = character;
        var tileRects = [{ x1: 0, y1: 0, x2: 1, y2: 1 }, { x1: 1, y1: 1, x2: 3, y2: 3 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet2;
        data.tiles.push(tile);
        data.backgroundProcesses.push(createDuelBot(character, computer, 150, false));
        data.backgroundProcesses.push(createStrafingBot(character, retard, 250, 550, true));
        data.onBegin = function (controller) {
            controller.dialogueText = 'Welcome to the Jungle';
            controller.dialogueRemaining = 1500;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.lines.push('And the story ends');
            dData1.lines.push('A stupid story, what a pity');
            dData1.lines.push('Shameful');
            var dScene = createDialogueScene(dData1);
            playScene(60, controls, canvas, dScene);
        }
        var scene = createInfantryScene(data);
        playScene(60, controls, canvas, scene);
    };
    var dScene = createDialogueScene(dData1);
    playScene(60, controls, canvas, dScene);
}

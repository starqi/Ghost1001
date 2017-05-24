// SHIT CODE WARNING DONT CARE
// SHIT CODE WARNING DONT CARE
// SHIT CODE WARNING DONT CARE
// SHIT CODE WARNING DONT CARE
// SHIT CODE WARNING DONT CARE

var MAP_WIDTH = 20;
var MAP_HEIGHT = 20;
var HIGHEST_X = MAP_WIDTH * 40 - 100;
var HIGHEST_Y = MAP_HEIGHT * 40 - 100;

function changePic() {
  var portrait = document.getElementById("portrait");
  var opponent = document.getElementById("opponent");
  var s = window.location.hash.substring(1);
  if (s in playerData) {
      opponent.value = s;
      init();
      return;
  }
  portrait.src = opponent.value + ".jpg";
}

var playerData = {
  "ayb": {
      name: "ayb",
      shout: "I was the greatest CA player, until 1 < a z e..."
  },
  "nvb": {
      name: "Ninj",
      shout: "ez"
  },
  "aybc": {
      name: "statutory apes",
      shout: "Leader ayb, we shall follow you"
  },
  "johny": {
      name: "johnyric0",
      shout: "nub rage yay"
  },
  "boog": {
      name: "B o o g",
      shout: "Master of the 606"
  },
  "nos": {
      name: "Noskeeper",
      shout: "I'm the prodigy of USL, and a proud Murican"
  },
  "ninj": {
      name: "Ninj",
      shout: "Greatest marine of all time"
  },
  "ikaze": {
      name: "1 < a z e",
      shout: "Greatest CA/CQ pubstar"
  },
  "plane": {
      name: "ayb",
      shout: "I believe I can fly"
  },
  "navck": {
      name: "Navck",
      shout: "Greatest CA pack spammer"
  },
  "pigm": {
      name: "Pigm",
      shout: "Greatest CA tank Infantry"
  },
  "hank": {
      name: "Henry the Cheater",
      shout: "lmfao this kid thinks he can beat me"
  }
};

var a = null;
a = playerData["ayb"].weapon = new Weapon();
a.damage = 15;
a.lifetime = 2000;
a.color = '#ffaaaa';
a.speed = 0.275;
a.shots = 15;
a.reload = 1000;
a.rate = 100;

a = playerData["johny"].weapon = new Weapon();
a.damage = 75;
a.lifetime = 350;
a.color = '#ff0000';
a.speed = 0.4;
a.shots = 1;
a.reload = 30;
a.rate = 30;

a = playerData["boog"].weapon = new Weapon();
a.damage = 90;
a.lifetime = 2000;
a.color = '#00ffff';
a.speed = 0.225;
a.shots = 3;
a.reload = 700;
a.rate = 100;

a = playerData["nos"].weapon = new Weapon();
a.damage = 75;
a.lifetime = 2000;
a.color = '#ff0000';
a.speed = 0.275;
a.shots = 10;
a.reload = 300;
a.rate = 300;

a = playerData["ninj"].weapon = new Weapon();
a.damage = 75;
a.lifetime = 2000;
a.color = '#ff0000';
a.speed = 0.275;
a.shots = 10;
a.reload = 300;
a.rate = 300;

a = playerData["ikaze"].weapon = new Weapon();
a.damage = 999;
a.lifetime = 8000;
a.color = '#00ffff';
a.speed = 0.5;
a.shots = 1;
a.reload = 3000;
a.rate = 3000;

a = playerData["plane"].weapon = new Weapon();
a.damage = 60;
a.lifetime = 2500;
a.color = '#ff0000';
a.speed = 0.4;
a.shots = 1;
a.reload = 30;
a.rate = 30;

a = playerData["navck"].weapon = new Weapon();
a.damage = 93;
a.lifetime = 2000;
a.color = '#ffffff';
a.speed = 0.31;
a.shots = 3;
a.reload = 300;
a.rate = 35;

a = playerData["pigm"].weapon = new Weapon();
a.damage = 45;
a.lifetime = 2000;
a.color = '#ffff00';
a.speed = 0.21;
a.shots = 100;
a.reload = 4000;
a.rate = 20;

a = playerData["hank"].weapon = new Weapon();
a.damage = 90;
a.lifetime = 2000;
a.color = '#ff00ff';
a.speed = 0.25;
a.shots = 100;
a.reload = 0;
a.rate = 20;

function init() {
    var portrait = document.getElementById("portrait");
    var opponent = document.getElementById("opponent");
    var button = document.getElementById("duel_button");
    var canvas = document.getElementById("canvas");
    var picko = document.getElementById("picko");
    picko.style.display = "none";
    portrait.style.display = "none";
    opponent.style.display = "none";
    button.style.display = "none";
    canvas.style.visibility = "visible";
    document.getElementById("pre").style.display = "none";

    var controls = registerControls(canvas);
    var dData1 = new DialogueSceneData();
    Sound.load("ding", "hurt.wav", 8);
    Sound.load("dead", "dead.wav", 3);
    Sound.load("win", "win.wav", 1);
    Sound.load("lose", "lose.wav", 1);
    dData1.percentageSpeed = 0.0003;
    dData1.lifetime = 3000;
    dData1.lines.push(playerData[opponent.value].name + ": ");
    dData1.lines.push(playerData[opponent.value].shout);
    dData1.onFinish = function () {

      if (opponent.value == "aybc") {
        var weapon = new Weapon();
        weapon.damage = 75;
        weapon.lifetime = 2000;
        weapon.color = '#ff0000';
        weapon.speed = 0.275;
        weapon.shots = 10;
        weapon.reload = 300;
        weapon.rate = 300;
        var weapon2 = new Weapon();
        weapon2.damage = 40;
        weapon2.lifetime = 2000;
        weapon2.color = '#ffffff';
        weapon2.speed = 0.21;
        weapon2.shots = 3;
        weapon2.reload = 700;
        weapon2.rate = 100;
        var opponentT = new AnimatedTileSheet("ayb_.png", 40, 40, 1, 1);
        var pool = new AnimatedTileSheet("pool.png", 40, 40, 1, 1);
        var playerT = new AnimatedTileSheet("me.png", 40, 40, 1, 1);
        var sheet1 = new AnimatedTileSheet("floor.png", 40, 40, 1, 1);
        var floor1 = new AnimatedTileSheet("floor2.png", 40, 40, 1, 1);
        var me = new Character("a", weapon, 20);
        me.name = "Me";
        me.tileSheets = [playerT];
        me.tileIndex = 0;
        me.x = HIGHEST_X * Math.random();
        me.y = HIGHEST_Y * Math.random();
        me.movementAccelMag = 0.005;

        var MAX_COMP = 5;
        var computers = [];
        var names = [
            "Therion",
            "ayb",
            "babble",
            "Rojo the Rager",
            "MikeC"
        ];
        for (var i = 0; i < MAX_COMP; ++i) {
          computers.push(new Character("b" + i, weapon2, 20));
          computers[i].movementAccelMag = 0.005;
          computers[i].name = names[i];
          computers[i].tileSheets = [opponentT, pool];
          computers[i].tileIndex = 0;
          computers[i].x = HIGHEST_X * Math.random();
          computers[i].y = HIGHEST_Y * Math.random();
          computers[i].horizontal = 1;
          computers[i].firing = true;
          computers[i].hp = computers[i].maxHp = 350;
        }

        var computersAlive = 5;
        var data = new InfantrySceneData();
        data.blockLength = 40;
        data.blockWidth = MAP_WIDTH;
        data.blockHeight = MAP_HEIGHT;
        var meKills = 0, computerKills = 0;
        data.onCharacterBulletHit = function (controller, character, bullet) {
          if (bullet.owner != me && character != me) return true;
          Sound.play("ding");
          character.hp -= bullet.damage;
          if (character.hp <= 0) {
            Sound.play("dead");
            character.hp = 0;
            var endRound = false;
            if (character == me) {
              computerKills++;
              endRound = true;
            } else {
              computersAlive--;
              character.off = true;
              character.tileIndex = 1;
              if (computersAlive <= 0) {
                meKills++;
                endRound = true;
              }
            }
            if (endRound) {
              controller.dialogueText = "Me: " + meKills + " - Statutory Apes: " 
                  + computerKills;
              controller.dialogueRemaining = 1500;
              me.hp = me.maxHp;
              for (var i = 0; i < MAX_COMP; ++i) {
                computers[i].hp = computers[i].maxHp;
                computers[i].off = false;
                computers[i].tileIndex = 0;
                me.x = HIGHEST_X * Math.random();
                me.y = HIGHEST_Y * Math.random();
                computers[i].x = HIGHEST_X * Math.random()
                computers[i].y = HIGHEST_Y * Math.random();
                controller.grid.enumerateDots(function (d) {
                  controller.grid.unregisterDot(d);
                });
              }
              computersAlive = MAX_COMP;
            }
          }
        };
        data.onUpdate = function (controller) {
          if (meKills >= 3) {
            Sound.play("win");
            controller.finished = true;
          } else if (computerKills >= 3) {
            Sound.play("lose");
            controller.finished = true;
          }
        };
        for (var i = 0; i < MAX_COMP; ++i) {
          data.backgroundProcesses.push(createStrafingBot(me, computers[i], 500, 4, false, 0.5));
        }
        data.things.push(me);
        for (var i = 0; i < MAX_COMP; ++i)
            data.things.push(computers[i]);
        data.player = me;
        delete me.autoHBounce;

        var tileRects = [{ x1: 0, y1: 0, x2: MAP_WIDTH - 1, y2: Math.floor(MAP_HEIGHT / 6) }, 
            { x1: 0, y1: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 1, x2: MAP_WIDTH - 1, y2: MAP_HEIGHT - 1 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet1;
        data.tiles.push(tile);
        var tileRects2 = [{ x1: 0, y1: Math.ceil(MAP_HEIGHT / 6), x2: MAP_WIDTH - 1, 
            y2: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 2 }];
        var tile2 = new Tile(tileRects2);
        tile2.tileX = tile2.tileY = 0;
        tile2.tileSheet = floor1;
        data.tiles.push(tile2);

        data.onBegin = function (controller) {
            controller.dialogueText = "Ready";
            controller.dialogueRemaining = 1000;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.percentageSpeed = 0.0002;
            dData1.lifetime = 3000;
            if (meKills > computerKills) {
                dData1.lines.push("WIN");
            } else {
                dData1.lines.push("LOSE");
            }
            var dScene = createDialogueScene(dData1);
            playScene(60, controls, canvas, dScene);
        }
        var scene = createInfantryScene(data);
        playScene(60, controls, canvas, scene);
        return;
      } else if (opponent.value == "nvb") {
        var opponentT = new AnimatedTileSheet("ninj_.png", 40, 40, 1, 1);
        var playerT = new AnimatedTileSheet("boog_.png", 40, 40, 1, 1);
        var sheet1 = new AnimatedTileSheet("floor.png", 40, 40, 1, 1);
        var floor1 = new AnimatedTileSheet("floor2.png", 40, 40, 1, 1);
        var me = new Character("a", playerData["boog"].weapon, 20);
        me.name = "Boog";
        me.tileSheets = [playerT];
        me.tileIndex = 0;
        me.movementAccelMag = 0.005;
          me.horizontal = 1;
          me.firing = true;

        var computer = new Character("b", playerData["ninj"].weapon, 20);
          computer.movementAccelMag = 0.005;
          computer.name = "Ninj";
          computer.tileSheets = [opponentT];
          computer.tileIndex = 0;
          computer.horizontal = -1;
          computer.firing = true;

                me.x = HIGHEST_X * Math.random();
                me.y = HIGHEST_Y * Math.random();
                computer.x = HIGHEST_X * Math.random();
                computer.y = HIGHEST_Y * Math.random();
        var data = new InfantrySceneData();
        if (Math.random() < 0.5)
            data.player = me;
        else
            data.player = computer;
        data.enableInteraction = false;
        data.blockLength = 40;
        data.blockWidth = MAP_WIDTH;
        data.blockHeight = MAP_HEIGHT;
        var meKills = 0, computerKills = 0;
        data.onCharacterBulletHit = function (controller, character, bullet) {
          Sound.play("ding");
                
            character.hp -= bullet.damage;
            if (character.hp <= 0) {
                Sound.play("dead");
                character.hp = 0;
                if (character == me) computerKills++;
                else if (character == computer) meKills++;
                controller.dialogueText = "Boog: " + meKills + " - " + 
                    "Ninj" +": " + computerKills
                controller.dialogueRemaining = 1500;
                me.hp = me.maxHp;
                computer.hp = computer.maxHp;
                me.x = HIGHEST_X * Math.random();
                me.y = HIGHEST_Y * Math.random();
                computer.x = HIGHEST_X * Math.random();
                computer.y = HIGHEST_Y * Math.random();
                controller.grid.enumerateDots(function (d) {
                    controller.grid.unregisterDot(d);
                });
            }
              };
        data.onUpdate = function (controller) {
          if (computerKills >= 3 || meKills >= 3){
            Sound.play("win");
            controller.finished = true;
          }
        };
          data.backgroundProcesses.push(createDuelBot(me, computer, 1, 60, canvas.width / 1.8));
          data.backgroundProcesses.push(createDuelBot(computer, me, 1, 60, canvas.width / 1.8));
        data.things.push(me);
        data.things.push(computer);


        var tileRects = [{ x1: 0, y1: 0, x2: MAP_WIDTH - 1, y2: Math.floor(MAP_HEIGHT / 6) }, 
            { x1: 0, y1: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 1, x2: MAP_WIDTH - 1, y2: MAP_HEIGHT - 1 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet1;
        data.tiles.push(tile);
        var tileRects2 = [{ x1: 0, y1: Math.ceil(MAP_HEIGHT / 6), x2: MAP_WIDTH - 1, 
            y2: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 2 }];
        var tile2 = new Tile(tileRects2);
        tile2.tileX = tile2.tileY = 0;
        tile2.tileSheet = floor1;
        data.tiles.push(tile2);

        data.onBegin = function (controller) {
            controller.dialogueText = "Ready";
            controller.dialogueRemaining = 1000;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.percentageSpeed = 0.0002;
            dData1.lifetime = 3000;
            if (meKills > computerKills) {
                dData1.lines.push("BOOG WIN");
            } else {
                dData1.lines.push("NINJ WIN");
            }
            var dScene = createDialogueScene(dData1);
            playScene(60, controls, canvas, dScene);
        }
        var scene = createInfantryScene(data);
        playScene(60, controls, canvas, scene);
        return;

      }

        if (opponent.value == "boog") {
            var weapon = playerData["boog"].weapon;
        } else {
            var weapon = new Weapon();
            weapon.damage = 75;
            weapon.lifetime = 2000;
            weapon.color = '#ff0000';
            weapon.speed = 0.275;
            weapon.shots = 10;
            weapon.reload = 300;
            weapon.rate = 300;
        }
        var playerT = new AnimatedTileSheet("me.png", 40, 40, 1, 1);
        var opponentTLoc = opponent.value + "_.png";
        var opponentTR = 40;
        if (opponent.value == "plane")
          opponentTR = 100;
        else if (opponent.value == "pigm")
          opponentTR = 60;

        var opponentT = new AnimatedTileSheet(opponentTLoc, opponentTR, opponentTR, 1, 1);
        playerT.autoTick = true;
        var sheet1 = new AnimatedTileSheet("floor.png", 40, 40, 1, 1);
        var floor1 = new AnimatedTileSheet("floor2.png", 40, 40, 1, 1);
        var me = new Character("a", weapon, 20);
        me.name = "Me";
        me.tileSheets = [playerT];
        me.tileIndex = 0;
        me.movementAccelMag = 0.005;
        var computer = new Character("b", playerData[opponent.value].weapon, opponentTR / 2);
        computer.movementAccelMag = 0.005;
        computer.name = playerData[opponent.value].name;
        computer.tileSheets = [opponentT];
        computer.tileIndex = 0;
        computer.horizontal = 1;
        computer.firing = true;
                me.x = HIGHEST_X * Math.random();
                me.y = HIGHEST_Y * Math.random();
                computer.x = HIGHEST_X * Math.random();
                computer.y = HIGHEST_Y * Math.random();
        if (opponent.value == "navck") {
            computer.movementAccelMag = 0.0165;
            computer.maxSpeed = 8;
            computer.wrapMap = false;
            computer.bounceMultiplier = 1.0;
        } else if (opponent.value == "pigm") {
            computer.maxHp = computer.hp = 5000;
        } else if (opponent.value == "hank") {
            computer.maxHp = computer.hp = 300;
        } else if (opponent.value == "johny") {
            computer.movementAccelMag = 0.04;
            computer.maxSpeed = 4;
            computer.wrapMap = false;
            computer.bounceMultiplier = 0.2;
        } else if (opponent.value == "plane") {
            computer.movementAccelMag = 0.05;
            computer.maxSpeed = 10;
            computer.wrapMap = false;
            computer.maxHp = computer.hp = 2800;
        }
        var data = new InfantrySceneData();
        data.blockLength = 40;
        data.blockWidth = MAP_WIDTH;
        data.blockHeight = MAP_HEIGHT;
        var meKills = 0, computerKills = 0;
        data.onCharacterBulletHit = function (controller, character, bullet) {
            Sound.play("ding");
                
            character.hp -= bullet.damage;
            if (character.hp <= 0) {
                Sound.play("dead");
                character.hp = 0;
                if (character == me) computerKills++;
                else if (character == computer) meKills++;
                controller.dialogueText = "Me: " + meKills + " - " + 
                    playerData[opponent.value].name +": " + computerKills
                controller.dialogueRemaining = 1500;
                me.hp = me.maxHp;
                computer.hp = computer.maxHp;
                me.x = HIGHEST_X * Math.random();
                me.y = HIGHEST_Y * Math.random();
                computer.x = HIGHEST_X * Math.random();
                computer.y = HIGHEST_Y * Math.random();
                controller.grid.enumerateDots(function (d) {
                    controller.grid.unregisterDot(d);
                });
            }
        };
        data.onUpdate = function (controller) {
            if (meKills >= 3) {
                Sound.play("win");
                controller.finished = true;
            } else if (computerKills >= 3) {
                Sound.play("lose");
                controller.finished = true;
            }
        };
        data.things.push(me);
        data.things.push(computer);
        data.player = me;
        delete me.autoHBounce; 

        var tileRects = [{ x1: 0, y1: 0, x2: MAP_WIDTH - 1, y2: Math.floor(MAP_HEIGHT / 6) }, 
            { x1: 0, y1: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 1, x2: MAP_WIDTH - 1, y2: MAP_HEIGHT - 1 }];
        var tile = new Tile(tileRects); 
        tile.tileX = tile.tileY = 0;
        tile.tileSheet = sheet1;
        data.tiles.push(tile);
        var tileRects2 = [{ x1: 0, y1: Math.ceil(MAP_HEIGHT / 6), x2: MAP_WIDTH - 1, 
            y2: MAP_HEIGHT - Math.floor(MAP_HEIGHT / 6) - 2 }];
        var tile2 = new Tile(tileRects2);
        tile2.tileX = tile2.tileY = 0;
        tile2.tileSheet = floor1;
        data.tiles.push(tile2);

        if (opponent.value == "ayb") {
            data.backgroundProcesses.push({
                off: false,
                interval: 100,
                func: function (controller) {
                  if (Math.random() < 0.1) {
                    var aim = { x: me.x - computer.x, y: me.y - computer.y };
                    computer.aimX = aim.x;
                    computer.aimY = aim.y;
                  }
                  computer.horizontal = 1;
                  computer.vertical = 0;
                  if (Math.random() < 0.1) {
                    computer.hp += 170;
                    if (computer.hp > computer.maxHp) 
                      computer.hp = computer.maxHp;
                    computer.vertical = -1;
                  }
                }
            });
        } else if (opponent.value == "johny") {
          var johnyToggle = false;
          data.backgroundProcesses.push({
              off: false,
              interval: 560,
              func: function (controller) {
                johnyToggle = !johnyToggle;
                computer.horizontal = 0;
                computer.vertical = johnyToggle ? 1 : 0;
                if (johnyToggle) {
                    if (Math.random() < 0.6) {
                    var aim = Helpers.aimbot(me.x + me.radius, me.y + me.radius,
                        computer.x + computer.radius, computer.y + computer.radius, 
                        me.vx, me.vy, computer.maxSpeed);
                        computer.aimX = aim.x;
                        computer.aimY = aim.y;
                    }
                }
              }
          });
        } else if (opponent.value == "boog") {
          data.backgroundProcesses.push(createDuelBot(me, computer, 1, 60, canvas.width / 1.8));
        } else if (opponent.value == "nos") {
          data.backgroundProcesses.push(createDuelBot(me, computer, 450, 60, canvas.width / 1.8));
        } else if (opponent.value == "ninj") {
          data.backgroundProcesses.push(createDuelBot(me, computer, 1, 60, canvas.width / 1.8));
        } else if (opponent.value == "ikaze") {
          data.backgroundProcesses.push(createDuelBot(me, computer, 1, 60, canvas.width / 1.8));
        } else if (opponent.value == "plane") {
          data.backgroundProcesses.push({
              off: false,
              interval: 500,
              func: function (controller) {
                  if (Math.random() < 0.5) {
                      var aim = Helpers.aimbot(me.x + me.radius, me.y + me.radius,
                                           computer.x + computer.radius, computer.y + computer.radius, 
                                           me.vx, me.vy, computer.maxSpeed);
                  var angle = Math.random() * 0.17;
                  aim.x = Math.cos(angle) * aim.x - Math.sin(angle) * aim.y;
                  aim.y = Math.sin(angle) * aim.x + Math.cos(angle) * aim.y;
                                           computer.aimX = aim.x;
                                           computer.aimY = aim.y;
                  }
                  computer.horizontal = 0;
                  computer.vertical = 1;
              }
            });
        } else if (opponent.value == "navck") {
          data.backgroundProcesses.push({
              off: false,
              interval: 10,
              func: function (controller) {
                  var aim = Helpers.aimbot(me.x + me.radius, me.y + me.radius,
                      computer.x + computer.radius, computer.y + computer.radius, 
                      me.vx, me.vy, computer.weapon.speed);
                  var angle = Math.random() * 1;
                  aim.x = Math.cos(angle) * aim.x - Math.sin(angle) * aim.y;
                  aim.y = Math.sin(angle) * aim.x + Math.cos(angle) * aim.y;
                  computer.aimX = aim.x;
                  computer.aimY = aim.y;
                  computer.horizontal = 1;
                  computer.vertical = 0;
              }
            });
        } else if (opponent.value == "pigm") {
          data.backgroundProcesses.push({
              off: false,
              interval: 10,
              func: function (controller) {
                  var aim = Helpers.aimbot(me.x + me.radius, me.y + me.radius,
                      computer.x + computer.radius, computer.y + computer.radius, 
                      me.vx, me.vy, computer.weapon.speed);
                  var angle = Math.random() * 0.56;
                  aim.x = Math.cos(angle) * aim.x - Math.sin(angle) * aim.y;
                  aim.y = Math.sin(angle) * aim.x + Math.cos(angle) * aim.y;
                  computer.aimX = aim.x;
                  computer.aimY = aim.y;
                  computer.horizontal = 0;
                  computer.vertical = 0;
              }
            });
        } else if (opponent.value == "hank") {
          data.backgroundProcesses.push({
              off: false,
              interval: 10,
              func: function (controller) {
                  var aim = Helpers.aimbot(me.x + me.radius, me.y + me.radius,
                      computer.x + computer.radius, computer.y + computer.radius, 
                      me.vx, me.vy, computer.weapon.speed);
                  var angle = Math.random() * 1.8;
                  aim.x = Math.cos(angle) * aim.x - Math.sin(angle) * aim.y;
                  aim.y = Math.sin(angle) * aim.x + Math.cos(angle) * aim.y;
                  computer.aimX = aim.x;
                  computer.aimY = aim.y;
                  computer.horizontal = 0;
                  computer.vertical = 0;
                  if (Math.random() < 0.05) {
                      computer.x = HIGHEST_X * Math.random();
                      computer.y = HIGHEST_Y * Math.random();
                  }
              }
            })
        } else {
            alert("Error: Programmer is retarded");
            throw "ur retarded";
        }

        data.onBegin = function (controller) {
            controller.dialogueText = "Ready";
            controller.dialogueRemaining = 1000;
        }
        data.onFinish = function (controller) {
            var dData1 = new DialogueSceneData();
            dData1.percentageSpeed = 0.0002;
            dData1.lifetime = 3000;
            if (meKills > computerKills) {
                dData1.lines.push("WIN");
            } else {
                dData1.lines.push("LOSE");
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

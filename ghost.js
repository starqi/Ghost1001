////////////////////////////////////////////////////////////////////////////////////////////////////
// AI
////////////////////////////////////////////////////////////////////////////////////////////////////

function createStrafingBot(target, me, interval, strafeTicks, aimbot, angleOffset) {
    var ticksLeft = 0;
    return { 
        off: false,
        interval: interval,
        func: function (controller) {
            if (me.off) return;
            if (this.off) {
                me.horizontal = 0;
                return;
            }
            ticksLeft -= 1;
            if (ticksLeft < 0)
                ticksLeft = 0;
            if (me.horizontal == 0) {
                me.horizontal = 1;
            } else if (ticksLeft == 0) {
                me.horizontal *= -1;
                ticksLeft = Math.max(strafeTicks * Math.random(), strafeTicks / 2);
            }
            if (aimbot) {
                var aim = Helpers.aimbot(target.x + target.radius, target.y + target.radius,
                    me.x + me.radius, me.y + me.radius, target.vx, target.vy, me.weapon.speed);
            } else {
                var aim = { x: target.x - me.x, y: target.y - me.y };
            }
            var angle = Math.random() * angleOffset - (angleOffset / 2);
            aim.x = Math.cos(angle) * aim.x - Math.sin(angle) * aim.y;
            aim.y = Math.sin(angle) * aim.x + Math.cos(angle) * aim.y;
            me.aimX = aim.x;
            me.aimY = aim.y;
        }
    };
}

var GAP = 2;
// Approximates dodging along a LINE, will run into bullets when it changes motion along a LINE
// Need ML for specific cases...
function createDuelBot(target, me, interval, fps, shootDist) {
    var dotToDodge = null;

    var isUnavoidable = function (strafe, dot, d) {
        var p2 = Helpers.posOnReverse(me.x, me.y, strafe[0], strafe[1], me.movementAccelMag,
            me.maxSpeed, d, fps);
        var dx2 = dot.vx * d + dot.x;
        var dy2 = dot.vy * d + dot.y;
        var result = Helpers.dotRectCollision(dx2, dy2, 
            p2[0] - GAP, p2[1] - GAP,
            p2[0] + me.width + GAP, p2[1] + me.height + GAP);
        //console.log(result);
        return result;
    };

    var getStrafeDir = function (dot) {
        var strafeX = -dot.vx;
        var strafeY = -dot.vy;
        var mag = Helpers.magnitude(strafeX, strafeY);
        if (mag == 0) {
            strafeX = 0;
            strafeY = 0;
        } else {
            strafeX /= mag;
            strafeY /= mag;
        }
        if (me.horizontal == 0) me.horizontal == 1;
        if (me.horizontal == 1) {
            var temp = strafeX;
            strafeX = strafeY;
            strafeY = -temp;
        } else if (me.horizontal == -1) {
            var temp = strafeX;
            strafeX = -strafeY;
            strafeY = temp;
        }
        strafeX *= me.maxSpeed;
        strafeY *= me.maxSpeed;
        return [strafeX, strafeY];
    };

    return {
        off: false,
        interval: interval,
        func: function (controller) {
            if (me.off) return;
            var fightDist = Helpers.magnitude(target.x - me.x, target.y - me.y);
            if (fightDist <= shootDist * 0.8) {
                me.vertical = 0;
            } else if (dotToDodge == null) {
                me.vertical = 1;
            } 
            if (fightDist <= shootDist) {
                me.firing = true;
            } else {
                me.firing = false;
            }

            var newX = me.x - GAP;
            var newY = me.y - GAP;
            var newX2 = me.x + me.width + GAP;
            var newY2 = me.y + me.height + GAP;

            if (dotToDodge != null) {
                var dodged = (function () { 
                    var strafe = getStrafeDir(dotToDodge);
                    var d = Helpers.timeToHitRect(dotToDodge.x, dotToDodge.y, dotToDodge.vx, dotToDodge.vy, 
                        newX, newY, newX2, newY2, strafe[0], strafe[1]);
                    if (d === false)
                        return true;
                    else 
                        return isUnavoidable(strafe, dotToDodge, d);
                })();
                if (!dodged) {
                    me.aimX = -dotToDodge.vx;
                    me.aimY = -dotToDodge.vy;
                    return;
                }
                //dotToDodge.dodgedBy = me;
            }

            dotToDodge = null;
            var lowestTime = null;
            var lowestDot = null;
            controller.grid.enumerateDots(function (dot) {
                if (dot.owner == me || dot.dodgedBy == me) return false;
                var strafe = getStrafeDir(dot);
                var d = Helpers.timeToHitRect(dot.x, dot.y, dot.vx, dot.vy, 
                    newX, newY, newX2, newY2, strafe[0], strafe[1]);
                if (d !== false) {
                    if (!isUnavoidable(strafe, dot, d)) {
                        if (lowestTime === null || lowestTime > d) {
                            lowestTime = d;
                            lowestDot = dot;
                        }
                    }
                }
                return false;
            });

            if (lowestTime != null) {
                if (me.horizontal == 0)
                    me.horizontal = Math.random() < 0.5 ? -1 : 1;
                else 
                    me.horizontal *= -1;
                me.aimX = -lowestDot.vx;
                me.aimY = -lowestDot.vy;
                dotToDodge = lowestDot;
                vertical = 0;
            } else {
                var aim = Helpers.aimbot(target.x + target.radius, target.y + target.radius,
                    me.x + me.radius, me.y + me.radius, target.vx, target.vy, me.weapon.speed);
                var timeToHit = Helpers.magnitude(target.x - me.x, target.y - me.y) 
                    / me.weapon.speed;
                var p2 = Helpers.posOnReverse(
                    target.x, target.y, target.vx, target.vy,
                    target.movementAccelMag, target.maxSpeed, timeToHit, fps);
                p2[0] -= me.x;
                p2[1] -= me.y;
                var rand = Math.random();
                if (rand >= 0.32) 
                    rand = 1.0;
                me.aimX = rand * (aim.x - p2[0]) + p2[0];
                me.aimY = rand * (aim.y - p2[1]) + p2[1];
            }
        }
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Trash Engine
////////////////////////////////////////////////////////////////////////////////////////////////////

function InfantrySceneData() {
    this.blockWidth = 10;
    this.blockHeight = 10;
    this.blockLength = 50;
    this.things = [];
    this.tiles = [];
    this.backgroundProcesses = [];
    this.player = null;
    this.enableInteraction = true;
    this.floorColor = '#223322';
    this.outOfMapColor = 'black';
    this.bounceMultiplier = 0.95;
    this.frictionAccelMag = 0.006;
    this.onCharacterBulletHit = function (controller, character, bullet) {};
    this.onCharacterThingCollision = function (controller, character, thing) {};
    this.onUpdate = function (controller) {};
    this.onBegin = function (controller) {};
    this.onFinish = function (controller) {};
}

function BackgroundProcess(func, interval) {
    this.func = func;
    this.interval = interval;
}

function AnimatedTileSheet(relativePath, fileWidth, fileHeight, animateWidth, animateHeight) {

    this.image = new Image();
    this.image.src = relativePath;
    this.animateWidth = animateWidth;
    this.animateHeight = animateHeight;
    this.animateX = this.animateY = 0;
    this.tileWidth = fileWidth / this.animateWidth;
    this.tileHeight = fileHeight / this.animateHeight;
    this.autoTick = false;
    this.alive = true;
    this.tickInterval = 1000;
    this.tickRemaining = 0;

    this.tick = function () {
        if (this.alive) {
            this.animateX++;
            if (this.animateX >= this.animateWidth) {
                this.animateX = 0;
                this.animateY++;
                if (this.animateY >= this.animateHeight) {
                    this.animateY = 0;
                    if (this.autoTick) {
                        return true;
                    } else {
                        this.alive = false;
                        return true;
                    }
                }
            }
            return false;
        } else {
            return true;
        }
    };

    this.draw = function (context, x, y, width, height) {
        context.drawImage(this.image, this.animateX * this.tileWidth, this.animateY * this.tileHeight,
            this.tileWidth, this.tileHeight, x, y, width, height);
    };
}

function Thing(x, y, solid) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.characterFlag = false;
    this.notSolidFlag = !solid;
    this.tileIndex = -1;
    this.tileSheets = [];
}

function Tile(blockRects) {
    this.blockRects = blockRects;
    this.tileSheet = null;
    this.tileX = 0;
    this.tileY = 0;
}

function Character(id, weapon, radius) {

    //this.bounceMultiplier = 1;
    //this.autoVBounce = false;
    this.disableBackpeddle = true;
    this.autoHBounce = true;
    this.wrapMap = false;
    this.off = false;
    this.maxHp = this.hp = 1000;
    this.name = 'Character';
    this.id = id;
    this.maxSpeed = 0.0875;
    this.movementAccelMag = 0.004;
    this.x = 0;
    this.y = 0;
    this.ax = 0;
    this.ay = 0;
    this.vx = 0;
    this.vy = 0;
    this.aimX = 0;
    this.aimY = -1;
    this.horizontal = 0;
    this.vertical = 0;
    this.firing = false;
    this.timeTillShot = 0;
    this.shotsBeforeReload = 0;
    this.weapon = weapon;
    this.characterFlag = true;
    this.tileIndex = -1;
    this.tileSheets = [];

    var bulletIdCounter = 0;
    this.createBullet = function () {
        var bullet = {};
        bullet.id = this.id + bulletIdCounter;
        bulletIdCounter++;
        if (bulletIdCounter > 1000) bulletIdCounter = 0;
        bullet.owner = this;
        bullet.x = this.x + this.radius; 
        bullet.y = this.y + this.radius;
        bullet.vx = this.aimX;
        bullet.vy = this.aimY;
        Helpers.changeMagnitudeRef('vx', 'vy', bullet, this.weapon.speed);
        bullet.damage = this.weapon.damage;
        bullet.lifetime = this.weapon.lifetime;
        bullet.color = this.weapon.color;
        return bullet;
    };

    this.setRadius = function (radius) {
        this.radius = radius;
        this.width = radius * 2;
        this.height = radius * 2;
    }

    this.setRadius(radius);
}

function Weapon() {
    this.damage = 200;
    this.lifetime = 2000;
    this.color = '#00ffff';
    this.speed = 0.225;
    this.shots = 3;
    this.reload = 1000;
    this.rate = 200;
}

function createInfantryScene(data) {

    var controller = {
        grid: new Grid(data.blockWidth, data.blockHeight, data.blockLength), 
        dialogueText: '',
        dialogueRemaining: 0,
        fadeRemaining: 2000,
        fadeStart: 2000,
        fadeDarkerElseLighter: false,
        finished: false
    };

    var processes = [];

    (function () {
        for (var i = 0; i < data.things.length; ++i) {
            controller.grid.registerRect(data.things[i]);
        }
        for (var i = 0; i < data.tiles.length; ++i) {
            for (var j = 0; j < data.tiles[i].blockRects.length; ++j) {
                var rect = data.tiles[i].blockRects[j];
                for (var x = rect.x1; x <= rect.x2; ++x) {
                    for (var y = rect.y1; y <= rect.y2; ++y) {
                        controller.grid.registerTile(x, y, data.tiles[i]);
                    }
                }
            }
        }
    })();

    var begin = function (context) {
        data.onBegin(controller);
        for (var i = 0; i < data.backgroundProcesses.length; ++i) {
            (function () {
                var process = data.backgroundProcesses[i];
                processes.push(setInterval(function () {
                    process.func(controller);
                }, process.interval));
            })();
        }
    };

    var draw = function (context, width, height) {

        if (controller.fadeRemaining > 0) {
            context.globalAlpha = 1;
        }

        Draw.drawRect(context, 0, 0, width, height, data.outOfMapColor);

        if (controller.fadeRemaining > 0) {
            if (controller.fadeDarkerElseLighter)
                context.globalAlpha = controller.fadeRemaining / controller.fadeStart;
            else
                context.globalAlpha = 1 - controller.fadeRemaining / controller.fadeStart;
        } else {
            context.globalAlpha = controller.fadeDarkerElseLighter ? 0 : 1;
        }

        if (data.player) {
            var x = data.player.x + data.player.radius;
            var y = data.player.y + data.player.radius;
        } else {
            var x = 0;
            var y = 0;
        }
        var x1 = x - width / 2;
        var y1 = y - height / 2;
      
        var bgX1 = -x1;
        var bgY1 = -y1;
        var bgX2 = controller.grid.pixelWidth - x1;
        var bgY2 = controller.grid.pixelHeight - y1;

        if (bgX1 < 0) bgX1 = 0;
        if (bgY1 < 0) bgY1 = 0;
        if (bgX2 >= controller.grid.pixelWidth) bgX2 = controller.grid.pixelWidth - 1;
        if (bgY2 >= controller.grid.pixelHeight) bgY2 = controller.grid.pixelHeight - 1;

        Draw.drawRect(context, bgX1, bgY1, bgX2, bgY2, data.floorColor);

        controller.grid.loopPixels(x1, y1, x1 + width - 1, y1 + height - 1, function (b, i, j) {
            if (b.tile) {
                var tileX = i * controller.grid.blockLength - x1;
                var tileY = j * controller.grid.blockLength - y1;
                if (b.tile.tileSheet) {
                    b.tile.tileSheet.animateX = b.tile.tileX;
                    b.tile.tileSheet.animateY = b.tile.tileY;
                    b.tile.tileSheet.alive = false;
                    b.tile.tileSheet.draw(context, tileX, tileY, controller.grid.blockLength, controller.grid.blockLength);
                } else {
                    Draw.drawRect(context, tileX, tileY, controller.grid.blockLength, controller.grid.blockLength, '#242424');
                }
            }
        });

        controller.grid.loopPixels(x1, y1, x1 + width - 1, y1 + height - 1, function (b, i, j) {
            for (var key in b.rects) {
                var rect = b.rects[key];
                var rectX = rect.x - x1;
                var rectY = rect.y - y1;
                if (rect.characterFlag) {
                    var tile = rect.tileSheets[rect.tileIndex];
                    if (tile) {
                        context.save();
                        context.translate(rectX + rect.radius, rectY + rect.radius);
                        context.rotate(Math.atan2(rect.aimY, rect.aimX));
                        tile.draw(context, -rect.radius, -rect.radius, rect.width, rect.height);
                        context.restore();
                    } else{
                        Draw.drawRect(context, rectX, rectY, rect.width, rect.height, 'white');
                    } 
                    var hpBarX = rectX - 5;
                    var hpBarY = rectY - 12;
                    var hpBarWidth = rect.width + 10;
                    Draw.drawRect(context, hpBarX, hpBarY, hpBarWidth, 4, '#AA0000');
                    Draw.drawRect(context, hpBarX, hpBarY, (rect.hp / rect.maxHp) * hpBarWidth, 4, '#00AA00');
                    Draw.drawText(context, rectX - 1.5 * rect.name.length, rectY - 18, rect.name, 'white', 8);
                } else {
                    var tile = rect.tileSheets[rect.tileIndex];
                    if (tile)
                        tile.draw(context, rectX, rectY, rect.width, rect.height);
                    else
                        Draw.drawRect(context, rectX, rectY, rect.width, rect.height, 'white');
                }
            }
        });

        controller.grid.loopPixels(x1, y1, x1 + width - 1, y1 + height - 1, function (b, i, j) {
            for (var key in b.dots) {
                var dot = b.dots[key];
                Draw.drawCircle(context, dot.x - x1, dot.y - y1, 2, dot.color);
            }

            return false;
        });
       
        var savedAlpha = context.globalAlpha;
        context.globalAlpha = 1;
        if (controller.dialogueRemaining > 0) {
            Draw.drawRect(context, 0, height * 0.8 - 10, width, 40, '#222222');
            Draw.drawRectBorder(context, 0, height * 0.8 - 10, width, 40, 'black', 2);
            Draw.drawText(context, width / 2 - controller.dialogueText.length * 4.9, height * 0.8 + 15, controller.dialogueText, 'white', 16);
        }
        context.globalAlpha = savedAlpha;
    };

    var update = function (controls, diff) { 

        if (controller.fadeRemaining > 0) {
            controller.fadeRemaining -= diff;
            if (controller.fadeRemaining < 0) {
                controller.fadeRemaining = 0;
            }
        }

        if (controller.dialogueRemaining > 0) {
            controller.dialogueRemaining -= diff;
            return false;
        } else if (controller.dialogueRemaining < 0) {
            controller.dialogueRemaining = 0;
        }
        
        if (data.onUpdate)
            data.onUpdate(controller);

        if (data.player && data.enableInteraction) {
            data.player.vertical = controls.vertical;
            if (data.player.disableBackpeddle) {
                if (data.player.vertical == -1) 
                    data.player.vertical = 0;
            }
            data.player.horizontal = controls.horizontal;
            data.player.firing = controls.mouse;
            data.player.aimX = controls.aimX;
            data.player.aimY = controls.aimY;
        }

        controller.grid.enumerateDots(function (bullet) {
            bullet.lifetime -= diff;
            if (bullet.lifetime < 0 || controller.grid.isDotOutside(bullet)) {
                controller.grid.unregisterDot(bullet);
                return;
            }
            controller.grid.removeDot(bullet);
            bullet.x += bullet.vx * diff;
            bullet.y += bullet.vy * diff;
            controller.grid.addDot(bullet);
            controller.grid.loopDotCollideWithRect(bullet, function (character) {
                if (character.characterFlag && !character.off) {
                    if (bullet.owner != character) {
                        if (!data.onCharacterBulletHit(controller, character, bullet))
                            controller.grid.unregisterDot(bullet);
                        return true;
                    }
                }
                return false;
            });
        });
        
        controller.grid.enumerateRects(function (character) {

            var tileSheets = character.tileSheets[character.tileIndex];
            if (tileSheets) {
                tileSheets.tickRemaining -= diff;
                if (tileSheets.tickRemaining <= 0) {
                    tileSheets.tickRemaining = tileSheets.tickInterval;
                    tileSheets.tick(); 
                }
            }

            if (!character.characterFlag || character.off) return;

            var addAccel = function (a, b, c, d, vertical) {
                var direction = vertical ? character.horizontal : character.vertical;
                if (direction == 1) {
                    var aimX = (vertical ? character.aimY : character.aimX) * a;
                    var aimY = (vertical ? character.aimX : character.aimY) * b;
                } else if (direction == -1) {
                    var aimX = (vertical ? character.aimY : character.aimX) * c;
                    var aimY = (vertical ? character.aimX : character.aimY) * d;
                }
                if (direction != 0) {
                    var r = Helpers.changeMagnitude(aimX, aimY, character.movementAccelMag);
                    character.ax += r.x;
                    character.ay += r.y;
                } 
            };
            
            if (character.horizontal == 0 && character.vertical == 0) {
                if (Helpers.magnitude(character.vx, character.vy) < data.frictionAccelMag) {
                    character.vx = 0;
                    character.vy = 0;
                    character.ax = 0;
                    character.ay = 0;
                } else {
                    var frictionAccel = Helpers.changeMagnitude(character.vx, character.vy, data.frictionAccelMag);
                    character.ax = -frictionAccel.x;
                    character.ay = -frictionAccel.y;
                    character.vx += character.ax;
                    character.vy += character.ay;
                }
            } else {
                addAccel(1, 1, -1, -1, false);
                addAccel(1, -1, -1, 1, true);
                Helpers.changeMagnitudeRef('ax', 'ay', character, character.movementAccelMag);
                character.vx += character.ax;
                character.vy += character.ay;
            }
            if (Helpers.magnitude(character.vx, character.vy) > character.maxSpeed) {
                Helpers.changeMagnitudeRef('vx', 'vy', character, character.maxSpeed);
            }

            (function () {
                var testCollision = function () {
                    var collision = controller.grid.isRectOutside(character);
                    if (collision) return true;
                    controller.grid.loopRectCollideWithRect(character, function (collidedRect) {
                        if (collidedRect.characterFlag) return false;
                        data.onCharacterThingCollision(controller, character, collidedRect);
                        if (collidedRect.notSolidFlag) {
                            return false;
                        } else {
                            collision = true;
                            return true; 
                        }
                    });
                    if (collision) return true;
                    return false;
                };
                var mx = character.vx * diff;
                var my = character.vy * diff;
                controller.grid.removeRect(character);

                if (character.wrapMap) {
                    if (character.x + character.width > controller.grid.pixelWidth)
                        character.x = 0;
                    else if (character.x < 0)
                        character.x = controller.grid.pixelWidth - character.width;
                    
                    if (character.y + character.height > controller.grid.pixelHeight) 
                        character.y = 0;
                    else if (character.y < 0)
                        character.y = controller.grid.pixelHeight - character.height;

                    character.x += mx;
                    character.y += my;
                } else {

                    character.x += mx;
                    var collisionX = testCollision();
                    character.x -= mx;
                    character.y += my;
                    var collisionY = testCollision();
                    character.y -= my;
                    if (collisionX) {
                        if (character.bounceMultiplier !== undefined)
                            character.vx *= -character.bounceMultiplier;
                        else
                            character.vx *= -data.bounceMultiplier;
                        if (character.autoVBounce)
                            character.vertical *= -1;
                    } else {
                        character.x += mx;
                    }
                    if (collisionY) {
                        if (character.bounceMultiplier !== undefined)
                            character.vy *= -character.bounceMultiplier;
                        else
                            character.vy *= -data.bounceMultiplier;
                        if (character.autoHBounce)
                            character.horizontal *= -1;
                    } else {
                        character.y += my;
                    }
                }

                controller.grid.addRect(character);
            })();
            
            (function () {
                character.timeTillShot -= diff;
                if (character.timeTillShot < 0) character.timeTillShot = 0;
                if (character.firing) {
                    if (character.shotsBeforeReload >= character.weapon.shots) { 
                        character.timeTillShot = character.weapon.reload;
                        character.shotsBeforeReload = 0;
                    } else if (character.timeTillShot == 0) { 
                        var reducedForDot = Helpers.changeMagnitude(character.aimX, character.aimY, character.weapon.speed);
                        var bullet = character.createBullet();
                        controller.grid.registerDot(bullet);
                        character.timeTillShot = character.weapon.rate; 
                        character.shotsBeforeReload++;
                    }
                }
            })();
        });

        if (controller.finished) {
            (function () {
                for (var i = 0; i < processes.length; ++i)
                    clearInterval(processes[i]);
            })();
            data.onFinish(controller);
            return true;
        }

        return false;
    };

    return { begin: begin, draw: draw, update: update };
}

function DialogueSceneData() {
    this.lines = [];
    this.percentageSpeed = 0.0001;
    this.lifetime = 8000;
    this.fontSize = 14;
    this.fontColor = "#eeffff"
    this.onFinish = function () {};
}

function createDialogueScene(data) {

    var y = 1;
    var lifetime = data.lifetime;

    var update = function (controls, diff) {
        y -= diff * data.percentageSpeed;
        lifetime -= diff;
        if (lifetime <= 0) {
            data.onFinish();
            return true;
        } else {
            return false;
        }
    };

    var draw = function (context, width, height) {
        context.globalAlpha = 1;
        Draw.drawRect(context, 0, 0, canvas.width, canvas.height, 'black');
        for (var i = 0; i < data.lines.length; ++i) {
            Draw.drawText(context, 10, y * canvas.height + i * 25, data.lines[i], data.fontColor, data.fontSize);
        }
    };

    return { begin: null, draw: draw, update: update };
}

function playScene(fps, controls, canvas, scene) {
    var delay = 1000 / fps;
    var lastFrame = null;
    var context = canvas.getContext('2d');
    if (scene.begin) 
        scene.begin(context);
    var id = setInterval(function () {
        var now = Date.now()
        var diff = lastFrame === null ? delay : now - lastFrame;
        lastFrame = now;
        var result = scene.update(controls, diff);
        scene.draw(context, canvas.width, canvas.height);
        if (result) clearInterval(id);
    }, delay);
}

function registerControls(canvas) {

    var states = {
        mouse: false, 
        vertical: 0,
        horizontal: 0,
        aimX: 0,
        aimY: -1
    }

    var up = false, down = false, right = false, left = false;

    var keyDown = function (e) {
        if (e.keyCode == 87) {
            up = true;
            states.vertical = 1;
        } else if (e.keyCode == 83) {
            down = true;
            states.vertical = -1;
        } else if (e.keyCode == 65) {
            left = true;
            states.horizontal = 1;
        } else if (e.keyCode == 68) {
            right = true;
            states.horizontal = -1;
        }
    };

    var keyUp = function (e) {
        if (e.keyCode == 87) {
            up = false; 
            states.vertical = down ? -1 : 0;
        } else if (e.keyCode == 83) {
            down = false;
            states.vertical = up ? 1 : 0;
        } else if (e.keyCode == 65) {
            left = false;
            states.horizontal = right ? -1 : 0;
        } else if (e.keyCode == 68) {
            right = false;
            states.horizontal = left ? 1 : 0;
        }
    };
    
    var mouseMove = function (e) {
        var r = canvas.getBoundingClientRect();
        states.aimX = e.clientX - r.left - canvas.width / 2;
        states.aimY = e.clientY - r.top - canvas.height / 2;
        if (states.aimX == 0 && states.aimY == 0) {
            states.aimX = 0;
            states.aimY = -1;
        }
    };
     
    var mouseDown = function (e) {
        states.mouse = true;
    }

    var mouseUp = function (e) {
        states.mouse = false;
    }

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    
    return states;
}

Helpers = {

    magnitude: function(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },

    changeMagnitude: function(x, y, m) {
        var original = this.magnitude(x, y);
        if (original == 0) return {x: 0, y: 0};
        var a = m / original;
        return {x: x * a, y: y * a};
    },

    changeMagnitudeRef: function(xKey, yKey, obj, m) {
        var original = this.magnitude(obj[xKey], obj[yKey]);
        if (original == 0) {
            obj[xKey] = 0;
            obj[yKey] = 0;
        } else {
            var a = m / original;
            obj[xKey] *= a;
            obj[yKey] *= a;
        }
    },

    rectCollision: function(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        return !(ay1 > by2 || ax1 > bx2 || ay2 < by1 || ax2 < bx1);
    },

    dotRectCollision: function(x, y, x1, y1, x2, y2) {
        return !(x > x2 || y > y2 || x < x1 || y < y1);
    },

    aimbot: function (player_x, player_y, ai_x, ai_y, player_move_x, player_move_y, velocity) {
        var x = player_x - ai_x;
        var y = player_y - ai_y;
        var c = Math.pow(x, 2) + Math.pow(y, 2);
        var b = 2 * x * player_move_x + 2 * y * player_move_y;
        var a = Math.pow(player_move_x, 2) + Math.pow(player_move_y, 2) - Math.pow(velocity, 2);
        var d = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
        var t = (-b - d) / (2 * a)
        if (t < 0) t = (-b + d) / (2 * a)
        return { x: x + t * player_move_x, y: y + t * player_move_y };
    },

    timeToHit: function(a1, a2, va1, va2) {
        var k = va1 - va2;
        if (k == 0) return false;
        var k = (a2 - a1) / k;
        if (k < 0) return false;
        return k;
    },

    swap: function(xy) {
        let temp = xy.x;
        xy.x = xy.y;
        xy.y = temp;
    },

    timeToHitRect: function(x, y, vx, vy, ax, ay, bx, by, rvx, rvy) { // Must have ax < bx, ay < by (valid rect)
        // Collision interval for each axis, always x < y
        var xt = {x: this.timeToHit(x, ax, vx, rvx), y: this.timeToHit(x, bx, vx, rvx)};
        var yt = {x: this.timeToHit(y, ay, vy, rvy), y: this.timeToHit(y, by, vy, rvy)};
        // If any interval doesn't exist, will never collide
        if (xt.x === false && xt.y === false) return false;
        if (yt.x === false && yt.y === false) return false;
        // Preprocess false to 0 to create valid collision intervals (think about x or y = 0 case)
        if (xt.x === false) xt.x = 0;
        else if (xt.y === false) xt.y = 0;
        if (yt.x === false) yt.x = 0;
        else if (yt.y === false) yt.y = 0;
        // Make it so that x < y always
        if (xt.y < xt.x) this.swap(xt);
        if (yt.y < yt.x) this.swap(yt);
        // If no overlap, then will never collide
        if (xt.x > yt.y || yt.x > xt.y) return false;
        // If overlap, then pick the 2nd biggest along timeline (visualize)
        return Math.max(xt.x, yt.x);
    },

    posOnReverse: function (x, y, vx, vy, accel, maxSpeed, d, fps) {
        //var tick = 1000 / fps;
        var currentSpeed = this.magnitude(vx, vy);
        var timeToZero = currentSpeed / accel;// * tick;
        var timeToMax = maxSpeed / accel;// * tick;

        if (currentSpeed === 0) {
            return [x, y];
        } else {
            var nx = vx / currentSpeed;
            var ny = vy / currentSpeed;
        }

        if (d < timeToZero) {
            var p2x = currentSpeed / 2 * nx * d + x;
            var p2y = currentSpeed / 2 * ny * d + y;
        } else if (d < timeToZero + timeToMax) {
            var p2x = currentSpeed / 2 * nx * timeToZero + x;
            var p2y = currentSpeed / 2 * ny * timeToZero + y;
            p2x += maxSpeed / 2 * -nx * (d - timeToZero);
            p2y += maxSpeed / 2 * -ny * (d - timeToZero);
        } else {
            var p2x = currentSpeed / 2 * nx * timeToZero + x;
            var p2y = currentSpeed / 2 * ny * timeToZero + y;
            p2x += maxSpeed / 2 * -nx * timeToMax;
            p2y += maxSpeed / 2 * -ny * timeToMax;
            p2x += maxSpeed * -nx * (d - timeToMax - timeToZero);
            p2y += maxSpeed * -ny * (d - timeToMax - timeToZero);
        }

        return [p2x, p2y];
    }
}

Sound = {

    loaded: {},

    load: function (name, path, times, onFinish) {
        if (times === undefined) 
            times = 1;
        this.loaded[name] = {
            index: 0,
            array: []
        };
        for (var i = 0; i < times; ++i) {
            var audio = new Audio();
            audio.src = path;
            audio.preload = 'auto';
            if (onFinish !== undefined)
                audio.addEventListener('canplaythrough', onFinish);
            this.loaded[name].array.push(audio);
        }
    },

    play: function (name) {
        var a = this.loaded[name];
        a.array[a.index].play();
        a.index++;
        a.index %= a.array.length;
    },

    playAndFade: function (name, duration, fadeDuration, interval) {
        var audio = this.loaded[name];
        audio.play();
        setTimeout(function () {
            var remaining = fadeDuration;
            var repeat = setInterval(function () {
                remaining -= interval;
                if (remaining <= 0) {
                    audio.pause();
                    audio.currentTime = 0;
                    clearInterval(repeat);
                    return;
                }
                audio.volume = remaining / fadeDuration;
            }, interval);
        }, duration);
    }
}

Draw = {

    drawCircle: function (context, x, y, r, c) {
        context.fillStyle = c;
        context.beginPath();
        context.arc(x, y, r, 2 * Math.PI, 0, false);
        context.fill();
    },

    drawCircleBorder: function (context, x, y, r, c, s) {
        context.lineWidth = s;
        context.strokeStyle = c;
        context.beginPath();
        context.arc(x, y, r, 2 * Math.PI, 0, false);
        context.stroke();
    },

    drawRect: function (context, x, y, width, height, c) {
        context.fillStyle = c;
        context.fillRect(x, y, width, height);
    },

    drawRectBorder: function (context, x, y, width, height, c, s) {
        context.strokeStyle = c;
        context.lineWidth = s;
        context.beginPath();
        context.rect(x, y, width, height);
        context.stroke();
    },

    drawLine: function (context, x1, y1, x2, y2, c, s) {
        context.lineWidth = s;
        context.strokeStyle = c;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    },

    drawText: function (context, x, y, text, c, size) {
        context.font = size + 'pt Arial';
        context.fillStyle = c;
        context.fillText(text, x, y);
    }
}

function Grid(blockWidth, blockHeight, blockLength) { 

    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.blockLength = blockLength;

    this.isRectOutside = function (rect) {
        return rect.x < 0 || rect.y < 0 ||
            rect.x + rect.width >= this.pixelWidth || rect.y + rect.height >= this.pixelHeight;
    };

    this.isDotOutside = function (dot) {
        return dot.x < 0 || dot.y < 0 || dot.x >= this.pixelWidth || dot.y >= this.pixelHeight;
    };

    this.getPixelWidth = function () {
        return this.pixelWidth;
    };

    this.getPixelHeight = function () {
        return this.pixelHeight;
    };

    this.pixelToBlock = function (x, y) {
        return {
            x: Math.floor(x / blockLength),
            y: Math.floor(y / blockLength)
        };
    };

    this.enumerateRects = function (func) {
        for (rectKey in all.rects) 
            func(all.rects[rectKey]); 
    };

    this.enumerateDots = function (func) {
        for (dotKey in all.dots)
            func(all.dots[dotKey]);
    };

    this.loop = function (bx1, by1, bx2, by2, func) {
        if (bx1 < 0) bx1 = 0;
        if (by1 < 0) by1 = 0;
        if (bx2 >= blockWidth) bx2 = blockWidth - 1;
        if (by2 >= blockHeight) by2 = blockHeight - 1;
        for (var i = bx1; i <= bx2; ++i) {
            for (var j = by1; j <= by2; ++j) {
                if (func(blocks[i][j], i, j)) return;
            }
        }
    };

    this.loopPixels = function (x1, y1, x2, y2, func) {
        var a = this.pixelToBlock(x1, y1);
        var b = this.pixelToBlock(x2, y2);
        this.loop(a.x, a.y, b.x, b.y, func);
    };

    this.loopRect = function (rect, func) {
        this.loopPixels(rect.x, rect.y, rect.x + rect.width - 1, rect.y + rect.height - 1, func); 
    };

    this.loopDot = function (dot, func) {
        var a = this.pixelToBlock(dot.x, dot.y);
        if (a.x < 0 || a.x >= blockWidth || a.y < 0 || a.y >= blockHeight) return;
        func(blocks[a.x][a.y], a.x, a.y);
    };

    this.loopTile = function (tile, func) {
        var found = blocks[tile.x][tile.y].tile;
        if (found != null)
            func(found);
    };

    this.loopDotCollideWithRect = function (dot, func) {
        this.loopDot(dot, function (b, i, j) {
            b.enumerateDotTouchRects(dot, func);
        });
    };

    this.loopRectCollideWithRect = function (rect, func) {
        this.loopRect(rect, function (b, i, j) {
            return b.enumerateRectTouchRects(rect, func);
        });
    };

    this.addRect = function (rect) {
        this.loopRect(rect, function (b, i, j) {
            b.rects[rect.id] = rect; 
            return false; 
        });
    };

    this.removeRect = function (rect) {
        this.loopRect(rect, function (b, i, j) {
            delete b.rects[rect.id]; 
            return false; 
        });
    };

    this.registerRect = function (rect) {
        this.addRect(rect);
        all.rects[rect.id] = rect;
    };

    this.unregisterRect = function (rect) {
        this.removeRect(rect);
        delete all.rects[rect.id];
    };

    this.addDot = function (dot) {
        this.loopDot(dot, function (b, i, j) {
            b.dots[dot.id] = dot;
        });
    };

    this.removeDot = function (dot) {
        this.loopDot(dot, function (b, i, j) {
            delete b.dots[dot.id] 
        });
    };

    this.registerDot = function (dot) {
        this.addDot(dot);
        all.dots[dot.id] = dot;
    };

    this.unregisterDot = function (dot) {
        this.removeDot(dot);
        delete all.dots[dot.id];
    };
    
    this.registerTile = function (x, y, tile) {
        blocks[x][y].tile = tile;
    };

    this.unregisterTile = function (x, y) {
        blocks[x][y].tile = null;
    };

    function Block() {

        this.dots = {};
        this.rects = {};
        this.tile = null;

        this.enumerateDotTouchRects = function (dot, func) {
            for (var key in this.rects) {
                var potentialRect = this.rects[key];
                if (Helpers.dotRectCollision(dot.x, dot.y, 
                    potentialRect.x, potentialRect.y,
                    potentialRect.x + potentialRect.width,
                    potentialRect.y + potentialRect.height)) {
                    if (func(potentialRect)) return true;
                }
            }
            return false;
        };

        this.enumerateRectTouchRects = function (rect, func) {
            for (var key in this.rects) {
                var potentialRect = this.rects[key];
                if (Helpers.rectCollision(potentialRect.x, potentialRect.y,
                    potentialRect.x + potentialRect.width,
                    potentialRect.y + potentialRect.height,
                    rect.x, rect.y,
                    rect.x + rect.width, rect.y + rect.height)) {
                    if (func(potentialRect)) return true;
                }
            }
            return false;
        };
    }

    this.pixelWidth = blockWidth * blockLength;
    this.pixelHeight = blockHeight * blockLength;

    var all = new Block();
    var blocks = [];

    (function () {
        for (var i = 0; i < blockWidth; ++i) {
            var a = [];
            blocks.push(a);
            for (var j = 0; j < blockHeight; ++j) {
                a.push(new Block());
            }
        }
    })();
}

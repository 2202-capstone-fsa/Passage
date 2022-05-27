"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overworldExits = exports.dialogueArea = exports.updateInventory = exports.displayInventory = exports.createAnims = exports.interact = exports.setPlayer = exports.movePlayer = exports.updateText = exports.isItClose = void 0;
// checks if player is close any obj in target arr. Returns the obj
function isItClose(prox, player, targets) {
    var playerX = player.x;
    var playerY = player.y;
    // check if within 5% of obj. If yes, return name.
    for (var i = 0; i < targets.length; i++) {
        var closeObj = targets[i];
        var closeObjLeft = closeObj.x; //Between this + Width
        var closeObjTop = closeObj.y; //Between this + Height
        var closeObjRight = closeObj.x + closeObj.width;
        var closeObjBottom = closeObj.y + closeObj.height;
        //XY are top left corner.
        var percentLeft = Math.abs((closeObjLeft - playerX) / closeObjLeft);
        var percentTop = Math.abs((closeObjTop - playerY) / closeObjTop);
        var percentRight = Math.abs((closeObjRight - playerX) / closeObjRight);
        var percentBottom = Math.abs((closeObjBottom - playerY) / closeObjBottom);
        //Checks if close to top left corner.
        if (percentLeft <= prox && percentTop <= prox) {
            return targets[i] || null; // returns target object
        }
        //Checks if close to bottom left corner.
        if (percentBottom <= prox && percentLeft <= prox) {
            return targets[i] || null; // returns target object
        }
        //Checks if close to top right corner.
        if (percentTop <= prox && percentRight <= prox) {
            return targets[i] || null; // returns target object
        }
        //Checks if close to bottom right corner.
        if (percentBottom <= prox && percentRight <= prox) {
            return targets[i] || null; // returns target object
        }
    }
}
exports.isItClose = isItClose;
function updateText(player, target, message) {
    message.x = player.x - 100;
    message.y = player.y + 20;
    //
    if (target.properties) {
        for (var i = 0; i < target.properties.length; i++) {
            if (target.properties[i].name == "message") {
                message.text = target.properties[i].value;
            }
        }
    }
}
exports.updateText = updateText;
function movePlayer(player, speed, pressedKey) {
    var _a, _b, _c, _d;
    if ((_a = pressedKey.left) === null || _a === void 0 ? void 0 : _a.isDown) {
        player.anims.play("player-walk-left", true);
        player.setVelocity(-speed, 0);
        player.scaleX = 1;
        player.body.offset.x = 7;
    }
    else if ((_b = pressedKey.right) === null || _b === void 0 ? void 0 : _b.isDown) {
        player.anims.play("player-walk-right", true);
        player.setVelocity(speed, 0);
        player.scaleX = 1;
        player.body.offset.x = 5;
    }
    else if ((_c = pressedKey.down) === null || _c === void 0 ? void 0 : _c.isDown) {
        player.anims.play("player-walk-down", true);
        player.setVelocity(0, speed);
        player.body.offset.y = 25;
    }
    else if ((_d = pressedKey.up) === null || _d === void 0 ? void 0 : _d.isDown) {
        player.anims.play("player-walk-up", true);
        player.setVelocity(0, -speed);
        player.body.offset.y = 25;
    }
    else {
        if (!player.anims.currentAnim)
            return;
        var parts = player.anims.currentAnim.key.split("-");
        parts[1] = "idle";
        player.play(parts.join("-"));
        player.setVelocity(0, 0);
    }
}
exports.movePlayer = movePlayer;
function setPlayer(player) {
    player.body.setSize(player.width * 0.3, player.height * 0.2);
    player.body.setOffset(6.5, 30);
    player.setCollideWorldBounds(true);
}
exports.setPlayer = setPlayer;
function interact(prox, message, player, objs, sound) {
    if (objs === void 0) { objs = []; }
    console.log(player.x);
    console.log(player.y);
    if (message.text) {
        message.text = "";
        // message.setPadding(0, 0, 0, 0);
    }
    else {
        var nextToTarget = isItClose(prox, player, objs);
        if (nextToTarget) {
            // message.setPadding(5, 5, 5, 5);
            updateText(player, nextToTarget, message);
            updateInventory(nextToTarget, message, player, sound);
        }
    }
}
exports.interact = interact;
//Create idle animations for direction player is facing.
function createAnims(anims) {
    anims.create({
        key: "player-idle-down",
        frames: [{ key: "player", frame: "shady_front_1" }],
    });
    anims.create({
        key: "player-idle-right",
        frames: [{ key: "player", frame: "shady_right_1" }],
    });
    anims.create({
        key: "player-idle-left",
        frames: [{ key: "player", frame: "shady_left_1" }],
    });
    anims.create({
        key: "player-idle-up",
        frames: [{ key: "player", frame: "shady_back_1" }],
    });
    anims.create({
        key: "player-walk-down",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 3,
            prefix: "shady_front_",
        }),
        repeat: -1,
        frameRate: 6,
    });
    anims.create({
        key: "player-walk-up",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 3,
            prefix: "shady_back_",
        }),
        repeat: -1,
        frameRate: 6,
    });
    anims.create({
        key: "player-walk-left",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 3,
            prefix: "shady_left_",
        }),
        repeat: -1,
        frameRate: 6,
    });
    anims.create({
        key: "player-walk-right",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 3,
            prefix: "shady_right_",
        }),
        repeat: -1,
        frameRate: 6,
    });
}
exports.createAnims = createAnims;
function displayInventory(message, player, inventory) {
    if (inventory === void 0) { inventory = localStorage; }
    if (message.text) {
        message.text = "";
    }
    else if (inventory) {
        message.x = player.x - 100;
        message.y = player.y + 50;
        var arr_1 = [];
        Object.keys(inventory).forEach(function (x) {
            arr_1.push("".concat(x, ": ").concat(inventory[x]));
        });
        message.text = "INVENTORY ITEMS: " + arr_1.join("\n ");
    }
}
exports.displayInventory = displayInventory;
var keyItems = [
    "Keycard",
    "Soul",
    "Dr. Cola",
    "Brain",
    "Shovel",
    "Helm",
    "Heart",
]; //only include key item names
function updateInventory(item, message, player, sound) {
    if (!localStorage[item.name] && keyItems.includes(item.name)) {
        message.x = player.x + 20;
        message.y = player.y + 100;
        if (localStorage.length == 0) {
            message.text = "Item obtained! Press SHIFT to view inventory!";
        }
        localStorage.setItem("".concat(item.name), "".concat(item.properties[0].value));
        sound.play();
        //make it invisible
    }
}
exports.updateInventory = updateInventory;
function dialogueArea(minX, maxX, minY, maxY, dialogueObj, player, message) {
    if (minX === void 0) { minX = 0; }
    if (maxX === void 0) { maxX = 0; }
    if (minY === void 0) { minY = 0; }
    if (maxY === void 0) { maxY = 0; }
    if (player.y < maxY &&
        player.y > minY &&
        player.x > minX &&
        player.x < maxX &&
        !dialogueObj.hasAppeared) {
        if (message.text)
            message.text = "";
        updateText(player, dialogueObj, message);
        dialogueObj.hasAppeared = true;
    }
}
exports.dialogueArea = dialogueArea;
exports.overworldExits = [
    { x: 320, y: 1165, name: "shop" },
    { x: 1234, y: 465, name: "hospital" },
    { x: 803, y: 216, name: "atlantis" },
    { x: 794, y: 1586, name: "ending" },
    // {
    //   x: 794,
    //   y: 1500,
    //   name: "nearEnd",
    //   message: "You are near the end, no going back, are you sure?",
    // },
];
//# sourceMappingURL=helper.js.map
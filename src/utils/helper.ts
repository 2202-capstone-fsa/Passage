// checks if player is close any obj in target arr. Returns the obj
export function isItClose(prox, player, targets) {
  let playerX = player.x;
  let playerY = player.y;

  // check if within 5% of obj. If yes, return name.
  for (let i = 0; i < targets.length; i++) {
    let closeObj = targets[i];

    let closeObjLeft = closeObj.x; //Between this + Width
    let closeObjTop = closeObj.y; //Between this + Height
    let closeObjRight = closeObj.x + closeObj.width;
    let closeObjBottom = closeObj.y + closeObj.height;
    //XY are top left corner.

    let percentLeft = Math.abs((closeObjLeft - playerX) / closeObjLeft);
    let percentTop = Math.abs((closeObjTop - playerY) / closeObjTop);
    let percentRight = Math.abs((closeObjRight - playerX) / closeObjRight);
    let percentBottom = Math.abs((closeObjBottom - playerY) / closeObjBottom);

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

export function updateText(player, target, message) {
  message.x = player.x - 100;
  message.y = player.y + 20;
  //
  if (target.properties) {
    for (let i = 0; i < target.properties.length; i++) {
      if (target.properties[i].name == "message") {
        message.text = target.properties[i].value;
      }
    }
  }
}

export function movePlayer(player, speed, pressedKey) {
  if (pressedKey.left?.isDown) {
    player.anims.play("player-walk-left", true);
    player.setVelocity(-speed, 0);
    player.scaleX = 1;
    player.body.offset.x = 7;
  } else if (pressedKey.right?.isDown) {
    player.anims.play("player-walk-right", true);
    player.setVelocity(speed, 0);
    player.scaleX = 1;
    player.body.offset.x = 5;
  } else if (pressedKey.down?.isDown) {
    player.anims.play("player-walk-down", true);
    player.setVelocity(0, speed);
    player.body.offset.y = 25;
  } else if (pressedKey.up?.isDown) {
    player.anims.play("player-walk-up", true);
    player.setVelocity(0, -speed);
    player.body.offset.y = 25;
  } else {
    if (!player.anims.currentAnim) return;
    const parts = player.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    player.play(parts.join("-"));
    player.setVelocity(0, 0);
  }
}

export function setPlayer(player) {
  player.body.setSize(player.width * 0.3, player.height * 0.2);
  player.body.setOffset(6.5, 30);
  player.setCollideWorldBounds(true);
}

export function interact(prox, message, player, objs = [], sound) {
  console.log(player.x);
  console.log(player.y);
  if (message.text) {
    message.text = "";
    // message.setPadding(0, 0, 0, 0);
  } else {
    let nextToTarget = isItClose(prox, player, objs);
    if (nextToTarget) {
      // message.setPadding(5, 5, 5, 5);
      updateText(player, nextToTarget, message);
      updateInventory(nextToTarget, message, player, sound);
    }
  }
}

//Create idle animations for direction player is facing.
export function createAnims(anims) {
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

export function displayInventory(message, player, inventory = localStorage) {
  if (message.text) {
    message.text = "";
  } else if (inventory) {
    message.x = player.x - 100;
    message.y = player.y + 50;
    let arr = [];
    Object.keys(inventory).forEach((x) => {
      arr.push(`${x}: ${inventory[x]}`);
    });

    message.text = "INVENTORY ITEMS: " + arr.join("\n ");
  }
}

let keyItems = [
  "Keycard",
  "Soul",
  "Dr. Cola",
  "Brain",
  "Shovel",
  "Helm",
  "Heart",
]; //only include key item names

export function updateInventory(item, message, player, sound) {
  if (!localStorage[item.name] && keyItems.includes(item.name)) {
    message.x = player.x + 20;
    message.y = player.y + 100;
    if (localStorage.length == 0) {
      message.text = "Item obtained! Press SHIFT to view inventory!";
    }

    localStorage.setItem(`${item.name}`, `${item.properties[0].value}`);

    sound.play();
    //make it invisible
  }
}

export function dialogueArea(
  minX = 0,
  maxX = 0,
  minY = 0,
  maxY = 0,
  dialogueObj,
  player,
  message
) {
  if (
    player.y < maxY &&
    player.y > minY &&
    player.x > minX &&
    player.x < maxX &&
    !dialogueObj.hasAppeared
  ) {
    if (message.text) message.text = "";
    updateText(player, dialogueObj, message);
    dialogueObj.hasAppeared = true;
  }
}

export const overworldExits = [
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

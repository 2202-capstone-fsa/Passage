// checks if player is close any obj in target arr. Returns the obj
export function isItClose(player, targets) {
  let x = player.x;
  let y = player.y;

  // check if within 5% of door. If yes, return name.
  for (let i = 0; i < targets.length; i++) {
    let doorX = targets[i].x;
    let doorY = targets[i].y;
    // console.log(`doorX: ${doorX}`);
    // console.log(`doorY: ${doorY}`);
    // console.log("x=" + x);
    // console.log("y = " + y);
    let percentX = Math.abs((doorX - x) / doorX);
    let percentY = Math.abs((doorY - y) / doorY);
    // console.log(`percentX ${percentX}`);
    // console.log(`percentY ${percentY}`);
    if (percentX <= 0.03 && percentY <= 0.03) {
      return targets[i] || null; // returns target object
    }
  }
}

export function updateText(player, target, message) {
  message.x = player.x + 20;
  message.y = player.y + 100;
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
    player.anims.play("player-walk-side", true);
    player.setVelocity(-speed, 0);
    player.scaleX = 1;
    player.body.offset.x = 5;
  } else if (pressedKey.right?.isDown) {
    player.anims.play("player-walk-side", true);
    player.setVelocity(speed, 0);
    player.scaleX = -1;
    player.body.offset.x = 10;
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

export function interact(message, player, objs = [], sound) {
  console.log(player.x);
  console.log(player.y);
  if (message.text) {
    message.text = "";
  } else {
    let nextToTarget = isItClose(player, objs);
    if (nextToTarget) {
      console.log(`im next to: ${nextToTarget.name}`);
      updateText(player, nextToTarget, message);
      updateInventory(nextToTarget, message, player, sound);
    }
  }
}

//Create idle animations for direction player is facing.
export function createAnims(anims) {
  anims.create({
    key: "player-idle-down",
    frames: [{ key: "player", frame: "doc-walk-down-0" }],
  });
  anims.create({
    key: "player-idle-side",
    frames: [{ key: "player", frame: "doc-walk-side-0" }],
  });
  anims.create({
    key: "player-idle-up",
    frames: [{ key: "player", frame: "doc-walk-up-0" }],
  });
  anims.create({
    key: "player-walk-down",
    frames: anims.generateFrameNames("player", {
      start: 3,
      end: 6,
      prefix: "doc-walk-down-",
    }),
    repeat: -1,
    frameRate: 6,
  });

  anims.create({
    key: "player-walk-up",
    frames: anims.generateFrameNames("player", {
      start: 3,
      end: 6,
      prefix: "doc-walk-up-",
    }),
    repeat: -1,
    frameRate: 6,
  });

  anims.create({
    key: "player-walk-side",
    frames: anims.generateFrameNames("player", {
      start: 3,
      end: 6,
      prefix: "doc-walk-side-",
    }),
    repeat: -1,
    frameRate: 6,
  });
}

export function displayInventory(message, player) {
  let inventory = localStorage;
  console.log(inventory);
  if (message.text) {
    message.text = "";
  } else if (inventory) {
    message.x = player.x + 20;
    message.y = player.y + 100;
    let arr = [];
    Object.keys(inventory).forEach((x) => {
      arr.push(`${x}: ${inventory[x]}`);
    });

    message.text = "INVENTORY ITEMS: " + arr.join("\n ");
  }
}

let keyItems = ["sign", "pod"]; //only include key item names

export function updateInventory(item, message, player, sound) {
  if (!localStorage[item.name] && keyItems.includes(item.name)) {
    message.x = player.x + 20;
    message.y = player.y + 100;
    if (localStorage.length == 0) {
      message.text = "Item obtained! Press SHIFT to view inventory!";
    }
    localStorage.setItem(`${item.name}`, `${item.message}`);
    sound.play();
    //make it invisible
  }
}

export const overworldExits = [
  { x: 320, y: 1165, name: "shop" },
  { x: 1234, y: 465, name: "hospital" },
  { x: 803, y: 216, name: "atlantis" },
];

export const overworldObjs = [{}];

//load data from json

// checks if player is close any obj in target arr. Returns the obj
export function isItClose(
  player,
  targets = [
    { x: 3, y: 4, name: "house1", text: "" },
    { x: 3, y: 4, name: "house2", text: "" },
    { x: 3, y: 4, name: "house3", text: "" },
  ]
) {
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

export function updateText(player, target, message = { x: 0, y: 0, text: "" }) {
  message.x = player.x + 20;
  message.y = player.y + 100;
  message.text = target.text;
}

export function movePlayer(player, speed, pressedKey) {
  if (pressedKey.left?.isDown) {
    player.anims.play("player-walk-side", true);
    player.setVelocity(-speed, 0);
    player.scaleX = 1;
    player.body.setOffset(2, 25);
  } else if (pressedKey.right?.isDown) {
    player.anims.play("player-walk-side", true);
    player.setVelocity(speed, 0);
    player.scaleX = -1;
    //player.body.setOffset(2, 25);
    // player.body.offset.x = 11;
  } else if (pressedKey.down?.isDown) {
    player.anims.play("player-walk-down", true);
    player.setVelocity(0, speed);
    //player.body.setOffset(2, 25);
  } else if (pressedKey.up?.isDown) {
    player.anims.play("player-walk-up", true);
    player.setVelocity(0, -speed);
    //player.body.setOffset(2, 25);
  } else {
    if (!player.anims.currentAnim) return;
    const parts = player.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    player.play(parts.join("-"));
    player.setVelocity(0, 0);
  }
}

export function createPlayer(player, x, y) {
  player.physics.add.sprite(x, y, "player", "doc-walk-down-0");
  player.body.setSize(player.width * 0.8, player.height * 0.25);
  player.body.setOffset(2, 25);
  player.setCollideWorldBounds(true);
}

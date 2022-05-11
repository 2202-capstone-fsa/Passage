//load data from json

// checks if player is close any obj in target arr. Returns the obj
export function isItClose(
  player,
  targets = [
    { x: 3, y: 4, name: "house1" },
    { x: 3, y: 4, name: "house2" },
    { x: 3, y: 4, name: "house3" },
  ]
) {
  let x = player.x;
  let y = player.y;

  // check if within 5% of door. If yes, return name.
  for (let i = 0; i < targets.length; i++) {
    let doorX = targets[i].x;
    let doorY = targets[i].y;
    let percentX = Math.abs(1 - (doorX - x) / doorX);
    let percentY = Math.abs(1 - (doorY - y) / doorY);
    if (percentX <= 0.05 && percentY <= 0.05) {
      return targets[i] || null; // returns target object
    }
  }
}

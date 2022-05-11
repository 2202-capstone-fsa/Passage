//load data from json

export function interactItem() {}

export function enterScene(player) {
  let x = player.x;
  let y = player.y;
  //check if you're within 10% of every door
  // get the object of 'doors'
  // 'objects' array includes every door instance
  let doors = [
    { x: 3, y: 4, name: "house1" },
    { x: 3, y: 4, name: "house2" },
    { x: 3, y: 4, name: "house3" },
  ];
  for (let i = 0; i < doors.length; i++) {
    let doorX = doors[i].x;
    let doorY = doors[i].y;
    let percentX = Math.abs(1 - (doorX - x) / doorX);
    let percentY = Math.abs(1 - (doorY - y) / doorY);
    if (percentX <= 0.05 && percentY <= 0.05) {
      return doors[i].name;
    }
  }
}

export function displayInventory() {}

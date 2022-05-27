export declare function isItClose(prox: any, player: any, targets: any): any;
export declare function updateText(player: any, target: any, message: any): void;
export declare function movePlayer(player: any, speed: any, pressedKey: any): void;
export declare function setPlayer(player: any): void;
export declare function interact(prox: any, message: any, player: any, objs: never[] | undefined, sound: any): void;
export declare function createAnims(anims: any): void;
export declare function displayInventory(message: any, player: any, inventory?: Storage): void;
export declare function updateInventory(item: any, message: any, player: any, sound: any): void;
export declare function dialogueArea(minX: number | undefined, maxX: number | undefined, minY: number | undefined, maxY: number | undefined, dialogueObj: any, player: any, message: any): void;
export declare const overworldExits: {
    x: number;
    y: number;
    name: string;
}[];

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = __importDefault(require("phaser"));
var ScanBackground = /** @class */ (function (_super) {
    __extends(ScanBackground, _super);
    function ScanBackground() {
        return _super.call(this, "scan-background") || this;
    }
    ScanBackground.prototype.preload = function () { };
    ScanBackground.prototype.create = function () {
        this.add.line(400, 250, 0, 0, 0, 500, 0xffffff, 1).setLineWidth(2.5, 2.5);
        this.add.circle(400, 250, 50).setStrokeStyle(5, 0xffffff, 1);
    };
    return ScanBackground;
}(phaser_1.default.Scene));
exports.default = ScanBackground;
//# sourceMappingURL=ScanBackground.js.map
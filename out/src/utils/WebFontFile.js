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
var webfontloader_1 = __importDefault(require("webfontloader"));
var WebFontFile = /** @class */ (function (_super) {
    __extends(WebFontFile, _super);
    function WebFontFile(loader, fontNames, service) {
        if (service === void 0) { service = "google"; }
        var _this = _super.call(this, loader, {
            type: "webfont",
            key: fontNames.toString(),
        }) || this;
        _this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
        _this.service = service;
        return _this;
    }
    WebFontFile.prototype.load = function () {
        var _this = this;
        var config = {
            active: function () {
                _this.loader.nextFile(_this, true);
            },
        };
        switch (this.service) {
            case "google":
                config["google"] = {
                    families: this.fontNames,
                };
                break;
            default:
                throw new Error("Unsupported font service");
        }
        webfontloader_1.default.load(config);
    };
    return WebFontFile;
}(phaser_1.default.Loader.File));
exports.default = WebFontFile;
//# sourceMappingURL=WebFontFile.js.map
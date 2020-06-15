"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.writeFile = exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
function readFile(path, cb) {
    return new Promise((res, rej) => {
        fs_1.default.readFile(path, (err, data) => {
            res(cb(err, data));
        });
    });
}
exports.readFile = readFile;
function writeFile(p, products) {
    fs_1.default.writeFile(p, JSON.stringify(products), (err) => err ? console.log(err) : null);
}
exports.writeFile = writeFile;
exports.deleteFile = (filePath) => {
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};
//# sourceMappingURL=fileUtility.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
function getErrorMessage(req) {
    let errorMessage = req.flash('error');
    console.log(errorMessage);
    if (errorMessage.length > 0) {
        return errorMessage[0];
    }
    else {
        return null;
    }
}
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=getFlashError.js.map
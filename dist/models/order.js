"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    products: [
        {
            product: {
                type: Object,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    user: {
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
});
exports.default = mongoose_1.model('Order', orderSchema);
//# sourceMappingURL=order.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationResource = void 0;
const validationResource = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        return next();
    }
    catch (error) {
        return res.status(400).send(error.errors);
    }
};
exports.validationResource = validationResource;

import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import { auth } from "../middlewares/auth";
import {
  createAddressSchema,
  deleteAddressSchema,
  getAddressSchema,
  updateAddressSchema,
} from "../dtos/address.dto";
import {
  createAddress,
  deleteAddress,
  getAddreses,
  updateAddress,
} from "../controllers/address.controller";

const addressRoute = express.Router();

addressRoute.get("/:userId", validationResource(getAddressSchema), getAddreses);

addressRoute.post(
  "/",
  auth,
  validationResource(createAddressSchema),
  createAddress
);

addressRoute.put(
  "/:addressId",
  auth,
  validationResource(updateAddressSchema),
  updateAddress
);

addressRoute.delete(
  "/:addressId",
  auth,
  validationResource(deleteAddressSchema),
  deleteAddress
);

export default addressRoute;

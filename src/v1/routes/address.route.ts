import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import { auth } from "../middlewares/auth";
import {
  createAddressSchema,
  deleteAddressSchema,
  getAddressSchema,
  updateAddressSchema,
} from "../dtos/address.dto";
import createAddress from "../controllers/address.controller";

const addressRoute = express.Router();

addressRoute.get(
  "/:userId",
  validationResource(getAddressSchema),
  createAddress.getAddreses
);

addressRoute.post(
  "/",
  auth,
  validationResource(createAddressSchema),
  createAddress.createAddress
);

addressRoute.put(
  "/:addressId",
  auth,
  validationResource(updateAddressSchema),
  createAddress.updateAddress
);

addressRoute.delete(
  "/:addressId",
  auth,
  validationResource(deleteAddressSchema),
  createAddress.deleteAddress
);

export default addressRoute;

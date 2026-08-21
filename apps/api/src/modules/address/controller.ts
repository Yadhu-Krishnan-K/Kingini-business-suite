import { type NextFunction, type Request, type Response } from "express";

import { addressService } from "./service.ts";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./validator.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

class AddressController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createAddressSchema.parse(req.body);
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      ) as any;

      const address = await addressService.create(
        req.user!.userId,
        cleanData,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Address created successfully.",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getAll(req.user!.userId);

      return sendResponse(res, {
        message: "Addresses fetched successfully.",
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateAddressSchema.parse(req.body);
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      ) as any;

      const address = await addressService.update(
        req.user!.userId,
        req.params.id as string,
        cleanData,
      );

      return sendResponse(res, {
        message: "Address updated successfully.",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await addressService.delete(req.user!.userId, req.params.id as string);

      return sendResponse(res, {
        message: "Address deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const addressController = new AddressController();
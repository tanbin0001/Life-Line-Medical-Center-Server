import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import { userFilterableFields } from "./user.constant";
import { pick } from "../../../utils/pick";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";








const createAdmin = catchAsync(async (req: Request, res: Response) => {


  try {
    //console.log(req.body);
    const result = await userServices.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin Created successfuly!",
      data: result
    })
  }
  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err
    })
  }
})
const createDoctor = catchAsync(async (req: Request, res: Response) => {


  try {
    //console.log(req.body);
    const result = await userServices.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor Created successfully!",
      data: result
    })
  }
  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err
    })
  }
});
const createPatient = catchAsync(async (req: Request, res: Response) => {


  try {
    //console.log(req.body);
    const result = await userServices.createPatient(req);
    res.status(200).json({
      success: true,
      message: "patient Created successfully!",
      data: result
    })
  }
  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err
    })
  }
});

const getAllUsers: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  console.log(options)
  const result = await userServices.getAllUsersFromDB(filters, options)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "all users  data fetched!",
    meta: result.meta,
    data: result.data
  })
})





export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers
} 
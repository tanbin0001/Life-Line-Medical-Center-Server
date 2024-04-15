



import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { adminServices } from './admin.service';
import { pick } from '../../../utils/pick';
import { adminFilterAbleFields } from './admin.constants';
import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';












 

const getAllAdmins: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await adminServices.getAllAdminsFromDb(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})








const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
  
        const result = await adminServices.getSingleAdmin(id);
        sendResponse(res, {
            statusCode:200,
            success:true,
            message:"All data fetched",
            data: result,
            
        })
      
  
})
const updateInDB =  catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
      
            const result = await adminServices.updateInDB(id, payload);
            sendResponse(res,{
                statusCode:200,
                success: true,
                message: "admin updated",
    
                data: result
            })
   
    }
    
)



const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminServices.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
})


const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminServices.softDeleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});

export const adminController = {
    getAllAdmins,
    getSingleAdmin,
    updateInDB,
    softDeleteFromDB,
    deleteFromDB
} 
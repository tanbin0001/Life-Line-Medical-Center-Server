



import express, { Request, Response } from 'express';
import { adminServices } from './admin.service';
import { pick } from '../../../utils/pick';
import { adminFilterAbleFields } from './admin.constants';






const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, adminFilterAbleFields);
        const options = pick(req.query, ['limit','page','sortBy','sortOrder'])
        console.log(options,'op');
        const result = await adminServices.getAllAdminsFromDb(filters,options);
        res.status(200).json({
            success: true,
            message: "Retreived all admins!",
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
};


export const adminController = {
    getAllAdmins
} 
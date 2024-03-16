import express, { Request, Response } from 'express';
import { adminController } from './admin.controller';


const router = express.Router();


router.get('/', adminController.getAllAdmins);




export const AdminRoutes = router;
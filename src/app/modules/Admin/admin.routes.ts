import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { adminValidationSchemas } from './admin.validation';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';


const router = express.Router();







router.get('/', auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), adminController.getAllAdmins);
router.get('/:id' , auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), adminController.getSingleAdmin);
router.patch('/:id', auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),  validateRequest(adminValidationSchemas.update), adminController.updateInDB);
router.delete('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),  adminController.deleteFromDB);

router.delete('/soft/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),  adminController.softDeleteFromDB);




export const AdminRoutes = router;









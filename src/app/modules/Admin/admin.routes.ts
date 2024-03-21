import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { adminValidationSchemas } from './admin.validation';


const router = express.Router();







router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getSingleAdmin);
router.patch('/:id',  validateRequest(adminValidationSchemas.update), adminController.updateInDB);
router.delete('/:id', adminController.deleteFromDB);

router.delete('/soft/:id', adminController.softDeleteFromDB);




export const AdminRoutes = router;









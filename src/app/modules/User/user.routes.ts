import express, { NextFunction } from 'express';

import { UserController } from './user.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

import { upload } from '../../utils/fileUploader';
import { userValidations } from './user.validation';









const router = express.Router();

 
router.get('/allUsers', UserController.getAllUsers);
router.post('/create-admin', upload.single('file'), auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidations.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    });
router.post('/create-doctor', upload.single('file'), auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidations.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    });

router.post('/create-doctor', upload.single('file'), auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidations.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    });

    router.post(
        "/create-patient",
         upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = userValidations.createPatientValidationSchema.parse(JSON.parse(req.body.data))
            return UserController.createPatient(req, res, next)
        }
    );



export const userRoutes = router;
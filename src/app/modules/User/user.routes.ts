import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
 
import { userValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../../helpars/fileUploader';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userController.getAllFromDB
);

router.get(
    '/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    userController.getMyProfile
)

router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return userController.createDoctor(req, res, next)
    }
);

router.post(
    "/create-patient",
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        return userController.createPatient(req, res, next)
    }
);

router.patch(
    '/:id/status',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(userValidation.updateStatus),
    userController.changeProfileStatus
);

router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfie(req, res, next)
    }
);


export const userRoutes = router;
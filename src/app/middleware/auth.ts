

import express, { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiErrors';
 






const auth = (...roles: string[]) => {



    return async (req: Response, res: Request, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            // console.log(token,'from token');
            if (!token) {
                throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
            }

            const verifiedUser = verifyToken(token, config.jwt.jwt_secret as Secret);

            req.user = verifiedUser
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
            }
            next()

        } catch (error) {
            next(error)
        }
    }
}


export default auth;
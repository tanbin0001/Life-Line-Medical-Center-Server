import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { Request, Response } from "express";



const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);

    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "login successful",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})

const refreshToken = catchAsync(async (req, res) => {
 
    const {refreshToken} = req.cookies;
 
    const result = await AuthServices.refreshToken(refreshToken);
  

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "login successful",
        data:result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    })
})
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed successfully",
        data: result
    })
});



const forgotPassword = catchAsync(async (req , res) => {

    await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email!",
        data: null
    })
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization || "";

    await AuthServices.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset!",
        data: null
    })
});



export const AuthControllers = {
    login,refreshToken,
    changePassword,forgotPassword,resetPassword
}
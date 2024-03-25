
import { prisma } from "../../../shared/prisma"

import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../helpers/jwtHelpers";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { UserStatus } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import emailSender from "../../utils/sendEmail";






// const login = async (payload: { email: string, password: string }) => {
//     const userData = await prisma.user.findFirstOrThrow({
//         where: {
//             email: payload.email
//         }
//     });

//     const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
//     if (!isCorrectPassword) {
//         throw new Error("Password incorrect")
//     }
//     console.log(isCorrectPassword);

//     const accessToken = generateToken({
//         email: userData.email,
//         role: userData.role
//     }, config.jwt.jwt_secret as string,
//     config.jwt.expires_in as string
//     )

//     const refreshToken = generateToken({
//         email: userData.email,
//         role: userData.role
//     },
//         config.jwt.refresh_token_expires_in!,
//         config.jwt.refresh_token_expires_in as string
//     );



//     return {
//         accessToken,
//         refreshToken,
//         needPasswordChange: userData.needPasswordChange
//     }
// }

const login = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const accessToken = generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret!,
        config.jwt.expires_in as string
    );

    const refreshToken = generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.refresh_token_secret!,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};


const refreshToken = async (token: string) => {

    let decodedData
    try {
        console.log(token);
        decodedData = verifyToken(token, "abcdef")
        console.log(decodedData);

    } catch (error) {

        throw new Error("Invalid refresh token");
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: 'ACTIVE'
        }
    })
    const accessToken = generateToken({
        email: userData!.email,
        role: userData!.role
    }, "abcdef",
        '15m'
    )
    return {
        accessToken,

        needPasswordChange: userData!.needPasswordChange
    }
};





const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};


const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt. reset_pass_exp_in as string
    )
    //console.log(resetPassToken)

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
    //console.log(resetPassLink)
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {
    console.log({ token, payload })

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = verifyToken(token, config.jwt.reset_pass_secret as Secret)

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};


export const AuthServices = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}
import dotenv from "dotenv";


import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    path: process.env.PORT,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_exp_in: process.env.RESET_PASS_TOKEN_EXP_IN,
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    email_sender:process.env.EMAIL_SENDER,
    app_pass:process.env.APP_PASS
}


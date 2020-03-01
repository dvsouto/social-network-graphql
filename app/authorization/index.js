/**
 * Authorization functions
 * @author Davi Souto
 * @since 28/02/2020
 */

import jwt from "jsonwebtoken";

import { UserSchema } from "app/database";

export default class Authorization {
    static SECRET = "SUCESSO! :)"; // Secret password JWT --- @TODO Tirar essa porra daqui kkk
    static EXPIRES_TIME = "1y";  // Token expires time
    static _context = {};

    static async isAuthorized() {
        var context = Authorization.getContext();

        if (context && context.id)
        {
            const actual_user = await UserSchema.findById(context.id);

            if (actual_user)
                return actual_user;
        }

        throw Error("Unauthorized");
    }

    static ContextMiddleware(req, res, next){
        Authorization._context = {};

        var token = req.headers.authorization || '';

        if (token)
        {
            token = token.split("Bearer ");

            if (token.length > 0)
            {
                token = token[1];

                jwt.verify(token, Authorization.SECRET, function(err, decoded){
                    if (err)
                        return;

                    // console.log("DECODED:", decoded);
                    Authorization._context = decoded;
                })
            }
        }

        next();
    }

    static getContext(){
        return Authorization._context;
    }
}
/**
 * UsersResolvers
 * Resolvers de usuários
 *
 * @author Davi Souto
 * @since 25/02/2019
 */
import { UserSchema } from "../database/index.js";

export default {
    async user({ id }) {
        const result = await UserSchema.findById(id);
        
        return result;
    },
    async users() {
        const result = await UserSchema.find({ });

        return result;
    },
    async createUser({ name, email }) {
        var user = new UserSchema({
            name: name,
            "email": email
        });

        const result = await user.save();

        return result;
    }
}
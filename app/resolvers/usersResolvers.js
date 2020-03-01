/**
 * UsersResolvers
 * Resolvers de usuários
 *
 * @author Davi Souto
 * @since 25/02/2019
 */
import { UserSchema } from "app/database";
import { getDistance } from "app/util/distance";
import Authorization from "app/authorization";

import bcrypt from "bcrypt";
import lodash from "lodash";
import jwt from "jsonwebtoken";

const usersResolvers = {
    /**
     * Find one user
     * @param string id
     * @author Davi Souto
     * @since 27/02/2020
     */
    async user({ id }, context) {
        await Authorization.isAuthorized();

        var user = await UserSchema.findById(id);
        
        if (user)
        {
            var user = {
                ...user._doc,
                id: user._doc._id,
                location: {
                    ...user._doc.location,
                    coordinates: {
                        lat: user._doc.location.coordinates[1],
                        lon: user._doc.location.coordinates[0],
                    }
                }
            }
        }

        return user;
    },

    /**
     * Return all users
     * @author Davi Souto
     * @since 27/02/2020
     */
    async users(_, context) {
        await Authorization.isAuthorized();

        var users = await UserSchema.find({ });

        users = users.map((user) => {
            return {
                ...user._doc,
                id: user._doc._id,
                location: {
                    ...user._doc.location,
                    coordinates: {
                        lat: user._doc.location.coordinates[1],
                        lon: user._doc.location.coordinates[0],
                    }
                }
            }
        })

        return users;
    },

    /**
     * Return the users count on database
     * @author Davi Souto
     * @since 28/02/2020
     */
    async usersCount() {
        Authorization.isAuthorized(context);

        var count_users = UserSchema.countDocuments({});

        return count_users;
    },

    ///////////////////////

    /**
     * Validate user login and return jwt token
     * @param string email
     * @param string password
     * @author Davi Souto
     * @since 28/02/2020
     */
    async login({ email, password }, context) {
        var user = await UserSchema.findOne({ email: email.toLowerCase().trim() });

        if (! user)
            throw new Error("Email não cadastrado !");

        // Verify password
        const validate_password = bcrypt.compareSync(password, user.password);

        if (! validate_password)
            throw new Error("Senha incorreta !");

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, Authorization.SECRET, { expiresIn: Authorization.EXPIRES_TIME })

        return {
            token: token,
            user: user,
        }
    },

    /**
     * Create an user
     * @param string name
     * @param string email
     * @param Location location
     * @author Davi Souto
     * @since 27/02/2020
     */
    async createUser({ input }, context) {
        var obj_user = input;

        obj_user.name = lodash.startCase(obj_user.name).trim();
        obj_user.last_name = lodash.startCase(obj_user.last_name).trim();
        obj_user.email = obj_user.email.toLowerCase().trim();
        obj_user.document = obj_user.document.replace(/[^0-9]/g, '');

        // Validate password min length
        if (input.password.length < 6)
            throw new Error("Senha deve conter no mínimo 6 caracteres !");

        // Validate password min length
        if (input.password.length > 30)
            throw new Error("Senha deve conter no máximo 30 caracteres !");

        // Validate document
        if (obj_user.document.length < 11)
            throw new Error("CPF precisa ser um documento válido !")

        // Crypt password
        const password_hash = bcrypt.hashSync(input.password, 10);

        obj_user.password = password_hash;

        if (input.location)
        {
            obj_user = {
                ...obj_user,
                location: {
                    type: "Point",
                    coordinates: [ input.location.lon, input.location.lat ]
                }
            }
        }

        // Validate email
        if (await UserSchema.findOne({ "email": obj_user.email }))
            throw new Error("Email já cadastrado !");

        // Validate document
        if (await UserSchema.findOne({ "document": obj_user.document }))
            throw new Error("CPF já cadastrado !");

        var user = new UserSchema(obj_user);

        user = await user.save();

        user = {
            ...user._doc,
            id: user._doc._id,
            location: {
                ...user._doc.location,
                coordinates: {
                    lat: user._doc.location.coordinates[1],
                    lon: user._doc.location.coordinates[0],
                }
            }
        }

        return user;
    },

    /**
     * Update an user
     * @param string id
     * @param Object input
     * @author Davi Souto
     * @since 27/02/2020
     */
    async updateUser({ id, input }, context) {
        await Authorization.isAuthorized();

        const find_user = await UserSchema.findById(id);

        if (! find_user)
            throw new Error("Usuário inexistente !");

        const user = await UserSchema.findByIdAndUpdate(id, input, { new: true });

        return user;
    },

    /**
     * Return the users nearest of the user id using the max distance
     * @param string id
     * @param int distance
     * @author Davi Souto
     * @since 28/02/2020
     */
    async nearestUsers({ id, distance }, context) {
        await Authorization.isAuthorized();

        if (! distance || distance <= 0)
            distance = 1000;

        const user = await UserSchema.findById(id);

        var nearest_users = await UserSchema.find({
            "location": {
                "$near": {
                    "$minDistance": 0,
                    "$maxDistance": distance,
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [ user.location.coordinates[0], user.location.coordinates[1] ]
                    }
                }
            },
            "_id": { "$ne": id }
        });

        nearest_users = nearest_users.map(current_user => {
            var distance = getDistance({
                latitude: user.location.coordinates[1],
                longitude: user.location.coordinates[0]
            }, {
                latitude: current_user.location.coordinates[1],
                longitude: current_user.location.coordinates[0],
            });


            return {
                ...current_user._doc,
                id: current_user._doc._id,
                distance,
            };
        })

        return nearest_users;
    },

    ////////////////////////////////

    /**
     * Returns de current user by jwt token
     * @author Davi Souto
     * @since 01/03/2020
     */
    async currentUser(_, context) {
        const current_user = await Authorization.isAuthorized();
        const current_user_with_location = await this.user({ id: current_user.id }, context);

        return current_user_with_location;
    },

    /**
     * Return the users nearest of me using the max distance
     * @param int distance
     * @author Davi Souto
     * @since 01/03/2020
     */
    async nearestUsersOfMe({ distance }, context) {
        const user = await Authorization.isAuthorized();
        const nearest_users = await this.nearestUsers({ id: user._id, distance }, context);

        return nearest_users;
    },

    /**
     * Update location of logged user
     * @param Object input
     * @author Davi Souto
     * @since 27/02/2020
     */
    async updateMyLocation({ input }, context) {
        const user = await Authorization.isAuthorized();

        const location_update = {
            location: {
                type: "Point",
                coordinates: [ input.lon, input.lat ]
            }
        }

        var updated_user = await UserSchema.findByIdAndUpdate(user._id, location_update, { new: true });

        if (updated_user)
        {
            var updated_user = {
                ...updated_user._doc,
                id: updated_user._doc._id,
                location: {
                    ...updated_user._doc.location,
                    coordinates: {
                        lat: updated_user._doc.location.coordinates[1],
                        lon: updated_user._doc.location.coordinates[0],
                    }
                }
            }
        }

        return updated_user;
    }
}

export default usersResolvers;
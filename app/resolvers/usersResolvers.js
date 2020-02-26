/**
 * UsersResolvers
 * Resolvers de usuários
 *
 * @author Davi Souto
 * @since 25/02/2019
 */
import { UserSchema } from "app/database";
import { getDistance } from "app/util/distance";

export default {
    async user({ id }) {
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
    async users() {
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
    async createUser({ name, email, location }) {
        var obj_user = {
            "name": name,
            "email": email,
        };


        if (location)
        {
            obj_user = {
                ...obj_user,
                location: {
                    type: "Point",
                    coordinates: [ location.lon, location.lat ]
                }
            }
        }

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
    async updateUser({ id, input }) {
        // const user = await UserSchema.findById(id);

        // if (! user)
        //     throw new Error("Usuário inexistente !");


        console.log("INPUT:", input);

        const user = await UserSchema.findByIdAndUpdate(id, input, { new: true });

        return user;
    },

    async nearestUsers({ id, distance }) {
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
    }
}
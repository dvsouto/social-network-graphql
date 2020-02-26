/**
 * GraphQL Resolvers
 *
 * @author Davi Souto
 * @since 25/02/2020
 */

import helloResolvers from "app/resolvers/helloResolvers";
import usersResolvers from "app/resolvers/usersResolvers";

const resolvers = Object.assign({}, 
    helloResolvers,
    usersResolvers,
);

export default resolvers;
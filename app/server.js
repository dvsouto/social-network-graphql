import express from "express";
import expressGraphql from "express-graphql";
import graphql from "graphql";

import resolvers from "./resolvers/index.js";

const app = express();
const buildSchema = graphql.buildSchema;

export default class Server {
    /**
     * Create NodeJS Express with GraphQL Server
     * @author Davi Souto
     * @since 25/02/2020
     */
    constructor(){
        const schema = buildSchema(`
          type User {
            id: ID
            name: String!
            email: String!
          }
          type Query {
            user(id: ID!): User
            users: [User]
          }
          type Mutation {
            createUser(name: String!, email: String!): User
          }
        `);


        app.use(
            "/graphql",
            expressGraphql({
                schema,
                rootValue: resolvers,
                graphiql: true
          })
        );

    }

    /**
     * Start NodeJS Express with GraphQL Server
     * @author Davi Souto
     * @since 25/02/2020
     */
    start(port){
        if (port === undefined)
            port = 3000;

        app.listen(port, function(){
            console.log("Servidor iniciado na porta " + port.toString())
        });

    }
}
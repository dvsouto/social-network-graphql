import express from "express";
import expressGraphql from "express-graphql";
import { buildSchema } from "graphql";

import typesDefs from "app/schemas";
import resolvers from "app/resolvers";
import Authorization from "app/authorization";

const app = express();

export default class Server {
    /**
     * Create NodeJS Express with GraphQL Server
     * @author Davi Souto
     * @since 25/02/2020
     */
    constructor(){
        const schema = buildSchema(typesDefs);


        // Request initial page
        app.get("/", (req, res) => res.send("GraphQL Server Online !"));

        // Authorization Middleware
        app.use(Authorization.ContextMiddleware);

        // Init GraphQL 
        app.use(
          "/graphql",
          expressGraphql({
            schema,
            rootValue: resolvers,
            graphiql: true,
            // context: () => Authorization.getContext()
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
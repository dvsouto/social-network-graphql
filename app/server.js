import express from "express";
import expressGraphql from "express-graphql";
import { buildSchema } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";

import typesDefs from "app/schemas";
import resolvers from "app/resolvers";
import Authorization from "app/authorization";

import fs from "fs";
import path from "path";

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

        // Picture profile
        app.get("/storage/profile/:photo", (req, res) => {
            const photo_file = req.params.photo;

            try {
                const storage_path = path.resolve(__dirname + "/storage/pictures/profile");
                const photo_read = fs.readFileSync(storage_path + "/" + photo_file);

                var type = false;

                if (photo_file.toLowerCase().indexOf(".jpg") > 0) type = "image/jpeg";
                if (photo_file.toLowerCase().indexOf(".jpeg") > 0) type = "image/jpeg";
                if (photo_file.toLowerCase().indexOf(".png") > 0) type = "image/png";
                if (photo_file.toLowerCase().indexOf(".gif") > 0) type = "image/gif";

                if (type)
                {
                    res.writeHead(200, {'Content-Type': type });
                    res.end(photo_read, 'binary');
                } else throw new Error("Invalid image");

            } catch (err) {
                res.send("Image not exists, " + err);
            }
        });

        // Authorization Middleware
        app.use(Authorization.ContextMiddleware);

        // Init GraphQL 
        app.use(
          "/graphql",
          graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }), // 10mb Max
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
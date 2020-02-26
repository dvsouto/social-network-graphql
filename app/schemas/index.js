/**
 * GraphQL Schemas
 * Merge GraphQL Schemas
 *
 * @author Davi Souto
 * @since 26/02/2020
 */

// import fs from "fs";
import path from "path";
// import { Iconv }  from "iconv";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.resolve(__dirname));

export default mergeTypes(typesArray, { all: true });

// console.log("TypesArray: ", typesArray);

// var typeDefs = false;


// const root = `
//     type Query {
//         root: String
//     }
//     type Mutation {
//         root: String
//     }
// `;

// const typesDir = path.resolve(__dirname);
// const typeFiles = fs.readdirSync(typesDir).filter(file => file.indexOf(".graphql") >= 0);
// var typeDefs = typeFiles.map(file => fs.readFileSync(path.join(typesDir, file), 'utf-8'))].join("\n\n");

// var typeDefs = [root, ...typeFiles.map(file => fs.readFileSync(path.join(typesDir, file), 'utf-8'))].join("\n\n");


// const typesMerge = 
// console.log("types:", types);

// const iconv = new Iconv("UTF-8", "ISO-8859-1");
// const typeDefs = iconv.convert(types);

// const typeDefs = iconv.convert(types); //types.replace(\[\n]\g, "")
// const typeDefs = types;
// console.log("types:", typeDefs);
/**
 * Index Server
 *
 * @author Davi Souto
 * @since 23/02/2020
 */

import Server from "./app/server.js";
import Database from "./app/database/index.js";

const server = new Server;
const db = new Database;

db.createUser();

server.start();
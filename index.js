/**
 * Index Server
 *
 * @author Davi Souto
 * @since 23/02/2020
 */

import Server from "app/server";
import Database from "app/database";

const database = new Database;
const server = new Server;

server.start(3000);
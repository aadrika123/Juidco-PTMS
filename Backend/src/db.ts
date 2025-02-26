import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "ptms",
  user: "postgres",
  password: "admin",
});

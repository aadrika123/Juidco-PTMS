import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "juidco_ptms",
  user: "postgres",
  password: "123456",
});

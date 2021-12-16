import { EzAuth } from "@ezbackend/auth";
import { EzBackend } from "@ezbackend/common";
import { EzCors } from "@ezbackend/cors";
import type { createConnection } from "typeorm";
import { Paste } from "./paste";
import { User } from "./user";

const app = new EzBackend();

//---Plugins---
//Everything is an ezapp in ezbackend
app.addApp(new EzCors());
app.addApp(new EzAuth());
//---Plugins---

if (process.env.NODE_ENV !== "production") {
  import("@ezbackend/db-ui").then(({ EzDbUI }) => app.addApp(new EzDbUI()));
  import("@ezbackend/openapi").then(({ EzOpenAPI }) =>
    app.addApp(new EzOpenAPI())
  );
}

app.addApp(Paste, { prefix: "paste" });
app.addApp(User, { prefix: "user" });

const ormConfig: Parameters<typeof createConnection>[0] = {
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  synchronize: true,
  ssl: process.env.NODE_ENV === "production",
};

app.start({
  backend: {
    typeorm: ormConfig,
    listen: {
      address: "0.0.0.0",
      port: process.env.PORT || 8000,
    },
    fastify: {
      trustProxy: true,
    },
  },
  auth: {
    successRedirectURL: process.env.CLIENT_URL,
  },
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

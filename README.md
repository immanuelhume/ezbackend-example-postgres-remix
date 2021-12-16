An example application using [ezbackend](https://github.com/kapydev/ezbackend) with Postgres as the datastore.
The frontend uses [Remix](https://github.com/remix-run/remix).

Run both applications locally with these commands.
Docker Compose is required to start a Postgres instance.

```bash
make dev-api # starts the server
make dev-client # starts the remix app
```

import "reflect-metadata";
import { app } from "./app";
import { env } from "./core/config/env";

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

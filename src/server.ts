import "reflect-metadata";
import { app } from "./app";
import { env } from "./core/config/env";
import { logger } from "./core/config/logger";

app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});

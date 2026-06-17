import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const swaggerDocument = YAML.load(join(__dirname, "..", "swagger.yaml"));

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;

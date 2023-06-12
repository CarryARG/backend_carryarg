import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { connect } from "mongoose";

export default __dirname;

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://carryARG:oD9ZeezEmgSDCE6U@clustercoderbackend.tznplng.mongodb.net/"
    );
    console.log("plug mongo");
  } catch (e) {
    console.log(e);
    throw new Error("Error de conexión");
  }
}

import readlineSync from "readline-sync";
import { connectLiveDatabase } from "../../config/dbConnection.js";

const createLiveDatabaseConnection = async (req, res, next) => {
  try {
    const conformation = readlineSync.question("Do you want to connect live database (yes/no)?");
    if (conformation === "yes") {
      let response = await connectLiveDatabase();
      if (response) {
        next();
      } else {
        console.log("you enter wrong pass");
      }
    } else {
      return false;
    }
  } catch (error) {
    next(error);
  }
};

export { createLiveDatabaseConnection };

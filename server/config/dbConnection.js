import mongoose from "mongoose";
import { createTunnel } from "tunnel-ssh";

const connectLiveDatabase = () => {
  if (process.env.ENV === "dev") {
    mongoose.connection.close();
    return new Promise((resolve, reject) => {
      const port = 27018;

      const tunnelOptions = {
        autoClose: true,
      };
      const serverOptions = {
        port: port,
      };
      const sshOptions = {
        host: process.env.LIVE_DATABASE_HOSTNAME,
        port: 22,
        username: process.env.LIVE_DATABASE_USERNAME,
        password: process.env.LIVE_DATABASE_PASS,
      };
      const forwardOptions = {
        srcAddr: "0.0.0.0",
        srcPort: port,
        dstAddr: "127.0.0.1",
        dstPort: 27017,
      };

      createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions)
        .then(([server, conn], error) => {
          server.on("error", (e) => {
            console.log("SSH server error:", e);
          });

          conn.on("error", (e) => {
            console.log("SSH connection error:", e);
          });

          // SSH tunnel has been successfully established, so we can connect to MongoDB here
          mongoose.connect(process.env.LIVE_MONGO_URL);
          const db = mongoose.connection;
          db.on("error", console.error.bind(console, "DB connection error:"));
          db.once("open", function () {
            // The database connection has been established
            console.log("DB connection successful");
            resolve(true);
          });
        })
        .catch((error) => {
          // Handle errors related to creating the SSH tunnel
          console.log("SSH tunnel setup error:", error);
        });
    });
  } else {
    console.log("you do not have right id or pass for live database");
    return false;
  }
};

const closeLiveConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("----Live connection closed----");

    const mongoUrl = process.env.MONGO_URL;

    await mongoose.connect(mongoUrl);

    // Handle events for the local connection as needed
    const localDb = mongoose.connection;
    localDb.on("error", console.error.bind(console, "Local DB connection error:"));
    localDb.once("open", function () {
      console.log("Local DB connection successful");
      // You can perform local database operations here
    });
  } catch (error) {
    console.error("Error closing or establishing connections:", error);
  }
};

export { connectLiveDatabase, closeLiveConnection };

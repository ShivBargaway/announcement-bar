import { Session } from "@shopify/shopify-api";
import Cryptr from "cryptr";
import SessionModel from "./models/SessionModel.js";

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const storeSession = async (session) => {
  try {
    await SessionModel.findOneAndUpdate(
      { id: session.id },
      {
        content: cryption.encrypt(JSON.stringify(session)),
        shop: session.shop,
      },
      { upsert: true }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const loadSession = async (id) => {
  try {
    const sessionResult = await SessionModel.findOne({ id });
    if (sessionResult === null) {
      return undefined;
    }
    if (sessionResult.content.length > 0) {
      const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
      const returnSession = new Session(sessionObj);
      return returnSession;
    }
    return undefined;
  } catch (err) {
    throw err;
  }
};

const loadOnlineSession = async (shop) => {
  try {
    const sessions = await SessionModel.find({ shop });
    const sessionResult = sessions.find((s) => s.id.includes(`${shop}_`));
    if (sessionResult === null) {
      return undefined;
    }
    if (sessionResult.content.length > 0) {
      const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
      const returnSession = new Session(sessionObj);
      return returnSession;
    }
    return undefined;
  } catch (err) {
    throw err;
  }
};

const deleteSession = async (id) => {
  try {
    await SessionModel.deleteMany({ id });
    return true;
  } catch (err) {
    throw err;
  }
};

// (() => {
//   let content =
//     "48660d852883ee83c6603344a5f800821ed3b197e5ed423af76ab004150e32568058fedd0f2c2ad4c82b3c9f151feec82d8af3137c64ed7d70ae12178bcc0ee2384efaee121a07b7a6a25ec5e117e0bdc10186e987142689cd00ebe67eb2403e80bcd6299120ec11ad2d545714ba0991899f9f5fa9d3b3a8a706de14b23d33c569e1510ef4e8d56d097c961321df487def6fd4fe5010fb69225eef836d915cb9e0e6ac4dc8baf94a4fdc9c76a6795a08f84013393805f5cc8b8a6cf980f2c08ab90a136d58f371c624bb0c0c4f8c6c96ce36141b2cef448faa132767d3c43c63d1d385fc56908832474e233edb738b45f1f9986edb7716c3d595a165b18b32921dd8ce4aeae49bba276f12dc80bbb1e0410e4d0ece99b1f17e6cbeaa6f78adf686e9e8dc0d5c49212580c9f79cb12a7b24fd0dd6530d730f0d9520d4b66c548afdb68e7bf520bbd06a763611d86acc983b01355c09f88b741e0a1c992e2c46c67525cc9357c37aeb7b67c217637bcafc8faf17df3969c7223ba82144372151306dd5a60f196d77b995ae5921a16a1f1a39cc93f4a9db1f8f3243286e1f304f08fbd0223e62be39cc7b74c9fe7e3a11412e02ddfeb9b5a45d49b2a38c2d137f20565916f182be37c12b898bfadfa88e860ed6a21a4a75bbaa54fb0bf605c0ae8ba6a83653a3173384fb20578a21414edbb96f0996feda063b50844d8a708feda321eec7de28fb0195b2ad252e0bbdb48da2681dfbf2d7cb05492f9eea3e9b07571783dc545137ac9735e55a282adfce32b995ce6c49664cbe57d8229171d63aeb390a75ad61ba1707cae343e77d0707b7e9a079238d8ef7b43163172c2776f3265f9772fa9eb931a42aa3b4d2a8df882bed9cd4d68854b78829fd7e08ab5335a09a723643d944d37c0826cf30b07f5232bf28e973e4dc7a1ee1b5d867800eedc77959e614c5707fedda25d43fc19d5ea4d7ff0110187d9f208a9e2b660a2d2684a10e48670ba3920a57deda723f1c1e1cd457d296fdbc8dca99b46d82eb4d682b0b11f9dab8a9af6efbbdf9c15a486aca033975e0f5240acaa8b457968b10e1d4b8b3496e348627a1e99880910673dff9cbac64608c1a4c4a24b628714804b72e5a6fcc475e856db1df31511d5980f81188b6e80dfdd586fea3c1cfc4f53a2dd7db8afd6b6957b9b23f3ce4d2a76350be683b77a2d12f2b29ae01c57af05417d89ec2e5f074";
//   let decrypt = JSON.parse(cryption.decrypt(content));
//   console.log("============decrypt===============");
//   console.log(decrypt);
//   decrypt.expires = new Date("08/21/2023").toISOString();
//   console.log("============decrypt============", decrypt);
//   let encrypt = cryption.encrypt(JSON.stringify(decrypt));
//   console.log("============encrypt===============");
//   console.log(encrypt);
// })();

const sessionHandler = { storeSession, loadSession, deleteSession, loadOnlineSession };

export default sessionHandler;

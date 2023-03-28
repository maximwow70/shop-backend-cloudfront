const basicAuthorizer = async (event: any, _, cb) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  if (!event.headers.Authorization) {
    return cb("Unauthorized");
  }

  try {
    const encodedCreds = event.headers.Authorization.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split("=");

    console.log(`username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    cb(null, {
      principalId: encodedCreds,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: "*",
          },
        ],
      },
    });
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

export const main = basicAuthorizer;

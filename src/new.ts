import readline from "readline";
import log from "./log";
import { noUsers, setUserPassHash, userExists } from "./db";
import { authenticate, getPassword } from "./session";



export const newUser = async (user: string) => {
    try {
        if (!noUsers() && !userExists(user)) {
            log("new", user, "Invalid user");
            throw new Error("User not recognized");
        }

        if (!(await authenticate(user))) {
            log("new", user, "Authentication failure");
            throw new Error("Unable to authenticate user");
        }

        let newUser = await getNewUsername();
        let newPassHash = await getPassword();
        log("new", user, "Created user "+newUser);
        await setUserPassHash(newUser, newPassHash);

    } catch (error) {
        log("new", user, "Error creating new user");
        console.error("Error ocurred creating a new user.", error);
    }
}

const getNewUsername = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let username: string = await new Promise(resolve => rl.question("Username: ", resolve));
    return username;
}
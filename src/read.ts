import log from "./log";
import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";

export async function readMessages(user: string) {
    
    try {
        if (!await userExists(user)) {
            log("read", user, "Invalid user");
            throw new Error("User does not exist");
        }

        if (!await authenticate(user)) {
            log("read", user, "Authentication Failure");
            throw new Error("Unable to authenticate");
        }

        log("read", user);
        getMessagesForUser(user).then((messages) => {
            messages.forEach((e: string) => console.log(e, "\n"));
        });

    } catch (error) {
        log("read", user, "Error");
        console.error("Error occured during reading.", error);
    }
}
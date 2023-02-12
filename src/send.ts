import readline from "readline";
import { saveMessage } from "./db";
import { userExists } from "./db/user"
import log from "./log";

export const sendMessage = async (user: string) => {
    
    try {
        if (!await userExists(user)) {
            log("send", user, "Invalid User");
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            log("send", user, "Message created: " + message);
            await saveMessage(message, user);
        });


    } catch (error) {
        log("send", user, "Error");
        console.error("Error occured during send operation.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}
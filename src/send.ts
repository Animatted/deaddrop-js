import readline from "readline";
import { saveMessage } from "./db";
import { userExists } from "./db/user"
import log from "./log";
import { authenticate } from "./session";


export const sendMessage = async (recipient: string) => {
    
    try {

        console.log("Please authenticate to send message");
        let sender = await getSender();

        if (!await authenticate(sender)) {
            log("read", sender, "Authentication Failure");
            throw new Error("Unable to authenticate");
        }

        if (!await userExists(recipient)) {
            log("send", sender, "Invalid User");
            throw new Error("Destination user does not exist");
        }


        getUserMessage().then(async (message) => {
            log("send", sender, "Message created, sent to " + recipient);
            await saveMessage(message, recipient, sender);
        });


    } catch (error) {
        log("send", recipient, "Error");
        console.error("Error occured during send operation.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}

const getSender = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let sender: string = await new Promise(resolve => rl.question("Username: ", resolve));
    rl.close();
    return sender.toString();
}
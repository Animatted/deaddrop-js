import { connect } from "./db"
import { hash } from "../session"
import log from "../log"
//import sha256 from 'crypto-js/sha256'

export const getMessagesForUser = async (user: string): Promise<string[]> => {
    let db = await connect();
    
    //hash thing here
    let senders: string[] = [];
    let messages: string[] = [];
    let hashes: string[] = [];

    await db.each(`
        SELECT data FROM Messages
        WHERE recipient = (
            SELECT id FROM Users WHERE user = :user
        );
    `, {
        ":user": user,
    }, (err, row) => {
        if (err) {
            throw new Error(err);
        }
        messages.push(row.data);
    });

    await db.each(`
        SELECT sender FROM Messages
        WHERE recipient = (
            SELECT id FROM Users WHERE user = :user
        );
    `, {
        ":user": user,
    }, (err, row) => {
        if (err) {
            throw new Error(err);
        }
        senders.push(row.sender);
    });

    await db.each(`
        SELECT hash FROM Messages
        WHERE recipient = (
            SELECT id FROM Users WHERE user = :user
        );
    `, {
        ":user": user,
    }, (err, row) => {
        if (err) {
            throw new Error(err);
        }
        hashes.push(row.hash);
    });

    for(var i = 0; i < messages.length; i++)
    {
        if(hashes[i] !== hash(messages[i]))
        {
            console.log(hashes[i]);
            console.log(hash(messages[i]))
            log("read", user, "Message and hash do not match");
            return hashes;
        }
    }

    for(var i = 0; i < messages.length; i++)
    {
        messages[i] = senders[i] + ": " + messages[i];
    }

    return messages;


}


export const saveMessage = async (message: string, recipient: string, sender: string) => {
    let db = await connect();
    let messageHash = hash(message);
    await db.run(`
        INSERT INTO Messages 
            (recipient, sender, data, hash)
        VALUES (
            (SELECT id FROM Users WHERE user = :recipient),
            :sender,
            :message,
            :hash
        )
    `, {
        ":recipient": recipient,
        ":sender": sender,
        ":message": message,
        ":hash": messageHash
    });
}

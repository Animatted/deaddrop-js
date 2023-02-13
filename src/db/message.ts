import { connect } from "./db"
import { saltAndHash } from "../session"
import log from "../log"

export const getMessagesForUser = async (user: string): Promise<string[]> => {
    let db = await connect();

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
        hashes.push(row.data);
    });

    if(hashes == messages.map(message => saltAndHash(message)))
    {
        return messages;
    }
    else
    {
        log("read", user, "Message and hash do not match");
        return hashes;
    }
 
}


export const saveMessage = async (message: string, recipient: string) => {
    let db = await connect();
    let messageHash = saltAndHash(message);
    await db.run(`
        INSERT INTO Messages 
            (recipient, data, hash)
        VALUES (
            (SELECT id FROM Users WHERE user = :user),
            :message,
            :hash
        )
    `, {
        ":user": recipient,
        ":message": message,
        ":hash": messageHash
    });
}

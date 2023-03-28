import { connect } from "./db"
import { hash } from "../session"
import log from "../log"
//import sha256 from 'crypto-js/sha256'

export const getMessagesForUser = async (user: string): Promise<string[]> => {
    let db = await connect();
    
    //hash thing here

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

    return messages;

/*

    if(hashes == messages.map(message => hash(message)))
    {
        return messages;
    }
    else
    {
        log("read", user, "Message and hash do not match");
        return hashes;
    }
 

    */
}


export const saveMessage = async (message: string, recipient: string) => {
    let db = await connect();
    let messageHash = hash(message);
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

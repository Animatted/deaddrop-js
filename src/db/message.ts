import { connect } from "./db"
import { saltAndHash } from "../session"

export const getMessagesForUser = async (user: string): Promise<string[]> => {
    let db = await connect();

    let messages: string[] = [];

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

    return messages;
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

/*
export const setMessageHash = async (message: string, recipient: string) => {
    let db = await connect();
    let hash = saltAndHash(message);

    await db.run(`
        INSERT INTO Messages 
            (recipient, hash)
        VALUES (
            (SELECT id FROM Users WHERE user = :user),
            :hash
        )
    `, {
        ":user": recipient,
        ":message": hash,
    });
}
*/
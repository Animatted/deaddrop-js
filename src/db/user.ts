import { connect } from "./db"
import log from "../log"

export const userExists = async (user: string): Promise<boolean> => {
    let db = await connect();
    try
    {
        let query = "SELECT id FROM Users WHERE user = :user;"
        const result = await db.get(query, {':user': user,});
        return typeof result.id === "number";
    }
    catch(error)
    {
        log("send", user, "Invalid Destination User");
        throw new Error("Destination user does not exist");
    }

}


export const getUserId = async (user: string): Promise<number> => {
    let db = await connect();

    let result = await db.get(`
        SELECT id FROM Users
        WHERE user = :user;
    `, {
        ":user": user,
    });

    return result;
}

export const getUserPassHash = async (user: string): Promise<string> => {
    let db = await connect();

    let result = await db.get(`
        SELECT hash FROM Users
        WHERE user = :user;
    `, {
        ":user": user,
    });

    return result.hash;
}

export const setUserPassHash = async (user: string, hash: string) => {
    let db = await connect();

    await db.run(`
        INSERT INTO Users
            (user, hash)
        VALUES
            (:user, :hash);
    `, {
        ":user": user,
        ":hash": hash,
    });
}

export const noUsers = async (): Promise<boolean> => {
    let db = await connect();
    let result = await db.get("SELECT COUNT(*) FROM Users;");
    return Promise.resolve(result['COUNT(*)'] === 0);
}
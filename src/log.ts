import fs from "fs"

export default function log(fn : string, user : string, notes = "NA")
{
    var date = new Date();

    let data = "User: " + user + '\n' 
                + "Verb: " + fn + '\n' 
                + "Date: " + date.toLocaleString() + '\n'
                + "Notes:" + notes + '\n\n';

    const fs = require('fs');
    fs.appendFile('./log.txt', data, (err : ErrorCallback) => {
        if(err) throw err;
    })
}
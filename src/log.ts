import fs from "fs";

export default function log(verb : string, user : string, notes : string = "NA")
{
    var date = new Date();

    let data = "User: " + user + '\n' 
                + "Verb: " + verb + '\n' 
                + "Date: " + date.toLocaleString() + '\n'
                + "Notes:" + notes + '\n\n';

    const fs = require('fs');
    fs.appendFile('./log.txt', data, (err : ErrorCallback) => {
        if(err) throw err;
    })
}
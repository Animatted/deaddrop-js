import fs from "fs";

export default function log(verb : string, user : string, notes : string = "NA")
{
    var date = new Date();

    let data = "User: " + user + ', ' 
                + "Verb: " + verb + ', ' 
                + "Date: " + date.toLocaleString() + ', '
                + "Notes:" + notes + ',\n';

    const fs = require('fs');
    fs.appendFile('./log.txt', data, (err : ErrorCallback) => {
        if(err) throw err;
    })
}
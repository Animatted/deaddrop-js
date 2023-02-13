#  deaddrop-js

A deaddrop utility written in Typescript. Put files in a database behind a password to be retrieved at a later date.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:
- [Go](https://github.com/andey-robins/deaddrop-go)
- [Rust](https://github.com/andey-robins/deaddrop-rs)

## Versioning

`deaddrop-js` is built with:
- node v18.13.0

## Usage

`npm run build && node dist/index.js --help` for instructions

Then run `node dist/index.js --new --user <username here>` and you will be prompted to create the initial password.

## Database

Data gets stored into the local database file dd.db. This file will not by synched to git repos. Delete this file if you don't set up a user properly on the first go

## Mitigation 

A usage log is currently updated on the use of verbs 'read', 'new', or 'send'. This log includes the user that invoked the verb, the verb itself, a the date/time of interaction,  
and a short note giving context to the interaction. (Errors thrown, users created, things 
of that nature) All of this information is saved to a file called log.txt.

Additionally, there is a system in place that audits the integrity of each message within the system. Upon sending a message, a hash is generated and stored in the database. When 
messages are fetched from the database, they are then each run through the hashing algorithm and checked against the hashes stored in the database. The current implementation of this 
system isn't perfect, and still leaves the hashes open to tampering. I did attempt to mitigate this concern by encrypting the hashes using a symmetric encryption algorithm such as 
AES or DES, but could not produce a satisfactory result within the time allotted. 
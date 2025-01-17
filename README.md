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

A usage log is currently updated on the use of verbs 'read', 'new', or 'send'. This log includes the user that invoked the verb, the verb itself, a the date/time of
interaction, and a short note giving context to the interaction. (Errors thrown, users created, thingsof that nature) All of this information is saved to a file called
log.txt.

*************************************************************************************************************************************************************************
MAC incoming. [Originally due: 3/26/23 Submission date: [4/5/23]
*************************************************************************************************************************************************************************
3/28/23
MAC working in it's most basic form. Currently generating and comparing a sha256 hash for each message saved within database. More to come.

3/29/23
Getting sender into database and trying to figure out read only entries. Sleep is needed.

4/4/23
Finally got sender into database and displaying when read is invoked. Just need to make MAC's unable to be modified.

4/6/23
I just can't figure out making MAC's unmodifiable. Encryption hits the whole database, columns can't be set to read only, schema would only prevent modification within
software which isn't possible as it stands anyway. Maybe a new table for MAC's could have been encrypted, but I lack the database experience to make that happen with 
the negative time I have. May still be some test code in there, but gotta move on from this one. 

*************************************************************************************************************************************************************************
Changes Discussion
*************************************************************************************************************************************************************************

MAC Implementation
On creating a new message, a SHA-256 has is generated and saved to the database as well as the sender of the message. The is checked against a freshly generated hash at the
time of read to ensure that a message has not been modified. Additionally, at read time, a user is asked to authenticate before the check to see if a user exists. This order
is important as it could allow for an outside entity to discern users in the database if the check happened before authentication. Sender information is concatenated with 
message data right before the message is printed, after the MAC check. 
I could not get the MACs implemented in a way that they themselves were unable to be modified.  

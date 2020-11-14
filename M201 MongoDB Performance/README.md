## M201 Useful Commands

To login issie the following command

`mongo "mongodb+srv://stevocurtis:PASSWORD@cluster0.8bzep.mongodb.net/test?authSource=admin&replicaSet=atlas-jdv02t-shard-0&readPreference=primary"`

To import people data

`mongoimport --drop -c people --uri mongodb+srv://stevocurtis:PASSWORD@cluster0.8bzep.mongodb.net/test?authSource=admin handouts/people.json`
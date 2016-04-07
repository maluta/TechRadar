var dbp = require('./dbConfig.js');
var pg = require('pg');
var async = require('async');

var client = new pg.Client(dbp.getConnectionString());
client.connect();

var statements = [
    'DROP TABLE IF EXISTS project_tech_link',
    'DROP TABLE IF EXISTS history;',
    'DROP TABLE IF EXISTS technologies',
    'DROP TABLE IF EXISTS status',
    'DROP TABLE IF EXISTS categories',
    'DROP TABLE IF EXISTS projects',
    'DROP TABLE IF EXISTS comments',
    'DROP TABLE IF EXISTS votes',

    'CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT )',
    'CREATE TABLE IF NOT EXISTS status(id SERIAL PRIMARY KEY, name VARCHAR(10)  )',
    'CREATE TABLE IF NOT EXISTS technologies(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, website VARCHAR(100), description TEXT , ' +
            'category integer references categories(id) , status integer references status(id))',
    'CREATE TABLE IF NOT EXISTS history(id SERIAL PRIMARY KEY, technology integer references technologies(id) )',
    'CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY, name VARCHAR(100) )',
    'CREATE TABLE IF NOT EXISTS project_tech_link(project integer references projects(id), technology integer references technologies(id)  )',
    'CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, technology integer references technologies(id) , text TEXT )',
    'CREATE TABLE IF NOT EXISTS votes(id SERIAL PRIMARY KEY, technology integer references technologies(id) , score INTEGER)',


    "INSERT INTO status (id , name) VALUES (1,'Adopt'),(2,'Trial'),(3,'Assess'), (4,'Hold') , (5, 'Avoid'), (6, 'TBD')",
    "INSERT INTO categories (id , name, description) VALUES " +
                "(1,'Tools','A program that software developers use to create, debug, maintain, or otherwise support other programs and applications')," +
                "(2,'Languages and Frameworks','Languages and highlevel libraries for building application and systems')," +
                "(3,'Platforms' , 'A platform is a group of technologies that are used as a base upon which other applications, processes or technologies are developed.')," +
                "(4,'Infrastructure' , 'The set of hardware, software, networks, facilities, etc., in order to develop, test, deliver, monitor, control or support IT services') ",

    "INSERT INTO projects (id , name) VALUES (1, 'DVSA'), (2,'ONS'), (3,'Home Office'), (4,'DVLA'), (5,'DEFRA'), (6,'MoJ') "
    ];


function doQuery(item, callback) {
    console.log("Query:" + item);
    client.query(item, function (err, result) {
        // return any err to async.each iterator
        callback(err);
    })
}

async.eachSeries(statements, doQuery, function (err) {
    // Release the client to the pg module
    if (err) {
        console.error(err);
    } else {
        console.log("All Done");
        client.end();
    }

});

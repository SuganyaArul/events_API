const format = require('pg-format');
const db = require('../connection');


const seed = ({ eventsData, usersData, attendeesData }) => {
    return db
      .query(`DROP TABLE IF EXISTS attendees;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS events;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        /*Creating 2 Tables users and events */
        const usersTablePromise = db.query(`
        CREATE TABLE users (
          email VARCHAR PRIMARY KEY ,
          fullname VARCHAR NOT NULL,
          username VARCHAR NOT NULL,
          password VARCHAR NOT NULL
        );`);
        const eventTablePromise = db.query(`
        CREATE TABLE events (
            event_id serial PRIMARY KEY,
            title VARCHAR NOT NULL,
            date VARCHAR NOT NULL,
            address VARCHAR NOT NULL,
            link VARCHAR ,
            event_location_map VARCHAR ,
            description VARCHAR NOT NULL,
            ticket_info VARCHAR NOT NULL,
            venue VARCHAR,
            thumbnail VARCHAR,
            image VARCHAR,
            capacity INT,
            created_by VARCHAR NOT NULL
        );
        `)
       
        return Promise.all([eventTablePromise, usersTablePromise]);
      })
      .then(()=>{
        return db.query(`
          CREATE TABLE attendees (
            attendee_id SERIAL PRIMARY KEY,
            email VARCHAR NOT NULL ,
            firstname VARCHAR NOT NULL,
            lastname VARCHAR NOT NULL,
            event_id INT REFERENCES events(event_id) NOT NULL
          );`)
      })
      .then(() => {
        //seeding data into table
        const insertEventsQueryStr = format(
          'INSERT INTO events (title, date, address, event_location_map, description, ticket_info, venue, thumbnail, image,capacity, created_by) VALUES %L;',
          eventsData.map(({ title, date, address, event_location_map, description, ticket_info, venue, thumbnail, image, capacity, created_by }) => [title, date, address, event_location_map, description, ticket_info, venue, thumbnail, image, capacity, created_by])
        );
        const eventsPromise = db.query(insertEventsQueryStr);
        const insertUsersQueryStr = format(
          'INSERT INTO users ( username, fullname, email, password) VALUES %L;',
          usersData.map(({ username, fullname, email, password }) => [
            username,
            fullname,
            email,
            password
          ])
        );
        const usersPromise = db.query(insertUsersQueryStr);
        const insertAttendeesQueryStr = format(
          'INSERT INTO attendees ( firstname, lastname, email, event_id) VALUES %L;',
          attendeesData.map(({ firstname, lastname, email, event_id }) => [
            firstname,
            lastname,
            email,
            event_id
          ])
        );
        const attendeesPromise = db.query(insertAttendeesQueryStr)
        return Promise.all([eventsPromise,usersPromise,attendeesPromise]);
    })
    .catch((error)=>{
      console.log(error);
      
      
    })
    };

    module.exports = seed;
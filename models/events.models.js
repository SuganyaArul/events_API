const db=require("../db/connection")
const fs=require("fs/promises")

exports.fetchAllEndpoints=()=>{
    return fs.readFile('./endpoints.json','utf-8').then((endpoints)=>{
       return JSON.parse(endpoints)
    }).catch((err)=>{
       return {msg:'No such files'}
    })
   
}

exports.fetchAllEvents=async(topics,location)=>{
    let sqlQuery=`SELECT * FROM events`
    if(topics && location){
        sqlQuery+=` WHERE title ILIKE '%${topics}%' AND address ILIKE '%${location}%'`
    }
    else {
    if(topics){
        sqlQuery+=` WHERE title ILIKE '%${topics}%'`
    }
    else if(location){
        sqlQuery+=` WHERE address ILIKE '%${location}%'`
    }
    }
    sqlQuery+=`;`
    const response=await db.query(sqlQuery)
    if(response.rows.length===0){
        return Promise.reject({msg:'Not Found'})
    }
         return response.rows;
    
}

exports.fetchEventById=(id)=>{
    return db.query(`SELECT * FROM events WHERE event_id=$1`,[id]).then((result)=>{
        return result.rows[0]
    })
}

exports.fetchUserByEmail=({email,password})=>{
    return db.query(`SELECT * FROM users WHERE email=$1 AND password=$2`,[email,password]).then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({msg:'Invalid Username or Password'})
        }
        return result.rows[0]
    })
}

exports.createEvent=(event)=>{
    return db.query(`INSERT INTO events (title, date, address, event_location_map, description, ticket_info, venue, image, created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`,[event.title,event.date,event.address,event.event_location_map,event.description,event.ticket_info,event.venue,event.image,event.created_by]).then(({rows})=>{
                return rows[0]
    })
}

exports.createNewUser=(newUser)=>{
    return db.query(`INSERT INTO users (email , fullname, username, password) VALUES($1,$2,$3,$4) RETURNING *;`,[newUser.email,newUser.fullname,newUser.username,newUser.password]).then(({rows})=>{
        return rows[0]
    })
}

exports.fetchUserEvents=(email)=>{
    return db.query(`SELECT * FROM events WHERE created_by=$1;`,[email]).then(({rows})=>{
        return rows;
    })
}

exports.fetchAttendees=(id)=>{
    return db.query(`SELECT * FROM attendees WHERE event_id=$1;`,[id]).then(({rows})=>{
        console.log('result',rows);
        
        return rows;
    })
}

exports.addNewAttendee=(attendee)=>{
    return db.query(`INSERT INTO attendees (firstname, lastname, email, event_id) VALUES($1,$2,$3,$4) RETURNING *;`,[attendee.firstname,attendee.lastname,attendee.email,attendee.event_id]).then(({rows})=>{
        return rows[0]
    })
}
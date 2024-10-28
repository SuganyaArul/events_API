const{fetchAllEndpoints,fetchAllEvents,fetchEventById,fetchUserByEmail,createEvent,createNewUser,fetchUserEvents,fetchAttendees,addNewAttendee} =require("../models/events.models")


exports.getEndpoints=(req,res,next)=>{
    fetchAllEndpoints().then((endpoints)=>{
        return res.status(200).send({endpoints})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getEvents=(req,res,next)=>{
    const {topics,location} =req.query;
    fetchAllEvents(topics,location).then((events)=>{
        return res.status(200).send({events});
    })
    .catch((err)=>{
        next(err);
    })
}

exports.getEventById=(req,res,next)=>{
    const id=req.params.event_id;
    fetchEventById(id).then((event)=>{
        return res.status(200).send({event});
    })
    .catch((err)=>{
        next(err);
    })
}

exports.getUserDetails=(req,res,next)=>{
    const {email,password}=req.query;
    fetchUserByEmail({email,password}).then((user)=>{
        return res.status(200).send({user});
    })
    .catch((err)=>{
        next(err);
    }) 
}

exports.postNewEvent=(req,res,next)=>{
    const newEvent=req.body;
    createEvent(newEvent).then((event)=>{
        return res.status(201).send({event});
    })
    .catch((err)=>{
        next(err);
    }) 
}

exports.postNewUser=(req,res,next)=>{
    const newUser=req.body;
    createNewUser(newUser).then((user)=>{
        return res.status(201).send({user});
    })
    .catch((err)=>{
        next(err);
    }) 
}

exports.getUserEvents=(req,res,next)=>{
    const {email}=req.query;
    fetchUserEvents(email).then((events)=>{
        return res.status(200).send({events})
    })
    .catch((err)=>{
        next(err);
    }) 
}

exports.getAttendees=(req,res,next)=>{
    const {event_id}=req.query;
    fetchAttendees(event_id).then((attendees)=>{
        return res.status(200).send({attendees})
    })
    .catch((err)=>{
       next(err);
    })
}

exports.postAttendees=(req,res,next)=>{
    const attendee=req.body;
    addNewAttendee(attendee).then((attendee)=>{
        return res.status(201).send({attendee})
    })
    .catch((err)=>{
        next(err);
    })
}
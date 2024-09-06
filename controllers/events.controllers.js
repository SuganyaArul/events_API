const{fetchAllEndpoints,fetchAllEvents,fetchEventById,fetchUserByEmail,createEvent,createNewUser,fetchUserEvents} =require("../models/events.models")


exports.getEndpoints=(req,res,next)=>{
    fetchAllEndpoints().then((endpoints)=>{
        return res.status(200).send({endpoints})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getEvents=(req,res,next)=>{
    fetchAllEvents().then((events)=>{
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
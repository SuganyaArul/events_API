const express=require("express");
const app=express();
const cors=require('cors');
const{getEvents,getEndpoints,getEventById,getUserDetails,postNewEvent,postNewUser,getUserEvents}=require("./controllers/events.controllers")
app.use(cors());
app.use(express.json());

app.get('/api/events',getEvents);

app.get('/api',getEndpoints);

app.get('/api/events/:event_id', getEventById);

app.get('/api/user', getUserDetails);

app.post('/api/event', postNewEvent);

app.post('/api/user', postNewUser);

app.get('/api/user/events', getUserEvents);

app.use((err,req,res,next)=>{
    if(err.msg==='No such files'||err.msg==='Not Found')
    res.status(404).send({msg:'Not Found'})
    else if(err.msg==='Events Not Found' || err.msg==='Invalid Username or Password')
    res.status(404).send(err)
    else
    next(err)
})

app.use((err,req,res,next)=>{
    if(err.code==='22P02' || err.code==='23502'){
        res.status(400).send({msg:'Bad Request'})
    }else if(err.code==='23503'){
        res.status(404).send({msg:'Not Found'})
    }
})

module.exports=app
const app=require("../app")
const request=require("supertest")
const db=require("../db/connection");
const testData=require("../db/data/test-data");
const seed = require("../db/seeds/seed");

//This will end the connection 
afterAll(()=>{
    return db.end();
})

//seeding our test data
beforeEach(()=>{
    return seed(testData);
})

describe('/api endpoints',()=>{
    test('Should respond with all the endpoints',()=>{
        return request(app).get('/api').expect(200).then(({body})=>{
            const {endpoints} = body;
            expect(endpoints).toHaveProperty('GET /api')
            expect(endpoints).toHaveProperty('GET /api/events')
        })
    })
})

describe('/api',()=>{
    describe('/events',()=>{
        test('GET:200 /events should respond with array of events data',()=>{
            return request(app).get('/api/events').expect(200)
            .then(({body})=>{
                const {events} = body;
                events.forEach((event) => {
                    expect(event).toHaveProperty('title') 
                });
                
            })
        })
        test('GET:200 /events should respond with array of events data',()=>{
            return request(app).get('/api/events?location=Manchester').expect(200)
            .then(({body})=>{
                const {events} = body;
                events.forEach((event) => {
                    expect(event).toHaveProperty('title') 
                });
                
            })
        })
        test('GET:200 /events should respond with array of events data',()=>{
            return request(app).get('/api/events?topics=the&location=Manchester').expect(200)
            .then(({body})=>{
                const {events} = body;
                events.forEach((event) => {
                    expect(event).toHaveProperty('title') 
                });
                expect(body.events).toHaveLength(1)
            })
        })
        test('GET:404 /events should respond Not Found message',()=>{
            return request(app).get('/api/events?location=makrich').expect(404)
            .then(({body})=>{
                    expect(body.msg).toBe('Not Found') 
                
                
            })
        })
    })
    describe('/events/:event_id',()=>{
        test('GET:200 /events should respond with particular event data',()=>{
            return request(app).get('/api/events/2').expect(200)
            .then(({body})=>{
                const {event} = body;
                
                    expect(event).toHaveProperty('title') 
                    expect(event.event_id).toBe(2);
                
            })
        })
        
    })
    describe('/user?email=email&password=password',()=>{
        test('GET:200 /user should respond with success message',()=>{
            return request(app).get('/api/user?email=benmitchell24@abc.com&password=benmi@24').expect(200)
            .then(({body})=>{
                const {user} = body
                expect(user.email).toBe('benmitchell24@abc.com');
                expect(user.password).toBe('benmi@24');
            })
        })
    })
    describe('/user?email=email&password=password',()=>{
        test('GET:404 /user should respond with error message for incorrect password',()=>{
            return request(app).get('/api/user?email=benmitchell24@abc.com&password=sugan').expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('Invalid Username or Password');
            })
        })
    })
    describe('/user?email=email&password=password',()=>{
        test('GET:404 /user should respond with error message for incorrect password',()=>{
            return request(app).get('/api/user?email=nithinbabu@abc.com&password=sugan@678').expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('Invalid Username or Password');
            })
        })
    })
    describe('/user?email=email',()=>{
        test('GET:404 /user should respond with error message for password not sent',()=>{
            return request(app).get('/api/user?email=nithinbabu@abc.com').expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('Invalid Username or Password');
            })
        })
    })
    describe('POST /user',()=>{
        test('POST: 201 Should respond with Posted user object',()=>{
            const user={
                email:"sakshisarav@abc.com",
                fullname:"Sakshi Sarav",
                username:"sakshi03",
                password:"saksar@03",
            }
            return request(app).post('/api/user').send(user).expect(201).then(({body})=>{
                expect(body.user).toMatchObject(user)
            })
        })
        test('POST: 400 Should respond with Bad Request if user details not sent',()=>{
            const user={
                email:"sakshisarav@abc.com",
                fullname:"Sakshi Sarav",
                username:"sakshi03",
                password:"saksar@03",
            }
            return request(app).post('/api/user').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('POST: 400 Should respond with Bad Request if required field not sent',()=>{
            const user={
                email:"sakshisarav@abc.com",
                fullname:"Sakshi Sarav",
                password:"saksar@03",
            }
            return request(app).post('/api/user').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
    describe('POST /event',()=>{
        test('POST: 201 Should respond with Posted event object',()=>{
            const event={
            "title":
            "Martin Kemp Back to the 80s",
            "date": "Fri, 6 Oct, 20:00 – Sat, 7 Oct, 01:00",
            "address":"Freight Island, 11 Baring St, Manchester",
            "event_location_map":
            "https://www.google.com/maps/vt/data=-24zcPi2FFCbQBj0wvbDCbFBNK10gXm2jbTl7r9v2YJ8VLvjNSMZppcShkd_Q5SL7Zs1IXFXMaOMw0NdEFxvx3mfIG7EzZJehyagsINUV0eAVaOEPrY",
            "description":
            "Martin Kemp is coming to Freight Island this October with a Back to the 80s SPECIAL on Friday 6th October",
            "ticket_info":"free",
            "image":
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFd4OsacnPZwvewnOgWZ5QJKmu3OZGQcz78s7M3z12uQ&s",
            "created_by":"sarahmachin04@abc.com"
            }
            return request(app).post('/api/event').send(event).expect(201).then(({body})=>{
                expect(body.event).toMatchObject(event)
            })
        })
        test('POST: 400 Should respond with Bad Request if event details not sent',()=>{
            return request(app).post('/api/event').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('POST: 400 Should respond with Bad Request if required field not sent',()=>{
            const event={
                "title":
                "Martin Kemp Back to the 80s",
                "address":"Freight Island, 11 Baring St, Manchester",
                "event_location_map":
                "https://www.google.com/maps/vt/data=-24zcPi2FFCbQBj0wvbDCbFBNK10gXm2jbTl7r9v2YJ8VLvjNSMZppcShkd_Q5SL7Zs1IXFXMaOMw0NdEFxvx3mfIG7EzZJehyagsINUV0eAVaOEPrY",
                "description":
                "Martin Kemp is coming to Freight Island this October with a Back to the 80s SPECIAL on Friday 6th October",
                "ticket_info":"free",
                "image":
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFd4OsacnPZwvewnOgWZ5QJKmu3OZGQcz78s7M3z12uQ&s",
                "created_by":"sarahmachin04@abc.com"
                }
            return request(app).post('/api/event').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
    describe('GET /user/events',()=>{
        test('GET: 200 should respond with array of user created event',()=>{
            return request(app).get('/api/user/events?email=sarahmachin04@abc.com').expect(200).then(({body})=>{
                const {events} = body;
                events.forEach((event)=>{
                    expect(event.created_by).toBe('sarahmachin04@abc.com')
                })
            })
        })
    })
})
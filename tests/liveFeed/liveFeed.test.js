var {
    initScenario1,
    clearScenario1
} = require('./scenarios');
var fetch = require('node-fetch');
const request = require('supertest');
const app = require('../../app') ; 
const { JWT_SECRET , JWT_EXPIRATION } = require('../../config/userAuth') ; 
const jwt = require('jsonwebtoken') ; 

let access_token = 'some token';
let baseUrl = 'http://localhost:3001';

beforeAll(async () => {
    await initScenario1();
    let res = await (await fetch(`${baseUrl}/v1/auth/emailLogin`, {
        method: 'POST',
        body: JSON.stringify({
            email: 'cbarraza11@gmail.com',
            password: 'swordfish'
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })).json();
    access_token = res.access_token;
    userId = res.payload.id ; 
    return;
});

afterAll( async () => {
    await clearScenario1() ; 
    return; 
});

test('the fetch fails with an error', async () => {
    expect.assertions(1);
    let res = await request(app)
    .get('/v1/liveFeed/all')
    .set('Authorization', `Bearer ${access_token}`) ; 
    let obj = {
        "payload": [
            {
                "description": "nuevo",
                "mediaPath": "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                "isUpdate": false,
                "isCensored": false,
                "latitude": null,
                "longitude": null,
                "displayLocation": "batts rock beach",
                "campaign": {
                    "name": null,
                    "urgencyLevel": "critical",
                    "isClosed": false,
                    "user": {
                        "name": "Turtles project",
                        "imagePath": "https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50"
                    },
                    "key": null
                }
            },
            {
                "description": "nuevo",
                "mediaPath": "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                "isUpdate": false,
                "isCensored": false,
                "latitude": null,
                "longitude": null,
                "displayLocation": "batts rock beach",
                "campaign": {
                    "name": null,
                    "urgencyLevel": "critical",
                    "isClosed": false,
                    "user": {
                        "name": "Turtles project",
                        "imagePath": "https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50"
                    },
                    "key": null
                },
            },
            {
                "description": "nuevo",
                "mediaPath": "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                "isUpdate": false,
                "isCensored": false,
                "latitude": null,
                "longitude": null,
                "displayLocation": "batts rock beach",
                "campaign": {
                    "name": null,
                    "urgencyLevel": "critical",
                    "isClosed": false,
                    "user": {
                        "name": "Turtles project",
                        "imagePath": "https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50"
                    },
                    "key": null
                },
            },
            {
                "description": "nuevo",
                "mediaPath": "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                "isUpdate": false,
                "isCensored": false,
                "latitude": null,
                "longitude": null,
                "displayLocation": "batts rock beach",
                "campaign": {
                    "name": null,
                    "urgencyLevel": "critical",
                    "isClosed": false,
                    "user": {
                        "name": "Turtles project",
                        "imagePath": "https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50"
                    },
                    "key": null
                },
            },
            {
                "description": "nuevo",
                "mediaPath": "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                "isUpdate": false,
                "isCensored": false,
                "latitude": null,
                "longitude": null,
                "displayLocation": "batts rock beach",
                "campaign": {
                    "name": null,
                    "urgencyLevel": "critical",
                    "isClosed": false,
                    "user": {
                        "name": "Turtles project",
                        "imagePath": "https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50"
                    },
                    "key": null
                },
            }
        ]
    } ;
    expect(res.body).toMatchObject(obj);
});
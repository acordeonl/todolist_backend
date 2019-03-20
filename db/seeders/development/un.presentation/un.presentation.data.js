var {db} = require('../../db/models');
var bcrypt = require('bcryptjs') ;

const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:0749eeac-16f1-454a-b782-c428641005cc',
    key: 'b7aefba8-76ec-473b-a9c4-f562de1c0d0f:W7D9YYOSjUsR12VEC/FEJvV9ZV2wV00Jm/oWxY5NaSM=',
});



async function createKCUser (obj) {
    try{
        if(obj.password)
            obj.password = bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10) ) ; 
        let user = await db.users.create(obj) ;
        // await chatkit.createUser({
        // id: `User${user.id}`,
        // name: `User${user.id}`
        // }) ; 
        // await chatkit.addUsersToRoom({
        // roomId: '19570177',
        // userIds: [`User${user.id}`]
        // }) ; 
        // await chatkit.assignRoomRoleToUser({
        // userId: `User${user.id}`,
        // name: 'userNotifications',
        // roomId: '19570177'
        // }) ; 
        // let room = await chatkit.createRoom({
        //     creatorId:`User${user.id}`,
        //     name: `User${user.id} - notifications`,
        //     userIds: [`User${user.id}`],
        //     isPrivate: true
        // });
        // await chatkit.assignRoomRoleToUser({
        // userId: `User${user.id}`,
        // name: 'userNotifications',
        // roomId: room.id
        // }) ; 
        return user ; 
    } catch(err){
        console.log(err);
    }

}

async function main(){

    let campaignIncludes = [{
            model: db.inPersonNeeds
        },
        {
            model: db.moneyNeeds
        },
        {
            model: db.skillNeeds
        },
        {
            model: db.campaignPosts,
            include: [
                {
                    model: db.campaignPostComments
                }
            ]
        }
    ] ; 

    let megancromp = await createKCUser({
        email: 'megancromp@gmail.com',
        name: 'Megan Cromp',
        username:'megancromp',
        displayLocation:'St. George’s, Grenada',
        password:'swordfish',
        isOrganization: false,
        mediaPath: 'file_1541717811653_Mask Group 212.png',
        description:"I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
    }); 

    let leonardgriffiths = await createKCUser({
        email: 'leonardgriffiths@gmail.com',
        name: 'Leonard Griffiths',
        username:'leonardgriffiths',
        displayLocation:'St. George’s, Grenada',
        password:'swordfish',
        isOrganization: false,
        mediaPath: 'file_1541718313981_Mask Group 213.png',
        description:"I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
    });

    let natalieweekes = await createKCUser({
        email: 'natalieWeekes@gmail.com',
        name: 'Natalie Weekes',
        username:'natalieweekes',
        displayLocation:'St. George’s, Grenada',
        password:'swordfish',
        isOrganization: false,
        mediaPath: 'file_1541718389726_Mask Group 214.png',
        description:"I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
    });

    let barbadosseaturtleproject = await createKCUser({
        email: 'barbadosseaturtle@gmail.com',
        name: 'Barbados Sea Turtle project',
        displayLocation:"Batts Rock Beach",
        username:'barbadosseaturtleproject',
        description:'We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1541716836379_Group 3414.png',
        organizationDetail:{
            phoneNumber:1800635277,
            organizationBackground:'The barbados Sea Turtle Project is based at the University of the West Indies (Cave Hill Campus). For more than 25 years, we have been involved in conserva on of the endangered marine turtle species that forage around and nest on Barbados through research, educa on and public outreach as well as monitoring of nes ng females, juveniles and hatchlings.', 
            website:'www.barbadosseaturtle.com',
            instagram:'barbadosseaturtle',
            facebook:'barbadosseaturtle',
            twitter:'barbadosseaturtle'
        },
        bigIssues:{
            title:'Road through nesting beach',
            displayLocation:'Speightstown',
            mediaPath:'file_1542227582705_p3080015.png', 
            problem:'This road in speighstown is one of our biggest problems for nesting females. It runs right up to one of the best nesting beaches and we often find sea turtles on the road who have been hut by cars or are stuck un the ditch on the otherside.',  
            whatWeWant:'We would like to find a way to protect turtles from this road. Either by moving the road, making a bridge over it or putting up fencing to stop the from crossing. a bridge would be ideal for expensive.',  
            whatWeAreDoing:'We are currently dping nightly patrols to check for stranded sea turtles. We have also reached out to the department of Transport for feedback on road changes but don’t fell hopeful as there is not much in the budget for plans and implementation. We are now looking in to different fencing opportunities in the meantime.', 
            howYouCanHelp: 'We need help convincing the Department of Transport that this is a worthwhile project. Please consider contactim them here and express your support. We think big here so if anyone has any expertise in bridge building and traffic mitigation we would love yo hear your ideas below. We also need help determining the best fencing, paying for it and installation. Lastly, if you see a sea turtle in the road please call us and we will move it to safety. See how you can help in detail by clicking nedd below.',
            gotAnIdea:'Do you have an idea taht you think could help with our big problem? It can be completely off the wall or something simple. If the systmes behind your idea doesn’t exist and we think it could work we can try and develop it trhough Key Ventures. What are you waiting for?'
        }
    },{
        include:[{
            model:db.organizationDetail
        },{
            model:db.bigIssues
        }]
    });
    
    let caribbeanseaturtleproject = await createKCUser({
        email: 'caribbeanseaturtleproject@gmail.com',
        name: 'Caribbean Sea Turtle Project',
        displayLocation:"St. George’s, Grenada",
        username:'caribbeanseaturtleproject',
        description:'We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1542232954427_Mask Group 230.png',
        organizationDetail:{
            phoneNumber:1800635277,
            organizationBackground:'The Caribbean Sea Turtle Project is based in St. George’s, Grenada but we work all over the island. We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years. We believe in empowering our local communities through education and public outreach as well as educating our many international visitors to',
            website:'www.caribbeanseaturtleproject.com',
            instagram:'caribbeanseaturtleproject',
            facebook:'caribbeanseaturtleproject',
            twitter:'caribbeanseaturtleproject'
        },
        bigIssues:{
            title:'Road through nesting beach',
            displayLocation:'Speightstown',
            mediaPath:'file_1542227582705_p3080015.png', 
            problem:'This road in speighstown is one of our biggest problems for nesting females. It runs right up to one of the best nesting beaches and we often find sea turtles on the road who have been hut by cars or are stuck un the ditch on the otherside.',  
            whatWeWant:'We would like to find a way to protect turtles from this road. Either by moving the road, making a bridge over it or putting up fencing to stop the from crossing. a bridge would be ideal for expensive.',  
            whatWeAreDoing:'We are currently dping nightly patrols to check for stranded sea turtles. We have also reached out to the department of Transport for feedback on road changes but don’t fell hopeful as there is not much in the budget for plans and implementation. We are now looking in to different fencing opportunities in the meantime.', 
            howYouCanHelp: 'We need help convincing the Department of Transport that this is a worthwhile project. Please consider contactim them here and express your support. We think big here so if anyone has any expertise in bridge building and traffic mitigation we would love yo hear your ideas below. We also need help determining the best fencing, paying for it and installation. Lastly, if you see a sea turtle in the road please call us and we will move it to safety. See how you can help in detail by clicking nedd below.',
            gotAnIdea:'Do you have an idea taht you think could help with our big problem? It can be completely off the wall or something simple. If the systmes behind your idea doesn’t exist and we think it could work we can try and develop it trhough Key Ventures. What are you waiting for?'
        }
    },{
        include:[{
            model:db.organizationDetail
        },{
            model:db.bigIssues
        }]
    });

    let africanwildlifefoundation = await createKCUser({
        email: 'africanwildlife@gmail.com',
        name: 'African Wildlife Foundation',
        displayLocation:"Embu Kenya",
        username:'africanwildlifefoundation',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1541717238038_1a81789f34f31d8493fc4d31488de02c.png'
    });
    
    let africanlionfoundation = await createKCUser({
        email: 'iguantaL@gmail.com',
        name: 'African Lion Foundation',
        displayLocation:"Okonjima, Namibia",
        username:'africanlionfoundation',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1541717663884_Mask Group 215.png'
    });

    let batActionNetwork = await createKCUser({
        email: 'batActionNetwork@gmail.com',
        name: 'Bat Action Network',
        displayLocation:"Surrey, United Kingdom",
        username:'batactionnetwork',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1542234691625_Bat.png'
    });

    let evergladeWildlifeFoundation = await createKCUser({
        email: 'evergladewildlifefoundation@gmail.com',
        name: 'Everglade Wildlife Foundation',
        displayLocation:"Flamingo, Florida, USA",
        username:'evergladewildlifefoundation',
        password:'swordfish',
        isOrganization: true,
        mediaPath: 'file_1542235010138_Everglades logo.png'
    });

    await db.campaigns.create({
        userId: barbadosseaturtleproject.id,
        urgencyLevel: "critical",
        mediaPath: "file_1542228862607_Webp.net-compress-image (1).jpg",
        campaignPosts: [{
            description: "This nesting female tried to cross a road to lay her eggs on a beach but was hit by a car. We need to get her medical attention wich is on the island of Grenada ASAP.",
            displayLocation: ["Batts Rock Beach"],
            isCensored: ["Animal in poor health and blood"],
            mediaPath: "file_1542228862607_Webp.net-compress-image (1).jpg"
        },
        {
            description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to @virginatlantic for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Batts Rock Beach"],
            mediaPath: "file_1542229397985_Hanson-RB.LO_.086-sick-Olive-Ridley-turtle-Marine-Savers-Maldives-3.png",
            isUpdate:true,
            campaignPostComments:[{
                userId:barbadosseaturtleproject.id,
                content:`43! We even saved one from the hotel pool and 3 from a drain. [@leonardGriffiths](/users/${leonardgriffiths.id})` 
            },{
                userId:megancromp.id,
                content:'another comment'
            }]
        },{
            description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Batts Rock Beach"],
            mediaPath: "file_1542299784952_Mask Group 47.png",
            isUpdate:true
        }],
        inPersonNeeds: [{
            description: "Assist with the movement of an approximate 85 pound female Hawksbill sea turtle from Paynes bay to a truck at 354 Flamboyant Ave",
            assistanceTime:'1 hour',
            radius:6,
            peopleNeeded: 15,
            meetingTimeAndDate:'2018-11-14T15:49:37.935Z',
            latitude: 34.334,
            longitude: 10.43
        }],
        moneyNeeds: [{
            description: "Medicine for wounds",
            ammount: 65.00
        }, {
            description: "Transport to veterinarian across island.",
            ammount: 30.00
        }]
        ,
        skillNeeds: [{
            name:'Boating',
            description: "We need boat transportation ASAP for one Hawksbill sea turtle and two BSTP biologists from Bridgetown Harbor, Barbados yo Egmont Harbor on Grenada. If you can only do one way is ok too.",
            comitmentEstimate: "2 days"
        }]
    }, {
        include:campaignIncludes
    });


    await db.campaigns.create({
        userId: caribbeanseaturtleproject.id,
        urgencyLevel: "critical",
        mediaPath: "file_1542234014334_Screenshot from 2018-11-14 17-19-34.png",
        campaignPosts: [{
            description: "Caribbean Sea Turtle Project This nesting female tried to cross a road to lay her eggs on a beach but was hit by a car. We need to get her medical attention wich is on the island of Grenada ASAP.",
            displayLocation: ["South Palm Beach"],
            mediaPath: "file_1542234014334_Screenshot from 2018-11-14 17-19-34.png"
        },
        {
            description: `Caribbean Sea Turtle Project Thank you to [@lenigriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieweekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #CSTP #Grenada… more`,
            displayLocation: ["South Palm Beach"],
            mediaPath: "file_1542234155925_Sea Turtle App Update.png",
            isUpdate:true
        }],
        inPersonNeeds: [{
            description: "Assist with the movement of an approximate 85 pound female Hawksbill sea turtle from Paynes bay to a truck at 354 Flamboyant Ave",
            assistanceTime:'1 hour',
            radius:6,
            peopleNeeded: 15,
            meetingTimeAndDate:'2018-11-14T15:49:37.935Z',
            latitude: 34.334,
            longitude: 10.43
        }],
        moneyNeeds: [{
            description: "Medicine for wounds",
            ammount: 65.00
        }, {
            description: "Transport to veterinarian across island.",
            ammount: 30.00
        }]
        ,
        skillNeeds: [{
            name:'Boating',
            description: "We need boat transportation ASAP for one Hawksbill sea turtle and two BSTP biologists from Bridgetown Harbor, Barbados yo Egmont Harbor on Grenada. If you can only do one way is ok too.",
            comitmentEstimate: "2 days"
        }]
    }, {
        include:campaignIncludes
    });


    await db.campaigns.create({
        userId: batActionNetwork.id,
        urgencyLevel: "urgent",
        mediaPath: "file_1542234784642_Screenshot from 2018-11-14 17-32-42.png",
        campaignPosts: [{
            description: `Endangered Wildlife Trust Thank you to [@leonardgriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieweekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Surrey, United Kingdom"],
            mediaPath: "file_1542234784642_Screenshot from 2018-11-14 17-32-42.png",
            isUpdate:true
        }],
    }, {
        include:campaignIncludes
    });

    await db.campaigns.create({
        userId: evergladeWildlifeFoundation.id,
        urgencyLevel: "urgent",
        mediaPath: "file_1542235427458_Mask Group -1.png",
        campaignPosts: [{
            description: `Everglade Wildlife Foundation We have just received  a citizen science report from                               about an egret with what looks to be a fishing line around its neck and mouth. We need help finding the bird in the large marsh. Once we capture it we will begin removing the fishing line, accessing the damage and what needs done.`,
            displayLocation: ["Flamingo, Florida, USA"],
            mediaPath: "file_1542235427458_Mask Group -1.png",
        },{
            description: "Everglade Wildlife Foundation Thanks to a geo-tagged citizen science report fro we were able to locate an egret with a fishing line around its neck and remove it. We arrived just in time and the line had not injured the bird. Here he is back in the fishing line free!",
            displayLocation: ["Flamingo, Florida, USA"],
            mediaPath: "file_1542235178691_Mask Group 47.png",
            isUpdate:true,
            campaignPostComments:[{
                userId:leonardgriffiths.id,
                content:"I’m so happy to hear that you were able to find him again and get the fishing line off!"
            }]
        }],
    }, {
        include:campaignIncludes
    });


    await db.campaigns.create({
        userId: africanlionfoundation.id,
        urgencyLevel: "urgent",
        mediaPath: "file_1542299670910_Mask Group 50.png",
        campaignPosts: [{
            description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Embu, Kenya"],
            mediaPath: "file_1542299670910_Mask Group 50.png",
            isUpdate:true
        }],
    }, {
        include:campaignIncludes
    });

    await db.campaigns.create({
        userId: africanwildlifefoundation.id,
        urgencyLevel: "urgent",
        mediaPath: "file_1542301132047_foxies.png",
        campaignPosts: [{
            description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Kruger National Park"],
            mediaPath: "file_1542301132047_foxies.png",
            isUpdate:true
        }],
    }, {
        include:campaignIncludes
    });

    await db.campaigns.create({
        userId: africanwildlifefoundation.id,
        urgencyLevel: "urgent",
        mediaPath: "file_1542301086257_monaco.png",
        campaignPosts: [{
            description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
            displayLocation: ["Kruger National Park"],
            mediaPath: "file_1542301086257_monaco.png",
            isUpdate:true
        }],
    }, {
        include:campaignIncludes
    });



    // db.userConnections.create({
    //     connectorUserId: organization.id,
    //     connectedUserId: globalSupporter.id
    // })
}

main() ; 
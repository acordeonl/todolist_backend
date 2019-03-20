var { db } = require('../../../../db/models');

var bcrypt = require('bcryptjs');
var createChatRoom = require('../../../../helpers/createChatRoom') ;
var i18n = require('../../../../config/locales') ; 


const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix + ':' + process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id + ':' + process.env.chatkit_secret_key
});

async function createSupport(organization, supporter, campaign, support) {
    try {
        let { userNotifications } = i18n[organization.language];
        let { userChatMessages } = i18n[organization.language];
        let gaveHelpMessage ; 
        let startSupportMessage ;
        let supporterUsername = supporter.username;
        let supporterId = supporter.id;
        let campaignId = campaign.id ;
        let campaignName  = campaign.name ;
        let room ; 

        if (support.type === 'skill') {
            await db.campaignSupport.create({
                campaignId:campaign.id,
                userId:supporter.id,
                supportType: support.type,
                skillNeedId: support.id
            });
            let skillName = support.name ;
            gaveHelpMessage = eval('`' + userNotifications.skillSupport + '`');
            startSupportMessage = eval('`' + userChatMessages.skillSupport + '`');
            room = await createChatRoom(supporter.id, organization.id , 'campaign', {
                campaignId: campaign.id,
                skillNeedId: support.id,
                inPersonNeedId: null
            });
        }

        if (support.type === 'inPerson'){
            await db.campaignSupport.create({
                campaignId:campaign.id,
                userId:supporter.id,
                supportType: support.type,
                inPersonNeedId: support.id
            });
            gaveHelpMessage = eval('`' + userNotifications.inPersonSupport + '`');
            startSupportMessage = eval('`' + userChatMessages.inPersonSupport + '`');
            room = await createChatRoom(supporter.id, organization.id , 'campaign', {
                campaignId: campaign.id,
                skillNeedId: null,
                inPersonNeedId: support.id
            });
        }
        if(support.type ===  'money'){
            await db.campaignSupport.create({
                campaignId:campaign.id,
                moneyNeedId:support.id,
                moneyAmmount:parseFloat(support.ammount),
                supportType:'money',
                userId:supporter.id,
                paymentId:support.paymentId
            }) ; 
            let { ammount , paymentId }  = support ; 
            gaveHelpMessage = eval('`' + userNotifications.moneySupport + '`');
        }

        if(support.type !== 'money'){
            await chatkit.sendMessage({
                userId: `User${supporter.id}`,
                roomId: room.id,
                text: startSupportMessage,
            });
            await chatkit.updateRoom({
                id: room.id,
                customData: {
                    ...room.custom_data,
                    timestamp: new Date().getTime()
                }
            }) ;
        }
            
        await db.keys.findOrCreate({
            where: {
                campaignId:campaign.id,
                userId:supporter.id
            },
            defaults: {
            campaignId:campaign.id,
            userId:supporter.id
            } 
        }) ;

        await db.userNotifications.create({
            type: 'support',
            userId: organization.id,
            mediaPath: supporter.mediaPath,
            content: gaveHelpMessage
        });
    } catch (err) {
        console.log(err);
    }
}

async function createDirectChat ( userId_1 , userId_2 ) {
    let room = await createChatRoom (userId_1, userId_2, 'direct', {
        campaignId: null,
        inPersonNeedId: null,
        skillNeedId: null
    });

    await chatkit.sendMessage({
        userId: `User${userId_1}`,
        roomId: room.id,
        text: 'hello',
    });
    await chatkit.updateRoom({
        id: room.id,
        customData: {
            ...room.custom_data,
            timestamp: new Date().getTime()
        }
    }) ;
}   

async function createKCUser(obj,includes,playerId) {
    try {
        if (obj.password)
            obj.password = bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10));
        if(playerId)
            obj.pushNotificationPlayerIds = [{
                playerId
            }] ;
        let user = await db.users.create(obj,includes);
        await chatkit.createUser({
            id: `User${user.id}`,
            name: `User${user.id}`
        });
        return user;
    } catch (err) {
        console.log(err);
    }

}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


async function main() {
    try {
        let date1,date2,date3,date4 ;
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
            model:db.tags
        },
        {
            model: db.campaignPosts,
            silent:true,
            include: [
                {
                    model: db.campaignPostComments,
                    silent:true
                },
                {
                    model: db.campaignPostLikes
                },
                {
                    model: db.campaignPostBookmarks
                }
            ]
        }
        ];
    // --------------- create users ----------------------
        // movich
        let megancromp = await createKCUser({
            email: 'megancromp@gmail.com',
            name: 'Megan Cromp',
            username: 'megancromp',
            displayLocation: 'St. George’s, Grenada',
            password: 'swordfish',
            isOrganization: false,
            latitude:11.009949,
            longitude:-74.825390,
            mediaPath: 'file_1541717811653_Mask Group 212.png',
            description: "I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
        },{
            include: [{
                model: db.pushNotificationPlayerIds
            }]
        });

        // Baranoa
        let leonardgriffiths = await createKCUser({
            email: 'leonardgriffiths@gmail.com',
            name: 'Leonard Griffiths',
            username: 'leonardgriffiths',
            displayLocation: 'St. George’s, Grenada',
            password: 'swordfish',
            isOrganization: false,
            latitude:10.796680,
            longitude:-74.914421,
            mediaPath: 'file_1541718313981_Mask Group 213.png',
            description: "I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
        },{
            include: [{
                model: db.pushNotificationPlayerIds
            }]
        });

        // Puerto Colombia
        let natalieweekes = await createKCUser({
            email: 'natalieWeekes@gmail.com',
            name: 'Natalie Weekes',
            username: 'natalieweekes',
            latitude:10.987760,
            longitude:-74.954620,
            displayLocation: 'St. George’s, Grenada',
            password: 'swordfish',
            isOrganization: false,
            mediaPath: 'file_1541718389726_Mask Group 214.png',
            description: "I'm a Wildlife Biologist from the Us traveling around the world. Currently studying turtles in Cambodia and making a difference where I can."
        },{
            include: [{
                model: db.pushNotificationPlayerIds
            }]
        });

        // parque venezuela
        let barbadosseaturtleproject = await createKCUser({
            email: 'barbadosseaturtle@gmail.com',
            name: 'Barbados Sea Turtle project',
            displayLocation: "Batts Rock Beach",
            username: 'barbadosseaturtleproject',
            description: 'We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.',
            password: 'swordfish',
            isOrganization: true,
            latitude:11.001530,
            longitude:-74.824089,
            mediaPath: 'file_1541716836379_Group 3414.png',
            organizationDetail: {
                phoneNumber: 1800635277,
                organizationBackground: 'The barbados Sea Turtle Project is based at the University of the West Indies (Cave Hill Campus). For more than 25 years, we have been involved in conserva on of the endangered marine turtle species that forage around and nest on Barbados through research, educa on and public outreach as well as monitoring of nes ng females, juveniles and hatchlings.',
                website: 'www.barbadosseaturtle.com',
                instagram: 'barbadosseaturtle',
                facebook: 'barbadosseaturtle',
                twitter: 'barbadosseaturtle'
            },
            bigIssues: [{
                title: 'Road through nesting beach',
                displayLocation: 'Speightstown',
                mediaPath: 'file_1542227582705_p3080015.png',
                problem: 'This road in speighstown is one of our biggest problems for nesting females. It runs right up to one of the best nesting beaches and we often find sea turtles on the road who have been hut by cars or are stuck un the ditch on the otherside.',
                whatWeWant: 'We would like to find a way to protect turtles from this road. Either by moving the road, making a bridge over it or putting up fencing to stop the from crossing. a bridge would be ideal for expensive.',
                whatWeAreDoing: 'We are currently dping nightly patrols to check for stranded sea turtles. We have also reached out to the department of Transport for feedback on road changes but don’t fell hopeful as there is not much in the budget for plans and implementation. We are now looking in to different fencing opportunities in the meantime.',
                howYouCanHelp: 'We need help convincing the Department of Transport that this is a worthwhile project. Please consider contactim them here and express your support. We think big here so if anyone has any expertise in bridge building and traffic mitigation we would love yo hear your ideas below. We also need help determining the best fencing, paying for it and installation. Lastly, if you see a sea turtle in the road please call us and we will move it to safety. See how you can help in detail by clicking nedd below.',
                gotAnIdea: 'Do you have an idea taht you think could help with our big problem? It can be completely off the wall or something simple. If the systmes behind your idea doesn’t exist and we think it could work we can try and develop it trhough Key Ventures. What are you waiting for?'
            }]
        }, {
                include: [{
                    model: db.organizationDetail
                }, {
                    model: db.bigIssues
                }]
            });

        // Ponedera 
        let caribbeanseaturtleproject = await createKCUser({
            email: 'caribbeanseaturtleproject@gmail.com',
            name: 'Caribbean Sea Turtle Project',
            displayLocation: "St. George’s, Grenada",
            username: 'caribbeanseaturtleproject',
            description: 'We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.',
            password: 'swordfish',
            latidude:10.641600,
            longitude:-74.752690,
            isOrganization: true,
            mediaPath: 'file_1542232954427_Mask Group 230.png',
            organizationDetail: {
                phoneNumber: 1800635277,
                organizationBackground: 'The Caribbean Sea Turtle Project is based in St. George’s, Grenada but we work all over the island. We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years. We believe in empowering our local communities through education and public outreach as well as educating our many international visitors to',
                website: 'www.caribbeanseaturtleproject.com',
                instagram: 'caribbeanseaturtleproject',
                facebook: 'caribbeanseaturtleproject',
                twitter: 'caribbeanseaturtleproject'
            },
            bigIssues: [{
                title: 'Road through nesting beach',
                displayLocation: 'Speightstown',
                mediaPath: 'file_1542227582705_p3080015.png',
                problem: 'This road in speighstown is one of our biggest problems for nesting females. It runs right up to one of the best nesting beaches and we often find sea turtles on the road who have been hut by cars or are stuck un the ditch on the otherside.',
                whatWeWant: 'We would like to find a way to protect turtles from this road. Either by moving the road, making a bridge over it or putting up fencing to stop the from crossing. a bridge would be ideal for expensive.',
                whatWeAreDoing: 'We are currently dping nightly patrols to check for stranded sea turtles. We have also reached out to the department of Transport for feedback on road changes but don’t fell hopeful as there is not much in the budget for plans and implementation. We are now looking in to different fencing opportunities in the meantime.',
                howYouCanHelp: 'We need help convincing the Department of Transport that this is a worthwhile project. Please consider contactim them here and express your support. We think big here so if anyone has any expertise in bridge building and traffic mitigation we would love yo hear your ideas below. We also need help determining the best fencing, paying for it and installation. Lastly, if you see a sea turtle in the road please call us and we will move it to safety. See how you can help in detail by clicking nedd below.',
                gotAnIdea: 'Do you have an idea taht you think could help with our big problem? It can be completely off the wall or something simple. If the systmes behind your idea doesn’t exist and we think it could work we can try and develop it trhough Key Ventures. What are you waiting for?'
            }]
        }, {
                include: [{
                    model: db.organizationDetail
                }, {
                    model: db.bigIssues
                }]
            });

        // Estadio metropolitano Bararnquilal
        let africanwildlifefoundation = await createKCUser({
            email: 'africanwildlife@gmail.com',
            name: 'African Wildlife Foundation',
            displayLocation: "Embu Kenya",
            latitude:10.926867,
            longitude:-74.800615,
            username: 'africanwildlifefoundation',
            password: 'swordfish',
            isOrganization: true,
            mediaPath: 'file_1541717238038_1a81789f34f31d8493fc4d31488de02c.png'
        });

        // La troja
        let africanlionfoundation = await createKCUser({
            email: 'iguantaL@gmail.com',
            name: 'African Lion Foundation',
            latidude:10.993631,
            longitude:-74.808760,
            displayLocation: "Okonjima, Namibia",
            username: 'africanlionfoundation',
            password: 'swordfish',
            isOrganization: true,
            mediaPath: 'file_1541717663884_Mask Group 215.png'
        });

        // Sabana larga
        let batActionNetwork = await createKCUser({
            email: 'batActionNetwork@gmail.com',
            name: 'Bat Action Network',
            latidude:10.631643,
            longitude:-74.922153,
            displayLocation: "Surrey, United Kingdom",
            username: 'batactionnetwork',
            password: 'swordfish',
            isOrganization: true,
            mediaPath: 'file_1542234691625_Bat.png'
        });

        // Cartagena
        let evergladeWildlifeFoundation = await createKCUser({
            email: 'evergladewildlifefoundation@gmail.com',
            name: 'Everglade Wildlife Foundation',
            displayLocation: "Flamingo, Florida, USA",
            latitude:10.411613,
            longitude:-75.518411,
            username: 'evergladewildlifefoundation',
            password: 'swordfish',
            isOrganization: true,
            mediaPath: 'file_1542235010138_Everglades logo.png'
        });

    // --------------- create Campaigns ----------------------
    
        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        date2 = randomDate(date, new Date()) ;
        date3 = randomDate(date2, new Date()) ;
        let barbadosCampaignRef = await db.campaigns.create({
            userId: barbadosseaturtleproject.id,
            urgencyLevel: "critical",
            mediaPath: "file_1542228862607_Webp.net-compress-image (1).jpg",
            name:'barbados turtle campaign',
            campaignPosts: [{
                description: "This nesting female tried to cross a road to lay her eggs on a beach but was hit by a car. We need to get her medical attention wich is on the island of Grenada ASAP.",
                displayLocation: ["Batts Rock Beach"],
                isCensored: ["Animal in poor health and blood"],
                mediaPath: "file_1542228862607_Webp.net-compress-image (1).jpg",
                createdAt:date, 
                updatedAt:date
            },
            {
                description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to @virginatlantic for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Batts Rock Beach"],
                mediaPath: "file_1542229397985_Hanson-RB.LO_.086-sick-Olive-Ridley-turtle-Marine-Savers-Maldives-3.png",
                isUpdate: true,
                createdAt:date2, 
                updatedAt:date2,
                campaignPostComments: [{
                    userId: barbadosseaturtleproject.id,
                    content: `43! We even saved one from the hotel pool and 3 from a drain. [@leonardGriffiths](/users/${leonardgriffiths.id})`,
                    updatedAt:date3 ,
                    createdAt:date3 
                }, {
                    userId: megancromp.id,
                    content: 'another comment',
                    updatedAt:date2,
                    createdAt:date2
                }],
                campaignPostLike: {
                    userId: megancromp.id
                },
                campaignPostBookmark: {
                    userId: leonardgriffiths.id
                },
            }, {
                description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Batts Rock Beach"],
                mediaPath: "file_1542299784952_Mask Group 47.png",
                isUpdate: true,
                createdAt:date3, 
                updatedAt:date3
            }],
            inPersonNeeds: [{
                description: "Assist with the movement of an approximate 85 pound female Hawksbill sea turtle from Paynes bay to a truck at 354 Flamboyant Ave",
                assistanceTime: '1 hour',
                radius: 6,
                peopleNeeded: 15,
                meetingTimeAndDate: '2018-11-14T15:49:37.935Z',
                latitude: 11.001530,
                longitude: -74.824089
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
                name: 'Boating',
                description: "We need boat transportation ASAP for one Hawksbill sea turtle and two BSTP biologists from Bridgetown Harbor, Barbados yo Egmont Harbor on Grenada. If you can only do one way is ok too.",
                comitmentEstimate: "2 days"
            }],
            tags:[{
                userId: barbadosseaturtleproject.id,
                name:'endangered'
            }]
        }, {
                include: campaignIncludes,
            });

        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        date2 = randomDate(date, new Date()) ;
        let carribeanCampaignRef = await db.campaigns.create({
            userId: caribbeanseaturtleproject.id,
            urgencyLevel: "critical",
            mediaPath: "file_1542234014334_Screenshot from 2018-11-14 17-19-34.png",
            name:'carribean test campaign',
            campaignPosts: [{
                description: "Caribbean Sea Turtle Project This nesting female tried to cross a road to lay her eggs on a beach but was hit by a car. We need to get her medical attention wich is on the island of Grenada ASAP.",
                displayLocation: ["South Palm Beach"],
                mediaPath: "file_1542234014334_Screenshot from 2018-11-14 17-19-34.png",
                campaignPostLike: {
                    userId: megancromp.id
                },
                createdAt:date, 
                updatedAt:date,
            },
            {
                description: `Caribbean Sea Turtle Project Thank you to [@lenigriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieweekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #CSTP #Grenada… more`,
                displayLocation: ["South Palm Beach"],
                mediaPath: "file_1542234155925_Sea Turtle App Update.png",
                isUpdate: true,
                campaignPostBookmark: {
                    userId: megancromp.id
                },
                createdAt:date2, 
                updatedAt:date2
            }],
            inPersonNeeds: [{
                description: "Assist with the movement of an approximate 85 pound female Hawksbill sea turtle from Paynes bay to a truck at 354 Flamboyant Ave",
                assistanceTime: '1 hour',
                radius: 6,
                peopleNeeded: 15,
                meetingTimeAndDate: '2018-11-14T15:49:37.935Z',
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
                name: 'Boating',
                description: "We need boat transportation ASAP for one Hawksbill sea turtle and two BSTP biologists from Bridgetown Harbor, Barbados yo Egmont Harbor on Grenada. If you can only do one way is ok too.",
                comitmentEstimate: "2 days"
            }],
            tags:[{
                userId: barbadosseaturtleproject.id,
                name:'vulnerable'
            }]
        }, {
                include: campaignIncludes,
            });


        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        let batCampaignRef = await db.campaigns.create({
            userId: batActionNetwork.id,
            urgencyLevel: "urgent",
            mediaPath: "file_1542234784642_Screenshot from 2018-11-14 17-32-42.png",
            name:'bat test campaign',
            createdAt:date, 
            updatedAt:date,
            campaignPosts: [{
                description: `Endangered Wildlife Trust Thank you to [@leonardgriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieweekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Surrey, United Kingdom"],
                mediaPath: "file_1542234784642_Screenshot from 2018-11-14 17-32-42.png",
                createdAt:date, 
                updatedAt:date,
                isUpdate: true,
                campaignPostLike: {
                    userId: megancromp.id
                },
                campaignPostBookmark: {
                    userId: megancromp.id
                }
            }],
        }, {
                include: campaignIncludes,
            });

        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        date2 = randomDate(date, new Date()) ;
        let evergladeCampaignRef = await db.campaigns.create({
            userId: evergladeWildlifeFoundation.id,
            urgencyLevel: "urgent",
            name:'everglade test campaign',
            mediaPath: "file_1542235427458_Mask Group -1.png",
            isClosed:true,
            campaignPosts: [{
                description: `Everglade Wildlife Foundation We have just received  a citizen science report from                               about an egret with what looks to be a fishing line around its neck and mouth. We need help finding the bird in the large marsh. Once we capture it we will begin removing the fishing line, accessing the damage and what needs done.`,
                displayLocation: ["Flamingo, Florida, USA"],
                mediaPath: "file_1542235427458_Mask Group -1.png",
                createdAt:date, 
                updatedAt:date
            }, {
                description: "Everglade Wildlife Foundation Thanks to a geo-tagged citizen science report fro we were able to locate an egret with a fishing line around its neck and remove it. We arrived just in time and the line had not injured the bird. Here he is back in the fishing line free!",
                displayLocation: ["Flamingo, Florida, USA"],
                mediaPath: "file_1542235178691_Mask Group 47.png",
                isUpdate: true,
                createdAt:date2, 
                updatedAt:date2,
                campaignPostComments: [{
                    userId: leonardgriffiths.id,
                    content: "I’m so happy to hear that you were able to find him again and get the fishing line off!"
                }]
            }],
            skillNeeds: [{
                name: 'Web design',
                description: "We need boat transportation ASAP for one Hawksbill sea turtle and two BSTP biologists from Bridgetown Harbor, Barbados yo Egmont Harbor on Grenada. If you can only do one way is ok too.",
                comitmentEstimate: "2 days"
            }],
            inPersonNeeds: [{
                description: "Assist with the movement of an approximate 85 pound female Hawksbill sea turtle from Paynes bay to a truck at 354 Flamboyant Ave",
                assistanceTime: '1 hour',
                radius: 6,
                peopleNeeded: 15,
                meetingTimeAndDate: '2018-11-14T15:49:37.935Z',
                latitude: 34.334,
                longitude: 10.43
            }]
        }, {
                include: campaignIncludes,
            });

        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        await db.campaigns.create({
            userId: africanlionfoundation.id,
            urgencyLevel: "urgent",
            name:'african test campaign',
            mediaPath: "file_1542299670910_Mask Group 50.png",
            campaignPosts: [{
                description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Embu, Kenya"],
                mediaPath: "file_1542299670910_Mask Group 50.png",
                isUpdate: true,
                createdAt:date, 
                updatedAt:date
            }],
        }, {
                include: campaignIncludes,
            });

        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        await db.campaigns.create({
            userId: africanwildlifefoundation.id,
            urgencyLevel: "urgent",
            name:'Wildlife foundation campaign',
            mediaPath: "file_1542301132047_foxies.png",
            campaignPosts: [{
                description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Kruger National Park"],
                mediaPath: "file_1542301132047_foxies.png",
                isUpdate: true,
                createdAt:date, 
                updatedAt:date
            }],
        }, {
                include: campaignIncludes,
            });

        date = randomDate(new Date(2017, 0, 1), new Date()) ;
        await db.campaigns.create({
            userId: africanwildlifefoundation.id,
            urgencyLevel: "urgent",
            name:'wild foundation campaign',
            mediaPath: "file_1542301086257_monaco.png",
            campaignPosts: [{
                description: `Thank you to [@leonargriffiths](/users/${leonardgriffiths.id}) for donating the gas money and to [@natalieWeekes](/users/${natalieweekes.id}) for the In-person help we needed to save this nestlings! #BSTP #barbados`,
                displayLocation: ["Kruger National Park"],
                mediaPath: "file_1542301086257_monaco.png",
                isUpdate: true, 
                createdAt:date, 
                updatedAt:date
            }],
        }, {
                include: campaignIncludes,
            });

    // --------------- tmp vars ----------------------
        let barbadosCampaign = await db.campaigns.findOne({
            where: {id: barbadosCampaignRef.id},
            include: campaignIncludes
        });
        let evergladeCampaign = await db.campaigns.findOne({
            where: {id: evergladeCampaignRef.id},
            include: campaignIncludes
        });

    // --------------- create Support ----------------------
        await createSupport(barbadosseaturtleproject, megancromp, barbadosCampaign, { type: 'skill', id: barbadosCampaign.skillNeeds[0].id, name: barbadosCampaign.skillNeeds[0].name });
        await createSupport(evergladeWildlifeFoundation, natalieweekes , evergladeCampaign, { type: 'skill', id: evergladeCampaign.skillNeeds[0].id, name: evergladeCampaign.skillNeeds[0].name });
        await createSupport(evergladeWildlifeFoundation, leonardgriffiths , evergladeCampaign, { type: 'inPerson', id: evergladeCampaign.skillNeeds[0].id, name: evergladeCampaign.skillNeeds[0].name });
        await createSupport(barbadosseaturtleproject, leonardgriffiths , barbadosCampaign , { type:'inPerson' , id:barbadosCampaign.inPersonNeeds[0].id }) ;
        await createSupport(barbadosseaturtleproject, megancromp , barbadosCampaign , { type:'money' , id:barbadosCampaign.moneyNeeds[0].id , ammount:5.3 , paymentId:'testpaymentId'}) ;
    
    // --------------- create Direct Chat  ----------------------
        await createDirectChat ( megancromp.id , leonardgriffiths.id ) ;
        await createDirectChat ( megancromp.id , natalieweekes.id ) ;
        await createDirectChat ( megancromp.id , evergladeWildlifeFoundation.id ) ;

    // --------------- create connections ----------------------
        await db.userConnections.create({
            connectedUserId:megancromp.id,
            connectorUserId:barbadosseaturtleproject.id
        }) ;

        await db.userConnections.create({
            connectedUserId:megancromp.id,
            connectorUserId:caribbeanseaturtleproject.id
        }) ;

        await db.userConnections.create({
            connectedUserId:barbadosseaturtleproject.id,
            connectorUserId:megancromp.id
        }) ;

        await db.userConnections.create({
            connectedUserId:leonardgriffiths.id,
            connectorUserId:barbadosseaturtleproject.id
        }) ;
        process.exit() ;
    } catch(err){
        console.log(err);
    }


}

main(); 
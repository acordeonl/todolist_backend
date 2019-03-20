var {db} = require('../../db/models');
var bcrypt = require('bcryptjs') ;


var salt = bcrypt.genSaltSync(10)     ; 
var hash = bcrypt.hashSync('swordfish', salt) ;

async function main(){

    let globalSupporter = await db.users.create({
        email: 'cbarraza11@gmail.com',
        name: 'Camilo Barraza',
        password:hash,
        isOrganization: false,
        mediaPath: 'https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50'
    });

    let organization = await db.users.create({
        email: 'testing@gmail.com',
        name: 'Turtles project',
        password:hash,
        isOrganization: true,
        mediaPath: 'https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50'
    });

    for (let i = 0; i < 15; i++) {
        await db.campaigns.create({
            userId: organization.id,
            description: "lets help all turtles",
            urgencyLevel: "critical",
            displayLocation: "batts rock beach",
            mediaPath: "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
            IUCNStatus:['RE','CR','AR'],
            campaignPosts: [{
                description: "nuevo",
                urgencyLevel: "critical",
                displayLocation: ["batts rock beach","somewhere over the rainbow"],
                isCensored: ["testing","algo mas"],
                mediaPath: "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
            }],
            inPersonNeeds: [{
                description: "probando",
                peopleNeeded: 15,
                latitude: 34.334,
                longitude: 10.43
            }, {
                description: "proband 2o",
                peopleNeeded: 15,
                latitude: 34.334,
                longitude: 10.43
            }],
            moneyNeeds: [{
                description: "otra prueba 4",
                ammount: 34
            }, {
                description: "otra prueba",
                ammount: 56
            }],
            skillNeeds: [{
                description: "skills description",
                comitmentEstimate: 34
            }]
        }, {
            include: [{
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
                    include: [{
                            model: db.campaignPostLikes
                        },
                        {
                            model: db.campaignPostBookmarks
                        }
                    ]
                }
            ]
        });
    }

    db.userConnections.create({
        connectorUserId: organization.id,
        connectedUserId: globalSupporter.id
    });
}

main() ; 
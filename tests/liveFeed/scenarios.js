var {db} = require('../../db/models');
var bcrypt = require('bcryptjs') ;


var salt = bcrypt.genSaltSync(10)     ; 
var hash = bcrypt.hashSync('swordfish', salt) ;

async function initScenario1() {

    let globalSupporter = await db.users.create({
        email: 'cbarraza11@gmail.com',
        name: 'Camilo Barraza',
        password:hash,
        isOrganization: false,
        imagePath: 'https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50'
    });

    let organization = await db.users.create({
        email: 'camiloandresbarrazaurbina@gmail.com',
        name: 'Turtles project',
        password:hash,
        isOrganization: true,
        imagePath: 'https://lh3.googleusercontent.com/-pULZeGjMULo/AAAAAAAAAAI/AAAAAAAAD0I/L26c02mhlxc/photo.jpg?sz=50'
    });

    console.log(globalSupporter.id);

    for (let i = 0; i < 5; i++) {
        await db.campaigns.create({
            userId: organization.id,
            description: "lets help all turtles",
            urgencyLevel: "critical",
            displayLocation: "batts rock beach",
            isCensored: false,
            mediaPath: "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
            campaignPosts: [{
                description: "nuevo",
                urgencyLevel: "critical",
                displayLocation: "batts rock beach",
                isCensored: false,
                mediaPath: "file_1539723273300_green-sea-turtle-closeup-underwater.adapt.945.1.jpg",
                campaignPostLike: {
                    userId: globalSupporter.id
                },
                campaignPostBookmark: {
                    userId: globalSupporter.id
                }
            }],
            inPersonNeeds: [{
                description: "probando",
                peopleNeeded: "about 15",
                latitude: 34.334,
                longitude: 10.43,
                contactName: "Dr. Karim"
            }, {
                description: "proband 2o",
                peopleNeeded: "about 15",
                latitude: 34.334,
                longitude: 10.43,
                contactName: "Dr. Karim"
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
}

async function clearScenario1() {
    await db.organizationFollowers.destroy({
        where: {}
    });
    await db.campaigns.destroy({
        where: {}
    });
    await db.users.destroy({
        where: {}
    });
}

module.exports.initScenario1 = initScenario1;
module.exports.clearScenario1 = clearScenario1;
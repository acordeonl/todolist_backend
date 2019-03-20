/** 
 * @module helpers/kc_toggle
 * */

/**
 * Creates entity on database in case it doesn't exist or destroys it otherwise
 * @param {Object} entity database entity
 * @param {Object} obj query object
 */
module.exports = async function(entity,obj) {
    let query = {where:obj} ; 
    let res = await entity.find(query);
    if(res)
        await entity.destroy(query) ; 
    else
        await entity.create(obj) ; 
};


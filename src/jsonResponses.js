const users = {};

//json response helper
const respondJSON = (request, response, status, object) => {
    const responseString = JSON.stringify(object);

    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(responseString);
    response.end();
};

//helper for heads
const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = { users };

    return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
    return respondJSONMeta(request, response, 200);
};

const addUser = (request, response, body) => {
    if (!body.name || !body.age) {
        const responseJSON = {
            message: 'Name and age are both required.',
            id: 'missingParams',
        };
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201; //assume new user

    if (users[body.name]) {
        responseCode = 204;
        users[body.name].age = body.age;
    } else {
        users[body.name] = { name: body.name, age: body.age };
    }

    if (responseCode === 201) {
        const responseJSON = {
            message: 'Created Successfully',
        };
        return respondJSON(request, response, responseCode, responseJSON);
    }

    //if 204, no body
    return respondJSONMeta(request, response, responseCode);
};

const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => {
    return respondJSONMeta(request, response, 404);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
    return respondJSONMeta(request, response, 404);
};

module.exports.getUsers = getUsers;
module.exports.getUsersMeta = getUsersMeta;
module.exports.addUser = addUser;
module.exports.notReal = notReal;
module.exports.notRealMeta = notRealMeta;
module.exports.notFound = notFound;
module.exports.notFoundMeta = notFoundMeta;
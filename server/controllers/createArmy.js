const statsAllUnit = {
    peasant: createUnitType("peasant", 10, 4, 2, 0),
    ninja: createUnitType("ninja", 10, 6, 3, 0),
    knight: createUnitType("knight", 25, 8, 2, 0),
    bowman: createUnitType("bowman", 8, 5, 1, 5),
};

const listUnits = ["peasant", "ninja", "knight", "bowman"];

function createUnitType(type, hp, dmg, move, range) {
    return {
        type, hp, maxHp: hp, dmg, move, range
    };
}

function copyJson(json) {
    return JSON.parse(JSON.stringify(json));
}

function generateJsonArmy(nbUnits, idRoom, idPlayer) {
    const army = [];
    let idxUnit = 0;
    let x = 1;
    let y = (isFirstPlayer(idRoom, idPlayer) === true) ? 12 : 2;
    for (const unit of listUnits) {
        for (let idx = 0; idx < nbUnits[unit]; idx++) {
            const newUnit = copyJson(statsAllUnit[unit]);
            newUnit["x"] = x;
            newUnit["y"] = y;
            newUnit["idx"] = idxUnit;
            newUnit["hasMoved"] = false;
            army.push(newUnit);
            x += 2;
            idxUnit++;
        }
    }
    return army;
}

function checkReady(idRoom) {
    for (const player of global.ROOMS[idRoom].players) {
        if (!("army" in global.ROOMS[idRoom][player])) {
            return false;
        }
    }
    return true;
}

function isFirstPlayer(idRoom, idPlayer) {
    if (global.ROOMS[idRoom].players[0] === idPlayer) {
        return true;
    } else {
        return false;
    }
}

function createArmy(req, res, next) {
    const nbUnits = req.body.army;
    const idPlayer = req.query.idPlayer;
    const idRoom = req.params.idRoom;
    global.ROOMS[idRoom][idPlayer]["army"] = generateJsonArmy(nbUnits, idRoom, idPlayer);
    if (checkReady(idRoom) === true) {
        global.ROOMS[idRoom].status = 3;
    }
    console.log(JSON.stringify(global.ROOMS));
    res.send({
        idRoom: req.params.idRoom
    });
}

module.exports = createArmy;
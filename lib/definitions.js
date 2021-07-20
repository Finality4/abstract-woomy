// GUN DEFINITIONS
const combineStats = function(arr) {
    try {
    // Build a blank array of the appropiate length
    let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    arr.forEach(function(component) {
        for (let i=0; i<data.length; i++) {
            data[i] = data[i] * component[i];
        }
    });
    return {
        reload:     data[0],
        recoil:     data[1],
        shudder:    data[2], 
        size:       data[3],
        health:     data[4],
        damage:     data[5],
        pen:        data[6],
        speed:      data[7],
        maxSpeed:   data[8],
        range:      data[9],
        density:    data[10],
        spray:      data[11],
        resist:     data[12],
    };
    } catch(err) {
        console.log(err);
        console.log(JSON.stringify(arr));
    }
};
const skillSet = (() => {
    let config = require('../config.json');
    let skcnv = {
        rld: 0,
        pen: 1,
        str: 2,
        dam: 3,
        spd: 4,
    
        shi: 5,
        atk: 6,
        hlt: 7,
        rgn: 8,
        mob: 9,
    };
    return args => {
        let skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let s in args) {
            if (!args.hasOwnProperty(s)) continue;
            skills[skcnv[s]] = Math.round(config.MAX_SKILL * args[s]);
        }
        return skills;
    };
})();

const setBuild = build => {
  let skills = build.split(build.includes('/') ? '/' : '').map(r => +r);
  if (skills.length !== 10) throw new RangeError('Build must be made up of 10 numbers');
  return [6, 4, 3, 5, 2, 9, 0, 1, 8, 7].map(r => skills[r]);
};

const g = { // Gun info here 
    trap:               [36,    1,     0.25,   0.6,    1,      0.75,   1,      5,      1,      1,      1,      15,     3], 
    swarm:              [18,    0.25,  0.05,   0.4,    1,      0.75,   1,      4,      1,      1,      1,      5,      1],  
    drone:              [50,    0.25,  0.1,    0.6,    1,      1,      1,      2,      1,      1,      1,      0.1,    1], 
    factory:            [60,    1,     0.1,    0.7,    1,      0.75,   1,      3,      1,      1,      1,      0.1,    1], 
    basic:              [18,    1.4,   0.1,    1,      1,      0.75,   1,      4.5,    1,      1,      1,      15,     1],  
    /***************** RELOAD RECOIL SHUDDER  SIZE   HEALTH  DAMAGE   PEN    SPEED    MAX    RANGE  DENSITY  SPRAY   RESIST  */
    blank:              [1,     1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1],
        spam:           [1.1,   1,     1,      1.05,   1,      1.1,    1,      0.9,    0.7,    1,      1,      1,      1.05],      
        minion:         [1,     1,     2,      1,      0.4,    0.4,    1.2,    1,      1,      0.75,   1,      2,      1],      
        single:         [1.05,  1,     1,      1,      1,      1,      1,      1.05,   1,      1,      1,      1,      1],  
    sniper:             [1.35,  1,     0.25,   1,      1,      0.8,    1.1,    1.5,    1.5,    1,      1.5,    0.2,    1.15],
        rifle:          [0.8,   0.8,   1.5,    1,      0.8,    0.8,    0.9,    1,      1,      1,      1,      2,      1],     
        assass:         [1.65,  1,     0.25,   1,      1.15,   1,      1.1,    1.18,   1.18,   1,      3,      1,      1.3],
        hunter:         [1.5,   0.7,   1,      0.95,   1,      0.9,    1,      1.1,    0.8,    1,      1.2,    1,      1.15], 
            hunter2:    [1,     1,     1,      0.9,    2,      0.5,    1.5,    1,      1,      1,      1.2,    1,      1.1], 
            preda:      [1.4,   1,     1,      0.8,    1.5,    0.9,    1.2,    0.9,    0.9,    1,      1,      1,      1],   
            snake:      [0.4,   1,     4,      1,      1.5,    0.9,    1.2,    0.2,    0.35,   1,      3,      6,      0.5],   
            sidewind:   [1.5,   2,     1,      1,      1.5,    0.9,    1,      0.15,   0.5,    1,      1,      1,      1],  
            snakeskin:  [0.6,   1,     2,      1,      0.5,    0.5,    1,      1,      0.2,    0.4,    1,      5,      1],
    mach:               [0.5,   0.8,   1.7,    1,      0.7,    0.7,    1,      1,      0.8,    1,      1,      2.5,    1],
        blaster:        [1,     1.2,   1.25,   1.1,    1.5,    1,      0.6,    0.8,    0.33,   0.6,    0.5,    1.5,    0.8], 
        chain:          [1.25,  1.33,  0.8,    1,      0.8,    1,      1.1,    1.25,   1.25,   1.1,    1.25,   0.5,    1.1], 
        mini:           [1.25,  0.6,   1,      0.8,    0.55,   0.45,   1.25,   1.33,   1,      1,      1.25,   0.5,    1.1], 
            stream:     [1.1,   0.6,   1,      1,      1,      0.65,   1,      1.24,   1,      1,      1,      1,      1],    
        shotgun:        [8,     0.4,   1,      1.5,    1,      0.4,    0.8,    1.8,    0.6,    1,      1.2,    1.2,    1], 
    flank:              [1,     1.2,   1,      1,      1.02,   0.81,   0.9,    1,      0.85,   1,      1.2,    1,      1],
        tri:            [1,     0.9,   1,      1,      0.9,    1,      1,      0.8,    0.8,    0.6,    1,      1,      1],  
            trifront:   [1,     0.2,   1,      1,      1,      1,      1,      1.3,    1.1,    1.5,    1,      1,      1],  
            thruster:   [1,     1.5,   2,      1,      0.5,    0.5,    0.7,    1,      1,      1,      1,      0.5,    0.7], 
        auto: /*pure*/  [1.8,   0.75,  0.5,    0.8,    0.9,    0.6,    1.2,    1.1,    1,      0.8,    1.3,    1,      1.25],
            five:       [1.15,  1,     1,      1,      1,      1,      1,      1.05,   1.05,   1.1,    2,      1,      1],   
            autosnipe:  [1,     1,     1,      1.4,    2,      1,      1,      1,      1,      1,      1,      1,      1],   
    /***************** RELOAD RECOIL SHUDDER  SIZE   HEALTH  DAMAGE   PEN    SPEED    MAX    RANGE  DENSITY  SPRAY   RESIST  */ 
    pound:              [2,     1.6,   1,      1,      1,      2,      1,      0.85,   0.8,    1,      1.5,    1,      1.15], 
        destroy:        [2.2,   1.8,   0.5,    1,      2,      2,      1.2,    0.65,   0.5,    1,      2,      1,      3],
            anni:       [0.85,  1.25,  1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1],    
            hive:       [1.5,   0.8,   1,      0.8,    0.7,    0.3,    1,      1,      0.6,    1,      1,      1,      1],
        arty:           [1.2,   0.7,   1,      0.9,    1,      1,      1,      1.15,   1.1,    1,      1.5,    1,      1], 
            mortar:     [1.2,   1,     1,      1,      1.1,    1,      1,      0.8,    0.8,    1,      1,      1,      1],   
            spreadmain: [0.78125, 0.25, 0.5,   1,      0.5,    1,      1,   1.5/0.78, 0.9/0.78,1,      1,      1,      1], 
            spread:     [1.5,   1,     0.25,   1,      1,      1,      1,      0.7,    0.7,    1,      1,      0.25,   1],   
            skim:       [1.33,  0.8,   0.8,    0.9,    1.35,   0.8,    2,      0.3,    0.3,    1,      1,      1,      1.1],   
    twin:               [1,     0.5,   0.9,    1,      0.9,    0.7,    1,      1,      1,      1,      1,      1.2,    1],
        bent:           [1.1,   1,     0.8,    1,      0.9,    1,      0.8,    1,      1,      1,      0.8,    0.5,    1],    
        triple:         [1.2,   0.667, 0.9,    1,      0.85,   0.85,   0.9,    1,      1,      1,      1.1,    0.9,    0.95], 
            quint:      [1.5,   0.667, 0.9,    1,      1,      1,      0.9,    1,      1,      1,      1.1,    0.9,    0.95], 
            dual:       [2,     1,     0.8,    1,      1.5,    1,      1,      1.3,    1.1,    1,      1,      1,      1.25], 
        double:         [1,     1,     1,      1,      1,      0.9,    1,      1,      1,      1,      1,      1,      1],
            hewn:       [1.25,  1.5,   1,      1,      0.9,    0.85,   1,      1,      0.9,    1,      1,      1,      1],
        puregunner:     [1,     0.25,  1.5,    1.2,    1.35,   0.25,   1.25,   0.8,    0.65,   1,      1.5,    1.5,    1.2],
            machgun:    [0.66,  0.8,   2,      1,      1,      0.75,   1,      1.2,    0.8,    1,      1,      2.5,    1], 
    gunner:             [1.25,  0.25,  1.5,    1.1,    1,      0.35,   1.35,   0.9,    0.8,    1,      1.5,    1.5,    1.2],
        power:          [1,     1,     0.6,    1.2,    1,      1,      1.25,   2,      1.7,    1,      2,      0.5,    1.5], 
            nail:       [0.85,  2.5,   1,      0.8,    1,      0.7,    1,      1,      1,      1,      2,      1,      1],       
        fast:           [1,     1,     1,      1,      1,      1,      1,      1.2,    1,      1,      1,      1,      1], 
    turret:             [2,     1,     1,      1,      0.8,    0.6,    0.7,    1,      1,      1,      0.1,    1,      1], 
    /***************** RELOAD RECOIL SHUDDER  SIZE   HEALTH  DAMAGE   PEN    SPEED    MAX    RANGE  DENSITY  SPRAY   RESIST  */
    battle:             [1,     1,     1,      1,      1.25,   1.15,   1,      1,      0.85,   1,      1,      1,      1.1],
        bees:           [1.3,   1,     1,      1.4,    1,      1.5,    0.5,    3,      1.5,    1,      0.25,   1,      1],   
        carrier:        [1.5,   1,     1,      1,      1,      0.8,    1,      1.3,    1.2,    1.2,    1,      1,      1],
    hexatrap:           [1.3,   1,     1.25,   1,      1,      1,      1,      0.8,    1,      0.5,    1,      1,      1],     
    block:              [1.1,   2,     0.1,    1.5,    2,      1,      1.25,   1.5,    2.5,    1.25,   1,      1,      1.25],
        construct:      [1.3,   1,     1,      0.9,    1,      1,      1,      1,      1.1,    1,      1,      1,      1], 
        boomerang:      [0.8,   1,     1,      1,      0.5,    0.5,    1,      0.75,   0.75,   1.333,  1,      1,      1], 
    over:               [1.25,  1,     1,      0.85,   0.7,    0.8,    1,      1,      0.9,    1,      2,      1,      1], 
        meta:           [1.333, 1,     1,      1,      1,      0.667,  1,      1,      1,      1,      1,      1,      1],   
        weak:           [2,     1,     1,      1,      0.6,    0.6,    0.8,    0.5,    0.7,    0.25,   0.3,    1,      1],   
        master:         [3,     1,     1,      0.7,    0.4,    0.7,    1,      1,      1,      0.1,    0.5,    1,      1], 
        sunchip:        [5,     1,     1,      1.4,    0.5,    0.4,    0.6,    1,      1,      1,      0.8,    1,      1],     
    babyfactory:        [1.5,   1,     1,      1,      1,      1,      1,      1,      1.35,   1,      1,      1,      1], 
    lowpower:           [1,     1,     2,      1,      0.5,    0.5,    0.7,    1,      1,      1,      1,      0.5,    0.7], 
    halfrecoil:         [1,     0.5,   1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    morerecoil:         [1,     1.15,  1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1],
    muchmorerecoil:     [1,     1.35,  1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1],
    lotsmorrecoil:      [1,     1.8,   1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    tonsmorrecoil:      [1,     4,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    doublereload:       [0.5,   1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1],  
    morereload:         [0.75,  1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    halfreload:         [2,     1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    lessreload:         [1.5,   1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    threequartersrof:   [1.333, 1,     1,      1,      1,      1,      1,      1,      1,      1,      1,      1,      1], 
    morespeed:          [1,     1,     1,      1,      1,      1,      1,      1.3,    1.3,    1,      1,      1,      1], 
    bitlessspeed:       [1,     1,     1,      1,      1,      1,      1,      0.93,   0.93,   1,      1,      1,      1], 
    slow:               [1,     1,     1,      1,      1,      1,      1,      0.7,    0.7,    1,      1,      1,      1], 
    halfspeed:          [1,     1,     1,      1,      1,      1,      1,      0.5,    0.5,    1,      1,      1,      1],
    notdense:           [1,     1,     1,      1,      1,      1,      1,      1,      1,      1,      0.1,    1,      1],
    halfrange:          [1,     1,     1,      1,      1,      1,      1,      1,      1,      0.5,    1,      1,      1], 
    fake:               [1,     1,     1,   0.00001, 0.0001,   1,      1,   0.00001,   2,      0,      1,      1,      1], 
    /***************** RELOAD RECOIL SHUDDER  SIZE   HEALTH  DAMAGE   PEN    SPEED    MAX    RANGE  DENSITY  SPRAY   RESIST  */
    op:                 [0.5,   1.3,   1,      1,      4,      4,      4,      3,      2,      1,      5,      2,      1],       
    protectorswarm:     [5,  0.000001, 1,      1,      100,    1,      1,      1,      1,     0.5,     5,      1,      10], 
};

const dfltskl = 9;

// NAMES
const statnames = {
    smasher: 1,
    drone: 2,
    necro: 3,
    swarm: 4,
    trap: 5,
    generic: 6,
};
const gunCalcNames = {
    default: 0,
    bullet: 1,
    drone: 2,
    swarm: 3,
    fixedReload: 4,
    thruster: 5,
    sustained: 6,
    necro: 7,
    trap: 8,
};

// ENTITY DEFINITIONS
exports.genericEntity = {
    NAME: '',
    LABEL: 'Unknown Entity',
    TYPE: 'unknown',
    DAMAGE_CLASS: 0, // 0: def, 1: food, 2: tanks, 3: obstacles
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: 16,    
    INDEPENDENT: false,
    CONTROLLERS: ['doNothing'],    
    HAS_NO_MASTER: false,
    MOTION_TYPE: 'glide', // motor, swarm, chase
    FACING_TYPE: 'toTarget', // turnWithSpeed, withMotion, looseWithMotion, toTarget, looseToTarget
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    HITS_OWN_TYPE: 'normal', // hard, repel, never, hardWithBuffer
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    AUTO_UPGRADE: 'none',
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
    GUNS: [],
    MAX_CHILDREN: 0,
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,

        RANGE: 0,
        FOV: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,        
        HETERO: 2,
    },    
    FOOD: {
        LEVEL: -1,
    },
};

// FOOD
exports.food = {
    TYPE: 'food',
    DAMAGE_CLASS: 1,
    CONTROLLERS: ['moveInCircles'],
    HITS_OWN_TYPE: 'repel',
    MOTION_TYPE: 'drift',
    FACING_TYPE: 'turnWithSpeed',
    VARIES_IN_SIZE: true,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1,
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
};

const basePolygonDamage = 1;
const basePolygonHealth = 2;
exports.hugePentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 5,
    },
    LABEL: 'Alpha Pentagon',
    VALUE: 50000,
    SHAPE: -5,
    SIZE: 58,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 300 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: 0.6,
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
exports.bigPentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 4,
    },
    LABEL: 'Beta Pentagon',
    VALUE: 10000,
    SHAPE: 5,
    SIZE: 30,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 30,
        HEALTH: 50 * basePolygonHealth,
        RESIST: Math.pow(1.25, 2),
        SHIELD: 20 * basePolygonHealth,
        REGEN: 0.2,
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
exports.pentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 3,
    },
    LABEL: 'Pentagon',
    VALUE: 2000,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 14,
    BODY: {
        DAMAGE: 1.5 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 10 * basePolygonHealth,
        RESIST: 1.25,
        PENETRATION: 1.1,
    },
    DRAW_HEALTH: true,
};
exports.triangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2,
    },
    LABEL: 'Triangle',
    VALUE: 500,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 2,
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 6,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1.15,
        PENETRATION: 1.5,
    },
    DRAW_HEALTH: true,
};
exports.square = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 1,
    },
    LABEL: 'Square',
    VALUE: 250,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 13,
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 4,
        HEALTH: basePolygonHealth,
        PENETRATION: 2,
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
};
exports.egg = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
    },
    LABEL: 'Egg',
    VALUE: 100,
    SHAPE: 0,
    SIZE: 5,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 2,
        HEALTH: 0.0011,
        PUSHABILITY: 0,
    },
    DRAW_HEALTH: false,
};

exports.greenpentagon = {
    PARENT: [exports.food],
    LABEL: 'Pentagon',
    VALUE: 300000,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 1,
    BODY: {
        DAMAGE: 3,
        DENSITY: 8,
        HEALTH: 200,
        RESIST: 1.25,
        PENETRATION: 1.1,
    },
    DRAW_HEALTH: true,
};
exports.greentriangle = {
    PARENT: [exports.food],
    LABEL: 'Triangle',
    VALUE: 70000,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 1,
    BODY: {
        DAMAGE: 1,
        DENSITY: 6,
        HEALTH: 60,
        RESIST: 1.15,
        PENETRATION: 1.5,
    },
    DRAW_HEALTH: true,
};
exports.greensquare = {
    PARENT: [exports.food],
    LABEL: 'Square',
    VALUE: 20000,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 1,
    BODY: {
        DAMAGE: 0.5,
        DENSITY: 4,
        HEALTH: 20,
        PENETRATION: 2,
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
};

exports.gem = {
    PARENT: [exports.food],
    LABEL: 'Gem',
    VALUE: 20000,
    SHAPE: 6,
    SIZE: 5,
    COLOR: 0,
    BODY: {
        DAMAGE: basePolygonDamage/4,
        DENSITY: 4,
        HEALTH: 10,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: 0.25,
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
};
exports.obstacle = {
    TYPE: 'wall',
    DAMAGE_CLASS: 1,
    LABEL: 'Rock',
    FACING_TYPE: 'turnWithSpeed',
    SHAPE: -9,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 10000,
        SHIELD: 10000,
        REGEN: 1000,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1,
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: 16,
    VARIES_IN_SIZE: true,
    GIVE_KILL_MESSAGE: true,
    ACCEPTS_SCORE: false,
};
    exports.babyObstacle = {
        PARENT: [exports.obstacle],
        SIZE: 25,
        SHAPE: -7,
        LABEL: "Gravel",
    };

// WEAPONS
const wepHealthFactor = 0.5;
const wepDamageFactor = 1.5;
exports.bullet = {
    LABEL: 'Bullet',
    TYPE: 'bullet',
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 4 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    FACING_TYPE: 'smoothWithMotion',
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: 'never',
    // DIE_AT_LOW_SPEED: true,
    DIE_AT_RANGE: true,
};
    exports.casing = {
        PARENT: [exports.bullet],
        LABEL: 'Shell',
        TYPE: 'swarm',
    };

exports.swarm = {
    LABEL: 'Swarm Drone',
    TYPE: 'swarm',
    ACCEPTS_SCORE: false,
    SHAPE: 3,
    MOTION_TYPE: 'swarm',
    FACING_TYPE: 'smoothWithMotion',
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    CRAVES_ATTENTION: true,
    BODY: {
        ACCELERATION: 3,
        PENETRATION: 1.5,
        HEALTH: 0.35 * wepHealthFactor,
        DAMAGE: 1.5 * wepDamageFactor,
        SPEED: 4.5,
        RESIST: 1.6,
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: 0.5,
        FOV: 1.5,
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true,
};
    exports.bee = {
        PARENT: [exports.swarm],
        PERSISTS_AFTER_DEATH: true, 
        SHAPE: 4, 
        LABEL: 'Drone',
        HITS_OWN_TYPE: 'hardWithBuffer',
    };
    exports.autoswarm = {
        PARENT: [exports.swarm],
        AI: { FARMER: true, },
        INDEPENDENT: true,
    };

exports.trap = {
    LABEL: 'Thrown Trap',
    TYPE: 'trap',
    ACCEPTS_SCORE: false,
    SHAPE: -3, 
    MOTION_TYPE: 'glide', // def
    FACING_TYPE: 'turnWithSpeed',
    HITS_OWN_TYPE: 'push',
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1 * wepHealthFactor,
        DAMAGE: 2 * wepDamageFactor,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: 0,
    },
};
    exports.block = {
        LABEL: 'Set Trap',
        PARENT: [exports.trap],
        SHAPE: -4,
        MOTION_TYPE: 'motor',    
        CONTROLLERS: ['goToMasterTarget'],
        BODY: {
            SPEED: 1,
            DENSITY: 5,
        },
    };
    exports.boomerang = {
        LABEL: 'Boomerang',
        PARENT: [exports.trap],
        CONTROLLERS: ['boomerang'],
        MOTION_TYPE: 'motor',  
        HITS_OWN_TYPE: 'never',
        SHAPE: -5,
        BODY: {
            SPEED: 1.25,
            RANGE: 120,
        },
    };


exports.drone = {
    LABEL: 'Drone',
    TYPE: 'drone',
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: 'chase',
    FACING_TYPE: 'smoothToTarget',
    CONTROLLERS: [
        'nearestDifferentMaster',
        'canRepel',
        'mapTargetToGoal',
        'hangOutNearMaster'
    ],
    AI: { BLIND: true, },
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.05,
        HEALTH: 0.6 * wepHealthFactor,
        DAMAGE: 1.25 * wepDamageFactor,
        SPEED: 3.8,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.8,
    },
    HITS_OWN_TYPE: 'hard',
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
};
    exports.sunchip = {
        PARENT: [exports.drone],
        SHAPE: 4,
        NECRO: true,
        HITS_OWN_TYPE: 'hard',
        BODY: {
            FOV: 0.5,
        },
        AI: {
            BLIND: true,
            FARMER: true,
        },
        DRAW_HEALTH: false,
    };
    exports.autosunchip = {
        PARENT: [exports.sunchip],
        AI: {
            BLIND: true,
            FARMER: true,
        },
        INDEPENDENT: true,
    };
    exports.gunchip = {
        PARENT: [exports.drone],
        SHAPE: -2,
        NECRO: true,
        HITS_OWN_TYPE: 'hard',
        BODY: {
            FOV: 0.5,
        },
        AI: {
            BLIND: true,
            FARMER: true,
        },
        DRAW_HEALTH: false,
    };

exports.eggchip = {
        PARENT: [exports.drone],
        SHAPE: 0,
        NECRO: true,
        HITS_OWN_TYPE: 'hard',
        BODY: {
            FOV: 0.5,
        },
        AI: {
            BLIND: true,
            FARMER: true,
        },
        DRAW_HEALTH: false,
    };

exports.missile = {
    PARENT: [exports.bullet],
    LABEL: 'Missile',
    INDEPENDENT: true,
    BODY: {
        RANGE: 120,
    },  
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  14,     6,      1,      0,     -2,     130,     0,   ], 
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.muchmorerecoil, g.morespeed, g.morespeed]),
                TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                STAT_CALCULATOR: gunCalcNames.thruster,
            }, }, {
        POSITION: [  14,     6,      1,      0,      2,     230,     0,  ], 
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.muchmorerecoil, g.morespeed, g.morespeed]),
                TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                STAT_CALCULATOR: gunCalcNames.thruster,    
            }, }, 
    ],
};
    exports.hypermissile = {
        PARENT: [exports.missile],
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  14,     6,      1,      0,     -2,     150,     0,   ], 
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.morerecoil, g.morespeed]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                }, }, {
            POSITION: [  14,     6,      1,      0,      2,     210,     0,   ], 
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.morerecoil, g.morespeed]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                }, }, {        
            POSITION: [  14,     6,      1,      0,     -2,      90,    0.5,  ], 
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.morerecoil, g.morespeed]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                }, }, {
            POSITION: [  14,     6,      1,      0,      2,     270,    0.5,  ],  
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.morerecoil, g.morespeed]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                }, },
        ],
    };
    exports.snake = {
        PARENT: [exports.bullet],
        LABEL: 'Snake',
        INDEPENDENT: true,
        BODY: {
            RANGE: 120,
        },  
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   6,    12,     1.4,     8,      0,     180,    0,   ], 
                PROPERTIES: {
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.thruster,
                    SHOOT_SETTINGS: combineStats([
                        g.basic, g.sniper, g.hunter, g.hunter2, g.snake, g.snakeskin,
                    ]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                }, }, {
            POSITION: [  10,    12,     0.8,     8,      0,     180,   0.5,  ], 
                PROPERTIES: {
                    AUTOFIRE: true,
                    NEGATIVE_RECOIL: true,
                    STAT_CALCULATOR: gunCalcNames.thruster,
                    SHOOT_SETTINGS: combineStats([
                        g.basic, g.sniper, g.hunter, g.hunter2, g.snake,
                    ]),
                    TYPE: [exports.bullet, { PERSISTS_AFTER_DEATH: true, }],
                }, },
        ],
    };
    exports.hive = {
        PARENT: [exports.bullet],
        LABEL: 'Hive',
        BODY: {
            RANGE: 90,
            FOV: 0.5,
        },  
        FACING_TYPE: 'turnWithSpeed',
        INDEPENDENT: true,
        CONTROLLERS: ['alwaysFire', 'nearestDifferentMaster', 'targetSelf',],
        AI: { NO_LEAD: true, },
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   7,    9.5,    0.6,     7,      0,      108,     0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
                    TYPE: exports.bee,
                    STAT_CALCULATOR: gunCalcNames.swarm,    
                }, }, {
            POSITION: [   7,    9.5,    0.6,     7,      0,      180,    0.2,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
                    TYPE: exports.bee,
                    STAT_CALCULATOR: gunCalcNames.swarm,  
                }, }, {
            POSITION: [   7,    9.5,    0.6,     7,      0,      252,    0.4,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
                    TYPE: exports.bee,
                    STAT_CALCULATOR: gunCalcNames.swarm, 
                }, }, {
            POSITION: [   7,    9.5,    0.6,     7,      0,      324,    0.6,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
                    TYPE: exports.bee,
                    STAT_CALCULATOR: gunCalcNames.swarm, 
                }, }, {
            POSITION: [   7,    9.5,    0.6,     7,      0,      36,     0.8,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
                    TYPE: exports.bee,
                    STAT_CALCULATOR: gunCalcNames.swarm,  
                }, }, 
        ],
    };

// TANK CLASSES
const base = {
    ACCEL: 1.6,
    SPEED: 5.25,
    HEALTH: 20,
    DAMAGE: 3,
    RESIST: 1,
    PENETRATION: 1.05,
    SHIELD: 8,
    REGEN: 0.025,
    FOV: 1,
    DENSITY: 0.5,
};
exports.genericTank = {
    LABEL: 'Unknown Class',
    TYPE: 'tank',
    DAMAGE_CLASS: 2,
    DANGER: 5,
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'toTarget',
    SIZE: 12,
    MAX_CHILDREN: 0,   
    DAMAGE_EFFECTS: false,
    BODY: { // def
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED,
        HEALTH: base.HEALTH, 
        DAMAGE: base.DAMAGE, 
        PENETRATION: base.PENETRATION, 
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: 0.9,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
};
let gun = { };

function bossStats(options = {}) {
  if (!options.health) options.health = 1;
  if (!options.damage) options.damage = 1;
  if (!options.speed) options.speed = 1;
  if (!options.fov) options.fov = 1;
  return {
    HEALTH: (base.HEALTH * 15) * options.health,
    DAMAGE: (base.DAMAGE * 1.5) * options.damage,
    SPEED: (base.SPEED * 0.1) * options.speed,
    DENSITY: 500,
    FOV: (base.FOV * 1.125) * options.fov,
    SHIELD: base.SHIELD * 0.75
  };
};

exports.autoTurret = {
    PARENT: [exports.genericTank],
    LABEL: 'Turret',
    BODY: {
        FOV: 0.8
    },
    COLOR: 16,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  22,    10,      1,      0,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret]),
                TYPE: exports.bullet,
            }, },
    ],
};
    exports.machineAutoTurret = {
        PARENT: [exports.genericTank],
        LABEL: 'Turret',
        COLOR: 16,
        //CONTROLLERS: ['nearestDifferentMaster'],
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  14,    11,     1.3,     8,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.mach, g.slow]),
                    TYPE: exports.bullet,
                }, },
        ],
    };
    exports.autoSmasherTurret = {
        PARENT: [exports.genericTank],
        LABEL: 'Turret',
        COLOR: 16,
        //CONTROLLERS: ['nearestDifferentMaster'],
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  20,     6,      1,      0,      5,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.fast, g.mach, g.pound, g.morereload, g.morereload]),
                    TYPE: exports.bullet,
                    STAT_CALCULATOR: gunCalcNames.fixedReload,
                }, }, {
            POSITION: [  20,     6,      1,      0,     -5,      0,     0.5,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.fast, g.mach, g.pound, g.morereload, g.morereload]),
                    TYPE: exports.bullet,
                    STAT_CALCULATOR: gunCalcNames.fixedReload,
                }, },
        ],
    };
    exports.oldAutoSmasherTurret = {
        PARENT: [exports.genericTank],
        LABEL: 'Turret',
        COLOR: 16,
        //CONTROLLERS: ['nearestDifferentMaster'],
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  20,     7,      1,      0,    -5.75,    0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.lotsmorrecoil, g.morereload]),
                    TYPE: exports.bullet,
                    STAT_CALCULATOR: gunCalcNames.fixedReload,
                }, }, {            
            POSITION: [  20,     7,      1,      0,     5.75,    0,     0.5,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.lotsmorrecoil, g.morereload]),
                    TYPE: exports.bullet,
                    STAT_CALCULATOR: gunCalcNames.fixedReload,
                }, },
        ],
    };

exports.auto3gun = {
    PARENT: [exports.genericTank],
    LABEL: '',
    BODY: {
        FOV: 3,
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
    COLOR: 16,
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  22,    10,      1,      0,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
                TYPE: exports.bullet,
            }, }
    ],
};
    exports.auto5gun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        BODY: {
            FOV: 3,
        },
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  24,    11,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.five]),
                    TYPE: exports.bullet,
                }, }
        ],
    };
    exports.heavy3gun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        BODY: {
            FOV: 2,
            SPEED: 0.9,
        },
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  22,    14,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.auto]),
                    TYPE: exports.bullet,
                }, }
        ],
    };
    exports.masterGun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        BODY: {
            FOV: 3,
        },
        CONTROLLERS: ['nearestDifferentMaster'], 
        COLOR: 16,
        MAX_CHILDREN: 6,
        AI: {
            NO_LEAD: true,
            SKYNET: true,
            FULL_VIEW: true,
        },
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   8,     14,    1.3,     8,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.master]),
                    TYPE: exports.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }, },
        ],
    };
    exports.sniper3gun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        BODY: {
            FOV: 5,
        },
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  27,     9,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.auto, g.assass, g.autosnipe]),
                    TYPE: exports.bullet,
                }, }, {
            POSITION: [   5,     9,     -1.5,    8,      0,      0,      0,   ], 
            },
        ],
    };
    exports.bansheegun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        INDEPENDENT: true,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  26,    10,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.lessreload]),
                    TYPE: exports.bullet,
                }, }
        ],
    };
    exports.auto4gun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        BODY: {
            FOV: 2,
        },
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  16,     4,      1,      0,    -3.5,     0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.gunner, g.twin, g.power, g.slow]),
                    TYPE: exports.bullet,
                }, }, {
            POSITION: [  16,     4,      1,      0,     3.5,     0,     0.5,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.gunner, g.twin, g.power, g.slow]),
                    TYPE: exports.bullet,
                }, }
        ],
    };
    exports.bigauto4gun = {
        PARENT: [exports.genericTank],
        LABEL: '',
        CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  14,     5,      1,      0,    -4.5,     0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.gunner, g.twin, g.twin, g.power, g.halfreload]),
                    TYPE: exports.bullet,
                }, }, {
            POSITION: [  14,     5,      1,      0,     4.5,     0,     0.5,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.gunner, g.twin, g.twin, g.power, g.halfreload]),
                    TYPE: exports.bullet,
                }, }, {
            POSITION: [  16,     5,      1,      0,      0,      0,     0.5,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.gunner, g.twin, g.twin, g.power, g.halfreload]),
                    TYPE: exports.bullet,
                }, }
        ],
    };

exports.tritrapgun = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 16,
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  20,    16,      1,      0,      0,      0,      0,   ], 
        }, {
        POSITION: [   2,    16,     1.1,     20,     0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.block, g.auto]),
                TYPE: exports.block,
            }, },
    ],
};
exports.smasherBody = {
    LABEL: '',
    CONTROLLERS: ['spin'], 
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true,
};
exports.spikeBody = {
    LABEL: '',
    CONTROLLERS: ['spin'],
    COLOR: 9,
    SHAPE: -4,
    INDEPENDENT: true,
};
    exports.spikeBody1 = {
        LABEL: '',
        CONTROLLERS: ['fastspin'], 
        COLOR: 9,
        SHAPE: 3,
        INDEPENDENT: true,
    };
    exports.spikeBody2 = {
        LABEL: '',
        CONTROLLERS: ['reversespin'], 
        COLOR: 9,
        SHAPE: 3,
        INDEPENDENT: true,
    };
exports.megasmashBody = {
    LABEL: '',
    CONTROLLERS: ['spin'], 
    COLOR: 9,
    SHAPE: -6,
    INDEPENDENT: true,
};
exports.dominationBody = {
    LABEL: '',
    CONTROLLERS: ['dontTurn'], 
    COLOR: 9,
    SHAPE: 8,
    INDEPENDENT: true,
};
    exports.baseSwarmTurret = {
        PARENT: [exports.genericTank],
        LABEL: 'Protector',
        COLOR: 16,
        BODY: {
            FOV: 2,
        },
        CONTROLLERS: ['nearestDifferentMaster'], 
        AI: {
            NO_LEAD: true,
            LIKES_SHAPES: true,
        },
        INDEPENDENT: true,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   5,    4.5,    0.6,     7,      2,      0,     0.15, ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
                    TYPE: exports.swarm,
                    STAT_CALCULATOR: gunCalcNames.swarm,          
                }, }, {
            POSITION: [   5,    4.5,    0.6,     7,     -2,      0,     0.15, ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
                    TYPE: exports.swarm,
                    STAT_CALCULATOR: gunCalcNames.swarm,  
                }, }, {
            POSITION: [   5,    4.5,    0.6,    7.5,     0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
                    TYPE: [exports.swarm, { INDEPENDENT: true, AI: { LIKES_SHAPES: true, }, }, ],
                    STAT_CALCULATOR: gunCalcNames.swarm,  
            }, }
        ],
    };
    exports.baseGunTurret = {
        PARENT: [exports.genericTank],
        LABEL: 'Protector',
        BODY: {
            FOV: 5,
        },
        ACCEPTS_SCORE: false,
        CONTROLLERS: ['nearestDifferentMaster'], 
        INDEPENDENT: true,
        COLOR: 16,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  12,    12,     1,       6,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
                    TYPE: exports.bullet,          
                }, }, {
            POSITION: [  11,    13,     1,       6,      0,      0,     0.1,  ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
                    TYPE: exports.bullet,          
                }, }, {
            POSITION: [   7,    13,    -1.3,     6,      0,      0,      0,   ],
                }
        ],
    };
        exports.baseProtector = {
            PARENT: [exports.genericTank],
            LABEL: 'Base',
            SIZE: 64,
            DAMAGE_CLASS: 0,
            ACCEPTS_SCORE: false,
            SKILL: skillSet({ 
                rld: 1,
                dam: 1,
                pen: 1,
                spd: 1,
                str: 1,
            }),
            BODY: { // def
                SPEED: 0,
                HEALTH: 10000, 
                DAMAGE: 10, 
                PENETRATION: 0.25, 
                SHIELD: 1000,
                REGEN: 100,
                FOV: 1,
                PUSHABILITY: 0,
                HETERO: 0,
            },
            //CONTROLLERS: ['nearestDifferentMaster'],
            FACING_TYPE: 'autospin',
            TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                POSITION: [  25,     0,      0,      0,     360,  0], 
                    TYPE: exports.dominationBody,
                        }, {
                POSITION: [  12,     7,      0,      45,     100,  0], 
                    TYPE: exports.baseSwarmTurret,
                        }, {
                POSITION: [  12,     7,      0,     135,    100,  0], 
                    TYPE: exports.baseSwarmTurret,
                        }, {
                POSITION: [  12,     7,      0,     225,    100,  0], 
                    TYPE: exports.baseSwarmTurret,
                        }, {
                POSITION: [  12,     7,      0,     315,    100,  0], 
                    TYPE: exports.baseSwarmTurret,
                        },
            ],
            GUNS: [ /***** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */ {
                POSITION: [  4.5,  11.5,   -1.3,     6,      0,      45,     0,   ], }, {   
                POSITION: [  4.5,  11.5,   -1.3,     6,      0,     135,     0,   ], }, {   
                POSITION: [  4.5,  11.5,   -1.3,     6,      0,     225,     0,   ], }, {   
                POSITION: [  4.5,  11.5,   -1.3,     6,      0,     315,     0,   ], }, {
                POSITION: [  4.5,   8.5,   -1.5,     7,      0,      45,     0,   ], }, {   
                POSITION: [  4.5,   8.5,   -1.5,     7,      0,     135,     0,   ], }, {   
                POSITION: [  4.5,   8.5,   -1.5,     7,      0,     225,     0,   ], }, {   
                POSITION: [  4.5,   8.5,   -1.5,     7,      0,     315,     0,   ], }, 
            ],
        };



exports.minion = {
    PARENT: [exports.genericTank],
    LABEL: 'Minion', 
    TYPE: 'minion',
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: 'hardWithBuffer',
    FACING_TYPE: 'smoothToTarget',
    BODY: {
        FOV: 0.5,
        SPEED: 3,
        ACCELERATION: 0.4,
        HEALTH: 5,
        SHIELD: 0,
        DAMAGE: 1.2,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        'nearestDifferentMaster', 'mapAltToFire', 'minion', 'canRepel', 'hangOutNearMaster'],
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  17,     9,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minion]),
            WAIT_TO_CYCLE: true,
            TYPE: exports.bullet,
        }, }, 
    ],
};
exports.pillboxTurret = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 16,
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  22,    11,      1,      0,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minion, g.turret, g.power, g.auto, g.notdense]),
                TYPE: exports.bullet,
            }, },
    ],
};
exports.pillbox = {
    LABEL: 'Pillbox',
    PARENT: [exports.trap],
    SHAPE: -4,
    MOTION_TYPE: 'motor',    
    CONTROLLERS: ['goToMasterTarget', 'nearestDifferentMaster'],
    INDEPENDENT: true,
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true, 
    TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [  11,     0,      0,      0,     360,  1], 
            TYPE: exports.pillboxTurret,
        }
    ]
};
exports.skimturret = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: base.FOV * 2,
    },
    COLOR: 2,
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'], 
    LABEL: '',
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  10,    14,    -0.5,     9,      0,      0,      0,  ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty, g.skim]),
                TYPE: exports.hypermissile,
            }, }, {
        POSITION: [  17,    15,      1,      0,      0,      0,      0,  ], 
            },
    ],
};
    exports.skimboss = {
        PARENT: [exports.genericTank],
        BODY: {
            HEALTH: 300,
            DAMAGE: 2,
            SHIELD: 200,
        },
        SHAPE: 3, 
        COLOR: 2,
        FACING_TYPE: 'autospin',
        TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
            POSITION: [  15,     5,      0,     60,     170, 0], 
                TYPE: exports.skimturret,
                    }, {
            POSITION: [  15,     5,      0,     180,    170, 0], 
                TYPE: exports.skimturret,
                    }, {
            POSITION: [  15,     5,      0,     300,    170, 0], 
                TYPE: exports.skimturret,
                    },
        ],
    };

function makeAuto(type, name = -1, options = {}) {
    let turret = { type: exports.autoTurret, size: 10, independent: true, };
    if (options.type != null) { turret.type = options.type; }
    if (options.size != null) { turret.size = options.size; }
    if (options.independent != null) { turret.independent = options.independent; }
    
    let output = JSON.parse(JSON.stringify(type));
    let autogun = {
        /*********  SIZE               X       Y     ANGLE    ARC */
        POSITION: [  turret.size,     0,      0,     180,    360,  1,], 
        TYPE: [turret.type, { CONTROLLERS: ['nearestDifferentMaster'], INDEPENDENT: turret.independent, }],
    };
    if (type.GUNS != null) { output.GUNS = type.GUNS; }
    if (type.TURRETS == null) { output.TURRETS = [autogun]; }
    else { output.TURRETS = [...type.TURRETS, autogun]; }
    if (name == -1) { output.LABEL = 'Auto-' + type.LABEL; } else { output.LABEL = name; }
    output.DANGER = type.DANGER + 1;
    return output;
}
function makeHybrid(type, name = -1) {
    let output = JSON.parse(JSON.stringify(type));
    let spawner = { 
        /********* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [   7,     12,    1.2,     8,      0,     180,     0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: [exports.drone, { INDEPENDENT: true, }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: false,    
            MAX_CHILDREN: 3,
        }, };
    if (type.TURRETS != null) { output.TURRETS = type.TURRETS; }
    if (type.GUNS == null) { output.GUNS = [spawner]; }
    else { output.GUNS = [...type.GUNS, spawner]; }
    if (name == -1) { output.LABEL = 'Hybrid ' + type.LABEL; } else { output.LABEL = name; }
    return output;
}

exports.basic = {
    PARENT: [exports.genericTank],
    LABEL: 'Basic',
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: exports.bullet,
            LABEL: '',                  // def
            STAT_CALCULATOR: 0,         // def
            WAIT_TO_CYCLE: false,       // def
            AUTOFIRE: false,            // def
            SYNCS_SKILLS: false,        // def         
            MAX_CHILDREN: 0,            // def  
            ALT_FIRE: false,            // def 
            NEGATIVE_RECOIL: false,     // def
        }, }, 
    ],
};







        exports.testbed = {
            PARENT: [exports.genericTank],
            LABEL: 'TESTBED',
            RESET_UPGRADES: true,
            SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            LEVEL: -1,
            BODY: { // def
                SHIELD: 1000,
                REGEN: 10,
                HEALTH: 100,
                DAMAGE: 10,
                DENSITY: 20,
                FOV: 2,
            },
            SHAPE: [
              [-1, -0.8],
              [-0.8, -1],
              [0.8, -1],
              [1, -0.8],
              [0.2, 0],
              [1, 0.8],
              [0.8, 1],
              [-0.8, 1],
              [-1, 0.8],
            ],
            TURRETS: [],
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  18,    10,    -1.4,     0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.op]),
                    TYPE: [exports.bullet, { SHAPE: 5, }],
                }, }, 
            ],
        };
            exports.single = {
                PARENT: [exports.genericTank],
                LABEL: 'Single',
                //CONTROLLERS: ['nearestDifferentMaster'],
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  19,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.single]),
                            TYPE: exports.bullet,
                        }, },  {
                    POSITION: [  5.5,    8,    -1.8,    6.5,     0,      0,      0,   ],                         
                    }
                ],
            };  

exports.single = {
    PARENT: [exports.genericTank],
    LABEL: "Lazer",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [13.846, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [9.692, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.308, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [6.923, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.1, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};

        let smshskl = 12; //13;
        exports.smash = {
            PARENT: [exports.genericTank],
            LABEL: 'Smasher',
            DANGER: 6,
            BODY: {
                FOV: base.FOV * 1.05,
                DENSITY: base.DENSITY * 2,
            },
            TURRETS: [{ /** SIZE     X       Y     ANGLE    ARC */
                POSITION: [  21.5,   0,      0,      0,     360,  0,], 
                TYPE: exports.smasherBody,
            }],
            IS_SMASHER: true,
            SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
            STAT_NAMES: statnames.smasher,
        };
            exports.megasmash = {
                PARENT: [exports.genericTank],
                LABEL: 'Mega-Smasher',
                DANGER: 7,
                BODY: {
                    SPEED: base.speed * 1.05,
                    FOV: base.FOV * 1.1,
                    DENSITY: base.DENSITY * 4,
                },
                IS_SMASHER: true,
                SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
                STAT_NAMES: statnames.smasher,
                TURRETS: [{ /** SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  24,     0,      0,      0,     360,  0,], 
                    TYPE: exports.megasmashBody,
                }],
            };
            exports.spike = {
                PARENT: [exports.genericTank],
                LABEL: 'Spike',
                DANGER: 7,
                BODY: {
                    SPEED: base.speed*0.9,
                    DAMAGE: base.DAMAGE * 1.1,
                    FOV: base.FOV * 1.05,
                    DENSITY: base.DENSITY * 2,
                },
                IS_SMASHER: true,
                SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
                STAT_NAMES: statnames.smasher,
                TURRETS: [{ /** SIZE     X       Y     ANGLE    ARC */
                    POSITION: [ 20.5,    0,      0,      0,     360,  0,], 
                    TYPE: exports.spikeBody,
                    }, { 
                    POSITION: [ 20.5,    0,      0,     120,    360,  0,], 
                    TYPE: exports.spikeBody,
                    }, {
                    POSITION: [ 20.5,    0,      0,     240,    360,  0,], 
                    TYPE: exports.spikeBody,
                }],
            };     
            exports.weirdspike = {
                PARENT: [exports.genericTank],
                LABEL: 'Spike',
                DANGER: 7,
                BODY: {
                    DAMAGE: base.DAMAGE * 1.15,
                    FOV: base.FOV * 1.05,
                    DENSITY: base.DENSITY * 1.5,
                },
                IS_SMASHER: true,
                SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
                STAT_NAMES: statnames.smasher,
                TURRETS: [{ /** SIZE     X       Y     ANGLE    ARC */
                    POSITION: [ 20.5,    0,      0,      0,     360,  0,], 
                    TYPE: exports.spikeBody1,
                    }, { 
                    POSITION: [ 20.5,    0,      0,     180,    360,  0,], 
                    TYPE: exports.spikeBody2,
                }],
            };       
            exports.autosmash = makeAuto(exports.smash, 'Auto-Smasher', { type: exports.autoSmasherTurret, size: 11, });
            exports.autosmash.SKILL_CAP = [smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl,];

    exports.twin = {
        PARENT: [exports.genericTank],
        LABEL: 'Twin',
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  20,     8,      1,      0,     5.5,     0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: exports.bullet,
            }, }, { /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  20,     8,      1,      0,    -5.5,     0,     0.5,  ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: exports.bullet,
            }, }, 
        ],
    };

exports.twin = {
    PARENT: [exports.genericTank],
    LABEL: "Naturalist",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [8.308, 4.8, 1, -15.231, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [100, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.75, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.308, 4.8, 1, -15.231, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [100, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.75, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.308, 4.8, 1, -15.231, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [100, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.75, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.308, 4.8, 1, -15.231, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [100, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.75, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.308, 4.8, 1, -15.231, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [100, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.75, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [3.692, 3.5, 2.7, -10, 0, 180, 0],
            PROPERTIES: {
                COLOR: 16
            },
        },
    ],
};
        exports.gunner = {
            PARENT: [exports.genericTank],
            LABEL: 'Gunner',
            DANGER: 6,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  12,    3.5,     1,      0,     7.25,    0,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  12,    3.5,     1,      0,    -7.25,    0,     0.75, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  16,    3.5,     1,      0,     3.75,    0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  16,    3.5,     1,      0,    -3.75,    0,     0.25, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                        TYPE: exports.bullet,
                    }, }, 
            ],
        };

exports.gunner = {
    PARENT: [exports.genericTank],
    LABEL: "Preon",
    SIZE: 0.094,
    SHAPE: 0,
    GUNS: [{
        POSITION: [1.385, 0.08, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [40, 0, 0.001, 1, 1, 0.75, 1, 0.45, 1, 3, 1, 0.00001, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 16
        },
    }, ],
};
            exports.machinegunner = {
                PARENT: [exports.genericTank],
                LABEL: 'Machine Gunner',
                DANGER: 6,
                BODY: {
                    SPEED: base.SPEED * 0.9,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  14,     3,     4.0,    -3,      5,      0,     0.6,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.machgun]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  14,     3,     4.0,    -3,     -5,      0,     0.8,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.machgun]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  14,     3,     4.0,     0,     2.5,     0,     0.4,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.machgun]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  14,     3,     4.0,     0,    -2.5,     0,     0.2,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.machgun]),
                            TYPE: exports.bullet,
                        }, },  { 
                    POSITION: [  14,     3,     4.0,     3,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.machgun]),
                            TYPE: exports.bullet,
                        }, }, 
                ]
            };

exports.machinegunner = {
    PARENT: [exports.genericTank],
    LABEL: "Quantum Foam",
    SIZE: 0.0094,
    SHAPE: 0,
    GUNS: [{
        POSITION: [0.277, 0.32, 1, 0, 0, 355.236, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [40, 0, 0.001, 1, 1, 0.75, 1, 0.09, 1, 3, 1, 0.00001, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 16
        },
    }, ],
};
            exports.autogunner = makeAuto(exports.gunner);            
            exports.nailgun = {
                PARENT: [exports.genericTank],
                LABEL: 'Nailgun',
                DANGER: 7,
                BODY: {
                    FOV: base.FOV * 1.1,
                    SPEED: base.SPEED * 0.9,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  19,     2,      1,      0,    -2.5,     0,     0.25, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.nail]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     2,      1,      0,     2.5,     0,     0.75, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.nail]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     2,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.nail]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  5.5,    8,    -1.8,    6.5,     0,      0,      0,   ],
                        },
                ],
            };

exports.nailgun = {
    PARENT: [exports.genericTank],
    LABEL: "Natural Stacker",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 27, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 22.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 18, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 13.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 9, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 0.9, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 31.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 36, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 40.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 45, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 49.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 54, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 58.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 63, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 67.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 72, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 76.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 81, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 85.5, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [11.077, 3.2, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [1.846, 3.2, 1.3, 11.077, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 90, 0.8, 5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [13.846, 16, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
    ],
};

        exports.double = {
            PARENT: [exports.genericTank],
            LABEL: 'Double Twin',
            DANGER: 6,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  20,     8,      1,      0,     5.5,     0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  20,     8,      1,      0,    -5.5,     0,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  20,     8,      1,      0,     5.5,    180,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  20,     8,      1,      0,    -5.5,    180,    0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
                        TYPE: exports.bullet,
                    }, }, 
            ],
        };

exports.double = {
    PARENT: [exports.genericTank],
    LABEL: "Executor",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [19.385, 11.2, 1, 0, 0, 330, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 0.75, 1, 8.1, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [19.385, 11.2, 1, 0, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 0.75, 1, 8.1, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [33.231, 11.2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 5, 0.001, 1, 1, 0.75, 1, 8.1, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};


            exports.tripletwin = {
                PARENT: [exports.genericTank],
                LABEL: 'Triple Twin',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  20,     8,      1,      0,     5.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,    -5.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,     5.5,    120,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,    -5.5,    120,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,     5.5,    240,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,    -5.5,    240,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
                            TYPE: exports.bullet,
                        }, }, 
                ],
            };

exports.tripletwin = {
    PARENT: [exports.genericTank],
    LABEL: "Astonisher",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [33.231, 11.2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 5, 0.001, 1, 1, 0.75, 1, 8.1, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.615, 7, 2.7, 8, 0, 0.477, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [300, 0, 0.001, 1.54, 1.02, 1.26, 1, 9, 0.9, 25, 2, 0.00001, 1]
                ]),
                TYPE: exports.drone,
                COLOR: 16
            },
        },
        {
            POSITION: [19.385, 11.2, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 25, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [19.385, 11.2, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 25, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};


            exports.autodouble = makeAuto(exports.double, 'Auto-Devastator');
            exports.split = {
                PARENT: [exports.genericTank],
                LABEL: 'the h',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  19,     8,      1,      0,     5.5,     25,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.double, g.hewn, g.morerecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,    -5.5,    -25,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.double, g.hewn, g.morerecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,     5.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn, g.morerecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,    -5.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn, g.morerecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,     5.5,    180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  20,     8,      1,      0,    -5.5,    180,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn]),
                            TYPE: exports.bullet,
                        }, }, 
                ],
            };

        exports.bent = {
            PARENT: [exports.genericTank],
            LABEL: 'Triple Shot',
            DANGER: 6,
            BODY: {
                SPEED: base.SPEED * 0.9,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  19,     8,      1,      0,     -2,    -20,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  19,     8,      1,      0,      2,     20,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  22,     8,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                        TYPE: exports.bullet,
                    }, },
            ],
        };

exports.bent = {
    PARENT: [exports.genericTank],
    LABEL: "cgu tank",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 11.2, 1, 0, 0, 330, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 5, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 50000, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 9
            },
        },
        {
            POSITION: [18, 11.2, 1, 0, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 5, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 50000, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 9
            },
        },
        {
            POSITION: [19.938, 11.2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 5, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 50000, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 9
            },
        },
    ],
};
            exports.bentdouble = {
                PARENT: [exports.genericTank],
                LABEL: 'Bent Double',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  19,     8,      1,      0,     -1,     -25,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,      1,      25,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  22,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,     -1,     155,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,      1,    -155,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  22,     8,      1,      0,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
                            TYPE: exports.bullet,
                        }, },
                ],
            };
            exports.penta = {
                PARENT: [exports.genericTank],
                LABEL: 'Penta Shot',
                DANGER: 7,
                BODY: {
                    SPEED: base.SPEED * 0.85,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  16,     8,      1,      0,     -3,    -30,    0.667, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  16,     8,      1,      0,      3,     30,    0.667, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,     -2,    -15,    0.333, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     8,      1,      0,      2,     15,    0.333, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  22,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                            TYPE: exports.bullet,
                        }, },
                ],
            };

exports.penta = {
    PARENT: [exports.genericTank],
    LABEL: "triangl",
    SIZE: 3.75,
    SHAPE: 3,
    GUNS: [{
            POSITION: [2.215, 0.64, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [120, 0, 0.001, 1, 1, 0.75, 1, 3.6, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.215, 0.64, 1, 0, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [120, 0, 0.001, 1, 1, 0.75, 1, 3.6, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.215, 0.64, 1, 0, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [120, 0, 0.001, 1, 1, 0.75, 1, 3.6, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};

            exports.benthybrid = makeHybrid(exports.penta, 'oxy guardian bottom text');


        exports.triple = {
            PARENT: [exports.genericTank],
            DANGER: 6,
            BODY: {
                FOV: base.FOV * 1.05,
            },
            LABEL: 'Triplet',
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  18,    10,      1,      0,      5,      0,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  18,    10,      1,      0,     -5,      0,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  21,    10,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
                        TYPE: exports.bullet,
                    }, }, 
            ],
        };

exports.triple = {
    PARENT: [exports.genericTank],
    LABEL: "Tropicana",
    SIZE: 12,
    SHAPE: 4,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 332.647, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 29.002, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 359.743, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 298.504, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 239.27, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 268.746, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 207.108, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 150.336, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 179.792, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 117.431, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 86.874, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 58.428, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
    ],
};
            exports.quint = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                BODY: {
                    FOV: base.FOV * 1.1,
                },
                LABEL: 'Quintuplet',
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  16,    10,      1,      0,     -5,      0,    0.667, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  16,    10,      1,      0,      5,      0,    0.667, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  19,    10,      1,      0,     -3,      0,    0.333, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
                            TYPE: exports.bullet,
                        }, },  { 
                    POSITION: [  19,    10,      1,      0,      3,      0,    0.333, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
                            TYPE: exports.bullet,
                        }, },  { 
                    POSITION: [  22,    10,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
                            TYPE: exports.bullet,
                        }, }, 
                ],
            };        
            exports.dual = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                BODY: {
                    ACCEL: base.ACCEL * 0.8,
                    FOV: base.FOV * 1.1,
                },
                LABEL: '',
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,     7,      1,      0,     5.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowpower]),
                            TYPE: exports.bullet,
                            LABEL: 'Small',
                        }, }, { 
                    POSITION: [  18,     7,      1,      0,    -5.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowpower]),
                            TYPE: exports.bullet,
                            LABEL: 'Small',
                        }, }, { 
                    POSITION: [  16,    8.5,     1,      0,     5.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
                            TYPE: exports.bullet,
                        }, },  { 
                    POSITION: [  16,    8.5,     1,      0,    -5.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
                            TYPE: exports.bullet,
                        }, }, 
                ],
            };

    exports.sniper = {
        PARENT: [exports.genericTank],
        LABEL: 'Sniper',
        BODY: {
            ACCELERATION: base.ACCEL * 0.7, 
            FOV: base.FOV * 1.2,
        },
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  24,    8.5,     1,      0,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: exports.bullet,
            }, },
        ],
    };

exports.sniper = {
    PARENT: [exports.genericTank],
    LABEL: "Clockxyrrhexis But Not",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [8, 2.8, 2.7, -14.154, 0, 0, 0],
            PROPERTIES: {
                COLOR: 5
            },
        },
        {
            POSITION: [18, 20.8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 1, 1, 0.75, 1, 3.15, 1, 2.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 345, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 345, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 345, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 345, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 330, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 330, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 330, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 330, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 315, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 315, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 315, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 315, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 300, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 300, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 300, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 300, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 285, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 285, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 285, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 285, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 270, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 270, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 270, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 270, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 255, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 255, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 255, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 255, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 240, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 240, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 240, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 240, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 210, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 210, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 210, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 210, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 195, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 195, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 195, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 195, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 165, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 165, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 165, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 165, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 150, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 150, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 150, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 150, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 105, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 105, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 105, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 105, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 90, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 90, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 90, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 90, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 60, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 60, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 60, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 60, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 75, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 75, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 75, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 75, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 24, 1, 16.615, 0, 0, NaN],
            PROPERTIES: {
                COLOR: 16
            },
        },
    ],
};



        exports.assassin = {
            PARENT: [exports.genericTank],
            DANGER: 6,
            LABEL: 'Assassin',
            BODY: {
                ACCELERATION: base.ACCEL * 0.6,
                SPEED: base.SPEED * 0.85,
                FOV: base.FOV * 1.4,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  27,    8.5,     1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [   5,    8.5,    -1.6,    8,      0,      0,      0,   ], 
                },
            ],
        };

exports.assassin = {
    PARENT: [exports.genericTank],
    LABEL: "Animator",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [13.846, 3.2, 1, 0, 0, 217.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 2, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [13.846, 3.2, 1, 0, 0, 142.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 2, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 12.8, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 12.8, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [24.923, 11.2, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 4, 0.001, 1, 1, 0.75, 1, 24.75, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [20.769, 11.2, 1, 0, 4.708, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9.9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [20.769, 11.2, 1, 0, -4.708, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9.9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.ranger = {
                PARENT: [exports.genericTank],
                LABEL: 'Ranger',
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.5,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.5,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  32,    8.5,     1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [   5,    8.5,    -1.6,    8,      0,      0,      0,   ], 
                    },
                ],
            };


            exports.autoass = makeAuto(exports.ranger, "die.");

        exports.hunter = {
            PARENT: [exports.genericTank],
            LABEL: 'Hunter',
            DANGER: 6,
            BODY: {
                ACCELERATION: base.ACCEL * 0.7,
                SPEED: base.SPEED * 0.9,
                FOV: base.FOV * 1.25,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  24,     8,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  21,    12,      1,      0,      0,      0,     0.25, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                        TYPE: exports.bullet,
                    }, },
            ],
        };

exports.hunter = {
    PARENT: [exports.genericTank],
    LABEL: "Disruptor",
    SIZE: 18.75,
    SHAPE: 4,
    GUNS: [{
            POSITION: [15.231, 0.32, 1, 0, 0, 326.984, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 326.984, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 328.588, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 328.588, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 329.484, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 329.484, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 330.466, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 330.466, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 330.954, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 330.954, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 331.681, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 331.681, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 332.56, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 332.56, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 333.038, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 333.038, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 333.277, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 333.277, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 333.673, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 333.673, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 334.305, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 334.305, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 335.095, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 335.095, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 335.724, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 335.724, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 336.766, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 336.766, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 337.518, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 337.518, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 339.021, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 339.021, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 339.021, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 339.021, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 339.021, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 339.021, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 339.021, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 339.021, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 339.021, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 339.021, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 341.651, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 341.651, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 343.249, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 343.249, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 344.658, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 344.658, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 345.964, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 345.964, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 346.959, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 346.959, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 348.079, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 348.079, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 349.228, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 349.228, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 350.161, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 350.161, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 350.913, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 350.913, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 352.353, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 352.353, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 352.982, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 352.982, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 352.982, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 352.982, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 352.982, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 352.982, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 352.982, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 352.982, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 356.339, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 356.339, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 358.744, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 358.744, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 1.076, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 1.076, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 5.582, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 5.582, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 6.668, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 6.668, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 6.668, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 6.668, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 6.668, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 6.668, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 6.668, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 6.668, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 6.668, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 6.668, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 7.145, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 7.145, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 9.15, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 9.15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 9.903, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 9.903, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 10.494, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 10.494, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 11.11, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 11.11, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 12.182, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 12.182, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 13.848, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 13.848, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 16.523, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 16.523, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 18.411, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 18.411, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 19.088, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 19.088, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 19.52, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 19.52, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 19.52, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 19.52, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 19.52, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 19.52, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 19.951, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 19.951, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 21.703, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 21.703, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 23.091, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 23.091, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 23.97, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 23.97, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 24.708, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 24.708, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 27.091, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 27.091, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.276, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.276, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.346, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.346, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.346, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.346, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.346, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.346, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.346, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.346, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 28.346, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 28.346, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 29.119, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 29.119, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 29.754, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 29.754, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 30.455, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 30.455, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 30.951, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 30.951, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 31.075, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 31.075, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 31.075, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 31.075, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 31.198, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 31.198, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 31.443, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 31.443, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 0.32, 1, 0, 0, 31.075, 0],
        },
        {
            POSITION: [2.539, 0.32, 1.3, 15.231, 0, 31.075, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 4.95, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 328.284, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 328.284, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 336.232, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 336.232, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 344.952, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 344.952, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 353.004, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 353.004, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 1.711, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 1.711, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 9.083, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 9.083, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 16.386, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 16.386, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 22.706, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 22.706, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
        {
            POSITION: [22.154, 3.2, 1, 0, 0, 29.364, 0],
        },
        {
            POSITION: [3.692, 3.2, 1.3, 22.154, 0, 29.364, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 7.2, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                // color from rgb selector (will be displayed as gray)
                COLOR: 16
            },
        },
    ],
};

            exports.preda = {
                PARENT: [exports.genericTank],
                LABEL: 'Predator',
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.7,
                    SPEED: base.SPEED * 0.85,
                    FOV: base.FOV * 1.3,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  24,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  21,    12,      1,      0,      0,      0,     0.15, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.preda]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  18,    16,      1,      0,      0,      0,     0.3,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda]),
                            TYPE: exports.bullet,
                        }, },
                ],
            };
            exports.poach = makeHybrid(exports.hunter, 'oh no');
            exports.sidewind = {
                PARENT: [exports.genericTank],
                LABEL: 'Sidewinder',
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.7,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.3,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  10,    11,    -0.5,    14,      0,      0,      0,  ], 
                        }, {
                    POSITION: [  21,    12,    -1.1,     0,      0,      0,      0,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewind]),
                            TYPE: exports.snake,
                            STAT_CALCULATOR: gunCalcNames.sustained,
                        }, },
                ],
            };

    exports.director = {
        PARENT: [exports.genericTank],
        LABEL: 'Director',  
        STAT_NAMES: statnames.drone,
        DANGER: 5,
        BODY: {
            ACCELERATION: base.ACCEL * 0.75,
            FOV: base.FOV * 1.1,
        },
        MAX_CHILDREN: 5,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   6,     12,    1.2,     8,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                    TYPE: exports.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }, },
        ],
    };

exports.director = {
    PARENT: [exports.genericTank],
    LABEL: "Octotool",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 270, 0],
        },
        {
            POSITION: [3, 8, 1.3, 18, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.85, 0.8, 3, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap,
                COLOR: 16
            },
        },
        {
            POSITION: [8, 3.5, 2.7, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1.54, 1.02, 1.26, 1, 5.85, 0.9, 3, 2, 0.00001, 1]
                ]),
                TYPE: exports.drone,
                COLOR: 16
            },
        },
        {
            POSITION: [20.769, 8, 1, 0, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 6.75, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 14.4, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [80, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 4.8, 1, 0, 0, 127.5, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, 3.323, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 8, 1, 0, -3.323, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 8, 1, 0, 0, 157.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 1, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 8, 1, 0, 0, 202.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 1, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [18, 11.2, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 1, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 4.8, 1, 0, 6.923, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 1, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 4.8, 1, 0, -6.923, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 1, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 4.8, 1, 0, -6.923, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.master = {
                PARENT: [exports.genericTank],
                LABEL: '',  
                STAT_NAMES: statnames.drone,
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                    FOV: base.FOV * 1.15,
                },
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  16,     1,      0,      0,      0, 0], 
                        TYPE: exports.masterGun,
                            }, {
                    POSITION: [  16,     1,      0,     120,     0, 0], 
                        TYPE: [exports.masterGun, { INDEPENDENT: true, }],
                            }, {
                    POSITION: [  16,     1,      0,     240,     0, 0], 
                        TYPE: [exports.masterGun, { INDEPENDENT: true, }],
                            },
                ],
            };

        exports.overseer = {
            PARENT: [exports.genericTank],
            LABEL: 'Overseer',  
            DANGER: 6,
            STAT_NAMES: statnames.drone,
            BODY: {
                ACCELERATION: base.ACCEL * 0.75,
                SPEED: base.SPEED * 0.9,
                FOV: base.FOV * 1.1,
            },
            MAX_CHILDREN: 8,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [   6,     12,    1.2,     8,      0,     90,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                        TYPE: exports.drone,
                        AUTOFIRE: true,
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: gunCalcNames.drone,
                        WAIT_TO_CYCLE: true,     
                    }, }, {
                POSITION: [   6,     12,    1.2,     8,      0,    270,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                        TYPE: exports.drone,
                        AUTOFIRE: true,
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: gunCalcNames.drone,
                        WAIT_TO_CYCLE: true,     
                    }, },
            ],
        };

exports.overseer = {
    PARENT: [exports.genericTank],
    LABEL: "Aegis 2.0",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [2.769, 9.6, 1, 12.462, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 9.6, 1, 12.462, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 9.6, 1, 12.462, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 4.8, 1, 0, 0, 225, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 4.8, 1, 0, 0, 180, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 4.8, 1, 0, 0, 135, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 1, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [8.862, 8, 1, 0, 0, 0, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.308, 3.5, 2.7, -19.692, 0, 180, NaN],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [9.138, 8, 1, 0, 0, 285, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [9.138, 8, 1, 0, 0, 75, NaN],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [0, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [6.769, 2.1, 2.7, -14.985, 0, 255, NaN],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [6.769, 2.1, 2.7, -14.985, 0, 105, NaN],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 3.84, 1, 0, 5.538, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [5, 0, 0.001, 1, 1, 0.75, 1, 5.4, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [12.462, 3.84, 1, 0, -5.538, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [5, 0, 0.001, 1, 1, 0.75, 1, 5.4, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [5.538, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0.5, 0.001, 1, 1, 0.75, 1, 0, 1, 0.05, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.overlord = {
                PARENT: [exports.genericTank],
                LABEL: 'Overlord',
                DANGER: 7,
                STAT_NAMES: statnames.drone,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.1,
                },
                MAX_CHILDREN: 8,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   6,     12,    1.2,     8,      0,     90,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,     
                        }, }, {
                    POSITION: [   6,     12,    1.2,     8,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true, 
                        }, }, {
                    POSITION: [   6,     12,    1.2,     8,      0,     270,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true, 
                        }, }, { 
                    POSITION: [   6,     12,    1.2,     8,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true, 
                        }, },
                ],
            };
            exports.overtrap = {
                PARENT: [exports.genericTank],
                LABEL: 'Overtrapper',
                DANGER: 7,
                STAT_NAMES: statnames.generic,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.6,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.2,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   6,     11,    1.2,     8,      0,     125,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,  
                            MAX_CHILDREN: 3,   
                        }, }, {
                    POSITION: [   6,     11,    1.2,     8,      0,     235,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,     
                            MAX_CHILDREN: 3,   
                        }, }, {
                    POSITION: [  14,     8,      1,      0,      0,      0,      0,   ],
                        }, {
                    POSITION: [   4,     8,     1.5,    14,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };
            exports.banshee = {
                PARENT: [exports.genericTank],
                LABEL: '',
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.5,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.1,
                },
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  10,     8,      0,      0,      80, 0], 
                        TYPE: exports.bansheegun,
                            }, {
                    POSITION: [  10,     8,      0,     120,     80, 0], 
                        TYPE: exports.bansheegun,
                            }, {
                    POSITION: [  10,     8,      0,     240,     80, 0], 
                        TYPE: exports.bansheegun,
                            },
                ],
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   6,     11,    1.2,     8,      0,      60,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,  
                            MAX_CHILDREN: 2,   
                        }, }, {
                    POSITION: [   6,     11,    1.2,     8,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,     
                            MAX_CHILDREN: 2,   
                        }, }, {
                    POSITION: [   6,     11,    1.2,     8,      0,     300,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,     
                            MAX_CHILDREN: 2,   
                        }, }, 
                    ]
            };
            exports.autoover = makeAuto(exports.overseer, "");
            exports.overgunner = {
                PARENT: [exports.genericTank],
                LABEL: 'Overgunner',
                DANGER: 7,
                STAT_NAMES: statnames.generic,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                    SPEED: base.SPEED * 0.9,
                    FOV: base.FOV * 1.1,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   6,     11,    1.2,     8,      0,     125,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,  
                            MAX_CHILDREN: 3,   
                        }, }, {
                    POSITION: [   6,     11,    1.2,     8,      0,     235,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
                            TYPE: exports.drone,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.drone,
                            WAIT_TO_CYCLE: true,     
                            MAX_CHILDREN: 3,   
                        }, }, {
                    POSITION: [  19,     2,      1,      0,    -2.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.slow, g.flank, g.lotsmorrecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     2,      1,      0,     2.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.slow, g.flank, g.lotsmorrecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  12,    11,      1,      0,      0,      0,      0,   ],
                        },
                ],
            };
        
        function makeSwarmSpawner(guntype) {
            return {
                PARENT: [exports.genericTank],
                LABEL: '',
                BODY: {
                    FOV: 2,
                },
                CONTROLLERS: ['nearestDifferentMaster'], 
                COLOR: 16,
                AI: {
                    NO_LEAD: true,
                    SKYNET: true,
                    FULL_VIEW: true,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  14,     15,    0.6,    14,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: guntype,
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,          
                        }, }
                ],
            };
        }
        exports.cruiserGun = makeSwarmSpawner(combineStats([g.swarm]));
        exports.cruiser = {
            PARENT: [exports.genericTank],
            LABEL: 'Cruiser',
            DANGER: 6,
            FACING_TYPE: 'locksFacing',
            STAT_NAMES: statnames.swarm,
            BODY: {
                ACCELERATION: base.ACCEL * 0.75,
                FOV: base.FOV * 1.2,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [   7,    7.5,    0.6,     7,      4,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm]),
                        TYPE: exports.swarm,
                        STAT_CALCULATOR: gunCalcNames.swarm,               
                    }, }, {
                POSITION: [   7,    7.5,    0.6,     7,     -4,      0,     0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm]),
                        TYPE: exports.swarm,
                        STAT_CALCULATOR: gunCalcNames.swarm,         
                    }, },
            ],
        };
            exports.battleship = {
                PARENT: [exports.genericTank],
                LABEL: 'Battleship',
                DANGER: 7,
                STAT_NAMES: statnames.swarm,
                FACING_TYPE: 'locksFacing',
                BODY: {
                    ACCELERATION: base.ACCEL,
                    FOV: base.FOV * 1.2,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   7,    7.5,    0.6,     7,      4,     90,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,        
                            LABEL: 'Guided'                
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,     -4,     90,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.autoswarm],
                            STAT_CALCULATOR: gunCalcNames.swarm,        
                            LABEL: 'Autonomous',        
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,      4,     270,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.autoswarm],
                            STAT_CALCULATOR: gunCalcNames.swarm,        
                            LABEL: 'Autonomous',         
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,     -4,     270,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,        
                            LABEL: 'Guided'                
                        }, },
                ],
            };
            exports.carrier = {
                PARENT: [exports.genericTank],
                LABEL: 'Carrier',
                DANGER: 7,
                STAT_NAMES: statnames.swarm,
                FACING_TYPE: 'locksFacing',
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                    FOV: base.FOV * 1.3,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   7,    7.5,    0.6,     7,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,          
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,      2,      40,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,    
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,     -2,     -40,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
                            TYPE: exports.swarm,
                            STAT_CALCULATOR: gunCalcNames.swarm,    
                        }, }
                ],
            };
            exports.autocruiser = makeAuto(exports.cruiser, "");
            exports.fortress = {
                PARENT: [exports.genericTank],
                LABEL: 'Fortress', //'Palisade',
                DANGER: 7,
                STAT_NAMES: statnames.generic,
                BODY: {
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.2,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   7,    7.5,    0.6,     7,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.swarm, { CONTROLLERS: ['canRepel'] }],
                            STAT_CALCULATOR: gunCalcNames.swarm,   
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,      0,     120,    1/3,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.swarm, { CONTROLLERS: ['canRepel'] }],
                            STAT_CALCULATOR: gunCalcNames.swarm,   
                        }, }, {
                    POSITION: [   7,    7.5,    0.6,     7,      0,     240,    2/3,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.swarm, { CONTROLLERS: ['canRepel'] }],
                            STAT_CALCULATOR: gunCalcNames.swarm,   
                        }, }, {
                    POSITION: [  14,     9,      1,      0,      0,     60,      0,   ],
                        }, {
                    POSITION: [   4,     9,     1.5,    14,      0,     60,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {                            
                    POSITION: [  14,     9,      1,      0,      0,     180,     0,   ],
                        }, {
                    POSITION: [   4,     9,     1.5,    14,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {                            
                    POSITION: [  14,     9,      1,      0,      0,     300,     0,   ],
                        }, {
                    POSITION: [   4,     9,     1.5,    14,      0,     300,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };

        exports.underseer = {
            PARENT: [exports.genericTank],
            LABEL: 'Underseer',
            DANGER: 6,
            STAT_NAMES: statnames.drone,
            BODY: {
                ACCELERATION: base.ACCEL * 0.7,
                SPEED: base.SPEED * 0.9,
                FOV: base.FOV * 1.1,
            },
            SHAPE: 4,
            MAX_CHILDREN: 14,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [   5,     12,    1.2,     8,      0,     90,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                        TYPE: exports.sunchip,
                        AUTOFIRE: true,
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: gunCalcNames.necro,
                    }, }, {
                POSITION: [   5,     12,    1.2,     8,      0,     270,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                        TYPE: exports.sunchip,
                        AUTOFIRE: true,
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: gunCalcNames.necro,
                    }, },
                ],
        };
            exports.necromancer = {
                PARENT: [exports.genericTank],
                LABEL: 'Necromancer',
                DANGER: 7,
                STAT_NAMES: statnames.necro,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.7,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.15,
                },
                SHAPE: 4,
                FACING_TYPE: 'autospin',
                MAX_CHILDREN: 14,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   5,     12,    1.2,     8,      0,     90,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                            TYPE: exports.sunchip,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.necro,
                        }, }, {
                    POSITION: [   5,     12,    1.2,     8,      0,     270,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                            TYPE: exports.sunchip,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            STAT_CALCULATOR: gunCalcNames.necro,
                        }, }, {
                    POSITION: [   5,     12,    1.2,     8,      0,      0,     0.25, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.weak, g.doublereload]),
                            TYPE: exports.autosunchip,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            MAX_CHILDREN: 4,
                            STAT_CALCULATOR: gunCalcNames.necro,
                            LABEL: 'Guard',
                        }, }, {
                    POSITION: [   5,     12,    1.2,     8,      0,     180,    0.75  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.weak, g.doublereload]),
                            TYPE: exports.autosunchip,
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,
                            MAX_CHILDREN: 4,
                            STAT_CALCULATOR: gunCalcNames.necro,
                            LABEL: 'Guard', 
                        }, },
                    ],
            };

        exports.lilfact = {
            PARENT: [exports.genericTank],
            LABEL: '',
            DANGER: 6,
            STAT_NAMES: statnames.drone,
            BODY: {
                SPEED: base.SPEED * 0.8,
                ACCELERATION: base.ACCEL * 0.5,
                FOV: 1.1,
            },
            GUNS: [ { /**** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  4.5,    10,      1,     10.5,    0,      0,      0,   ], 
                }, {
                POSITION: [   1,     12,      1,      15,     0,      0,      0,   ], 
                PROPERTIES: {          
                    MAX_CHILDREN: 4,
                    SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                    TYPE: exports.minion,
                    STAT_CALCULATOR: gunCalcNames.drone,                        
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,  
                }, }, {                        
                    POSITION: [  3.5,    12,      1,      8,      0,      0,      0,   ], 
                }
            ],
        };
            exports.factory = {
                PARENT: [exports.genericTank],
                LABEL: 'Factory',
                DANGER: 7,
                STAT_NAMES: statnames.drone,
                BODY: {
                    SPEED: base.SPEED * 0.8,
                    FOV: 1.1,
                },
                MAX_CHILDREN: 6,
                GUNS: [ { /**** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   5,     11,      1,      10.5,   0,      0,      0,   ], 
                        }, {
                    POSITION: [   2,     14,      1,      15.5,   0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.factory]),
                            TYPE: exports.minion,
                            STAT_CALCULATOR: gunCalcNames.drone,                        
                            AUTOFIRE: true,
                            SYNCS_SKILLS: true,   
                        }, }, {                        
                    POSITION: [   4,     14,      1,      8,      0,      0,      0,   ], 
                    }
                ],
            };

    exports.machine = {
        PARENT: [exports.genericTank],
        LABEL: 'Machine Gun',
        GUNS: [ {    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [    12,     10,     1.4,     8,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
                TYPE: exports.bullet,
            }, },
        ],
    };

exports.machine = {
    PARENT: [exports.genericTank],
    LABEL: "Orbiter",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
        POSITION: [2.769, 9.6, 1, 27.692, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [40, 2, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.5, 1, 0.00001, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 16
        },
    }, ],
};

            exports.spray = {
                PARENT: [exports.genericTank],
                LABEL: 'Sprayer',
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  23,     7,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.lowpower, g.mach, g.morerecoil]),
                        TYPE: exports.bullet,
                    }, }, {
                    POSITION: [  12,    10,     1.4,     8,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
                        TYPE: exports.bullet,
                    }, },
                ],
            };
exports.spray = {
    PARENT: [exports.genericTank],
    LABEL: "Sandman",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
        POSITION: [8.308, 9.6, 1, 0, 0, 0.988, 0.033],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [1200, 30, 0.001, 1, 1, 0.75, 1, 2.7, 1, 3, 1, 5000, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 16
        },
    }, ],
};
        exports.mini = {
            PARENT: [exports.genericTank],
            LABEL: 'Minigun',
            DANGER: 6,
            BODY: {
                FOV: 1.2,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  22,     8,      1,      0,      0,      0,      0, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  20,     8,      1,      0,      0,      0,    0.333, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
                        TYPE: exports.bullet,
                    }, }, { 
                POSITION: [  18,     8,      1,      0,      0,      0,    0.667, ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
                        TYPE: exports.bullet,
                    }, },
            ],
        };



            exports.stream = {
                PARENT: [exports.genericTank],
                LABEL: 'Streamliner',
                DANGER: 7,
                BODY: {
                    FOV: 1.3,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  25,     8,      1,      0,      0,      0,      0,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  23,     8,      1,      0,      0,      0,     0.2, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  21,     8,      1,      0,      0,      0,     0.4, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                            TYPE: exports.bullet,
                        }, }, { 
                    POSITION: [  19,     8,      1,      0,      0,      0,     0.6, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                            TYPE: exports.bullet,
                        }, },  { 
                    POSITION: [  17,     8,      1,      0,      0,      0,     0.8, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                            TYPE: exports.bullet,
                        }, },
                ],
            };
            exports.hybridmini = makeHybrid(exports.mini, "");
            exports.minitrap = {
                PARENT: [exports.genericTank],
                DANGER: 6,
                LABEL: '',
                STAT_NAMES: statnames.trap,
                BODY: {
                    FOV: 1.15,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */ 
                    POSITION: [  24,     8,      1,      0,      0,      0,      0, ], 
                            }, {
                    POSITION: [   4,     8,     1.3,     22,     0,      0,      0, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, { 
                    POSITION: [   4,     8,     1.3,     18,     0,      0,    0.333, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, { 
                    POSITION: [   4,     8,     1.3,     14,     0,      0,    0.667, ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };
    
    exports.pound = {
        PARENT: [exports.genericTank],
        DANGER: 5,
        BODY: {
            ACCELERATION: base.ACCEL * 0.8,
        },
        LABEL: 'Pounder',
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  20,    12,      1,      0,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
                TYPE: exports.bullet,
            }, },
        ],
    };


        exports.destroy = {
            PARENT: [exports.genericTank],
            DANGER: 6,
            BODY: {
                ACCELERATION: base.ACCEL * 0.75,
            },
            LABEL: 'Destroyer',
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  21,    14,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy]),
                    TYPE: exports.bullet,
                }, },
            ],
        };

exports.destroy = {
    PARENT: [exports.genericTank],
    LABEL: "Pollen",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [10, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 60, 1, 0.00001, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 3
        },
    }, ],
};
            exports.anni = {
                PARENT: [exports.genericTank],
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                },
                LABEL: 'Annihilator',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [ 20.5,  19.5,     1,      0,      0,      0,      0,   ],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni]),
                        TYPE: exports.bullet,
                    }, },
                ],
            };

exports.anni = {
    PARENT: [exports.genericTank],
    LABEL: "Reaper",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [15.231, 8, 1, 0, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [15.231, 8, 1, 0, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.hiveshooter = {
                PARENT: [exports.genericTank],
                DANGER: 6,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.75,
                    SPEED: base.speed * 0.8,
                },
                LABEL: '',
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  14,    14,     -1.2,    5,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.hive]),
                            TYPE: exports.hive,
                        }, }, {
                    POSITION: [  15,    12,      1,      5,      0,      0,      0,   ], 
                    }
                ],
            };
            exports.hybrid = makeHybrid(exports.destroy, 'Hybrid');
            exports.shotgun2 = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: 'Shotgun',
                BODY: {
                    ACCELERATION: base.ACCEL * 0.7,
                },
                GUNS: [ /***** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */ {
                    POSITION: [  4,      3,      1,     11,     -3,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  4,      3,      1,     11,      3,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  4,      4,      1,     13,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.casing,
                        }, }, {
                    POSITION: [  1,      4,      1,     12,     -1,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.casing,
                        }, }, {
                    POSITION: [  1,      4,      1,     11,      1,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.casing,
                        }, }, {                
                    POSITION: [  1,      3,      1,     13,     -1,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  1,      3,      1,     13,      1,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  1,      2,      1,     13,      2,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.casing,
                        }, }, {
                    POSITION: [  1,      2,      1,     13,     -2,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                            TYPE: exports.casing,
                        }, }, {
                    POSITION: [ 15,     14,      1,     6,       0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]),
                            TYPE: exports.casing,
                        }, }, {
                    POSITION: [  8,     14,    -1.3,    4,       0,      0,      0,   ], }
                ],
            };

exports.shotgun2 = {
    PARENT: [exports.genericTank],
    LABEL: "Pollen Wall",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 1, 1, 0.75, 1, 0, 1, 40, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 3
            },
        },
    ],
};

        exports.builder = {
            PARENT: [exports.genericTank],
            DANGER: 6,
            LABEL: 'Trapper',
            STAT_NAMES: statnames.trap,
            BODY: {
                SPEED: base.SPEED * 0.8,
                FOV: base.FOV * 1.15,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  18,    12,      1,      0,      0,      0,      0,   ], 
                }, {
                POSITION: [   2,    12,     1.1,     18,     0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.block]),
                        TYPE: exports.block,
                    }, },
            ],
        };
exports.builder = {
    PARENT: [exports.genericTank],
    LABEL: "longys and guilles booþe",
    SIZE: 12,
    SHAPE: 0,
  BODY: {
    FOV: base.FOV * 2
  },    
    GUNS: [{
            POSITION: [55.385, 4.8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [55.385, 4.8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [55.385, 4.8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};

            exports.engineer = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: 'Engineer',
                STAT_NAMES: statnames.trap,
                BODY: {
                    SPEED: base.SPEED * 1000,
                    FOV: base.FOV * 10,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   5,    11,      1,     10.5,     0,      0,      0,   ], 
                    }, {
                    POSITION: [   3,    14,      1,     15.5,     0,      0,      0,   ], 
                    }, {
                    POSITION: [   2,    14,     1.3,     18,      0,      0,      0,   ], 
                        PROPERTIES: {
                            MAX_CHILDREN: 10000000000000,
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.basic, g.sniper]),
                            TYPE: exports.pillbox,        
                            SYNCS_SKILLS: true,   
                        }, }, {                            
                    POSITION: [   4,    14,      1,      8,      0,      0,      0,   ]
                    }
                ],
            };
            exports.construct = {
                PARENT: [exports.genericTank],
                LABEL: 'Mega Trapper',
                STAT_NAMES: statnames.trap,
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.5,
                    SPEED: base.SPEED * 0.7,
                    FOV: base.FOV * 1.15,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,    18,      1,      0,      0,      0,      0,   ], 
                    }, {
                    POSITION: [   2,    18,     1.2,     18,     0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct]),
                            TYPE: exports.block,
                        }, }, 
                ],
            };

exports.construct = {
    PARENT: [exports.genericTank],
    LABEL: "Milky Way",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [2.769, 8, 1, 55.385, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 202.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 247.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 292.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 337.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 67.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 112.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 157.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 55.385, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [2.769, 8, 1, 27.692, 0, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 150, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [4, 2.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 210, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [4, 2.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [2, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [2, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [16.615, 9.6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [2, 0, 0.001, 1, 1, 0.75, 1, 22.5, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.autobuilder = makeAuto(exports.builder);
            exports.conq = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: '',
                STAT_NAMES: statnames.trap,
                BODY: {
                    SPEED: base.SPEED * 0.8,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  21,    14,      1,      0,      0,     180,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
                        TYPE: exports.bullet,
                    }, }, {
                    POSITION: [  18,    14,      1,      0,      0,      0,      0,   ], 
                    }, {
                    POSITION: [   2,    14,     1.1,     18,     0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block]),
                            TYPE: exports.block,
                        }, },
                ],
            };
            exports.bentboomer = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: 'Boomer',
                STAT_NAMES: statnames.trap,
                BODY: {
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.15,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   8,    10,      1,      8,     -2,     -35,     0,   ],
                        }, {
                    POSITION: [   8,    10,      1,      8,      2,      35,     0,   ],
                        }, {
                    POSITION: [   2,    10,     1.3,     16,    -2,     -35,     0,   ],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.fast, g.twin]),
                            TYPE: exports.boomerang,
                        }, }, {
                    POSITION: [   2,    10,     1.3,     16,     2,      35,    0.5,  ],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.fast, g.twin]),
                            TYPE: exports.boomerang,
                        }, },
                ],
            };
            exports.boomer = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: 'Boomer',
                STAT_NAMES: statnames.trap,
                FACING_TYPE: 'locksFacing',
                BODY: {
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.15,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [   5,    10,      1,      14,     0,      0,      0,   ],
                        }, {
                    POSITION: [   6,    10,    -1.5,      7,     0,      0,      0,   ],
                        }, {
                    //POSITION: [  12,    15,      1,      0,      0,      0,      0,   ],
                    //    }, {
                    POSITION: [   2,    10,     1.3,     18,     0,      0,      0,   ],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.boomerang]),
                            TYPE: exports.boomerang,
                        }, },
                ],
            };
            exports.quadtrapper = {
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: '',
                STAT_NAMES: statnames.trap, 
                BODY: {
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.15,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  14,     6,      1,      0,      0,     45,      0,   ], 
                        }, {
                    POSITION: [   2,     6,     1.1,     14,     0,     45,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.weak]),
                            TYPE: exports.block,
                        }, }, {
                    POSITION: [  14,     6,      1,      0,      0,     135,     0,   ], 
                        }, {
                    POSITION: [   2,     6,     1.1,     14,     0,     135,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.weak]),
                            TYPE: exports.block,
                        }, }, {
                    POSITION: [  14,     6,      1,      0,      0,     225,     0,   ], 
                        }, {
                    POSITION: [   2,     6,     1.1,     14,     0,     225,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.weak]),
                            TYPE: exports.block,
                        }, }, {
                    POSITION: [  14,     6,      1,      0,      0,     315,     0,   ], 
                        }, {
                    POSITION: [   2,     6,     1.1,     14,     0,     315,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.weak]),
                            TYPE: exports.block,
                        }, },
                ],
            };

        exports.artillery = {
            PARENT: [exports.genericTank],
            DANGER: 6,
            LABEL: 'Artillery',
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  17,     3,      1,      0,     -6,     -7,     0.25,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                        TYPE: exports.bullet,
                        LABEL: 'Secondary',
                    }, }, {
                POSITION: [  17,     3,      1,      0,      6,      7,     0.75,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                        TYPE: exports.bullet,
                        LABEL: 'Secondary',
                    }, }, {
                POSITION: [  19,     12,     1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]),
                        TYPE: exports.bullet,
                        LABEL: 'Heavy',
                    }, },
            ],
        };
            exports.mortar = {
                PARENT: [exports.genericTank],
                LABEL: 'Mortar',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  13,     3,      1,      0,     -8,     -7,     0.6,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                            TYPE: exports.bullet,
                            LABEL: 'Secondary',
                        }, }, {
                    POSITION: [  13,     3,      1,      0,      8,      7,     0.8,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                            TYPE: exports.bullet,
                            LABEL: 'Secondary',
                        }, }, {
                    POSITION: [  17,     3,      1,      0,     -6,     -7,     0.2,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                            TYPE: exports.bullet,
                            LABEL: 'Secondary',
                        }, }, {
                    POSITION: [  17,     3,      1,      0,      6,      7,     0.4,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                            TYPE: exports.bullet,
                            LABEL: 'Secondary',
                        }, }, {
                    POSITION: [  19,     12,     1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]),
                            TYPE: exports.bullet,
                            LABEL: 'Heavy',
                        }, },
                ],
            };
            exports.skimmer = {
                PARENT: [exports.genericTank],
                BODY: {
                    FOV: base.FOV * 1.15,
                },
                LABEL: 'Skimmer',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  10,    14,    -0.5,     9,      0,      0,      0,  ], 
                        }, {
                    POSITION: [  17,    15,      1,      0,      0,      0,      0,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty, g.skim]),
                            TYPE: exports.missile,
                            STAT_CALCULATOR: gunCalcNames.sustained,
                        }, },
                ],
            };
            exports.spread = {
                PARENT: [exports.genericTank],
                LABEL: 'Spreadshot',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  13,     4,      1,      0,    -0.8,    -75,    5/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [ 14.5,    4,      1,      0,    -1.0,    -60,    4/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [  16,     4,      1,      0,    -1.6,    -45,    3/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [ 17.5,    4,      1,      0,    -2.4,    -30,    2/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [  19,     4,      1,      0,    -3.0,    -15,    1/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {                    
                    POSITION: [  13,     4,      1,      0,     0.8,     75,    5/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [ 14.5,    4,      1,      0,     1.0,     60,    4/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [  16,     4,      1,      0,     1.6,     45,    3/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [ 17.5,    4,      1,      0,     2.4,     30,    2/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [  19,     4,      1,      0,     3.0,     15,    1/6,    ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Spread',
                        }, }, {
                    POSITION: [  13,    10,     1.3,     8,      0,      0,      0,     ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.spreadmain, g.spread]),
                            TYPE: exports.bullet,
                            LABEL: 'Pounder',
                        }, },
                ],
            };

    exports.flank = {
        PARENT: [exports.genericTank],
        LABEL: 'Flank Guard',
        BODY: {
            SPEED: base.SPEED * 1.1,
        },
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
                    TYPE: exports.bullet,
                }, }, {   
            POSITION: [  18,     8,      1,      0,      0,     120,     0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
                    TYPE: exports.bullet,
                }, }, {   
            POSITION: [  18,     8,      1,      0,      0,     240,     0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
                    TYPE: exports.bullet,
                }, },
        ],
    };
        exports.hexa = {
            PARENT: [exports.genericTank],
            LABEL: 'Hexa Tank',
            DANGER: 6,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {   
                POSITION: [  18,     8,      1,      0,      0,     120,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {   
                POSITION: [  18,     8,      1,      0,      0,     240,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {   
                POSITION: [  18,     8,      1,      0,      0,      60,    0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {   
                POSITION: [  18,     8,      1,      0,      0,     180,    0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {   
                POSITION: [  18,     8,      1,      0,      0,     300,    0.5,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, },
            ],
        };
            exports.octo = {
                PARENT: [exports.genericTank],
                LABEL: 'Octo Tank',
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,      90,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     270,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,      45,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     135,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  18,     8,      1,      0,      0,     225,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     315,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
                            TYPE: exports.bullet,
                        }, },
                ],
            };
exports.hexa = {
    PARENT: [exports.genericTank],
    LABEL: "Sword",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [55.385, 10.24, 1, 0, 0, 270, 0],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [110.769, 10.24, 1, 0, 0, 270, 0],
            PROPERTIES: {
                COLOR: 16
            },
        },
        {
            POSITION: [4.154, 10.24, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [4.154, 10.24, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
        {
            POSITION: [4.154, 10.24, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [1, 0, 0.001, 1, 1, 0.75, 1, 6.3, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 16
            },
        },
    ],
};
            exports.heptatrap = (() => {
                let a = 360/7, d = 1/7;
                return {
                    PARENT: [exports.genericTank],
                    LABEL: 'Hepta-Trapper',
                    DANGER: 7,
                    BODY: {
                        SPEED: base.SPEED * 0.8,
                    },
                    STAT_NAMES: statnames.trap,
                    HAS_NO_RECOIL: true,
                    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                        POSITION: [  15,     7,      1,      0,      0,      0,      0,   ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,      0,      0,   ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,      a,     4*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,      a,     4*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,     2*a,    1*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,     2*a,    1*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,     3*a,    5*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,     3*a,    5*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,     4*a,    2*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,     4*a,    2*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,     5*a,    6*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,     5*a,    6*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, }, {
                        POSITION: [  15,     7,      1,      0,      0,     6*a,    3*d,  ],
                            }, {
                        POSITION: [   3,     7,     1.7,    15,      0,     6*a,    3*d,  ], 
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                            }, },
                    ],
                };
            })();
            exports.hexatrap = makeAuto({
                PARENT: [exports.genericTank],
                LABEL: 'Hexa-Trapper',
                DANGER: 7,
                BODY: {
                    SPEED: base.SPEED * 0.8,
                },
                STAT_NAMES: statnames.trap,
                HAS_NO_RECOIL: true,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  15,     7,      1,      0,      0,      0,      0,   ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {
                    POSITION: [  15,     7,      1,      0,      0,     60,     0.5,  ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,     60,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {
                    POSITION: [  15,     7,      1,      0,      0,     120,     0,   ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,     120,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {
                    POSITION: [  15,     7,      1,      0,      0,     180,    0.5,  ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,     180,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {
                    POSITION: [  15,     7,      1,      0,      0,     240,     0,   ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,     240,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, }, {
                    POSITION: [  15,     7,      1,      0,      0,     300,    0.5,  ],
                        }, {
                    POSITION: [   3,     7,     1.7,    15,      0,     300,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            }, 'Hexa-Trapper');

        exports.tri = {
            PARENT: [exports.genericTank],
            LABEL: 'Tri-Angle',
            BODY: {
                HEALTH: base.HEALTH * 0.8,
                SHIELD: base.SHIELD * 0.8,
                DENSITY: base.DENSITY * 0.6,
            },
            DANGER: 6,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.tonsmorrecoil]),
                        TYPE: exports.bullet,
                        LABEL: 'Front',
                    }, }, {   
                POSITION: [  16,     8,      1,      0,      0,     150,    0.1,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                        TYPE: exports.bullet,
                        LABEL: gunCalcNames.thruster,
                    }, }, {   
                POSITION: [  16,     8,      1,      0,      0,     210,    0.1,  ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                        TYPE: exports.bullet,
                        LABEL: gunCalcNames.thruster,
                    }, },
            ],
        }; 

exports.tri = {
    PARENT: [exports.genericTank],
    LABEL: "Rammer",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
        POSITION: [33.231, 16, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [1, 3, 0.001, 1, 1, 0.75, 1, 0.09, 1, 0.5, 1, 30000, 1]
            ]),
            TYPE: exports.bullet,
            COLOR: 16
        },
    }, ],
};
            exports.booster = {
                PARENT: [exports.genericTank],
                LABEL: 'Booster',
                BODY: {
                    HEALTH: base.HEALTH * 0.6,
                    SHIELD: base.SHIELD * 0.6,
                    DENSITY: base.DENSITY * 0.2,
                },
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.muchmorerecoil]),
                            TYPE: exports.bullet,
                            LABEL: 'Front',
                        }, }, {   
                    POSITION: [  13,     8,      1,      0,     -1,     135,    0.6,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  13,     8,      1,      0,      1,     225,    0.6,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     145,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     215,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, },
                ],
            };
            exports.fighter = {
                PARENT: [exports.genericTank],
                LABEL: 'Fighter',
                BODY: {
                    DENSITY: base.DENSITY * 0.6,
                },
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
                            TYPE: exports.bullet,
                            LABEL: 'Front',
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,     -1,      90,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
                            TYPE: exports.bullet,
                            LABEL: 'Side',
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      1,     -90,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
                            TYPE: exports.bullet,
                            LABEL: 'Side',
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     150,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     210,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, },
                ],
            };
            exports.brutalizer = {
                PARENT: [exports.genericTank],
                LABEL: '',
                BODY: {
                    DENSITY: base.DENSITY * 0.6,
                },
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
                            TYPE: exports.bullet,
                            LABEL: 'Front',
                        }, }, {   
                    POSITION: [   7,    7.5,    0.6,     7,     -1,      90,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.autoswarm],
                            STAT_CALCULATOR: gunCalcNames.swarm,         
                        }, }, {   
                    POSITION: [   7,    7.5,    0.6,     7,      1,     -90,     9,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.swarm]),
                            TYPE: [exports.autoswarm],
                            STAT_CALCULATOR: gunCalcNames.swarm,     
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     150,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     210,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, },
                ],
            };
            exports.bomber = {
                PARENT: [exports.genericTank],
                LABEL: 'Bomber',
                BODY: {
                    DENSITY: base.DENSITY * 0.6,
                },
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  20,     8,      1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
                            TYPE: exports.bullet,
                            LABEL: 'Front',
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     130,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri]),
                            TYPE: exports.bullet,
                            LABEL: 'Wing',
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     230,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri]),
                            TYPE: exports.bullet,
                            LABEL: 'Wing',
                        }, }, {
                    POSITION: [  14,     8,      1,      0,      0,     180,     0,   ],
                        }, {
                    POSITION: [   4,     8,     1.5,    14,      0,     180,    0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.morerecoil]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };    
            exports.autotri = makeAuto(exports.tri);   
            exports.autotri.BODY = {
                SPEED: base.SPEED,
            };   
            exports.falcon = {
                PARENT: [exports.genericTank],
                LABEL: 'Falcon',
                DANGER: 7,
                BODY: {
                    ACCELERATION: base.ACCEL * 0.8,
                    FOV: base.FOV * 1.2,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  27,    8.5,     1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.lessreload]),
                            TYPE: exports.bullet,
                            LABEL: 'Assassin',
                            ALT_FIRE: true,
                        }, }, {
                    POSITION: [   5,    8.5,   -1.6,     8,      0,      0,      0,   ], 
                        }, {   
                    POSITION: [  16,     8,      1,      0,      0,     150,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  16,     8,      1,      0,      0,     210,    0.1,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, }, {   
                    POSITION: [  18,     8,      1,      0,      0,     180,    0.6,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]),
                            TYPE: exports.bullet,
                            LABEL: gunCalcNames.thruster,
                        }, },
                ],
            };

        exports.auto3 = { 
            PARENT: [exports.genericTank],
            LABEL: 'Auto-3',
            DANGER: 6,
            FACING_TYPE: 'autospin',
            TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                POSITION: [  11,     8,      0,      0,     190, 0], 
                    TYPE: exports.auto3gun,
                        }, {
                POSITION: [  11,     8,      0,     120,    190, 0], 
                    TYPE: exports.auto3gun,
                        }, {
                POSITION: [  11,     8,      0,     240,    190, 0], 
                    TYPE: exports.auto3gun,
                        },
            ],
        };
            exports.auto5 = {
                PARENT: [exports.genericTank],
                LABEL: 'Auto-5',
                DANGER: 7,
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  11,     8,      0,      0,     190, 0], 
                        TYPE: exports.auto5gun,
                            }, {
                    POSITION: [  11,     8,      0,      72,    190, 0], 
                        TYPE: exports.auto5gun,
                            }, {
                    POSITION: [  11,     8,      0,     144,    190, 0], 
                        TYPE: exports.auto5gun,
                            }, {
                    POSITION: [  11,     8,      0,     216,    190, 0], 
                        TYPE: exports.auto5gun,
                            }, {
                    POSITION: [  11,     8,      0,     288,    190, 0], 
                        TYPE: exports.auto5gun,
                            },
                ],
            };
            exports.heavy3 = {
                BODY: {
                    SPEED: base.SPEED * 0.95,
                },
                PARENT: [exports.genericTank],
                LABEL: 'Mega-3',
                DANGER: 7,
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  14,     8,      0,      0,     190, 0], 
                        TYPE: exports.heavy3gun,
                            }, {
                    POSITION: [  14,     8,      0,     120,    190, 0], 
                        TYPE: exports.heavy3gun,
                            }, {
                    POSITION: [  14,     8,      0,     240,    190, 0], 
                        TYPE: exports.heavy3gun,
                            },
                ],
            };
            exports.tritrap = {
                LABEL: '',
                BODY: {
                    SPEED: base.SPEED * 1.1,
                },
                PARENT: [exports.genericTank],
                DANGER: 6,
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  12,     8,      0,      0,     190, 0], 
                        TYPE: exports.tritrapgun,
                            }, {
                    POSITION: [  12,     8,      0,     120,    190, 0], 
                        TYPE: exports.tritrapgun,
                            }, {
                    POSITION: [  12,     8,      0,     240,    190, 0], 
                        TYPE: exports.tritrapgun,
                            },
                ],
            };
            exports.sniper3 = { 
                PARENT: [exports.genericTank],
                DANGER: 7,
                LABEL: '',
                BODY: {
                    ACCELERATION: base.ACCEL * 0.6,
                    SPEED: base.SPEED * 0.8,
                    FOV: base.FOV * 1.25,
                },
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  13,     8,      0,      0,     170, 0], 
                        TYPE: exports.sniper3gun,
                            }, {
                    POSITION: [  13,     8,      0,     120,    170, 0], 
                        TYPE: exports.sniper3gun,
                            }, {
                    POSITION: [  13,     8,      0,     240,    170, 0], 
                        TYPE: exports.sniper3gun,
                            },
                ],
            };
            exports.auto4 = { 
                PARENT: [exports.genericTank],
                DANGER: 5,
                LABEL: 'Auto-4',
                FACING_TYPE: 'autospin',
                TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                    POSITION: [  13,     6,      0,      45,    160, 0], 
                        TYPE: exports.auto4gun,
                            }, {
                    POSITION: [  13,     6,      0,     135,    160, 0], 
                        TYPE: exports.auto4gun,
                            }, {
                    POSITION: [  13,     6,      0,     225,    160, 0],
                        TYPE: exports.auto4gun,
                            }, {
                    POSITION: [  13,     6,      0,     315,    160, 0],
                        TYPE: exports.auto4gun,
                            },
                ],
            };

exports.auto4 = {
    PARENT: [exports.genericTank],
    LABEL: "Tera Preon",
    SIZE: 24,
    SHAPE: 0,
    GUNS: [{
            POSITION: [36, 20.8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 150, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 9
            },
        },
        {
            POSITION: [36, 20.8, 1, -8.308, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 150, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet,
                COLOR: 9
            },
        },
    ],
};
            
        exports.flanktrap = {
            PARENT: [exports.genericTank],
            LABEL: 'Trap Guard',
            STAT_NAMES: statnames.generic,
            DANGER: 6,
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  20,     8,      1,      0,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [  13,     8,      1,      0,      0,     180,     0,   ],
                    }, {
                POSITION: [   4,     8,     1.7,    13,      0,     180,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap]),
                        TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                    }, },
            ],
        };
            exports.guntrap = {
                PARENT: [exports.genericTank],
                LABEL: 'Gunner Trapper',
                DANGER: 7,
                STAT_NAMES: statnames.generic,
                BODY: {
                    FOV: base.FOV * 1.25,
                },
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  19,     2,      1,      0,    -2.5,     0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.tonsmorrecoil, g.lotsmorrecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  19,     2,      1,      0,     2.5,     0,     0.5,  ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.tonsmorrecoil, g.lotsmorrecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  12,    11,      1,      0,      0,      0,      0,   ],
                        }, {
                    POSITION: [  13,    11,      1,      0,      0,     180,     0,   ],
                        }, {
                    POSITION: [   4,    11,     1.7,    13,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap, g.fast, g.halfrecoil]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };
            exports.bushwhack = {
                PARENT: [exports.genericTank],
                LABEL: 'Snipe Guard',
                BODY: {
                    ACCELERATION: base.ACCEL * 0.7, 
                    FOV: base.FOV * 1.2,
                },
                DANGER: 7,
                GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                    POSITION: [  24,    8.5,     1,      0,      0,      0,      0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.morerecoil]),
                            TYPE: exports.bullet,
                        }, }, {
                    POSITION: [  13,    8.5,     1,      0,      0,     180,     0,   ],
                        }, {
                    POSITION: [   4,    8.5,    1.7,    13,      0,     180,     0,   ], 
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.trap]),
                            TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
                        }, },
                ],
            };

exports.basic2 = {
PARENT: [exports.genericTank],
LABEL: "621-Basic",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.twin2 = {
PARENT: [exports.genericTank],
LABEL: "621-Twin",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,4.708,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,9.6,1,0,-4.708,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.playable = {
PARENT: [exports.genericTank],
LABEL: "Playable Bosses",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,8,1,0,0,0.545,0],
PROPERTIES: {
COLOR: 16
}, },
], };



exports.warship = {
PARENT: [exports.genericTank],
LABEL: "Warship",
SIZE: 25.875,
SHAPE: 4,
GUNS: [
{
POSITION: [18,8,1,0,0,359.382,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,0,12.185,359.751,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,0,-12.185,359.751,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,0,-6.092,359.751,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,0,6.092,359.751,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,9.138,-6.092,180.688,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,9.138,6.092,181.138,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([2, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,3.046,0,113.671,0],
},
{
POSITION: [3, 8, 1.3, 21.046, 0, 113.671, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.85, 0.8, 3, 1.25, 1000, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [18,8,1,3.046,0,65.539,0],
},
{
POSITION: [3, 8, 1.3, 21.046, 0, 65.539, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.85, 0.8, 3, 1.25, 1000, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [18,8,1,3.046,0,295.176,0],
},
{
POSITION: [3, 8, 1.3, 21.046, 0, 295.176, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.85, 0.8, 3, 1.25, 1000, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [18,8,1,3.046,0,245.173,0],
},
{
POSITION: [3, 8, 1.3, 21.046, 0, 245.173, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.85, 0.8, 3, 1.25, 1000, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [8,3.5,2.7,11.046,0,270.968,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1.84, 0.6, 0.6, 0.6, 5.85, 0.8, 3, 0.8, 1000, 1]]),
TYPE: exports.sunchip,
COLOR: 16
}, },
{
POSITION: [8,3.5,2.7,11.046,0,89.462,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1.84, 0.6, 0.6, 0.6, 5.85, 0.8, 3, 0.8, 1000, 1]]),
TYPE: exports.sunchip,
COLOR: 16
}, },
], };

exports.fallenpentagon = {
PARENT: [exports.genericTank],
LABEL: "Fallen Pentagon",
SIZE: 20.625,
SHAPE: 5,
MAX_CHILDREN: 100,
GUNS: [
{
POSITION: [16.338,26.24,1,0,0,323.11,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 5.31, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [16.338,26.24,1,0,0,35.11,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 5.31, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [16.338,26.24,1,0,0,107.11,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 5.31, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [16.338,26.24,1,0,0,179.11,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 5.31, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [16.338,26.24,1,0,0,251.11,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 5.31, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [24.492,6.16,2.7,-13.323,0,250.636,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1.54, 1.02, 1.26, 1, 17.91, 0.9, 3, 2, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
{
POSITION: [24.492,6.16,2.7,-13.323,0,322.636,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1.54, 1.02, 1.26, 1, 17.91, 0.9, 3, 2, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
{
POSITION: [24.492,6.16,2.7,-13.323,0,34.636,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1.54, 1.02, 1.26, 1, 17.91, 0.9, 3, 2, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
{
POSITION: [24.492,6.16,2.7,-13.323,0,106.636,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1.54, 1.02, 1.26, 1, 17.91, 0.9, 3, 2, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
{
POSITION: [24.492,6.16,2.7,-13.323,0,178.636,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1.54, 1.02, 1.26, 1, 17.91, 0.9, 3, 2, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
], };


exports.terminal = {
PARENT: [exports.genericTank],
LABEL: "Terminal",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,0.32,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,0,-1.385,0,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,0,1.385,0,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,-1.385,2.769,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,-1.385,-2.769,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.terminalII = {
PARENT: [exports.genericTank],
LABEL: "Gateway",
GUNS: [
{
POSITION: [12.462,3.52,1,0,0,359.299,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic,g.pound,g.sniper]),
TYPE: exports.bullet
}, },
], };

exports.terminalIII = {
PARENT: [exports.genericTank],
LABEL: "Gateway MKII", 
                BODY: {
                FOV: base.FOV * 1.4,
                },
GUNS: [
{
POSITION: [12.462,3.52,1,0,-4.154,359.888,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic,g.sniper,g.pound]),
TYPE: exports.bullet
}, },
{
POSITION: [12.462,3.52,1,0,4.154,359.951,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic,g.sniper,g.pound]),
TYPE: exports.bullet
}, },
{
POSITION: [15.231,6.72,1,0,0,359.885,0.3],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic,g.sniper,g.pound]),
TYPE: exports.bullet
}, },
{
POSITION: [18,3.52,1,0,0,359.848,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic,g.sniper,g.pound]),
TYPE: exports.bullet
}, },
], };

exports.ballmaker = {
PARENT: [exports.genericTank],
LABEL: "Ballmaker",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [11.077,14.4,1,0,0,359.824,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 2, 0.001, 1, 1, 0.75, 1, 3.6, 1, 3, 1, 20000, 1]]),
TYPE: exports.bullet,
COLOR: 1
}, },
{
POSITION: [5.538,14.4,1,12.462,0,359.718,0],
PROPERTIES: {
COLOR: 2
}, },
{
POSITION: [5.538,14.4,1,19.385,0,359.584,0],
PROPERTIES: {
COLOR: 3
}, },
], };

exports.trollge = {
PARENT: [exports.genericTank],
LABEL: "trollge",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bee,
COLOR: 16
}, },
], };

exports.trollgeII = {
PARENT: [exports.genericTank],
LABEL: "trollge v2",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 150,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.swarm,
COLOR: 16
}, },
], };


exports.trollgeIII = {
PARENT: [exports.genericTank],
LABEL: "trollge 3",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 75,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.drone,
COLOR: 16
}, },
], };

exports.trollgeIV = {
PARENT: [exports.genericTank],
LABEL: "trollge 4",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
], };

exports.trollgeV = {
PARENT: [exports.genericTank],
LABEL: "trollge 5",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.block,
COLOR: 16
}, },
], };

exports.trollgeVI = {
PARENT: [exports.genericTank],
LABEL: "trollge 6",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.boomerang,
COLOR: 16
}, },
], };

exports.engitroll = {
PARENT: [exports.genericTank],
LABEL: "engineering trollge",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 75,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.pillbox,
COLOR: 16
}, },
], };

exports.trollgeVII = {
PARENT: [exports.genericTank],
LABEL: "trollge 7",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 150,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.sunchip,
COLOR: 16
}, },
], };

exports.trollgeVIII = {
PARENT: [exports.genericTank],
LABEL: "trollge 8",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 150,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.gunchip,
COLOR: 16
}, },
], };

exports.trollgeIX = {
PARENT: [exports.genericTank],
LABEL: "trollge 9",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.hive,
COLOR: 16
}, },
], };

exports.trollgeX = {
PARENT: [exports.genericTank],
LABEL: "trollge 10",
SIZE: 12,
SHAPE: 0,
MAX_CHILDREN: 25,
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[1, 0.5, 0.001, 1, 1, 0.75, 1, 9, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.minion,
COLOR: 16
}, },
], };

exports.scout = {
PARENT: [exports.genericTank],
LABEL: "Scout Rifle",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [27.692,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.969,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [28.246,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [28.523,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [28.8,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [29.077,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [29.354,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [29.631,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [29.908,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [30.185,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [30.462,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [30.738,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [31.015,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [31.292,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [31.569,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [31.846,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [32.123,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [32.4,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [32.677,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [32.954,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [33.231,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [33.508,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [33.508,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [33.231,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [34.062,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [34.338,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [34.615,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [34.892,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [35.169,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [35.446,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [35.723,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [36,7.04,1,0,0,359.871,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 89.91, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [6.092,7.04,1,6.092,0,337.38,0],
PROPERTIES: {
COLOR: 3
}, },
{
POSITION: [6.092,7.04,1,18.277,0,352.75,0],
PROPERTIES: {
COLOR: 3
}, },
], };

exports.virus = {
PARENT: [exports.genericTank],
LABEL: "Virus",
SIZE: 12,
SHAPE: 4,
GUNS: [
{
POSITION: [18,8,1,0,-9.138,359.872,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18,8,1,0,9.138,359.843,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [33.785,8,1,0,0,359.832,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 10.98, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };



exports.shockwave = {
PARENT: [exports.genericTank],
LABEL: "pfröjgge",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,180,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,270,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,90,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,135,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,225,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,315,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,45,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,112.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,157.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,202.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,247.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,292.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,337.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,22.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,67.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,195,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,187.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,210,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,217.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,232.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,240,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,255,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,262.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,277.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,285,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,300,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,307.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,322.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,330,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,345,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,352.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,7.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,15,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,30,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,37.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,52.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,60,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,75,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,82.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,97.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,105,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,120,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,127.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,142.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,150,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,165,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,172.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };


exports.alienterminal = {
PARENT: [exports.genericTank],
LABEL: "Alien Terminal",
SIZE: 12,
SHAPE: 7,
COLOR: 0,
GUNS: [
{
POSITION: [18,0.32,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.hypermissile,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,0,-1.385,0,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.hypermissile,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,0,1.385,0,0.5],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.hypermissile,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,-1.385,2.769,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.hypermissile,
COLOR: 16
}, },
{
POSITION: [18,0.32,1,-1.385,-2.769,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 5.85, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.hypermissile,
COLOR: 16
}, },
], };

exports.alien = {
    PARENT: [exports.genericTank],
    LABEL: 'Alien',
    SHAPE: 7,
    COLOR: 0,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.op]),
            TYPE: exports.bullet,
            LABEL: '',                  // def
            STAT_CALCULATOR: 0,         // def
            WAIT_TO_CYCLE: false,       // def
            AUTOFIRE: false,            // def
            SYNCS_SKILLS: false,        // def         
            MAX_CHILDREN: 0,            // def  
            ALT_FIRE: false,            // def 
            NEGATIVE_RECOIL: false,     // def
        }, }, 
    ],
};

exports.untimating = {
PARENT: [exports.genericTank],
LABEL: "Untimating",
SIZE: 12,
SHAPE: 0,
GUNS: [
{
POSITION: [27.692,8,1,0,0,89.426,0],
PROPERTIES: {
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,269.426,0],
PROPERTIES: {
COLOR: 16
}, },
{
POSITION: [18.277,14.08,1,4.154,-18.277,179.473,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,14.08,1,4.154,-18.277,359.473,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,14.08,1,4.154,18.277,359.95,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,14.08,1,4.154,18.277,179.95,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,3.52,1,0,0,0.394,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [15.231,3.52,1,0,0,0.641,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 4.95, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [12.185,3.52,1,0,0,0.641,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 3.96, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,10.56,1,0,0,178.312,0],
},
{
POSITION: [3.046, 10.56, 1.3, 18.277, 0, 178.312, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 5.94, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [18.277,3.52,1,0,-3.046,356.258,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,3.52,1,0,3.046,2.667,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,3.52,1,3.046,9.138,355.181,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,3.52,1,3.046,-9.138,4.139,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,8,1,27.415,0,89.217,0],
PROPERTIES: {
COLOR: 16
}, },
{
POSITION: [18.277,8,1,27.415,0,269.217,0],
PROPERTIES: {
COLOR: 16
}, },
{
POSITION: [18.277,8,1,3.046,-39.877,0.194,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,8,1,3.046,-39.877,180.194,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,8,1,3.046,39.877,358.533,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [18.277,8,1,3.046,39.877,178.533,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 5.94, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,4.708,18.277,0.191,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 6.93, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,4.708,18.277,180.191,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 6.93, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,4.708,-18.277,359.947,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 6.93, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,4.708,-18.277,179.947,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[20, 0, 0.001, 1, 1, 0.75, 1, 6.93, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,27.415,-9.138,178.315,0],
},
{
POSITION: [3.554, 8, 1.3, 48.738, -9.138, 178.315, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [21.323,8,1,27.415,9.138,178.315,0],
},
{
POSITION: [3.554, 8, 1.3, 48.738, 9.138, 178.315, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [21.323,4.8,1,60.092,18.277,178.32,0],
},
{
POSITION: [3.554, 4.8, 1.3, 81.41499999999999, 18.277, 178.32, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [21.323,4.8,1,60.092,9.138,177.934,0],
},
{
POSITION: [3.554, 4.8, 1.3, 81.41499999999999, 9.138, 177.934, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [21.323,4.8,1,60.092,-18.277,177.934,0],
},
{
POSITION: [3.554, 4.8, 1.3, 81.41499999999999, -18.277, 177.934, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
{
POSITION: [21.323,4.8,1,60.092,-9.138,177.934,0],
},
{
POSITION: [3.554, 4.8, 1.3, 81.41499999999999, -9.138, 177.934, 0 ],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 0.45, 0.6, 0.39, 1.25, 6.93, 0.8, 3, 1.25, 0.00001, 1]]),
TYPE: exports.trap,
COLOR: 16
}, },
], };

exports.ultralongys = {
PARENT: [exports.genericTank],
LABEL: "Longys Musket",
SIZE: 12,
SHAPE: 0,
  BODY: {
    FOV: base.FOV * 2
  },    
GUNS: [
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [13.846,9.6,1,0,0,180,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 2, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [13.846,9.6,1,0,0,180,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 2, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.longyshunter = {
PARENT: [exports.genericTank],
LABEL: "Longys Hunter",
SIZE: 12,
SHAPE: 0,
  BODY: {
    FOV: base.FOV * 1.4
  },    
GUNS: [
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 45, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [13.846,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [13.846,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.darkness = {
    PARENT: [exports.genericTank],
    LABEL: 'Dark Basic',
    COLOR: 9,
  BODY: {
    FOV: base.FOV * 2,
    HEALTH: base.HEALTH * 1.5,
  },    
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  18,     8,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.op]),
            TYPE: exports.bullet,
            LABEL: '',                  // def
            STAT_CALCULATOR: 0,         // def
            WAIT_TO_CYCLE: false,       // def
            AUTOFIRE: false,            // def
            SYNCS_SKILLS: false,        // def         
            MAX_CHILDREN: 0,            // def  
            ALT_FIRE: false,            // def 
            NEGATIVE_RECOIL: false,     // def
        }, }, 
    ],
};


exports.machlongys = {
PARENT: [exports.genericTank],
LABEL: "Machine Longys",
SIZE: 12,
SHAPE: 0,
BODY: {
    FOV: base.FOV * 1.5
  },    
GUNS: [
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[10, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.bigboope = {
PARENT: [exports.genericTank],
LABEL: "big boope",
SIZE: 12,
SHAPE: 0,
  BODY: {
    FOV: base.FOV * 1.5
  },    
GUNS: [
{
POSITION: [55.385,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[60, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.twinboop = {
PARENT: [exports.genericTank],
LABEL: "twin boope",
SIZE: 12,
SHAPE: 0,
  BODY: {
    FOV: base.FOV * 2
  },    
GUNS: [
{
POSITION: [55.385,4.8,1,0,5.262,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [55.385,4.8,1,0,-5.262,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 36, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.metal = {
    PARENT: [exports.genericTank],
    LABEL: 'Metallic Tank',
    COLOR: 16,
    SHAPE: 6,
  BODY: {
    FOV: base.FOV * 1.5,
    HEALTH: base.HEALTH * 10,
    SPEED: base.SPEED * 0.8,
    DAMAGE: base.DAMAGE * 100,
  },
            IS_SMASHER: true,
            SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
            STAT_NAMES: statnames.smasher,
        };

exports.visor = {
    PARENT: [exports.genericTank],
    LABEL: 'Sus',
    COLOR: 0,
    SHAPE: 'M 0 1 C 0 1 0 1 0 1 C 1 1 2 1 2 0 C 2 -1 1 -1 0 -1 C -1 -1 -2 -1 -2 0 C -2 1 -1 1 0 1'
    ,
};
exports.sus = {
    PARENT: [exports.genericTank],
    LABEL: 'sussy',
    SIZE:15,
    COLOR: 6,
  BODY: {
    HEALTH: base.HEALTH * 4,
    DAMAGE: base.DAMAGE * 4,
    SPEED: base.SPEED * 0.5
  },    
    SHAPE: [[-0.62,0.64],[-0.53,0.824],[-0.353,0.95],[-0.17,0.99],  
    [-0.01,0.995],[0.15,0.995],[0.327,0.964],[0.49,0.884], 
    [0.627,0.746],[0.687,0.546],[0.87,-0.7],[1.07,-0.754], 
    [1.107,-0.894],[1.03,-0.98],[0.59,-0.976],[0.5,-0.9], 
    [0.47,-0.536],[0.37,-0.45],[-0.273,-0.43],[-0.353,-0.5], 
    [-0.387,-0.734],[-0.227,-0.75],[-0.09,-0.814],[-0.09,-0.99], 
    [-0.24,-1.05],[-0.74,-1.05],[-0.74,-0.8],[-0.74,-0.376], 
    [-0.68,0.44]],
    SIZE: 10,
    TURRETS: [{ /*   SIZE     X       Y     ANGLE    ARC  OVERLAP*/
         POSITION: [  4.5,      0,      5,     0,     0,     1],
         TYPE: exports.visor,
            }],           
};

exports.bismuth = {
    PARENT: [exports.genericTank],
    LABEL: 'Bismuth',
    COLOR: 15,
    SHAPE: 6,
  BODY: {
    FOV: base.FOV * 2.5,
    HEALTH: base.HEALTH * 9,
    SPEED: base.SPEED * 1.4,
    DAMAGE: base.DAMAGE * 90,
  },
            IS_SMASHER: true,
            SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
            STAT_NAMES: statnames.smasher,
        };

exports.protective = {
            PARENT: [exports.genericTank],
            LABEL: 'Ultraprotect',
            COLOR: 17,
            DANGER: 6,
            BODY: {
                FOV: base.FOV * 1,
                DENSITY: base.DENSITY * 200,
                HEALTH: base.HEALTH * 15,
                SPEED: base.SPEED * 1.2,
                DAMAGE: base.DAMAGE * 200,
            },
            TURRETS: [{ /** SIZE     X       Y     ANGLE    ARC */
                POSITION: [  21.5,   0,      0,      0,     360,  0,], 
                TYPE: exports.smasherBody,
            }],
            IS_SMASHER: true,
            SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
            STAT_NAMES: statnames.smasher,
        };

exports.greasemetal = {
PARENT: [exports.genericTank],
LABEL: "Greasemetal",
SIZE: 12,
SHAPE: 6,
COLOR: 18,
  BODY: {
    FOV: base.FOV * 1.7,
    HEALTH: base.HEALTH * 10,
    SPEED: base.SPEED * 1.8,
    DAMAGE: base.DAMAGE * 80,
  },
GUNS: [
{
POSITION: [13.846,4.8,1,0,0,180,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 2.5, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };
       

exports.ultragrease = {
PARENT: [exports.genericTank],
LABEL: "Ultragrease",
SIZE: 12,
SHAPE: 6,
COLOR: 19,
  BODY: {
    FOV: base.FOV * 1.5,
    HEALTH: base.HEALTH * 7,
    SPEED: base.SPEED * 3,
    DAMAGE: base.DAMAGE * 50,
  },
GUNS: [
{
POSITION: [13.846,4.8,1,0,0,217.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 2.5, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [13.846,4.8,1,0,0,142.5,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[4, 2.5, 0.001, 1, 1, 0.75, 1, 2.25, 1, 0.5, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.pseudometal = {
PARENT: [exports.genericTank],
LABEL: "Pseudometallic",
SIZE: 12,
SHAPE: 6,
COLOR: 16,
BODY: {
    FOV: base.FOV * 1,
    HEALTH: base.HEALTH * 0.001,
    SPEED: base.SPEED * 0.1,
    DAMAGE: base.DAMAGE * 0.001,
  },
GUNS: [
{
POSITION: [18,9.6,1,0,0,0,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[3, 0, 0.001, 3, 3, 3, 3, 22.5, 3, 3, 3, 0.00001, 3]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.urmom = {
    PARENT: [exports.genericTank],
    LABEL: 'your mom',
    COLOR: 17,
    SHAPE: 6,
    SIZE: 160,
  BODY: {
    FOV: base.FOV * 6,
    HEALTH: base.HEALTH * 20,
    SPEED: base.SPEED * 0.01,
    DAMAGE: base.DAMAGE * 1,
  },
            IS_SMASHER: true,
            SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl,],
            STAT_NAMES: statnames.smasher,
        };

exports.obliterator = {
            PARENT: [exports.genericTank],
            LABEL: 'Fallen Obliterator',
            DANGER: 6,
            SIZE: 80,
            COLOR: 16,
            BODY: {
                ACCELERATION: base.ACCEL * 0.7, 
                FOV: base.FOV * 3,
                SPEED: base.SPEED * 0.3,
                HEALTH: base.HEALTH * 5,
            },
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  16,    12,      1,     12,      0,      0,      0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.op]),
                        TYPE: exports.bullet,
                    }, }, {
                POSITION: [   5,    12,    -0.8,     7,      0,      0,      0,   ], 
                },
            ],
        };

exports.RR0 = {
PARENT: [exports.genericTank],
LABEL: "RR-0",
SIZE: 26.25,
SHAPE: 6,
COLOR: 2,
BODY: {
                ACCELERATION: base.ACCEL * 0.7, 
                FOV: base.FOV * 2,
                SPEED: base.SPEED * 0.8,
                HEALTH: base.HEALTH * 3,
            },
SKILL: skillSet({
        rld: 5,
        dam: 5, 
        pen: 5,
        str: 5,
        spd: 5,
        atk: 5,
        hlt: 5,
        shi: 5,
        rgn: 5,
        mob: 5,        
    }),
GUNS: [
{
POSITION: [33.231,16,1,0,0,0.318,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 10.8, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,16,1,0,0,238.392,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,16,1,0,0,121.994,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.RR1 = {
PARENT: [exports.genericTank],
LABEL: "RR-1",
SIZE: 32,
SHAPE: 6,
COLOR: 2,
BODY: {
                ACCELERATION: base.ACCEL * 0.5, 
                FOV: base.FOV * 2.3,
                SPEED: base.SPEED * 0.5,
                HEALTH: base.HEALTH * 6,
            },
SKILL: skillSet({
        rld: 5,
        dam: 5, 
        pen: 5,
        str: 5,
        spd: 5,
        atk: 5,
        hlt: 5,
        shi: 5,
        rgn: 5,
        mob: 5,        
    }),
GUNS: [
{
POSITION: [33.231,16,1,0,0,0.318,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 10.8, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,16,1,0,0,238.392,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,16,1,0,0,121.994,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,200.455,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,167.713,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,78.173,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,47.738,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,319.966,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
{
POSITION: [27.692,8,1,0,0,283.941,0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([[40, 0, 0.001, 1, 1, 0.75, 1, 9, 1, 3, 1, 0.00001, 1]]),
TYPE: exports.bullet,
COLOR: 16
}, },
], };

exports.miniboss = {
  PARENT: [exports.genericTank],
  TYPE: 'miniboss',
  DANGER: 6,
  SKILL: skillSet({
    rld: 0.7,
    dam: 0.5,
    pen: 0.8,
    str: 0.8,
    spd: 0.2,
    atk: 0.3,
    hlt: 1,
    shi: 0.7,
    rgn: 0.7,
    mob: 0,
  }),
  LEVEL: 45,
  CONTROLLERS: ['nearestDifferentMaster', 'minion', 'canRepel'],
  AI: {
    NO_LEAD: true,
  },
  FACING_TYPE: 'autospin',
  HITS_OWN_TYPE: 'hard',
  BROADCAST_MESSAGE: 'A visitor has left!',
};

exports.zaphkielDroneBody = {
  PARENT: [exports.genericTank],
  LABEL: 'Zaphkiel Drone',
  SHAPE: 7,
  SIZE: 10,
  BODY: {
    FOV: 100
  },
  CONTROLLERS: ['counterslowspin'],
  MAX_CHILDREN: 28,
  GUNS: [],
};
for (let i = 0; i < 7; i++) exports.zaphkielDroneBody.GUNS.push({
  /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
  POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 0, ],
  PROPERTIES: {
    SHOOT_SETTINGS: combineStats([g.drone, [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
    TYPE: [exports.drone, {
      INDEPENDENT: true,
      BODY: {
        FOV: 5
      }
    }],
    AUTOFIRE: true,
    SYNCS_SKILLS: true,
    STAT_CALCULATOR: gunCalcNames.drone,
  },
})

exports.celestialTrapTurret = {
  PARENT: [exports.genericTank],
  LABEL: 'Turret',
  INDEPENDENT: true,
  COLOR: 16,
  GUNS: [{
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [16, 14, 1, 0, 0, 0, 0, ],
  }, {
    POSITION: [4, 14, 1.8, 16, 0, 0, 0, ],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.trap, [4, 1, 1, 1, 2, 1, 0.25, 1, 1, 1, 10, 1, 1]]),
      TYPE: exports.trap,
      STAT_CALCULATOR: gunCalcNames.trap,
      AUTOFIRE: true,
    },
  }, ],
}
let celestialTrapTurretArray = [];
for (let i = 0; i < 9; i++) {
  celestialTrapTurretArray.push({
    POSITION: [6, 9, 0, i * (360 / 9) + ((360 / 9) / 2), 0, 0, ],
    TYPE: [exports.celestialTrapTurret, {
      CONTROLLERS: ['nearestDifferentMaster'],
    }],
  });
};

exports.zaphkielSkimmer = {
  PARENT: [exports.genericTank],
  CONTROLLERS: ['onlyAcceptInArc', 'nearestDifferentMaster'],
  BODY: {
    FOV: base.FOV * 1.15,
  },
  LABEL: 'Skimmer',
  DANGER: 7,
  INDEPENDENT: true,
  GUNS: [{
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [10, 14, -0.5, 9, 0, 0, 0, ],
  }, {
    POSITION: [17, 15, 1, 0, 0, 0, 0, ],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 0.4, 1, 1, 1]]),
      TYPE: exports.hypermissile,
      STAT_CALCULATOR: gunCalcNames.sustained,
    },
  }],
};
exports.zaphkielSkimmerBody = {
  PARENT: [exports.genericTank],
  LABEL: 'Zaphkiel Skimmer',
  SHAPE: 5,
  SIZE: 10,
  CONTROLLERS: ['slowSpin'],
  SKILL: setBuild('5555555555'),
  INDEPENDENT: true,
  TURRETS: [{
    /*  SIZE     X       Y     ANGLE    ARC */
    POSITION: [9, 8, 0, 180, 180, 0, ],
    TYPE: exports.zaphkielSkimmer,
  }, {
    POSITION: [9, 8, 0, 108, 180, 0, ],
    TYPE: exports.zaphkielSkimmer,
  }, {
    POSITION: [9, 8, 0, 35, 180, 0, ],
    TYPE: exports.zaphkielSkimmer,
  }, {
    POSITION: [9, 8, 0, -35, 180, 0, ],
    TYPE: exports.zaphkielSkimmer,
  }, {
    POSITION: [9, 8, 0, -108, 180, 0, ],
    TYPE: exports.zaphkielSkimmer,
  }, ],
};
exports.zaphkiel = {
  PARENT: [exports.miniboss],
  LABEL: 'Celestial',
  NAME: "Zaphkiel",
  COLOR: 2,
  SHAPE: 9,
  SIZE: 40,
  VARIES_IN_SIZE: false,
  VALUE: 1000000,
  BODY: bossStats({
    health: 3,
    speed: 0.5
  }),
  SKILL: setBuild('6929987040'),
  TURRETS: [...celestialTrapTurretArray, {
    POSITION: [15, 0, 0, 0, 360, 1],
    TYPE: [exports.zaphkielDroneBody, {
      COLOR: 2
    }],
  }, {
    POSITION: [9, 0, 0, 0, 360, 1],
    TYPE: [exports.zaphkielSkimmerBody, {
      COLOR: 2
    }],
  }],
};


exports.autocelestial = {
  PARENT: [exports.genericTank],
  LABEL: 'CelestialTurret :madman:',
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [{
    /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
    POSITION: [18, 8, 1, 0, 0, 0, 0, ],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.basic]),
      TYPE: exports.bullet,
      LABEL: '', // def
      STAT_CALCULATOR: 0, // def
      WAIT_TO_CYCLE: false, // def
      AUTOFIRE: false, // def
      SYNCS_SKILLS: false, // def
      MAX_CHILDREN: 0, // def
      ALT_FIRE: false, // def
      NEGATIVE_RECOIL: false, // def
    },
  }, ],
  TURRETS: [{
    /* SIZE X Y ANGLE ARC */
    POSITION: [120, 70, 0, 180, 190, 0],
    TYPE: exports.zaphkiel,
  }, ],
};
            
  
            





// UPGRADE PATHS
exports.testbed.UPGRADES_TIER_1 = [
    exports.autocruiser, 
    exports.master, 
    exports.dual, 
    exports.hiveshooter, 
    exports.brutalizer,
    exports.shotgun2,
    exports.hybridmini
];

exports.basic.UPGRADES_TIER_1 = [exports.twin, exports.sniper, exports.machine, exports.flank, exports.director, exports.terminal, exports.alien];
        exports.basic.UPGRADES_TIER_3 = [exports.single, exports.sus];

    exports.basic.UPGRADES_TIER_2 = [exports.smash, exports.basic2, exports.playable, exports.metal, exports.pseudometal];
exports.basic2.UPGRADES_TIER_3 = [exports.twin2, exports.trollge, exports.trollgeII, exports.trollgeIII, exports.trollgeIV, exports.trollgeV, exports.trollgeVI, exports.engitroll, exports.trollgeVII, exports.trollgeVIII, exports.trollgeIX, exports.trollgeX];
exports.playable.UPGRADES_TIER_3 = [exports.warship, exports.fallenpentagon, exports.untimating, exports.urmom, exports.obliterator, exports.RR0, exports.RR1, exports.autocelestial];
        exports.smash.UPGRADES_TIER_3 = [exports.megasmash, exports.spike, exports.autosmash, exports.protective];

    exports.twin.UPGRADES_TIER_2 = [exports.double, exports.bent, exports.gunner, exports.hexa];
        exports.twin.UPGRADES_TIER_3 = [exports.triple];
        exports.double.UPGRADES_TIER_3 = [exports.tripletwin, exports.split, exports.autodouble, exports.bentdouble];
        exports.bent.UPGRADES_TIER_3 = [exports.penta, exports.spread, exports.benthybrid, exports.bentdouble, exports.triple];
        exports.gunner.UPGRADES_TIER_3 = [exports.autogunner, exports.nailgun, exports.auto4,exports.machinegunner];

    exports.sniper.UPGRADES_TIER_2 = [exports.assassin, exports.hunter, exports.mini, exports.builder, exports.scout];
        exports.sniper.UPGRADES_TIER_3 = [exports.bushwhack];
        exports.assassin.UPGRADES_TIER_3 = [exports.ranger, exports.falcon];
        exports.hunter.UPGRADES_TIER_3 = [exports.preda, exports.poach, exports.sidewind];
        exports.builder.UPGRADES_TIER_3 = [exports.construct, exports.autobuilder, exports.engineer, exports.boomer, exports.shockwave, exports.ultralongys, exports.longyshunter, exports.machlongys, exports.bigboope, exports.twinboop];

    exports.machine.UPGRADES_TIER_2 = [exports.destroy, exports.artillery, exports.mini, exports.gunner];
        exports.machine.UPGRADES_TIER_3 = [exports.spray];
        exports.destroy.UPGRADES_TIER_3 = [exports.anni, exports.hybrid, exports.construct, exports.shotgun2];
        exports.artillery.UPGRADES_TIER_3 = [exports.mortar, exports.spread, exports.skimmer];
        exports.mini.UPGRADES_TIER_3 = [exports.stream, exports.nailgun];

    exports.flank.UPGRADES_TIER_2 = [exports.hexa, exports.tri, exports.auto3, exports.flanktrap];
        exports.flank.UPGRADES_TIER_3 = [];
        exports.tri.UPGRADES_TIER_3 = [exports.fighter, exports.booster, exports.falcon, exports.bomber, exports.autotri, exports.greasemetal];
        exports.hexa.UPGRADES_TIER_3 = [exports.octo, exports.hexatrap];
        exports.auto3.UPGRADES_TIER_3 = [exports.auto5, exports.heavy3, exports.auto4];
        exports.flanktrap.UPGRADES_TIER_3 = [exports.bushwhack, exports.guntrap, exports.fortress, exports.bomber];

    exports.director.UPGRADES_TIER_2 = [exports.overseer, exports.cruiser, exports.underseer];
        exports.director.UPGRADES_TIER_3 = [exports.factory];
        exports.overseer.UPGRADES_TIER_3 = [exports.overlord, exports.overtrap, exports.overgunner];  
        exports.underseer.UPGRADES_TIER_3 = [exports.necromancer];
        exports.cruiser.UPGRADES_TIER_3 = [exports.carrier, exports.battleship, exports.fortress];

exports.terminal.UPGRADES_TIER_2 = [exports.terminalII]
exports.terminalII.UPGRADES_TIER_3 = [exports.terminalIII, exports.ballmaker, exports.virus]

exports.alien.UPGRADES_TIER_2 = [exports.alienterminal, exports.darkness]

exports.metal.UPGRADES_TIER_3 = [exports.bismuth, exports.protective, exports.greasemetal, exports.ultragrease]


    /*exports.smash.UPGRADES_TIER_3 = [exports.megasmash, exports.spike, exports.autosmash];
            
    exports.twin.UPGRADES_TIER_2 = [exports.double, exports.bent, exports.triple, exports.hexa];
        exports.double.UPGRADES_TIER_3 = [exports.tripletwin, exports.autodouble];
        exports.bent.UPGRADES_TIER_3 = [exports.penta, exports.benthybrid];
        exports.triple.UPGRADES_TIER_3 = [exports.quint];

    exports.sniper.UPGRADES_TIER_2 = [exports.assassin, exports.overseer, exports.hunter, exports.builder];
        exports.assassin.UPGRADES_TIER_3 = [exports.ranger];
        exports.overseer.UPGRADES_TIER_3 = [exports.overlord, exports.battleship
            , exports.overtrap, exports.necromancer, exports.factory, exports.fortress];
        exports.hunter.UPGRADES_TIER_3 = [exports.preda, exports.poach];
        exports.builder.UPGRADES_TIER_3 = [exports.construct, exports.autobuilder];
        
    exports.machine.UPGRADES_TIER_2 = [exports.destroy, exports.gunner, exports.artillery];
        exports.destroy.UPGRADES_TIER_3 = [exports.anni, exports.hybrid];
        exports.gunner.UPGRADES_TIER_3 = [exports.autogunner, exports.mortar, exports.stream];
        exports.artillery.UPGRADES_TIER_3 = [exports.mortar, exports.spread, exports.skimmer];
        exports.machine.UPGRADES_TIER_3 = [exports.spray];

    exports.flank.UPGRADES_TIER_2 = [exports.hexa, exports.tri, exports.auto3, exports.flanktrap];
        exports.hexa.UPGRADES_TIER_3 = [exports.octo];
        exports.tri.UPGRADES_TIER_3 = [exports.booster, exports.fighter, exports.bomber, exports.autotri];
        exports.auto3.UPGRADES_TIER_3 = [exports.auto5, exports.heavy3];
        exports.flanktrap.UPGRADES_TIER_3 = [exports.guntrap, exports.fortress, exports.bomber];*/

// NPCS:
exports.crasher = {
    TYPE: 'crasher',
    LABEL: 'Crasher',
    COLOR: 5,
    SHAPE: 3,
    SIZE: 5,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    AI: { NO_LEAD: true, },
    BODY: {
        SPEED: 5,
        ACCEL: 0.01,
        HEALTH: 0.5,
        DAMAGE: 5,
        PENETRATION: 2,
        PUSHABILITY: 0.5,
        DENSITY: 10,
        RESIST: 2,
    },
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'smoothWithMotion',
    HITS_OWN_TYPE: 'hard',
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
};


exports.sentry = {
    PARENT: [exports.genericTank],
    TYPE: 'crasher',
    LABEL: 'Valuable Shape',
    DANGER: 3,
    COLOR: 2,
    SHAPE: 7,
    SIZE: 15,
    SKILL: skillSet({
        rld: 0.5,
        dam: 0.8, 
        pen: 0.8,
        str: 0.1,
        spd: 1,
        atk: 0.5,
        hlt: 0,
        shi: 0,
        rgn: 0.7,
        mob: 0,        
    }),
    VALUE: 150000,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    AI: { NO_LEAD: true, },
    BODY: {
        FOV: 2,
        ACCEL: 0.2,
        DAMAGE: base.DAMAGE * 2,
        SPEED: base.SPEED * 1.5,
    },
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'smoothToTarget',
    HITS_OWN_TYPE: 'hard',
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
exports.trapTurret = {
    PARENT: [exports.genericTank],
    LABEL: 'Turret',
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ['nearestDifferentMaster'], 
    COLOR: 16,
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  16,    14,      1,      0,      0,      0,      0,   ],
            }, {
        POSITION: [   4,    14,     1.8,    16,      0,      0,      0,   ], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.lowpower, g.fast, g.halfreload]),
                TYPE: exports.trap, STAT_CALCULATOR: gunCalcNames.trap,
            }, },
    ],
};
exports.sentrySwarm = {
    PARENT: [exports.sentry],
    DANGER: 3,
    GUNS: [{
        POSITION: [    7,    14,    0.6,     7,     0,    180,     0,  ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.morerecoil]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm,     
        }, },
    ],
};
exports.sentryGun = makeAuto(exports.sentry, 'Treasure', { type: exports.heavy3gun, size: 12, });
exports.sentryTrap = makeAuto(exports.sentry, 'Treasure', { type: exports.trapTurret, size: 12, });

exports.miniboss = {
  PARENT: [exports.genericTank],
  TYPE: 'miniboss',
  DANGER: 6,
  SKILL: skillSet({
    rld: 0.7,
    dam: 0.5,
    pen: 0.8,
    str: 0.8,
    spd: 0.2,
    atk: 0.3,
    hlt: 1,
    shi: 0.7,
    rgn: 0.7,
    mob: 0,
  }),
  LEVEL: 45,
  CONTROLLERS: ['nearestDifferentMaster', 'minion', 'canRepel'],
  AI: {
    NO_LEAD: true,
  },
  FACING_TYPE: 'autospin',
  HITS_OWN_TYPE: 'hard',
  BROADCAST_MESSAGE: 'A visitor has left!',
};
    exports.crasherSpawner = {
        PARENT: [exports.genericTank],
        LABEL: 'Spawned',  
        STAT_NAMES: statnames.drone,
        CONTROLLERS: ['nearestDifferentMaster'], 
        COLOR: 5, 
        INDEPENDENT: true, 
        AI: { chase: true, },
        MAX_CHILDREN: 4,
        GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [   6,     12,    1.2,     8,      0,      0,      0,   ], 
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak]),
                    TYPE: [exports.drone, { LABEL: 'Crasher', VARIES_IN_SIZE: true, DRAW_HEALTH: true }],
                    SYNCS_SKILLS: true,
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }, },
        ],
    };
    exports.elite = {
        PARENT: [exports.miniboss],
        LABEL: 'Elite Crasher',
        COLOR: 5,
        SHAPE: 3,
        SIZE: 20,
        VARIES_IN_SIZE: true,
        VALUE: 150000,
        BODY: {
            FOV: 1.3,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 1.5,
            SHIELD: base.SHIELD * 1.25,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
    };
        exports.elite_destroyer = {
            PARENT: [exports.elite],
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [    5,    16,     1,      6,      0,     180,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
                        TYPE: exports.bullet,
                        LABEL: 'Devastator',
                    }, }, {
                POSITION: [    5,    16,     1,      6,      0,      60,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
                        TYPE: exports.bullet,
                        LABEL: 'Devastator',
                    }, }, {
                POSITION: [    5,    16,     1,      6,      0,     -60,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
                        TYPE: exports.bullet,
                        LABEL: 'Devastator',
                    }, },
            ],
            TURRETS: [{
                /*********  SIZE     X       Y     ANGLE    ARC */
                POSITION: [  11,     0,      0,     180,    360,   0, ], 
                    TYPE: [exports.crasherSpawner]
                    }, {
                POSITION: [  11,     0,      0,      60,    360,   0, ],  
                    TYPE: [exports.crasherSpawner]
                    }, {
                POSITION: [  11,     0,      0,     -60,    360,   0, ],  
                    TYPE: [exports.crasherSpawner]
                    }, {
                POSITION: [  11,     0,      0,       0,    360,   1, ],  
                    TYPE: [exports.bigauto4gun, { INDEPENDENT: true, COLOR: 5, }]
                    },
            ],
        };
        exports.elite_gunner = {
            PARENT: [exports.elite],
            GUNS: [ { /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [  14,    16,      1,      0,      0,     180,     0,   ],
                    }, {
                POSITION: [   4,    16,     1.5,    14,      0,     180,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                        TYPE: [exports.pillbox, { INDEPENDENT: true, }],
                    }, }, {                
                POSITION: [   6,    14,     -2,      2,      0,      60,     0,   ],
                    }, {                
                POSITION: [   6,    14,     -2,      2,      0,     300,     0,   ],
                    }
            ],
            AI: { NO_LEAD: false, },
            TURRETS: [{
                /*********  SIZE     X       Y     ANGLE    ARC */
                POSITION: [  14,     8,      0,     60,     180,   0, ], 
                    TYPE: [exports.auto4gun],
                    }, {
                POSITION: [  14,     8,      0,     300,    180,   0, ],
                    TYPE: [exports.auto4gun],
            }],
        };
        exports.elite_sprayer = { 
            PARENT: [exports.elite],
            AI: { NO_LEAD: false, },
            TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                POSITION: [  14,     6,      0,     180,     190, 0], 
                    TYPE: [exports.spray, { COLOR: 5, }],
                        }, {
                POSITION: [  14,     6,      0,      60,    190, 0], 
                    TYPE: [exports.spray, { COLOR: 5, }],
                        }, {
                POSITION: [  14,     6,      0,     -60,    190, 0], 
                    TYPE: [exports.spray, { COLOR: 5, }],
                        },
            ],
        };

    exports.palisade = (() => {
        let props = {
            SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
            TYPE: exports.minion,
            STAT_CALCULATOR: gunCalcNames.drone,                        
            AUTOFIRE: true,
            MAX_CHILDREN: 1,
            SYNCS_SKILLS: true,   
            WAIT_TO_CYCLE: true,
        };
        return {
            PARENT: [exports.miniboss],
            LABEL: 'Rogue Palisade',
            COLOR: 17,
            SHAPE: 6,
            SIZE: 28,
            VALUE: 500000,
            BODY: {
                FOV: 1.3,
                SPEED: base.SPEED * 0.1,
                HEALTH: base.HEALTH * 2,
                SHIELD: base.SHIELD * 2,
                REGEN: base.REGEN,
                DAMAGE: base.DAMAGE * 3,
            },
            GUNS: [ { /**** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [   4,      6,    -1.6,     8,      0,      0,      0,   ], 
                    PROPERTIES: props, }, {
                POSITION: [   4,      6,    -1.6,     8,      0,     60,      0,   ], 
                    PROPERTIES: props, }, {
                POSITION: [   4,      6,    -1.6,     8,      0,     120,     0,   ], 
                    PROPERTIES: props, }, {
                POSITION: [   4,      6,    -1.6,     8,      0,     180,     0,   ], 
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.factory, g.pound]),
                        TYPE: exports.minion,
                        STAT_CALCULATOR: gunCalcNames.drone,                        
                        AUTOFIRE: true,
                        MAX_CHILDREN: 1,
                        SYNCS_SKILLS: true, 
                        WAIT_TO_CYCLE: true,  
                    }, }, {
                POSITION: [   4,      6,    -1.6,     8,      0,     240,     0,   ], 
                    PROPERTIES: props, }, {
                POSITION: [   4,      6,    -1.6,     8,      0,     300,     0,   ], 
                    PROPERTIES: props, },
            ],
            TURRETS: [{ /*  SIZE     X       Y     ANGLE    ARC */
                POSITION: [   5,    10,      0,      30,    110, 0], 
                    TYPE: exports.trapTurret,
                        }, {
                POSITION: [   5,    10,      0,      90,    110, 0], 
                    TYPE: exports.trapTurret,
                        }, {
                POSITION: [   5,    10,      0,     150,    110, 0], 
                    TYPE: exports.trapTurret,
                        }, {
                POSITION: [   5,    10,      0,     210,    110, 0], 
                    TYPE: exports.trapTurret,
                        }, {
                POSITION: [   5,    10,      0,     270,    110, 0], 
                    TYPE: exports.trapTurret,
                        }, {
                POSITION: [   5,    10,      0,     330,    110, 0], 
                    TYPE: exports.trapTurret,
                        },
            ],
        };
    })();



exports.bot = {
    AUTO_UPGRADE: 'random',
    FACING_TYPE: 'looseToTarget',
    BODY: {
        SIZE: 10,
    },
    //COLOR: 17,
    NAME: "ai_",
    CONTROLLERS: [
        'nearestDifferentMaster', 'mapAltToFire', 'minion', 'fleeAtLowHealth'
    ],
    AI: { STRAFE: true, },
};

exports.testbed.UPGRADES_TIER_1.push(exports.elite_sprayer);
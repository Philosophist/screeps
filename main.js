var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

if(Game.time < 500) {
	Memory.tarHarvesters = 3;
	Memory.tarBuilders = 3;
	Memory.tarUpgraders = 3;
}

module.exports.loop = function () {

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    Memory.Harvesters = harvesters.length;
    console.log('Harvesters: ' + harvesters.length);
    console.log('Harvester target: ' + Memory.tarHarvesters);
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    Memory.Upgraders = upgraders.length;
    console.log('Upgraders: ' + upgraders.length);
    console.log('Upgrader target: ' + Memory.tarUpgraders);
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    Memory.Builders = builders.length;
    console.log('Builders: ' + builders.length);
    console.log('Builder target: ' + Memory.tarBuilders);

    if(!Game.spawns['Spawn1'].spawning && Game.spawns.Spawn1.energy > 299) {
        if(harvesters.length < Memory.tarHarvesters) {
            var newName = 'Worker' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'harvester', working: false, running: false}});
        }
        else if(upgraders.length < Memory.tarUpgraders) {
            var newName = 'Worker' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'upgrader', working: false, running: false}});
        }
        else if(builders.length < Memory.tarBuilders) {    
            var newName = 'Worker' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'builder', working: false, running: false}}); 
        }
    }
    else if(Game.spawns['Spawn1'].spawning){
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.running == false) {
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
	console.log('\n');
}
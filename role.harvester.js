var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.running = true;
        var storageRemaining = creep.store.getFreeCapacity();
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    Memory.tarHarvesters -= 1;
                    creep.memory.role = 'builder';
                    Memory.tarBuilders += 1;
                    creep.memory.running = false;
                    return;
                }
                else {
                    Memory.tarHarvesters -= 1;
                    creep.memory.role = 'upgrader';
                    Memory.tarUpgraders += 1;
                    creep.memory.running = false;
                    return;
                }
            }
        }
        if(storageRemaining == 0) {
            creep.memory.working = true;
        }
        if(!creep.memory.working) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        creep.memory.running = false;
    }
};

module.exports = roleHarvester;
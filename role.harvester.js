var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.running = true;
        var storageRemaining = creep.store.getFreeCapacity();
        if(creep.memory.working) {
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working == false;
            }
            else {
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
                        Memory.numHarvesters -= 1;
                        creep.memory.role = 'builder';
                        Memory.numBuilders += 1;
                        return;
                    }
                    else {
                        Memory.numHarvesters -= 1;
                        creep.memory.role = 'upgrader';
                        Memory.numUpgraders += 1;
                        return;
                    }
                }
            }
        }
        else {
            if(storageRemaining == 0) {
                creep.memory.working == true;
            }
            else{
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        creep.memory.running = false;
    }
};

module.exports = roleHarvester;
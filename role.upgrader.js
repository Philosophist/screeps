var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.running = true;
        var storageRemaining = creep.store.getFreeCapacity();

		if(Memory.Upgraders > 1) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
				Memory.tarUpgraders -= 1;
				creep.memory.role = 'harvester';
				Memory.tarHarvesters += 1;                
                creep.memory.running = false;
				return;
            }
			else {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(targets.length > 0) {
					Memory.tarUpgraders -= 1;
					creep.memory.role = 'builder';
					Memory.tarBuilders += 1;
                    creep.memory.running = false;
                    return;
				}
			}
		}

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && storageRemaining == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        creep.memory.running = false;
    }
};

module.exports = roleUpgrader;
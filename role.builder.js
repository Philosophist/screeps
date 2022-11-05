var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.running = true;
		var storageRemaining = creep.store.getFreeCapacity()

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else {
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				if(targets.length > 0) {
					Memory.numBuilders -= 1;
					creep.memory.role = 'harvester';
					Memory.numHarvesters += 1;
                    creep.memory.running = false;
					return;
				}
				else {
					Memory.numBuilders -= 1;
					creep.memory.role = 'upgrader';
					Memory.numUpgraders += 1;
                    creep.memory.running = false;
					return;
				}
			}
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        creep.memory.running = false;
    }
};

module.exports = roleBuilder;
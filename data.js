var Data = function() {
	this.nextTaskId = nextTaskId;
	this.kids = kids;
	this.tasks = tasks;
	
	//Saves all data to disk
	this.save = function {
		//TODO: save everything to file
	};
	
	//Returns a task by its id number or null if not found
	this.getTask = function(id) {
		var i = getTaskIndex(id);
		return (i > -1) ? tasks[i] : null;
	};
	
	//Returns the index of task with given id in tasks array, or -1 if not found
	this.getTaskIndex = new function(id) {
		for (var i = 0; i < tasks.length ; i++) {
			if (tasks[i].id == i) {
				i;
			}
		}
		return -1;
	}
	
	this.getAllTasks = function() {
		return tasks;
	};
	
	
	//TODO: decide how to do this and implement it. Remember to save afterwards
	//this.updateTask(id, 
	
	this.deleteTask(id) {
		//TODO: implement
	}
	
	this.createNewTask = function(name, date, repeat, assigned, reward, reminders, details) {
		var newTask = { "id":nextTaskId, 
						"name":name, 
						"day":date.getDate(), 
						"month":date.getMonth(), 
						"year":date.getFullYear(), 
						"repeat":repeat, 
						"assigned":assigned, 
						"reward":reward, 
						"reminders": reminders, 
						"details":details, 
						"done":false};
		
		nextTaskId++;
		tasks.append(newTask);
		
		save();
		
		return newTask;
	};
}

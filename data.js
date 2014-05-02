var Data = function(callback) {		
	
	var nextTaskId = null;
	var kids = null;
	var tasks = null;
	
	//Asynchronously loads the data file and calls "callback" when done
	$.getScript('http://nanu.mit.edu/pythonApp/privateData.js', function(){
		nextTaskId = privateData.nextTaskId;
		kids = privateData.kids;
		tasks = privateData.tasks;

		for (var i = 0; i < tasks.length ; i++) {			
			nextTaskId = Math.max(nextTaskId, tasks[i].id + 1);
		}
		
		tasks.sort(function(a, b) {
			a = new Date(new Date(a.year, a.month, a.day));
			b = new Date(new Date(b.year, b.month, b.day));
			return a > b ? 1 : a < b ? -1 : 0;
		});
	
		if (callback) {
			callback();
		}
	});
	
	//Asynchronously saves all data to disk and calls "callback" when done
	this.saveTask = function(task, callback) {	
		var encoded = $.toJSON(task);

		$.getJSON('http://nanu.mit.edu/pythonApp/save.py?data=' + encoded)
		
		.always(function() {
			if (callback) {
				callback();
			}
		});			
	}

	//Returns nextTaskId
	this.getNextTaskId = function() {
		return nextTaskId;
	}
	
	//Returns a task by its id number or null if not found
	this.getTask = function(id) {
		var i = this.getTaskIndex(id);
		return (i > -1) ? tasks[i] : null;
	}
	
	//Returns the index of task with given id in tasks array, or -1 if not found
	this.getTaskIndex = function(id) {
		for (var i = 0; i < tasks.length; i++) {			
			if (tasks[i].id == id) {
				return i;
			}
		}
		return -1;
	}
	
	//Returns all tasks
	this.getAllTasks = function() {		
		return tasks;
	}
	
	this.getAllTasksSimple = function() {
		var simpleTasks = new Array();
		for (var i = 0; i < tasks.length ; i++) {		
			var date = new Date(tasks[i].year, tasks[i].month, tasks[i].day);
			var simpleTask = {text: tasks[i].assigned + ': ' + tasks[i].name, start_date: date, end_date: date};
			simpleTasks.push(simpleTask);
		}
		
		return simpleTasks;
	}
	
	//Updates a task given its id and saves afterwards. Returns the task if it was found, otherwise null. Calls "callback" when done saving
	this.updateTask = function(id, name, date, repeat, assigned, reward, reminders, details, callback) {
		task = this.getTask(id);
		
		if (task != null) {
			task.name = name; 
			task.day = date.getDate(); 
			task.month = date.getMonth(); 
			task.year = date.getFullYear(); 
			task.repeat = repeat; 
			task.assigned = assigned; 
			task.reward = reward; 
			task.reminders =  reminders; 
			task.details = details; 
			task.done = false
		}
		
		this.saveTask(task, callback);		
		return task;
	}
	
	//Deletes a task based on its id and saves afterwards. Returns deleted task if successful, otherwise null. Calls "callback" when done saving
	this.deleteTask = function(id, callback) {
		index = this.getTaskIndex(id);		
		var task = (index > -1) ? tasks.splice(index, 1) : null;
		
		$.getJSON('http://nanu.mit.edu/pythonApp/save.py?data=delete' + id)
		
		.always(function() {
			if (callback) {
				callback();
			}
		});	
		
		return task;
	}
	
	//Creates a new task and saves afterwards. Returns the created task. Calls "callback" when done saving
	this.createTask = function(name, date, repeat, assigned, reward, reminders, details, callback) {
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
		tasks.push(newTask);
		
		this.saveTask(newTask, callback);		
		return newTask;
	}
	
	//Marks a task as done given its id and saves afterwards. Returns the task if it was found, otherwise null. Calls "callback" when done saving
	this.markDone = function(id, callback) {
		task = this.getTask(id);
		
		if (task != null) {
			task.done = true;
			this.saveTask(task, callback);
		}
					
		return task;
	}
	
	//Marks a task as not done given its id and saves afterwards. Returns the task if it was found, otherwise null. Calls "callback" when done saving
	this.markNotDone = function(id, callback) {
		task = this.getTask(id);
		
		if (task != null) {
			task.done = false;
			this.saveTask(task, callback);
		}
				
		return task;
	}
	
	//Changes who the task is assigned to given its id and saves afterwards. Returns the task if it was found, otherwise null. Calls "callback" when done saving
	this.changeAssignment = function(id, assigned, callback) {
		task = this.getTask(id);
		
		if (task != null) {
			task.assigned = assigned;
			this.saveTask(task, callback);
		}
					
		return task;
	}
	
	this.getKids = function() {
		return kids;
	}
}
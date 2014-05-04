#!/usr/bin/python

from filelock import FileLock

with FileLock("privateData.js"):
    import cgi
    fs = cgi.FieldStorage()

    maxInt = 0

    d = {}

    #read all current task data
    file = open("privateData.js", "r")
    text = file.read()
    index = text.index('"tasks":')
    taskText = text[index+9:]
    tasks = taskText.split('}')

    #used to handle repeats
    prev = None

    for x in tasks:
        #ignores short non-task strings (from the end mostly)
        if len(x) > 5:
            #remove leading comma for those that have it
            if x[0] == ',':
                x = x[1:]
            #append } to end to make it a valid JS object
            x += '}'

            #find task id    
            try:
                start = x.index('"id":') + 5
            except:
                #handles repeats
                d[prev] += "," + x
                continue
            end = x.index(',', start)
            taskId = int(x[start:end])
            
            d[taskId] = x

            #for nextTaskId
            maxInt = max(maxInt, taskId + 1)

            #used to handle repeats
            prev = taskId

    file.close()

    file = open("privateData.js", "w+")

    print "Content-type: text/plain\n"
    for key in fs.keys():
        arg = fs[key].value
        if (arg[0:6] == 'delete'):
            #delete
            deleteId = int(arg[6:])
            d.pop(deleteId, None)
        else:
            #create/update
            start = arg.index('"id":') + 5
            end = arg.index(',', start)
            taskId = int(arg[start:end])
            d[taskId] = arg
            maxInt = max(maxInt, taskId + 1)


    file.write('var privateData = {"nextTaskId":')
    file.write(str(maxInt))
    file.write(',"kids":["Molly","North","Andrew"],"tasks":[')


    keys = d.keys()    
    for i in range(len(keys)):

        #separating comma for all but the first element
        if (i > 0):
            file.write(', ')

        file.write(d[keys[i]].strip())

    file.write(']};')
    file.write('\n')

    file.close()

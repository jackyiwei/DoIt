#!/usr/bin/python

import cgi
fs = cgi.FieldStorage()
    
file = open("privateData.js", "w+")

print "Content-type: text/plain\n"
for key in fs.keys():
    file.write("%s;" % (fs[key].value))
    file.write("\n")

file.close()

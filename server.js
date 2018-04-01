'use strict';

const express = require('express');
const app = express();
const ical = require('ical');
const fs = require('fs')
var calendar = ical.parseFile('./ics/calendar.ics');
var calendarController = require('./calendarcontroller/calendar')
//console.log(calendar);

app.get('/api/calendar/subscribe', (req, res) => {
    const getData = new Promise(function(resolve,reject){
      calendarController.createIcs()
      fs.watch(`${process.cwd()}/ics/calendar.ics`,(curr,prev) => {
        if(curr){
          resolve("success")
        }
      })


    })
    .then((value)=>{
      if(value == "success"){

        res.sendFile(`${process.cwd()}/ics/calendar.ics` );
        console.log("yay");
      }
    })



});

const port = 3456;
app.listen(port);
console.log(`Application started at ${port}`);

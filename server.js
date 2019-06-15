'use strict';

const express = require('express');
const app = express();
const ical = require('ical');
const fs = require('fs')
var calendar = ical.parseFile('./ics/calendar.ics');
var calendarController = require('./calendarcontroller/calendar')
//console.log(calendar);

app.get('/api/calendar/subscribe/:categories?', (req, res) => {
    const getData = new Promise(function(resolve,reject){
      calendarController.createIcs(req.param.categories)
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

const port = process.env.PORT || 3456;
app.listen(port);
app.use(express.static('./Public'))
console.log(`Application started at ${port}`);

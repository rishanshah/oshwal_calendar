

exports.createIcs = function(){
  const cheerio = require('cheerio');
  const rp = require('request-promise');
  const { writeFileSync } = require('fs');
  const ics = require('ics');
  const convertTime = require('convert-time');
  const fs = require('fs')
  const options = {

    uri:"https://www.oshwal.org.uk/calendar/action~month/cat_ids~89,39,75,20,109,17,71/request_format~json/",
    transform: function(body){
      return cheerio.load(body, {ignoreWhitespace: true});
    }

  };

  function amPm(time){
    var timeArr = convertTime(time).split(':');
    return timeArr
  }



  rp(options)
    .then(($) => {
      var eventsArr = [];
      $('.ai1ec-day').each(function(i,elem){
        // console.log('-----------');
        // console.log($(this).find('.ai1ec-date a').attr('href').split('/')[5].replace('exact_date~','').split('-'));
        // console.log($(this).find('.ai1ec-event-title').text().trim());
        // console.log($(this).find('.ai1ec-event-time').text().split('@')[1]);
        var dateArr = $(this).find('.ai1ec-date a').attr('href').split('/')[5].replace('exact_date~','').split('-')
        var timeOfEvent = $(this).find('.ai1ec-event-time').text().split('@')[1]

        if(timeOfEvent != undefined){
          timeOfEvent = timeOfEvent.trim().split(' ')
          var startTime = timeOfEvent[0]+ timeOfEvent[1]
          var endTime =  timeOfEvent[3]+ timeOfEvent[4]
          //console.log(amPm(startTime)[0],amPm(endTime));

          eventsArr.push({
            title: $(this).find('.ai1ec-event-title').text().trim(),
            start: [dateArr[2],dateArr[1],dateArr[0],amPm(startTime)[0],amPm(startTime)[1]],
            end: [dateArr[2],dateArr[1],dateArr[0],amPm(endTime)[0],amPm(endTime)[1]]
            })

        }

      })

      ics.createEvents(eventsArr, (error,value) => {
        if(error){
          console.log(error);
        }
        //console.log(process.cwd());
        fs.writeFileSync(`${process.cwd()}/ics/calendar.ics`, value)

      })




    })

    .catch((err) => {
      console.log(err);

    });
}

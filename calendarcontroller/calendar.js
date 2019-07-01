

var createIcs = function(categories){
  const cheerio = require('cheerio');
  const rp = require('request-promise');
  const { writeFileSync } = require('fs');
  const ics = require('ics');
  const convertTime = require('convert-time');
  const fs = require('fs')
  console.log(categories);
  var options = {

    uri:"https://www.oshwal.org.uk/calendar/action~month/cat_ids~"+categories+"/request_format~json/",
    transform: function(body){
      return cheerio.load(body, {ignoreWhitespace: true});
    }

  };
  console.log(options.uri);
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
        //console.log($(this).find('.ai1ec-event-time').text().split('@')[1]);
        //console.log($(this).find('.ai1ec-popover .ai1ec-popup-excerpt').text());
        var dateArr = $(this).find('.ai1ec-date a').attr('href').split('/')[5].replace('exact_date~','').split('-')
        $(this).find('.ai1ec-popover ').each(function(i,elem){
          var timeOfEvent = $(this).find('.ai1ec-event-time').text().split('@')[1]
          var descriptionstr = $(this).find('.ai1ec-popup-excerpt').text()


          if(timeOfEvent != undefined){
            timeOfEvent = timeOfEvent.trim().split(' ')
            //console.log(timeOfEvent[4].substring(0,2))
            var startTime = timeOfEvent[0]+ timeOfEvent[1]
            var endTime =  timeOfEvent[3]+ timeOfEvent[4].substring(0,2)
            //console.log(amPm(startTime)[0],amPm(endTime));

            eventsArr.push({
              productId: 'Oshwal',
              startType: '00:00',
              title: $(this).find('.ai1ec-popup-title').text().trim(),
              start: [dateArr[2],dateArr[1],dateArr[0],parseInt(amPm(startTime)[0]),parseInt(amPm(startTime)[1])],
              end: [dateArr[2],dateArr[1],dateArr[0],parseInt(amPm(endTime)[0]),parseInt(amPm(endTime)[1])],
              description: descriptionstr
              })

          }

      });

      })
      //console.log(eventsArr);

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

module.exports.createIcs = createIcs

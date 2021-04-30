

var createIcs = function(categories){
  const cheerio = require('cheerio');
  const rp = require('request-promise');
  const { writeFileSync } = require('fs');
  const ics = require('ics');
  const convertTime = require('convert-time');
  const dateparse = require('date-and-time')
  const fs = require('fs');
  console.log(categories);
  var options = {

    uri:"https://www.astrosage.com/"+categories+"/jain-calendar-"+categories+"-dates.asp",
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
      $('tr').each(function(i,elem){
        // console.log('-----------');
        var event = $(this).find('td').text().split('\n')
        if(event[1]!='Festival '){
          const pattern = dateparse.compile('MMMMD,YYYY');
          // console.log(event)
          // console.log(dateparse.parse(event[3].replace(/\s+/g,''), pattern))
          var date = dateparse.parse(event[3].replace(/\s+/g,''), pattern)
          // console.log(date.getFullYear())
          // console.log(date.getMonth())
          // console.log(date.getDate())
          // console.log(event[3].replace(/\s+/g,''))
          // console.log(date)
          eventsArr.push({
            productId: 'Oshwal',
            startType: 'utc',
            title: event[1],
            start: [date.getFullYear(),date.getMonth()+1,date.getDate()],
            description: ''
            })

        }



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

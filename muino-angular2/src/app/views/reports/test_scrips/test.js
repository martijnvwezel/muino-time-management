'use strict';

const fs = require('fs');

// const testFolder = './';
// fs.readdir(testFolder, (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// });

// let rawdata = fs.readFileSync("c:/git/muino-angular/src/app/views/reports/test_scrips/data.json");
let rawdata = fs.readFileSync("data.json");


let project = JSON.parse(rawdata).user_assigned_project;

let conveted_weeks = convert_to_weeks(project, "2019");
/*

excel file met alle week nummers 
zip file voor iedere week iedere gebruiker in het 

*/

let filename = "data_out.csv";
convert_to_excel(conveted_weeks, filename);



/*
[
weekno: {
    groupid:{
        project, Task, mo,tu,we,tu,fr,sa,su,comment
    },
    groupid:{
        project, Task, mo,tu,we,tu,fr,sa,su,comment
    }
 }
]
*/



/**
 * @brief  Convert input data to week data
 * @param input_date the data from dataset that needs to be convert
 * @param year to book of exel
 * @retval array with for each week a 
 */
function convert_to_weeks(inputData, year){
    // console.log(inputData);
    // untested when multiple events in same groupweerk
    let year_overview = {};
    
    // * array with weeknumbers
    for (let i = 1; i < 54; ++i) {
        year_overview[i]= {};
    }
    const weekdays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

    const get_week_day = (time_start) => weekdays[(!(new Date(time_start).getDay()) ? (6) : (new Date(time_start).getDay() - 1))];

    inputData.map(elem=>{
        let project_name = elem.project_name;

        elem.sub_tasks.map(elemtask=>{
            let task_name = elemtask.task_name;
;
            elemtask.clock_out_events.map(elemeven=>{
                // console.log(elemeven.groupid, year_overview[elemeven.week]);
                // if(elemeven.week> 52){
                //     elemeven.week = elemeven.week-52;
                // }
                // console.log(year_overview[elemeven.week]);
                
                if(elemeven.groupid in year_overview[elemeven.week]){
                    // * add to object                    
                    year_overview[elemeven.week][elemeven.groupid][get_week_day(elemeven.time_stop)] = String(elemeven.hour) + ":"+String(elemeven.minut);
                }else{
                    // * make object
                    year_overview[elemeven.week][elemeven.groupid]={
                        project_name, 
                        task_name, 
                        mo: '0:0', tu: '0:0', we: '0:0', th: '0:0', fr: '0:0', sa: '0:0', su: '0:0',
                        comment: ''
                    };
                  
                    // * set hour and minuts on correct day
                    year_overview[elemeven.week][elemeven.groupid][get_week_day(elemeven.time_stop)] = String(elemeven.hour) + ":"+String(elemeven.minut);
                    year_overview[elemeven.week][elemeven.groupid].comment = elemeven.comment?elemeven.comment: " ";
                }
            });
            
        });
        
    });

    // console.log(year_overview);
    return year_overview;
}


/*

 '52': {
    'eb933655-d1b8-4531-a4c3-b276c5ba673e': {
      project_name: 'Muino',
      task_name: 'coding',
      mo: '4:0',
      tu: '5:0',
      we: '6:0',
      th: '7:0',
      fr: '1:0',
      sa: '2:0',
      su: '2:0',
      comment: 'bieeem'
    }
  }

*/


/**
 * @brief  Convert to plain csv file
 * @param inputData The data
 * @param filename filename to save 
 * @retval file saved with the filename 
 */
function convert_to_excel(inputData, filename){
    let excelFile = [];
    
    excelFile.push("years,2019,,,,,,,\r\n");
    excelFile.push("user,martijn,,,,,\r\n");
   
    for (let i = 1; i < 53; ++i) {
        // console.log(inputData);
        excelFile.push(",,,,,,,,");
        excelFile.push(",,,,,,,,");
        excelFile.push("week,"+String(i)+",,,,,,,,");
        excelFile.push("Project, Task, mo, tu, we, th, fr, sa, su,comment");

        Object.keys(inputData[i]).forEach(key=> {
            let elem = inputData[i][key];
            
            excelFile.push(elem.project_name+','+ elem.task_name+','+ elem.mo+','+ elem.tu+','+ elem.we+','+ elem.th+','+ elem.fr+','+ elem.sa+','+ elem.su+','+elem.comment);            
        });

    }

    excelFile=excelFile.join('\r\n'); // connect each elem to a enter
    fs.writeFileSync(filename,excelFile);
}























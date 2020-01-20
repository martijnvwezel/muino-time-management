let decoded = "0x";

let bytes_String =Buffer.from("3q2+7w==", 'base64').toString();//  Window.atob("3q2+7w==");
var len = bytes_String.length;
var bytes = new Uint8Array( len );
for (var i = 0; i < len; i++)        {
  bytes[i] = bytes_String.charCodeAt(i);
}
decoded += (bytes[0] << 8) | bytes[1];
decoded += (bytes[2] << 8) | bytes[3];
decoded += (bytes[4] << 8) | bytes[5];
decoded += (bytes[6] << 8) | bytes[7];



console.log( decoded ) ;














// {
//     "type": "node",
//     "request": "launch",
//     "name": "Launch Wezel",
//     "program": "${workspaceFolder}\\martijn_test.js"
// }
// ]



// interface weekrow {
//   mo: number;
//   tu: number;
//   we: number;
//   th: number;
//   fr: number;
//   sa: number;
//   su: number;
//   total: number;
//   comment: string;
//   project: string[];
//   task: string[];
//   projectSel: string;
//   taskSel: string;
//   task_id: string;
//   time_start: number;
//   time_stop: number;
//   _id: string;
// };


const weekdays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

var weekData = [{
  comment: "biertje",
  task_id: "5c5c4a7d2815a8047e1addfb",
  time_start: "2019-06-30T22:00:00.000Z",
  time_stop: "2019-07-01T00:00:00.000Z",
  user_id: "5c167160f2ea4c02a7bd8341",
  _id: "5d1b322123c1211a76810c61",
  groupid: "0472b941-1d3c-44e1-ab25-561d6d32a84d" // uuid4 margotje
},
{
  comment: "biertje",
  task_id: "5c5c4a7d2815a8047e1addfb",
  time_start: "2019-07-01T22:00:00.000Z",
  time_stop: "2019-07-01T23:00:00.000Z",
  user_id: "5c167160f2ea4c02a7bd8341",
  _id: "5d1bef0b7ea6066a6a3e81ec",
  groupid: "0472b941-1d3c-44e1-ab25-561d6d32a84d" // uuid4 margotje
}];

const convTimeString = (time_string) => (new Date(time_string).getTime());
const getDay = ({ time_start }) => weekdays[(new Date(time_start).getDay() - 1)]; // -1 for array pos
const getHoures = ({ time_start, time_stop }) => ((convTimeString(time_stop) - convTimeString(time_start)) / 3600000); // make mult

// const hoitje = this.data;
  let temp_week = weekData
  .map(event => ({ ...event, logged: {day: getDay(event), hours: getHoures(event) }}))
  .reduce((sessions, event) => {
    if (event.groupid in sessions) {
      sessions[event.groupid].events.push(event); // * FIX
      sessions[event.groupid][event.logged.day] = event.logged.hours;
    } else {
      sessions[event.groupid] = {
        comment: event.comment ? event.comment : "",
        [event.logged.day]: event.logged.hours,
        events: [event],
      }
    }
    return sessions;
  }, [])



  console.log(temp_week);

for (let idx in temp_week ) {
console.log(  temp_week[idx].comment);


  // ! somehow the next part is needed sometimes... yeah ok
  if (!temp_week[idx].task_id || !taskids[temp_week[idx].task_id].project_name || !taskids[temp_week[idx].task_id].task_name) {
    break;
  }

  temp_week[idx].projectSel = taskids[temp_week[idx].task_id].project_name;
  temp_week[idx].taskSel = taskids[temp_week[idx].task_id].task_name;

}

// console.log( hoitje );
console.log("hallosdfsdf");






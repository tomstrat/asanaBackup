const asana = require("asana");
const fs = require("fs");
const fastcsv = require("fast-csv");
const moment = require("moment");

const ws = fs.createWriteStream(moment().format("DD MM YYYY").toString() + ".csv");

const accessToken = "1/1119999714029704:141f60a8309217a64ea6ae5d9c0f5961";
const teamGid = "1117242934853104"

//Construct an Asana Client
const client = asana.Client.create().useAccessToken(accessToken);

const table = [];

const write = () => {
  console.log("writing");
  fastcsv.write(table, { headers: true }).pipe(ws);
};

const addRow = (project, task, status, completed, assignee) => {
  table.push({ project, task, status, completed, assignee });
};


//Get Projects
const getData = async () => {
  let success;
  client.projects.getProjectsForTeam(teamGid, { opt_pretty: true })
    .then(async projects => {
      for (let project of projects.data) {
        let tasks = await client.tasks.getTasksForProject(project.gid, { opt_expand: "name,completed,completed_at,assignee", opt_pretty: true });
        for (let task of tasks.data) {
          let user = task.assignee ? task.assignee.name : "none";
          addRow(project.name, task.name, task.completed, task.completed_at, user);
          console.log(`row added: ${task.name}`);
        }
      }
      write();
    })
    .catch(err => {
      console.log(err);
      success = false;
    });
};

getData();




  //  client.tasks.getTasksForProject("1136146919665001", { opt_fields: "name,completed,completed_at,assignee", opt_pretty: true })
  //   .then(tasks => {
  //     console.log(tasks.data[0]);
  //     client.users.getUser(tasks.data[0].assignee.gid, { opt_pretty: true })
  //       .then(user => {
  //         console.log(user.name);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

// //Get user info
// client.users.me()
//   .then(me => {
//     console.log(`Hello World! My name is: ${me.name}!`);
//   })
//   .catch(err => {
//     console.log(err);
//   });
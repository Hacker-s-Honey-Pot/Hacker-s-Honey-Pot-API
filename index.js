const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'www')));

client.on('ready', () => {
  console.log(`Bot logged in as: ${client.user.tag}!`);
});


app.post('/', function (req, res) {
var IP = req.header('CF-Connecting-IP');

const embed = new Discord.MessageEmbed()
.setTitle("New report!")
.setDescription("Someone attempted to hack a webiste, but entered a honey pot!")
.setFooter("The ip has been reported to AbuseIPDB")
.setColor("RED")
.addField("IP", "||" + IP + "||")

   fetch(
      `https://api.abuseipdb.com/api/v2/report?categories=15&ip=${IP}&comment=Attempted to hack a webiste, but entered a honey pot!`,
      {
        method: "POST",
        headers: {
          Key: process.env.ABUSEIPDB_KEY,
          Accept: "application/json"
        }
      }
    );

fs.appendFile(__dirname + "ip.txt", `${IP}\n`, function (err) {
  if (err) {
    console.log(err)
  } else {
  }
});

client.channels.cache.get(process.env.REPORTS_ID).send(embed).then(message => message.crosspost());

res.send(`<meta http-equiv="refresh" content="0;URL='/success/'" />`);
});

server.listen(PORT, null, function() {
	console.log('Listening on port ' + PORT);
});

client.login(process.env.TOKEN);
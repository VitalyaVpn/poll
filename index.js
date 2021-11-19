const Agent = require('socks5-https-client/lib/Agent')
var sqlite = require('sqlite-sync'); //requiring

const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const axios = require('axios')



const path = require('path');

const NodeGoogleDrive = require('node-google-drive');

const YOUR_ROOT_FOLDER = '1XcDmhc6pOneuwS4TccddvnxpDhnPXvd-'; 
    PATH_TO_CREDENTIALS = path.resolve('./client_secret.json');


async function pushImage(id) {
    const creds_service_user = require(PATH_TO_CREDENTIALS);
 
    const googleDriveInstance = new NodeGoogleDrive({
        ROOT_FOLDER: YOUR_ROOT_FOLDER
    });
 
    let gdrive = await googleDriveInstance.useServiceAccountAuth(
        creds_service_user
    );
 
	//async function createFile() {
		let writeImage = await googleDriveInstance.writeFile(
			`./img/${id}.jpg`,
			YOUR_ROOT_FOLDER,
			`${id}`,
			'image/jpg'
		)

		//console.log(writeImage)
//	}
//	createFile();
	//console.log(uploadResponse);
}

async function changeRow (id)
{
	const doc = new GoogleSpreadsheet('1820fa1SdNr_1kePpiP08OCvrQKY6NotDhXV7JNoWEtk');
	await doc.useServiceAccountAuth(require('./client_secret.json'));
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];
	const rows = await sheet.getRows();
	let updRow;
	rows.forEach((row)=>{
		if(row.id == id)
		{
			updRow = row;
			return
		}
	})
	updRow.photo = 'Да';
	await updRow.save();
	//console.log(rows[0].id);
}
async function makeLog (id, number, isBot, msg, msg2){
	const doc = new GoogleSpreadsheet('1820fa1SdNr_1kePpiP08OCvrQKY6NotDhXV7JNoWEtk');
	await doc.useServiceAccountAuth(require('./client_secret.json'));
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[2];
	const rows = await sheet.getRows();
	let currentRow;
	rows.forEach((row)=>{
		if (row.id == id) {
			currentRow = row;
			return
		}
	})
	if (currentRow) {
		if(isBot){
			currentRow._rawData[number*2] = msg;
			await currentRow.save();
		}
		else{
			currentRow._rawData[number*2 - 1] = msg;
			await currentRow.save();
		}

		//  console.log(currentRow._rawData[2]);
	}
	else {
		if (!isBot) {
			const sundar = await sheet.addRow({
				id: id,
				message_1: msg,
				bot_1: msg2
			});
		}
	}
}


async function accessSpreadsheet(userId, userCity, userStreet, userHouse, userStation, userPhone, userNickname, userFirstname, userLastname, brigadir ) {
	
	
	let currentDate = getDate();

	const doc = new GoogleSpreadsheet('1820fa1SdNr_1kePpiP08OCvrQKY6NotDhXV7JNoWEtk');
	await doc.useServiceAccountAuth(require('./client_secret.json'));
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];
//	const rows = await sheet.getRows();
	const sundar = await sheet.addRow({ Time: currentDate, id: userId, city: userCity, street: userStreet, house: userHouse, station: userStation, phone: userPhone, username: userNickname, tgname: userFirstname, tglastname: userLastname, brigadir: brigadir });
	//console.log(rows);
}

const getDate = () =>
{
	Data = new Date();
	let year = Data.getFullYear();
	let month = Data.getMonth();
	month +=1;
	let day = Data.getDate();
	let hours = Data.getHours();
	let minutes = Data.getMinutes();
	if (minutes.length < 2)
	{
		oldMinutes = minutes;
		minutes = '0' + oldMinutes;
	}
	let seconds = Data.getSeconds();

	let currentDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
	return currentDate;
}



//Connecting - if the file does not exist it will be created


  sqlite.connect('./db/db.db'); 


const TelegramBot = require('node-telegram-bot-api'),
		request = require('request'),
		token = require('./bot_config.json').token,
		bot = new TelegramBot(token,
			{
				polling:true
				// Если нужен прокси
				/*request: {
					agentClass: Agent,
					agentOptions: {
						socksHost: '200.89.178.132', //Прокси хост
						socksPort: parseInt('443'), //Порт прокси
						// Если нужна авторизаци, то снимаем комментирование и вписываем логин и пароль:
						// socksUsername: 'tproxy',
						// socksPassword: process.env.PROXY_SOCKS5_PASSWORD
					}
				}*/
				
			});
			console.log('Bot connected');

var username = 0;

const managers = require('./mangers.json');
const admins = require('./admins.json');
const addres = require('./addresses.json')
const { text } = require('express');

const isAdmin = (id) => {
	let verification = false;
	admins.forEach((admin) => {
		if (admin.id == id)
		verification = true;
		return
	})
	return verification;  
}


//start
bot.onText(/\/start/, (msg) => {
	if (msg.from.id === msg.chat.id) {
		
		if (isAdmin(msg.from.id)){
			bot.sendMessage(msg.chat.id, "Здравствуйте. Выберите команду из списка.", {
				"reply_markup": {
					"keyboard": [["Рассылка для все подписчиков", "Сообщение одному человеку"]],
					"resize_keyboard": true,
					"one_time_keyboard": true
				}
			});
		}	
		else{
			bot.sendMessage(msg.from.id, "Здравствуйте. Выберите населённый пункт из списка.", {
				"reply_markup": {
					"keyboard": [["п.г.т. Никель", "п.г.т. Печенга", "г. Заполярный"], 
					["н.п. Цыпнаволок", "н.п. Спутник", "н.п. Сальмиярви"], 
					["н.п. Раякоски", "н.п. Приречный", "н.п. Луостари"], 
					["н.п. Лиинахамари", "н.п. Корзуново", "н.п. Вайда-Губа"], 
					["н.п. Борисоглебский", "ж.-д. ст. Титовка", "ж.-д. ст. Печенга"], 
					["ж.-д. ст. Луостари", "н.п. Путевая Усадьба 9 км железной дороги Луостари-Никель"]],
					"resize_keyboard": false,
					"one_time_keyboard": true
				}
			});
			console.log(msg.from.id, msg.text);
		}
	}
});

bot.onText(/\/reset/, (msg) => {
	if (msg.from.id === msg.chat.id) {

		
		bot.sendMessage(msg.chat.id, "Выберите населённый пункт из списка.", {
			"reply_markup": {
				"keyboard": [["п.г.т. Никель", "п.г.т. Печенга", "г. Заполярный"], 
				["н.п. Цыпнаволок", "н.п. Спутник", "н.п. Сальмиярви"], 
				["н.п. Раякоски", "н.п. Приречный", "н.п. Луостари"], 
				["н.п. Лиинахамари", "н.п. Корзуново", "н.п. Вайда-Губа"], 
				["н.п. Борисоглебский", "ж.-д. ст. Титовка", "ж.-д. ст. Печенга"], 
				["ж.-д. ст. Луостари", "н.п. Путевая Усадьба 9 км железной дороги Луостари-Никель"]],
				"resize_keyboard": false,
				"one_time_keyboard": true
			}
		});
	}
});

bot.on('message', function (msg){

	class Admin{
		id;
		state;
		prevMessage;
		inDb;

		constructor(id, state, prevMessage, inDb){
			this.id = id;
			this.state = state;
			this.prevMessage = prevMessage;
			this.inDb = inDb;
		}

		prepareMailingAll(){

			if ((msg.text === 'Рассылка для все подписчиков') && (this.state === 1) && (this.id === msg.chat.id) && (msg.text !== '/reset') && (msg.text !== '/start')) {
				this.prevMessage = msg.text;
				this.state = 11;

				if (this.inDb === 0) {
					//var insert = sqlite.insert('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.prevMessage});
					var last_insert_id = sqlite.run('INSERT INTO admins(admin_id, state, prevMessage) VALUES (?,?,?)', [this.id, this.state, this.prevMessage]);

				}
				else {
					var update = sqlite.run('UPDATE admins SET state = ?, prevMessage = ? WHERE admin_id = ?', [this.state, this.prevMessage, this.id]);
					console.log('!!!  ', update);
					//var update = sqlite.update('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.pollingStation});
				}

				bot.sendMessage(msg.from.id, 'Введите текст рассылки');
			}

		}
		mailingAll(){
			if((msg.text !== this.prevMessage) &&  (this.state === 11) && (msg.text.length > 1) && (this.id === msg.chat.id) && (msg.text !== '/reset') && (msg.text !== '/start')){
				this.prevMessage = msg.text;
				this.state = 1;
				var update = sqlite.run('UPDATE admins SET state = ?, prevMessage = ? WHERE admin_id = ?', [this.state, this.prevMessage, this.id]);
				let index;
				admins.forEach((item)=>{
					if (item.id == msg.from.id){
					index = admins.indexOf(item);
					return
					}
				})
				admins[index].message = msg.text;
				let usersList = sqlite.run('SELECT user_id FROM users');
				usersList.forEach((item) => {
					bot.sendMessage(item.user_id, msg.text);
				});
				admins[index].message = '';
				bot.sendMessage(msg.chat.id, "Выберите команду из списка.", {
					"reply_markup": {
						"keyboard": [["Рассылка для все подписчиков", "Сообщение одному человеку"]],
						"resize_keyboard": true,
						"one_time_keyboard": true
					}
				});
			//	console.log(usersList);
			//	bot.sendMessage(msg.from.id, 'Введите текст рассылки');
			//	admins.message = msg.text;
			
			}
		}

		prepareMailingCurrent() {
			if ((msg.text === 'Сообщение одному человеку') && (this.id === msg.chat.id) && (this.state === 1) && (msg.text !== '/reset') && (msg.text !== '/start')) {
				this.prevMessage = msg.text;
				this.state = 21;

				if (this.inDb === 0) {
					//var insert = sqlite.insert('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.prevMessage});
					var last_insert_id = sqlite.run('INSERT INTO admins(admin_id, state, prevMessage) VALUES (?,?,?)', [this.id, this.state, this.prevMessage]);

				}
				else {
					var update = sqlite.run('UPDATE admins SET state = ?, prevMessage = ? WHERE admin_id = ?', [this.state, this.prevMessage, this.id]);
					console.log('!!!  ', update);
					//var update = sqlite.update('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.pollingStation});
				}

				bot.sendMessage(msg.from.id, 'Введите текст сообщения');
			}
			
		}
		waitForId() {
			if ((msg.text !== '') && (msg.text !== this.prevMessage) && (this.id === msg.chat.id) && (this.state === 21) && (msg.text !== '/reset') && (msg.text !== '/start')) {
				this.prevMessage = msg.text;
				this.state = 22;
				var update = sqlite.run('UPDATE admins SET state = ?, prevMessage = ? WHERE admin_id = ?', [this.state, this.prevMessage, this.id]);

				let index;
				admins.forEach((item) => {
					if (item.id == msg.from.id) {
						index = admins.indexOf(item);
						return
					}
				})
				admins[index].message = msg.text;
				bot.sendMessage(msg.from.id, 'Введите id клиента');


			}
		}
		currentMailing(){
			if ((msg.text !== '') && (msg.text !== this.prevMessage) && (this.id === msg.chat.id) && (this.state === 22) && (msg.text !== '/reset') && (msg.text !== '/start')){
				this.prevMessage = msg.text;
				let check = sqlite.run(`SELECT * FROM users WHERE user_id = ${msg.text}`)

				if (check[0]) {
					let text;
					admins.forEach((item) => {
						if (item.id == msg.from.id) {
							text = item.message;
							item.message = '';
							return
						}
					})
					bot.sendMessage(check[0].user_id, text);
				
					this.state = 1;
					var update = sqlite.run('UPDATE admins SET state = ?, prevMessage = ? WHERE admin_id = ?', [this.state, this.prevMessage, this.id]);
				
					
					bot.sendMessage(msg.chat.id, "Выберите команду из списка.", {
						"reply_markup": {
							"keyboard": [["Рассылка для все подписчиков", "Сообщение одному человеку"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});
				}
				else{
					bot.sendMessage(msg.from.id, 'Такого пользователя нет. Попробуйте ввести id заново.');
				}
				
			}
		}

	}

    class User 
    {
        id;
        name;
        city;
        street;
        house;
		state;
		pollingStation;
		prevMessage;
		inDb;
		phoneNumber;
		userName;
		tgFirstName;
		tgSecondName;
		counter;
		brigadir;

        constructor(id, name, city, street, house, state, pollingStation, prevMessage, inDb, phoneNumber, userName, tgFirstName, tgSecondName, counter, brigadir) {
			this.id = id;
			this.name = name;
			this.city = city;
			this.street = street;
			this.house = house;
			this.state = state;
			this.pollingStation = pollingStation;
			this.prevMessage = prevMessage;
			this.inDb = inDb;
			this.phoneNumber = phoneNumber;
			this.userName = userName;
			this.tgFirstName = tgFirstName;
			this.tgSecondName = tgSecondName;
			this.counter = counter;
			this.brigadir = brigadir;
          }

        


        getCity()
        {   

            
         //   while ((msg.text !== 'Мончегорск' || msg.text !== '27 км железной дороги Мончегорск Оленья' || msg.text !== '25 км железной дороги Мончегорск Оленья' ) && (this.state !== 1)&& (this.id !== msg.chat.id))
        //    {
		//		setTimeout(function(){}, 5000);
				
        //    } 
			if ((msg.text === 'п.г.т. Никель' || msg.text === 'п.г.т. Печенга' || msg.text === 'г. Заполярный' || msg.text === 'н.п. Цыпнаволок' 
				|| msg.text === 'н.п. Спутник' || msg.text === 'н.п. Сальмиярви' || msg.text === 'н.п. Раякоски' || msg.text === 'н.п. Приречный'
				|| msg.text === 'н.п. Луостари' || msg.text === 'н.п. Лиинахамари' || msg.text === 'н.п. Корзуново' || msg.text === 'н.п. Вайда-Губа'
				|| msg.text === 'н.п. Борисоглебский' || msg.text === 'ж.-д. ст. Титовка"' || msg.text === 'ж.-д. ст. Печенга' || msg.text === 'ж.-д. ст. Луостари'
				|| msg.text === 'н.п. Путевая Усадьба 9 км железной дороги Луостари-Никель') && (this.id === msg.chat.id) && (this.state === 1) && (msg.text !== '/reset') && (msg.text !== '/start')) {
                //bot.sendPhoto(id, './ku.jpg');
                this.prevMessage = msg.text;
                this.state = 3;
				this.city = msg.text;
				if (this.inDb === 0)
				{
				//var insert = sqlite.insert('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.prevMessage});
				var last_insert_id =  sqlite.run('INSERT INTO users(user_id, Name, city, street, house_number, state , polling_station, prevMessage, phone, username, firstname, lastname, counter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.id, this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter]) ;	
				
				}
				else
				{
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ? , phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					console.log ('!!!  ', update);	
					//var update = sqlite.update('users', {user_id: this.id}, {Name: this.name}, {city: this.city}, {street: this.street}, {house_number: this.house}, {state: this.state}, {polling_station: this.pollingStation}, {prevMessage: this.pollingStation});
				}

				if(msg.text === 'п.г.т. Никель')
				{
					bot.sendMessage(msg.from.id, 'Выберите улицу из списка.', {
						"reply_markup": {
							"keyboard": [["Зеленая", "Пионерская", "Победы"], ["Гвардейский проспект", "1-я Линия", "2-я Линия"], ["Молодежный переулок", "14 Армии",
								"Печенгская"], ["Мира", "Октябрьская", "Советская"], ["Первомайская", "Сидоровича", "Бредова"] , ["Комсомольская", "Спортивная"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});	
					makeLog (msg.from.id, this.counter, 1, 'Выберите улицу из списка.');	
				}
				else if (msg.text === 'п.г.т. Печенга'){
					bot.sendMessage(msg.from.id, 'Выберите улицу из списка.', {
						"reply_markup": {
							"keyboard": [["Бредова", "Стадионная", "Печенгское шоссе"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});	
					makeLog (msg.from.id, this.counter, 1, 'Выберите улицу из списка.');	
				}
				else if (msg.text === 'г. Заполярный'){
					bot.sendMessage(msg.from.id, 'Выберите улицу из списка.', {
						"reply_markup": {
							"keyboard": [["Ясный переулок", "Короткий переулок", "Юбилейная"], ["Карла Маркса", "Шмакова переулок", "Советский переулок"],
						["Бабикова", "Ленинградская", "Крупской"], ["Родионова", "Мира", "Ленина", "34 км"], ["Стрельцова", "Космонавтов", "Новоподгорная"], 
						["Подгорная", "Сафонова", "Терешковой"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});
					makeLog (msg.from.id, this.counter, 1, 'Выберите улицу из списка.');	
				}
				else if (msg.text === 'н.п. Лиинахамари'){
					bot.sendMessage(msg.from.id, 'Выберите улицу из списка.', {
						"reply_markup": {
							"keyboard": [["Вайдагубский маяк", "Шабалина", "Северная"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});	
					makeLog (msg.from.id, this.counter, 1, 'Выберите улицу из списка.');	
				}
				else {

					this.house = "Не указан";
					this.street = "Не указана"
					this.state = 5;
					let pollState = sqlite.run(`SELECT polling_station FROM streets WHERE city = '${this.city}'`);
					this.pollingStation = pollState[0].polling_station;
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					
					bot.sendMessage(msg.chat.id, "Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить", {
						"reply_markup": {
							"keyboard": [[{text: "Предоставить номер телефона", request_contact: true }], ["Закончить"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});
					makeLog (msg.from.id, this.counter, 1, 'Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить');	
					//bot.sendMessage(msg.from.id, 'Введите название улицы.');
				}
               // bot.sendMessage(msg.from.id, 'Введите ваши ФИО');
                
            }
        }  

		getStreet() {
		//	while ((msg.text)&&(msg.text.length <= 3) && (this.state !== 3) && (this.id !== msg.chat.id)) {
		//		setTimeout(function () { }, 5000);
		//	}
			if ((msg.text !== this.prevMessage) && (this.id === msg.chat.id) && (this.state === 3) && (msg.text !== '/reset') && (msg.text !== '/start')) {

				this.prevMessage = msg.text;
				let streetTemp = sqlite.run(`SELECT street FROM streets WHERE street = '${msg.text}' AND city = '${this.city}'`);
			
				if(this.city === 'п.г.т. Никель' || this.city === 'п.г.т. Печенга' || this.city === 'г. Заполярный' || this.city === 'н.п. Лиинахамари') {
				//user.name = messageText;
					if (streetTemp[0]) {
						this.state = 4;
						this.street = msg.text;
						
						var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
						
						bot.sendMessage(msg.from.id, 'Введите номер дома');
						makeLog (msg.from.id, this.counter, 1, 'Введите номер дома');
					}
					else {
						bot.sendMessage(msg.from.id, 'Такой улицы нет. Проверье правильность ввода!');
						makeLog (msg.from.id, this.counter, 1, 'Такой улицы нет. Проверье правильность ввода!');
					}
				}
			/*	else {
					this.state = 4;
					this.street = msg.text;
					
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					
					bot.sendMessage(msg.from.id, 'Введите номер дома');
				}*/

			}

		}
		getHouse()
		{
		//	while ((msg.text)&&(msg.text.length <= 1 ) && (this.state !== 4)&& (this.id !== msg.chat.id))
        //    {
		//		setTimeout(function(){}, 5000);
		//	}
			if ((msg.text !== this.prevMessage) && (this.id === msg.chat.id) && (this.state === 4) && (msg.text !== '/reset') && (msg.text !== '/start')) {
				
				let houseTemp = sqlite.run(`SELECT house_number FROM streets WHERE city = '${this.city}' AND street = '${this.street}' AND house_number = '${msg.text}'`);
				let houseTemp_2 = sqlite.run(`SELECT house_number FROM streets WHERE city = '${this.city}' AND street = '${this.street}' AND house_number = 'all'`);
				let pollState;
				
				if(this.city === 'п.г.т. Никель' || this.city === 'п.г.т. Печенга' || this.city === 'г. Заполярный' || this.city === 'н.п. Лиинахамари') {
				
					if (houseTemp[0])
					{	
						this.house = msg.text;
						this.state = 5;
						pollState = sqlite.run(`SELECT polling_station FROM streets WHERE city = '${this.city}' AND street = '${this.street}' AND house_number = '${this.house}'`);
						this.pollingStation = pollState[0].polling_station;
						var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
						
						bot.sendMessage(msg.chat.id, "Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить", {
							"reply_markup": {
								"keyboard": [[{text: "Предоставить номер телефона", request_contact: true }], ["Закончить"]],
								"resize_keyboard": true,
								"one_time_keyboard": true
							}
						});
						makeLog (msg.from.id, this.counter, 1, 'Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить');
					
					}
					else if (houseTemp_2[0]) 
					{	

						this.house = msg.text;
						this.state = 5;
						pollState = sqlite.run(`SELECT polling_station FROM streets WHERE city = '${this.city}' AND street = '${this.street}'`);
						this.pollingStation = pollState[0].polling_station;
						var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
						
						bot.sendMessage(msg.chat.id, "Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить", {
							"reply_markup": {
								"keyboard": [[{text: "Предоставить номер телефона", request_contact: true }], ["Закончить"]],
								"resize_keyboard": true,
								"one_time_keyboard": true
							}
						});
						makeLog (msg.from.id, this.counter, 1, 'Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить');
					

					}
					else
					{	
						bot.sendMessage(msg.from.id, 'Такого дома нет. Проверье правильность ввода!');
						makeLog (msg.from.id, this.counter, 1, 'Такого дома нет. Проверье правильность ввода!');
					}
				
				}
		/*		else {
					this.house = msg.text;
					this.state = 5;
					pollState = sqlite.run(`SELECT polling_station FROM streets WHERE city = '${this.city}'`);
					this.pollingStation = pollState[0].polling_station;
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					
					bot.sendMessage(msg.chat.id, "Пожалуйста, предоставьте нам ваш номер телефона, нажав на соответсвующую кнопку, чтобы мы могли написать вам, если что-то пойдёт не так. Если вы не хотите предоставлять номер телефона, то просто нажмите Закончить", {
						"reply_markup": {
							"keyboard": [[{text: "Предоставить номер телефона", request_contact: true }], ["Закончить"]],
							"resize_keyboard": true,
							"one_time_keyboard": true
						}
					});
				}*/
			}
		}

		getPhone()
		{
			while ((!msg.text || !msg.contact) && (this.state !== 5)&& (this.id !== msg.chat.id))
            {
				setTimeout(function(){}, 5000);
			}
			if ((msg.text || msg.contact) && (this.id === msg.chat.id) && (this.state === 5) && (msg.text !== '/reset') && (msg.text !== '/start')){
				let pollAddres;
				addres.forEach((item) => {
					if (item.id == this.pollingStation)
					pollAddres = item.addres;
					return
				})
				if (msg.contact){

					if (msg.contact.phone_number)
					{
						this.phoneNumber = msg.contact.phone_number;
					}
					else{
						this.phoneNumber = 'Не указан';
					}
					
					this.state = 6;
					//update

					let brigadir = sqlite.run(`SELECT brigadir FROM users WHERE user_id = '${this.id}'`);

					bot.sendMessage(msg.from.id, `Ваш участок – ${this.pollingStation}. Адрес: ${pollAddres}. Ожидайте дальнейших инструкций.`);
					makeLog (msg.from.id, this.counter, 1, `Ваш участок – ${this.pollingStation}. Адрес: ${pollAddres}. Ожидайте дальнейших инструкций.`);

					accessSpreadsheet(this.id, this.city, this.street, this.house, this.pollingStation, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, brigadir[0].brigadir);
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					

				} 
				else if (msg.text === 'Закончить'){

					this.phoneNumber = 'Не указан';
					this.state = 6;

					let brigadir = sqlite.run(`SELECT brigadir FROM users WHERE user_id = '${this.id}'`);
					
					bot.sendMessage(msg.from.id, `Ваш участок – ${this.pollingStation}. Адрес: ${pollAddres}. Ожидайте дальнейших инструкций.`);
					makeLog (msg.from.id, this.counter, 1, `Ваш участок – ${this.pollingStation}. Адрес: ${pollAddres}. Ожидайте дальнейших инструкций.`);
					
					accessSpreadsheet(this.id, this.city, this.street, this.house, this.pollingStation, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, brigadir[0].brigadir);
					var update = sqlite.run('UPDATE users SET name = ?, city = ?, street = ?, house_number = ?, state = ?, polling_station = ?, prevMessage = ?, phone = ?, username = ?, firstname = ?, lastname = ?, counter = ? WHERE user_id = ?', [this.name, this.city, this.street, this.house, this.state, this.pollingStation, this.prevMessage, this.phoneNumber, this.userName, this.tgFirstName, this.tgSecondName, this.counter, this.id]);
					

				}
//				else {
//					bot.sendMessage(msg.from.id, 'Выберите вариант и списка!')
//				}


			}
		}

		getPhoto()
		{
			if ((msg.photo) && (this.id === msg.chat.id) && (this.state > 5) && (msg.text !== '/reset') && (msg.text !== '/start')){
				//file_id = msg.photo[msg.photo.length - 1].file_id;
				//console.log(file_id);
				//console.log(msg.photo[msg.photo.length - 1].file_id);
				let tempCounter = this.counter;	
				axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${msg.photo[msg.photo.length - 1].file_id}`).then( ({ data }) => {
					let file_path = data.result.file_path;
				//	console.log(file_path);
				let id = this.id;
						axios({
							method: "get",
							url: `https://api.telegram.org/file/bot${token}/${file_path}`,
							responseType: "stream"
						}).then(function (response) {
							response.data.pipe(fs.createWriteStream(`./img/${msg.from.id}.jpg`));
							bot.sendMessage(msg.from.id, 'Фото получено');
							makeLog (msg.from.id, tempCounter, 1, 'Фото получено');
							changeRow(id);
							pushImage(msg.from.id);
					});
				});

				
				
				 
			}
		}
    }
	if (isAdmin(msg.from.id)){
		const tempAdmin =
		{
			id: '',
			state: '',
			prevMessage: '',
			inDb: ''
		}
		let data = sqlite.run(`SELECT * FROM admins WHERE admin_id = ${msg.from.id}`);
		if (data[0]){
			tempAdmin.id = data[0].admin_id;
			
			tempAdmin.prevMessage = data[0].prevMessage;
			tempAdmin.inDb = 1;
			if (msg.text === '/reset' || msg.text === '/start') {
				var update = sqlite.run('UPDATE admins SET state = ? WHERE admin_id = ?', [1, msg.from.id]);
			}
			tempAdmin.state = data[0].state;
		}
		else{
			tempAdmin.id = msg.from.id;
			tempAdmin.state = 1;
			tempAdmin.inDb = 0;
		}
		const admin = new Admin(tempAdmin.id, tempAdmin.state, tempAdmin.prevMessage, tempAdmin.inDb);
		admin.prepareMailingAll();
		admin.mailingAll();
		admin.prepareMailingCurrent();
		admin.waitForId();
		admin.currentMailing();
	}						
	else{
		const tempUser =
		{
			id: '',
			name: '',
			city: '',
			street: '',
			house: '',
			state: '',
			polling_station: '',
			prevMessage: '',
			inDb: '',
			phone_number: '',
			username: '',
			tgFirstName: '',
			tgLastName: '',
			counter:'',
			brigadir: ''
		}

		let data = sqlite.run(`SELECT * FROM users WHERE user_id = ${msg.from.id}`);

		if (data[0]) {
			tempUser.id = data[0].user_id;
			tempUser.name = data[0].Name;
			tempUser.city = data[0].city;
			tempUser.street = data[0].street;
			tempUser.house = data[0].house_number;
			if (msg.text === '/reset' || msg.text === '/start') {
				var update = sqlite.run('UPDATE users SET state = ? WHERE user_id = ?', [1, msg.from.id]);
			}
			tempUser.state = data[0].state;
			tempUser.polling_station = data[0].polling_station;
			tempUser.prevMessage = data[0].prevMessage;
			tempUser.inDb = 1;
			tempUser.phone_number = data[0].phone;
			tempUser.username = data[0].username;
			tempUser.tgFirstName = data[0].firstname;
			tempUser.tgLastName = data[0].lastname;
			tempUser.counter = data[0].counter + 1;
			var update = sqlite.run('UPDATE users SET counter = ? WHERE user_id = ?', [tempUser.counter, msg.from.id]);
			if (msg.text) {
				makeLog(msg.from.id, tempUser.counter, 0, msg.text);
				if (msg.text == '/reset') {
					makeLog(msg.from.id, tempUser.counter, 1, 'Выберите населённый пункт из списка.');
				} 
				else if (msg.text == '/start') {
					makeLog(msg.from.id, tempUser.counter, 1, 'Здравствуйте. Выберите населённый пункт из списка.');
				}
				

			}
			else if (msg.contact) {
				makeLog(msg.from.id, tempUser.counter, 0, msg.contact.phone_number);
			}
			else if (msg.photo) {
				makeLog(msg.from.id, tempUser.counter, 0, 'Фото');
			}

		}
		else {
			tempUser.id = msg.from.id;
			tempUser.state = 1;
			tempUser.inDb = 1;
			tempUser.counter = 1;

			if (msg.from.first_name) {
				tempUser.tgFirstName = msg.from.first_name;
			}
			else {
				tempUser.tgFirstName = 'Не указано';
			}

			if (msg.from.last_name) {
				tempUser.tgLastName = msg.from.last_name;
			}
			else {
				tempUser.tgLastName = 'Не указано';
			}

			if (msg.from.username) {
				tempUser.username = msg.from.username;
			}
			else {
				tempUser.username = 'Не указан';

			}

			if (/\/start/.test(msg.text))
			{
				let startTextArr = msg.text.split(' ');
				managers.forEach((item) => {
					if (item.polling_station == startTextArr[startTextArr.length - 1])
					tempUser.brigadir = item.polling_station;
					return
				})
				var last_insert_id =  sqlite.run('INSERT INTO users(user_id, brigadir, state, username, firstname, lastname, counter) VALUES (?,?,?,?,?,?, ?)', [msg.from.id, tempUser.brigadir, tempUser.state, tempUser.username, tempUser.tgFirstName, tempUser.tgLastName, tempUser.counter]);
				makeLog (msg.from.id, tempUser.counter, 0, msg.text, 'Здравствуйте. Выберите населённый пункт из списка.');
				//makeLog (msg.from.id, tempUser.counter, 1, '');
			}
		}
		if (tempUser.counter > 40)
		{
			bot.sendMessage(msg.from.id, "Вы написали слишком много сообщение и больше не можете это делать");
			return;
		}
		const user = new User(tempUser.id, tempUser.name, tempUser.city, tempUser.street, tempUser.house, 
								tempUser.state, tempUser.polling_station, tempUser.prevMessage, tempUser.inDb, 
								tempUser.phone_number, tempUser.username, tempUser.tgFirstName, tempUser.tgLastName, tempUser.counter, tempUser.brigadir);
		

							
		user.getCity();
	//	user.getName();
		user.getStreet();
		user.getHouse();
		user.getPhone();
		user.getPhoto();
	}
}); 


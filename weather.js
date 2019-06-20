const API_KEY = '92323150727077c1b657e697a0b8d525'
const API_VERSION = '2.5'
const cities = {
	Stockholm: 2673730,
	Chaguana: 7521937
}

const messages = {
	yes: 'Det är hett som i Trinidad!',
	no: 'Det är inte längre hett som i Trinidad :('
}

let latestNotification;

function getWeather(city) {
	return fetch(`https://api.openweathermap.org/data/${API_VERSION}/weather?id=${city}&units=metric&APPID=${API_KEY}`)
		.then(response => response.json())
}

async function refresh() {
	let temp1, temp2
	const updated = document.getElementById('updated-time')

	const city1 = {
		name: document.getElementById('city1-name'),
		temp: document.getElementById('city1-temp')
	}

	const city2 = {
		name: document.getElementById('city2-name'),
		temp: document.getElementById('city2-temp')
	}

	const answer = document.getElementById('answer')

	await getWeather(cities.Stockholm).then(data => {
		city1.name.innerText = data.name
		city1.temp.innerText = data.main.temp

		temp1 = data.main.temp
	})

	await getWeather(cities.Chaguana).then(data => {
		city2.name.innerText = data.name
		city2.temp.innerText = data.main.temp

		temp2 = data.main.temp
	})

	const tempDiff = Math.abs(temp1 - temp2)

	if (tempDiff < 5) {
		if (tempDiff < 3) {
			answer.innerText = 'Ja'

			notify(messges.yes)
		} else {
			answer.innerText = 'Typ'
		}
	} else {
		answer.innerText = 'Nej'
		
		if (latestNotification === messages.yes) {
			notify(messages.no)
		}
	}

	const time = new Date()

	updated.innerText = time.toLocaleString()
	updated.setAttribute('datetime', time.toISOString())
}

function notify(message) {
	if ("Notification" in window && Notification.permission === "granted" && message !== latestNotification) {
		// If it's okay let's create a notification
		new Notification(message)
		latestNotification = message
	}
}

function askForPermission() {
	// Let's check if the browser supports notifications
	if ("Notification" in window) {
		Notification.requestPermission()
	}
}

window.onload = refresh

askForPermission();
setInterval(refresh, 1000 * 60 * 10) //refresh every 10 minutes
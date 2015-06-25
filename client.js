connection = new WebSocket("ws://localhost:8081/chat")
connection.onopen = function () {
  console.log("Connection opened")
	connection.send("Hi!")
}

connection.onclose = function () {
	console.log("Connection closed")
}

connection.onerror = function () {
	console.error("Connection error")
}

connection.onmessage = function (event) {
	console.log(event.data)
}

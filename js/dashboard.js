const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadData() {
let response = await fetch(BASE_URL + ".json")
let responseToJson = await response.json()
console.log(responseToJson.taskList.length);

}
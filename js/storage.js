let contactList = {
  0: {
    color: "#ff6f61",
    avatar: "NV",
    name: "Noah Velickovic",
    email: "noah.velic@hotmail.com",
    phoneNumber: "+1234567890",
    password: "noah123",
  },
  1: {
    color: "#6b5b95",
    avatar: "DK",
    name: "Daniel Kwiatkowski",
    email: "danielkwiatkowski@gmx.de",
    phoneNumber: "+0987654321",
    password: "daniel123",
  },
  2: {
    color: "#88b04b",
    avatar: "YA",
    name: "Yama Azizi",
    email: "aziziyama92@gmail.com",
    phoneNumber: "+1122334455",
    password: "yama123",
  },
  3: {
    color: "#f7cac9",
    avatar: "DT",
    name: "Dora Telekesi",
    email: "dorothea0929@gmail.com",
    phoneNumber: "+5566778899",
    password: "dora123",
  },
  4: {
    color: "#92a8d1",
    avatar: "G",
    name: "Guest",
    email: "",
    phoneNumber: "",
    password: "",
  },
};

let taskList = {
  0: {
    id: 0,
    column: "to-do",
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation.",
    date: "2025-10-06",
    priority: "medium",
    assigned_to: {
      0: "Dora Telekesi",
      1: "Yama Azizi",
      2: "Daniel Kwiatkowski",
    },
    subtasks: {
      0: { title: "Implement Recipe Recommendation", status: "done" },
      1: { title: "Start Page Layout", status: "undone" },
      2: { title: "Header and Navbar", status: "done" },
    },
    category: "User Story",
  },
  1: {
    id: 1,
    column: "to-do",
    title: "CSS Architecture Planning",
    description: "Define CSS naming conventions and structure.",
    date: "2025-05-06",
    priority: "urgent",
    assigned_to: {
      0: "Noah Velickovic",
      1: "Yama Azizi",
    },
    subtasks: {
      0: { title: "Establish CSS Methodology", status: "done" },
      1: { title: "Setup Base Styles", status: "undone" },
    },
    category: "Technical Task",
  },
  2: {
    id: 2,
    column: "in-progress",
    title: "HTML Base Template",
    description: "Create reusable HTML base templates for basic structure.",
    date: "2025-07-06",
    priority: "low",
    assigned_to: {
      0: "Noah Velickovic",
      1: "Daniel Kwiatkowski",
      2: "Dora Telekesi",
    },
    subtasks: {},
    category: "Technical Task",
  },
  3: {
    id: 3,
    column: "done",
    title: "Daily Kochwelt Recipe",
    description: "Implement daily recipe and portion calculator.",
    date: "2025-11-06",
    priority: "low",
    assigned_to: {
      0: "Yama Azizi",
      1: "Daniel Kwiatkowski",
      2: "Noah Velickovic",
    },
    subtasks: {},
    category: "User Story",
  },
};

function initStorage() {
  console.log("hex");
  // putData(`users`, users);
  // putData("contactList", contactList);
  putData("taskList", taskList);
}

// const BASE_URL =
//   "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

// let usersArr = [];
// async function init() {
//   let userResponse = await getAllUsers("users");
//   console.log(userResponse);

//   let UserKeysArray = Object.keys(userResponse);
//   // console.log(UserKeysArray);
//   for (let index = 0; index < UserKeysArray.length; index++) {
//     usersArr.push({
//       id: UserKeysArray[index],
//       user: userResponse[UserKeysArray[index]],
//     });
//   }

//   addUser();

//  await addEditSingleUser();

// putData("taskList", taskList);
// putData("contactList", contactList)
// putData("users", users);
// }

// async function getAllUsers(path) {
//   let response = await fetch(BASE_URL + path + ".json");
//   return (responseToJson = await response.json());
// }

// function addUser() {
//   let newEmail = "telekesidora@test.hu";
//   let newPassword = "telekesidora";
//   if (usersArr.some((user) => user.user.email === newEmail && user.user.password ===newPassword)) {
//     console.log("yes");
//   }
//    else {
//     usersArr.push({
//       id: String(usersArr.length),
//       user: { email: newEmail, password: newPassword },
//     });
//     addEditSingleUser(usersArr[usersArr.length - 1].id, {
//       email: usersArr[usersArr.length - 1].user.email,
//       password: usersArr[usersArr.length - 1].user.password,
//     });
//   }
// }
// async function addEditSingleUser(id, user) {
//   putData(`users/${id}`, user);
// }

// console.log(contactList);
// async function loadData(path = ""){
//     let response = await fetch(BASE_URL + path + ".json");
//     let responseToJson = await response.json();

//     for (let key in responseToJson){
//       console.log(responseToJson[key].phoneNumber)
//     }

// let users = {
//   0: {
//     name: "Dora",
//     email: "dora@test.de",
//     password: "test123",
//   },
// };

// let contactList = {
//   0: {
//     color: "#ff6f61",
//     avatar: "NV",
//     name: "Noah Velickovic",
//     email: "noah.velic@hotmail.com",
//     phoneNumber: "+1234567890",
//   },
//   1: {
//     color: "#6b5b95",
//     avatar: "DK",
//     name: "Daniel Kwiatkowski",
//     email: "marcel.bauer@example.com",
//     phoneNumber: "+0987654321",
//   },
//   2: {
//     color: "#88b04b",
//     avatar: "YA",
//     name: "Yama Azizi",
//     email: "aziziyama92@gmail.com",
//     phoneNumber: "+1122334455",
//   },
//   3: {
//     color: "#f7cac9",
//     avatar: "DT",
//     name: "Dora Telekesi",
//     email: "dorothea0929@gmail.com",
//     phoneNumber: "+5566778899",
//   },
//   4: {
//     color: "#92a8d1",
//     avatar: "G",
//     name: "Guest",
//     email: "",
//     phoneNumber: "",
//   },
//   5: {
//     color: "#f4a261",
//     avatar: "OS",
//     name: "Oliver Schulz",
//     email: "oliver.schulz@example.com",
//     phoneNumber: "+1122334455",
//   },
//   6: {
//     color: "#955251",
//     avatar: "WM",
//     name: "Werner Möller",
//     email: "werner.moeller@example.com",
//     phoneNumber: "+5566778899",
//   },
//   7: {
//     color: "#b565a7",
//     avatar: "AS",
//     name: "Anja Schulz",
//     email: "anja.schulz@example.com",
//     phoneNumber: "+6677889900",
//   },
//   8: {
//     color: "#009b77",
//     avatar: "EF",
//     name: "Eva Fischer",
//     email: "eva.fischer@example.com",
//     phoneNumber: "+9988776655",
//   },
//   9: {
//     color: "#dd4124",
//     avatar: "AW",
//     name: "Adam West",
//     email: "adam.west@example.com",
//     phoneNumber: "+1122334455",
//   },
// };

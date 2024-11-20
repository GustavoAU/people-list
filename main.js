let existingPeopleList = [];
let addPeopleList = [];
let removePeopleList = [];
let masterList = [];
let currentOrderType = "asc";

const getPeople = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const dataUsers = await response.json();
  return dataUsers;
};

const renderList = () => {
  const orderedList = orderByName(masterList, currentOrderType);

  const usersList = orderedList.map((user) => {
    const {
      id,
      name,
      phone,
      email,
      address: { city, zipcode },
    } = user;

    return `
    <div class="list-element">

      <div class="image-silueta">
        <h3 class="list-link-name" >${name}</h3>
        <img src="https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-silueta-de-avatar-de-empresario.png?w=360" alt="man siulette" class="man-image">
      </div>
      <div class="elements">
        <div>
          <p class="list-link-location" >${city}, ${zipcode}</p>
        </div>
        <div class="links-element">
          <a href="tel:${phone}" class="list-link" ><ion-icon name="call-outline" class="icon-link"></ion-icon></a>
          <a href="mailto:${email}" class="list-link" ><ion-icon name="mail-outline" class="icon-link"></ion-icon></a>
        </div>
      </div>
        <button onclick="removePersonList('${id}')" class="btn-remove">Remove</button>
    </div>`;
  });
  const htmlList = usersList.join("");
  document.getElementById("containerList").innerHTML = htmlList;
};

const removePersonList = (userId) => {
  if (isPersonInsideGroup(existingPeopleList, userId)) {
    removePeopleList.push(findExistingPerson(userId));
  } else if (isPersonInsideGroup(addPeopleList, userId)) {
    addPeopleList = addPeopleList.filter(
      (person) => person.id !== parseInt(userId)
    );
  }

  createList();
  renderList();
};

const findExistingPerson = (personId) => {
  const foundPerson = existingPeopleList.find(
    (person) => person.id === parseInt(personId)
  );
  return foundPerson;
};

const createList = () => {
  const existingAndAddPeopleList = [...existingPeopleList, ...addPeopleList];
  //(existingPeopleList + addPeopleList) - removePeopleList
  //      sumList
  masterList = existingAndAddPeopleList.filter((existingPerson) => {
    return !removePeopleList.some((removePerson) => {
      return removePerson.id === existingPerson.id;
    });
  });
};

const isPersonInsideGroup = (list, userId) => {
  return list.some((person) => person.id === parseInt(userId));
};

getPeople().then((dataUsers) => {
  existingPeopleList = dataUsers;
  createList();
  renderList();
});

const addPersonButton = document.getElementById("add-new-person");

addPersonButton.addEventListener("click", () => {
  const id = Math.floor(Math.random() * 100);
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;
  const zipcode = document.getElementById("zipcode").value;

  console.log("Creacion del id del nuevo user", id);
  if (!name || !phone || !email || !city || !zipcode) {
    alert("name is required");
    return;
  }

  const newPerson = {
    id,
    name,
    phone,
    email,
    address: { city, zipcode },
  };
  addPeopleList.push(newPerson);
  console.log(addPeopleList);
  createList();
  renderList();
});

const findPersonButton = document.getElementById("btn-find");
const searchingInput = document.getElementById("searching");

searchingInput.addEventListener("input", (event) => {
  const searchingPerson = masterList.filter((person) =>
    person.name.toLowerCase().includes(event.target.value.toLowerCase())
  );
  masterList = searchingPerson;
  renderList();
  createList();
});

// findPersonButton.addEventListener("click", () => {
//   const searchingPerson = masterList.filter((person) =>
//     person.name.toLowerCase().includes(searchingInput.value.toLowerCase())
//   );
//   masterList = searchingPerson;
//   renderList();
//   createList();
// });

const clearFilterButton = document.getElementById("btn-clear-filter");

clearFilterButton.addEventListener("click", () => {
  searchingInput.value = "";
  createList();
  renderList();
});

const orderByName = (list, orderType) => {
  return list.sort((a, b) => {
    if (orderType === "asc") {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    } else {
      return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    }
  });
};

const btnOrderList = document.getElementById("btn-order-list");

btnOrderList.addEventListener("click", () => {
  console.log(currentOrderType);
  currentOrderType = currentOrderType === "asc" ? "des" : "asc";
  masterList = orderByName(masterList, currentOrderType);

  if (currentOrderType === "asc") {
    btnOrderList.innerHTML = "Descending";
  } else {
    btnOrderList.innerHTML = "Ascending";
  }

  renderList();
});

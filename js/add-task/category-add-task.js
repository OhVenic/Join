let category = ["Technical Task", "User Story"];

function showCategoryList(event) {
  event.stopPropagation();
  if (document.getElementById("add-category-img-up").classList.contains("dp-none")) {
    document.getElementById("add-category-img-up").classList.remove("dp-none");
    document.getElementById("add-category-img-down").classList.add("dp-none");
    document.getElementById("drop-down-category-list").classList.remove("dp-none");
    renderCategoryList();
  } else {
    closeCategoryList();
  }
}

function renderCategoryList() {
  document.getElementById("drop-down-category-list").innerHTML = "";
  for (let i = 0; i < category.length; i++) {
    document.getElementById("drop-down-category-list").innerHTML += categoryDropDownTemplate(i);
  }
}

function categoryDropDownTemplate(indexCategory) {
  return `<div class="categoryListElement" onclick="selectCategory(${indexCategory})">
            <span class="category">${category[indexCategory]}</span>
            </div>`;
}

function selectCategory(i) {
  document.getElementById("category").value = category[i];
  closeCategoryList();
}

function closeCategoryList() {
  document.getElementById("drop-down-category-list").classList.add("dp-none");
  document.getElementById("add-category-img-up").classList.add("dp-none");
  document.getElementById("add-category-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-category-list").innerHTML = "";
}

let main = document.getElementById("main");
let searchInput = document.getElementById("search");
let dropdown = document.getElementById("dropdown");
let pickedRepos = document.getElementById("picked");

function showOptions(repos) {
  let dropdownContent = document.querySelectorAll(".dropdown_content");
  clearSearch();

  for (let rep = 0; rep < 5; rep++) {
    let name = repos.items[rep].name;
    let owner = repos.items[rep].owner.login;
    let stars = repos.items[rep].stargazers_count;

    let dropdownContent = `<div class="dropdown_items" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
    dropdown.innerHTML += dropdownContent;
  }
}

function pickRepos(item) {
  let name = item.textContent;
  let owner = item.dataset.owner;
  let stars = item.dataset.stars;

  pickedRepos.innerHTML += `<div class="picked">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="button_close"></button></div>`;
}

async function getOptions(repositoriesPart) {
  repositoriesPart = searchInput.value;
  let repos = `https://api.github.com/search/repositories?q=${repositoriesPart}`;

  try {
    let response = await fetch(repos);
    if (response.ok) {
      let repositories = await response.json();
      showOptions(repositories);
    }
  } catch (error) {
    return null;
  }
}

function clearSearch() {
  dropdown.innerHTML = "";
}

dropdown.addEventListener("click", (evt) => {
  let target = evt.target;
  if (!target.classList.contains("dropdown_items")) {
    return;
  }
  pickRepos(target);
  searchInput.value = "";
  clearSearch();
});

pickedRepos.addEventListener("click", (evt) => {
  let target = evt.target;
  if (target.classList.contains("button_close")) {
    target.parentElement.remove();
  }
});

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}
const getPredictionsDebounce = debounce(getOptions, 300);
searchInput.addEventListener("input", getPredictionsDebounce);

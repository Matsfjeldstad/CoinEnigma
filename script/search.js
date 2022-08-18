// search bar
const searchBarBox = document.querySelector('.search-box-wrapper');
const searchInput = document.querySelector('#searchBarInput');
const searchIcon = document.querySelector('.search-icon');
// opens the searchbox
searchIcon.onclick = function openSearchBox() {
  searchBarBox.classList.toggle('open-search');
};

// closes the searchbox when clicking outside
window.onmouseup = function closeSearchBox(event) {
  if (
    event.target !== searchBarBox &&
    event.target.parentNode !== searchBarBox
  ) {
    searchBarBox.classList.remove('open-search');
  }
};
// fetches data from api based on the value of the search input on every keystroke
searchInput.onkeyup = function () {
  const searchResultsWrapper = document.querySelector(
    '.search-results-wrapper',
  );
  searchResultsWrapper.innerHTML = '';
  const searchValue = this.value.trim();
  const searchApi = `https://api.coinranking.com/v2/search-suggestions?query=${searchValue}`;
  searchResults();
  async function searchResults() {
    try {
      const response = await fetch(
        `https://noroffcors.herokuapp.com/${searchApi}`,
        {
          headers: {
            'x-access-token': `coinranking559ce0a80e3feb2fc252cce051dad60ffb6b8ed1dd63a930`,
          },
        },
      );
      const searchData = await response.json();
      const searchDataCoins = searchData.data.coins;
      for (let i = 0; i < 3; i++) {
        console.log(searchDataCoins[i]);
        searchResultsWrapper.innerHTML += `<a href="details.html?id=${searchDataCoins[i].uuid}&symbol=${searchDataCoins[i].name}">
                                            <div class="coin-icon" style=" background-image: url('${searchDataCoins[i].iconUrl}');"></div>${searchDataCoins[i].name}</a>`;
      }
      //   for (let searchDataCoins of searchDataCoins) {
      // searchResultsWrapper.innerHTML = `
      // <div class= "top-3-title">Top 3 results</div>
    } catch (e) {
      searchResultsWrapper.innerHTML = `<div class="error"> Oh no and error happend:</div>
                                 <div>${e}</div>`;
      searchBarBox.style.border = '3px solid red';
      searchResultsWrapper.style.color = 'red';
    }
  }
};

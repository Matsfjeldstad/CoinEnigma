let cryptoApiURL = 'https://api.coinranking.com/v2/coins';
const proxyUrl = 'https://noroffcors.herokuapp.com/';
const apiKey = 'coinranking559ce0a80e3feb2fc252cce051dad60ffb6b8ed1dd63a930';
const timeChange = document.querySelector('.crypto-time-change');
const corsUrl = proxyUrl + cryptoApiURL;
const tabelBody = document.querySelector('.tabel-body');
const tabelRow = document.querySelectorAll('tr');

(async function getCoins() {
  try {
    const response = await fetch(corsUrl, {
      headers: {
        'x-access-token': `${apiKey}`,
      },
    });
    const apiData = await response.json();
    const coinsData = apiData.data.coins;
    // removes the loading animaton when api is fetched or if there is an error
    tabelBody.innerHTML = '';
    // looping the json data to get info abou each cryto
    for (let coin of coinsData) {
      let coinPrice = Number(coin.price);
      const coinRank = coin.rank;
      const coinName = coin.name;
      const coinSymbol = coin.symbol;
      const coinIcon = coin.iconUrl;
      const coinId = coin.uuid;
      const coinMarketCap = Number(coin.marketCap);
      let coinChange = Number(coin.change);
      // Formating numbers to have a spesific amout of numbers or decimals.
      // prices over 100 have 2 decimal,
      // prices between one and 100 have 3.
      // and number under 1 will show atleast 4 segnificant numbers:
      function precise(number) {
        return number.toPrecision(4);
      }

      if (coinPrice < 1) {
        coinPrice = precise(coinPrice);
      } else if (coinPrice >= 1 && coinPrice < 100) {
        coinPrice = coinPrice.toFixed(3);
      } else if (coinPrice >= 100) {
        coinPrice = coinPrice.toFixed(2);
      }
      // format the marketcap number to display a more readable number
      let formatedMarkedcap = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumSignificantDigits: 4,
      }).format(coinMarketCap);
      // add class with styling to the coinChange to display if its a negative o
      let changeStyle = '';
      if (coinChange < 0) {
        changeStyle = 'bear';
      } else {
        changeStyle = 'bull';
        coinChange = `+ ${coinChange}`;
      }
      // add html to tabel with info from the api!
      tabelBody.innerHTML += `
        <tr>
        <td class="crypto-name">
        <a href="details.html?id=${coinId}&symbol=${coinSymbol}">
              <div class="crypto-name-wrapper">
                <div class="coin-ranking">${coinRank}</div>
                <div class="coin-icon" style="background-image: url('${coinIcon}');"></div>
                <div class="coin-name-ticker">
                  <div class="coin-name">${coinName}</div>
                  <div class="coin-ticker">${coinSymbol}</div>
                </div>
              </div>
              </a>
        </td>
            <td class="crypto-price"><div>$${coinPrice}</div><div class="MCsmall mobile-data">(${formatedMarkedcap})</div></td>
            <td class="crypto-marketcap desktop-data">${formatedMarkedcap}</td>
         <td class="crypto-time-change ${changeStyle}">${coinChange}%</td>
        </tr>
        `;
    }
  } catch (error) {
    tabelBody.innerHTML = `
    <tr>
    <td> Oh no! some error happend : ${error}</td>
    </tr>
    `;
  }
})();

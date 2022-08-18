const queryString = document.location.search;
const param = new URLSearchParams(queryString);
const idParam = param.get('id');
let coinInfoApi = `https://api.coinranking.com/v2/coin/` + idParam;
const proxyUrl = 'https://noroffcors.herokuapp.com/';
let corsUrl = proxyUrl + coinInfoApi;
const apiKey = 'coinranking559ce0a80e3feb2fc252cce051dad60ffb6b8ed1dd63a930';

const changeTimeButtons = document.querySelectorAll('.time-period');
const coinInfoHtml = document.querySelector('.crypto-info');
const basicPriceNameInfo = document.querySelector('.basic-price-name-info');
const supplyPercent = document.querySelector('.percent-supply');
const coinDescriptionHTML = document.querySelector('.description');
const athPercentDown = document.querySelector('.percent-ath');
const athBar = document.querySelector('.ath-visual .visual-after');
const circulatingSupplyBar = document.querySelector(
  '.total-supply-visual  .visual-after',
);
const websiteLinkWrapper = document.querySelector('.webpage-link');
const btcPriceWrapper = document.querySelector('.btc-price');

for (let button of changeTimeButtons) {
  button.onclick = function getdata() {
    coinInfoApi = `https://api.coinranking.com/v2/coin/${idParam}`;
    coinInfoApi += `?timePeriod=${this.dataset.timeframe}`;
    corsUrl = proxyUrl + coinInfoApi;
    getCoinInfo();
  };
}

async function getCoinInfo() {
  try {
    const infoResponse = await fetch(corsUrl, {
      headers: {
        'x-access-token': `${apiKey}`,
      },
    });
    const coinDatajson = await infoResponse.json();
    const coinInfo = coinDatajson.data.coin;
    const coinName = coinInfo.name;
    const coinSymbol = coinInfo.symbol;
    const coinIcon = coinInfo.iconUrl;
    const coinDescription = coinInfo.description;
    let coinPrice = Number(coinInfo.price);
    const coinRank = coinInfo.rank;
    let coinChange = Number(coinInfo.change);
    const coinATH = Number(coinInfo.allTimeHigh.price);
    const coinMarketCap = coinInfo.marketCap;
    const coinVolume = coinInfo['24hVolume'];
    const coinTotalSupply = coinInfo.supply.total;
    const coinCirculatinSupply = coinInfo.supply.circulating;
    const coinWebpage = coinInfo.websiteUrl;
    const coinCirculatingSupplyPercent =
      (coinCirculatinSupply * 100) / coinTotalSupply;
    const coinPriceFromATH = ((coinPrice - coinATH) * 100) / coinATH;
    const btcPrice = coinInfo.btcPrice;

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

    let formatNumber = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumSignificantDigits: 4,
    });

    const formatedVolume = formatNumber.format(coinVolume);
    const formatedMarkedcap = formatNumber.format(coinMarketCap);
    const formatedPrice = formatNumber.format(coinPrice);

    let changeStyle = '';
    if (coinChange < 0) {
      changeStyle = 'bear';
    } else {
      changeStyle = 'bull';
      coinChange = `+ ${coinChange}`;
    }

    document.title = `$${coinSymbol} - ${coinName}`;
    basicPriceNameInfo.innerHTML = `<div class="coin-name">
    <div class="icon" style="background-image: url(${coinIcon}">
    </div>
    <div>
      <h1>${coinName}</h1>
      <div>${coinSymbol}</div>
    </div>
  </div>
  <div class="price-wrapper">
    <div class="price-name">Price:</div>
    <div class="price-num">${formatedPrice}</div>
    <div class="price-change ${changeStyle}">
      ${coinChange}%
    </div>
  </div>
  `;

    coinInfoHtml.innerHTML = `<div>
    <div class="cryto-info-title">rank</div>
    <div class="crypto-info-value">#${coinRank}</div>
  </div>
  <div>
    <div class="cryto-info-title">market cap (24h)</div>
    <div class="crypto-info-value">${formatedMarkedcap}</div>
  </div>
  <div>
    <div class="cryto-info-title">volume (24h)</div>
    <div class="crypto-info-value">${formatedVolume}</div>
  </div>
  <div>
    <div class="cryto-info-title">circulating Supply</div>
    <div class="crypto-info-value">${coinCirculatinSupply} ${coinSymbol}</div>
  </div>`;

    supplyPercent.innerHTML = `${coinCirculatingSupplyPercent.toFixed(1)}%`;

    if (coinCirculatingSupplyPercent === Infinity) {
      circulatingSupplyBar.style.width = '100%';
    }

    circulatingSupplyBar.style.width = `${coinCirculatingSupplyPercent.toFixed(
      1,
    )}%`;

    athBar.style.width = `${coinPriceFromATH + 100}%`;
    athPercentDown.innerHTML = `${coinPriceFromATH.toFixed(2)}%  from ATH `;
    coinDescriptionHTML.innerHTML = coinDescription;
    websiteLinkWrapper.innerHTML = `<a href='${coinWebpage}'>${coinWebpage}</a>`;
    btcPriceWrapper.innerHTML = `${btcPrice} BTC`;
  } catch (e) {
    const mainwrapper = document.querySelector('.main-wrapper');
    mainwrapper.innerHTML = `Oh no somthing happend${e}`;
    mainwrapper.style.height = '100vh';
    mainwrapper.style.fontSize = '2rem';
  }
}
getCoinInfo();

const percentChange = document.querySelectorAll('.percent-change');
for (let i = 0; i < percentChange.length; i++) {
  const percentChangeData = percentChange[i].dataset.timeframe;
  let percentChangeApi = `https://api.coinranking.com/v2/coin/${idParam}?timePeriod=${percentChangeData}`;

  async function changePercentFunction() {
    try {
      const response = await fetch(`${proxyUrl}${percentChangeApi}`, {
        headers: {
          'x-access-token': `${apiKey}`,
        },
      });
      const responseJson = await response.json();
      percentChange[i].innerHTML = responseJson.data.coin.change;
      if (responseJson.data.coin.change < 0) {
        percentChange[i].classList.add('bear');
        percentChange[i].innerHTML = `${responseJson.data.coin.change} %`;
      } else {
        percentChange[i].classList.add('bull');
        percentChange[i].innerHTML = `+${responseJson.data.coin.change} %`;
      }
    } catch {}
  }
  changePercentFunction();
}

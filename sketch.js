let rainData;

function preload() {
  // 台北市即時雨量 API 位址
  let targetUrl = 'https://wic.gov.taipei/OpenData/API/Rain/Get?stationNo=&loginId=open_rain&dataKey=85452C1D';
  // 由於跨網域 (CORS) 限制，我們使用 allorigins 代理伺服器來讀取資料
  // 使用 allorigins 的 raw 模式，並加入隨機參數避免快取問題
  let url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl) + '&cb=' + Date.now();
  // 使用 loadJSON 取得資料，並在 console 印出結果方便偵錯
  rainData = loadJSON(url, 
    () => console.log("資料已成功載入:", rainData),
    () => console.error("無法從 API 取得資料，請檢查網路或代理伺服器狀態")
  );
}

function setup() {
  // 採用全螢幕畫面
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textSize(16);
}

function draw() {
  background(245);
  
  fill(30);
  textStyle(BOLD);
  text("台北市即時雨量資料 (單位: mm)", 20, 20);
  textStyle(NORMAL);
  
  if (rainData) {
    // 相容性處理：有些 API 會將陣列包在 records 或 data 欄位下
    let list = Array.isArray(rainData) ? rainData : (rainData.records || rainData.data || []);

    if (list.length > 0) {
    let x = 20;
    let y = 60;
    let lineHeight = 25;
    let columnWidth = 250;

    for (let i = 0; i < list.length; i++) {
      let station = list[i];
      let info = `${station.stationName}: ${station.rain}`;
      text(info, x, y);
      
      y += lineHeight;
      // 如果超出畫面高度，則換列顯示
      if (y > height - 40) {
        y = 60;
        x += columnWidth;
      }
    }
    } else {
      text("目前無雨量數據或資料格式不符", 20, 60);
    }
  } else {
    text("資料載入中或無法取得資料...", 20, 60);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

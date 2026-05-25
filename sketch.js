let rainData;

function preload() {
  // 台北市即時雨量 API 位址
  let url = 'https://wic.gov.taipei/OpenData/API/Rain/Get?stationNo=&loginId=open_rain&dataKey=85452C1D';
  // 使用 loadJSON 取得資料
  rainData = loadJSON(url);
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
  
  if (rainData && Array.isArray(rainData)) {
    let x = 20;
    let y = 60;
    let lineHeight = 25;
    let columnWidth = 250;

    for (let i = 0; i < rainData.length; i++) {
      let station = rainData[i];
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
    text("資料載入中或無法取得資料...", 20, 60);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

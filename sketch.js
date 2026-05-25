let rainData = [];
let lastUpdated = "";
const padding = 30;

// Mappa 地圖設定
let myMap;
let canvas;
let mappaInstance; 

// 地圖初始化參數：中心點設在台北市中心，縮放層級 12
const options = {
  lat: 25.045,
  lng: 121.54,
  zoom: 12,
  style: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

// 使用 corsproxy.io 代理伺服器
const apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://wic.gov.taipei/OpenData/API/Rain/Get?stationNo=&loginId=open_rain&dataKey=85452C1D');


function setup() {
  // 建立全螢幕畫布
  canvas = createCanvas(windowWidth, windowHeight);

  // 初始化 Mappa
  mappaInstance = new Mappa('Leaflet');

  // 初始化地圖並將其作為底圖圖層
  myMap = mappaInstance.tileMap(options);
  myMap.overlay(canvas);
 
  // 初始讀取資料
  fetchRainData();
 
  // 設定每 10 分鐘自動更新一次 (600,000 毫秒)
  setInterval(fetchRainData, 600000);
 
  textFont('sans-serif');
  textAlign(CENTER, CENTER);
}


function fetchRainData() {
  // 使用 p5.js 的 loadJSON 取得資料
  loadJSON(apiUrl, (data) => {
    console.log("資料回傳成功:", data);
   
    // 彈性檢查：有些 API 回傳直接是陣列，有些會包在 Data 屬性裡
    let actualData = Array.isArray(data) ? data : (data.Data || data.data || []);
   
    if (actualData.length > 0) {
      rainData = actualData;
      lastUpdated = new Date().toLocaleTimeString();
    }
  }, (err) => {
    console.error("無法取得 API 資料，請檢查網路連線或 CORS 限制:", err);
  });
}


function draw() {
  // 清除畫布，讓底下的地圖圖塊能夠顯示出來
  clear();

  // 繪製地圖上的數據點
  drawMapPoints();
  
  // 繪製左上角的 UI 面板
  drawOverlayUI();
}


function drawMapPoints() {
  for (let item of rainData) {
    // 取得經緯度 (API 回傳可能是 Lat/Lon 或 lat/lon)
    let lat = item.Lat || item.lat;
    let lon = item.Lon || item.lon;

    if (lat && lon) {
      // 將經緯度轉換為螢幕上的像素座標
      let pos = myMap.latLngToPixel(lat, lon);

      let sName = item.StationName || item.stationName || "未知";
      let r1 = parseFloat(item.Rain1hr || item.rain1hr) || 0;
      let diameter = r1 > 0 ? 10 + r1 * 2 : 6;

      // 設定點的顏色：有降雨顯示亮青色並增加外框，無雨顯示灰色
      if (r1 > 0) {
        fill(0, 255, 200, 200);
        stroke(255);
        strokeWeight(1);
        circle(pos.x, pos.y, diameter); // 雨量愈大，圓點愈大
      } else {
        fill(100, 100, 100, 150);
        noStroke();
        circle(pos.x, pos.y, diameter);
      }

      // 互動：當滑鼠靠近圓點時才顯示資訊
      let d = dist(mouseX, mouseY, pos.x, pos.y);
      if (d < diameter / 2 + 5) {
        noStroke();
        fill(255);
        textSize(12);
        text(`${sName}\n${r1.toFixed(1)} mm`, pos.x, pos.y + 20);
      }
    }
  }
}

function drawOverlayUI() {
  push();
  // 背景裝飾框
  fill(0, 0, 0, 150);
  noStroke();
  rect(10, 10, 300, 80, 5);
  
  // 文字資訊
  textAlign(LEFT, TOP);
  fill(255);
  textSize(20);
  text("台北市即時雨量地圖", 20, 20);
  
  fill(200);
  textSize(12);
  text(`最後同步: ${lastUpdated || '同步中...'}`, 20, 50);
  text("圓點大小代表 1hr 累積雨量", 20, 65);
  pop();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

const fs = require("fs");
const path = require("path");
const https = require("https");

// ----------------------
// CONFIG
// ----------------------
const googleDriveFileId = "1Ch-DXQrtB06ul1IXixIRBFWFm-cQgcYA"; // replace with your file ID
const outputPath = path.join(__dirname, "public", "images", "github-heatmap-weekly.svg");
const cellSize = 20;
const cellGap = 4;
const cornerRadius = 4;
const startWeekday = 0; // 0 = Sunday

const driveUrl = `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`;

// ----------------------
// FETCH JSON
// ----------------------
https.get(driveUrl, (res) => {
  let dataStr = "";

  res.on("data", (chunk) => (dataStr += chunk));
  res.on("end", () => {
    try {
      const data = JSON.parse(dataStr);
      generateHeatmap(data);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err.message);
    }
  });
}).on("error", (err) => {
  console.error("❌ Failed to fetch JSON:", err.message);
});

// ----------------------
// GENERATE HEATMAP SVG
// ----------------------
function generateHeatmap(data) {
  // GROUP INTO WEEKS
  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  let dayCounter = startWeekday;

  data.forEach((d) => {
    const dayIndex = dayCounter % 7;
    currentWeek[dayIndex] = d;
    dayCounter++;
    if (dayIndex === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });
  if (currentWeek.some((d) => d !== null)) weeks.push(currentWeek);

  // SVG dimensions
  const cols = weeks.length;
  const rows = 7;
  const width = cols * (cellSize + cellGap);
  const height = rows * (cellSize + cellGap);

  // Color scale
  function getColor(count) {
    if (!count) return "#ebedf0";
    if (count < 3) return "#c6e48b";
    if (count < 6) return "#7bc96f";
    if (count < 9) return "#239a3b";
    return "#196127";
  }

  // Generate squares
  let squares = "";
  weeks.forEach((week, col) => {
    week.forEach((day, row) => {
      const x = col * (cellSize + cellGap);
      const y = row * (cellSize + cellGap);
      const color = day ? getColor(day.contribution) : "#ebedf0";
      squares += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="${cornerRadius}" ry="${cornerRadius}" />\n`;
    });
  });

  // Wrap in SVG
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${squares}
</svg>
`;

  // Save SVG
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, svg.trim());
  console.log(`✅ Heatmap SVG saved to ${outputPath}`);
}

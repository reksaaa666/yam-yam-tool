let chart;
let notFollowBackData = [];

document.getElementById("analyzeBtn").addEventListener("click", analyze);
document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document.getElementById("searchBox").addEventListener("input", filterList);

async function analyze() {

  const followersFile = document.getElementById("followersFile").files[0];
  const followingFile = document.getElementById("followingFile").files[0];

  if (!followersFile || !followingFile) {
    alert("Upload both JSON files.");
    return;
  }

  document.getElementById("loading").classList.remove("hidden");

  const followersData = JSON.parse(await followersFile.text());
  const followingData = JSON.parse(await followingFile.text());

  const followers = new Set(
    followersData.map(item => item.string_list_data[0].value)
  );

  const following = new Set(
    followingData.relationships_following.map(item =>
      item.string_list_data[0].value
    )
  );

  const followBack = [...following].filter(user => followers.has(user));
  const notFollowBack = [...following].filter(user => !followers.has(user));
  notFollowBackData = notFollowBack;

  animateCounter("totalFollowers", followers.size);
  animateCounter("totalFollowing", following.size);
  animateCounter("followBack", followBack.length);
  animateCounter("notFollowBack", notFollowBack.length);

  createChart(followBack.length, notFollowBack.length);
  renderList(notFollowBack);

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function animateCounter(id, value) {
  let start = 0;
  const el = document.getElementById(id);
  const interval = setInterval(() => {
    start += Math.ceil(value / 30);
    if (start >= value) {
      start = value;
      clearInterval(interval);
    }
    el.textContent = start;
  }, 20);
}

function createChart(fb, nfb) {
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById("ratioChart"), {
    type: "doughnut",
    data: {
      labels: ["Follow Back", "Not Follow Back"],
      datasets: [{
        data: [fb, nfb],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });
}

function renderList(list) {
  const container = document.getElementById("resultList");
  container.innerHTML = list.map(u => `<div>${u}</div>`).join("");
}

function filterList() {
  const query = this.value.toLowerCase();
  renderList(
    notFollowBackData.filter(u =>
      u.toLowerCase().includes(query)
    )
  );
}

function downloadCSV() {
  const csv = "data:text/csv;charset=utf-8," +
    notFollowBackData.join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "not_follow_back.csv";
  link.click();
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

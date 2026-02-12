let notFollowBackData = [];

async function analyze() {
  const followersFile = document.getElementById("followersFile").files[0];
  const followingFile = document.getElementById("followingFile").files[0];

  if (!followersFile || !followingFile) {
    alert("Upload both JSON files first.");
    return;
  }

  document.getElementById("loading").classList.remove("hidden");

  try {
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
    notFollowBackData = [...following].filter(user => !followers.has(user));

    const ratio = ((followBack.length / following.size) * 100).toFixed(1);

    document.getElementById("stats").innerHTML = `
      <p><strong>Total Followers:</strong> ${followers.size}</p>
      <p><strong>Total Following:</strong> ${following.size}</p>
      <p><strong>Follow Back:</strong> ${followBack.length}</p>
      <p><strong>Not Follow Back:</strong> ${notFollowBackData.length}</p>
      <p><strong>Follow Back Ratio:</strong> ${ratio}%</p>
    `;

    displayResults(notFollowBackData);

    document.getElementById("stats").classList.remove("hidden");
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("resultControls").classList.remove("hidden");

  } catch (error) {
    alert("Invalid JSON file format.");
  }

  document.getElementById("loading").classList.add("hidden");
}

function displayResults(data) {
  const container = document.getElementById("results");
  container.innerHTML = data.map(user => `<div>${user}</div>`).join("");
}

function filterList() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = notFollowBackData.filter(user =>
    user.toLowerCase().includes(keyword)
  );
  displayResults(filtered);
}

function downloadCSV() {
  const csvContent = "data:text/csv;charset=utf-8,"
    + notFollowBackData.join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "not_follow_back.csv");
  document.body.appendChild(link);
  link.click();
}

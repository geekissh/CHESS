// Selected chess mode
let selectedMode = "live_rapid";
let data;

// Fetch data using XMLHttpRequest
function getData(link) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", link);
        request.send();

        request.onload = () => {
            if (request.status == 200) resolve(JSON.parse(request.response));
            else console.log("error fetching data");
        };
    });
}

// Main logic
async function main() {
    data = await getData("https://api.chess.com/pub/leaderboards");
    setList();
}

main();

// Set player list on the webpage
async function setList() {
    let players = data[selectedMode];
    let list = document.getElementsByClassName("playerList")[0];
    list.innerHTML = "";

    for (let i = 0; i < players.length; i++) {
        // Create HTML elements for player details
        let playerItemRank = "<div class='playerItemRank'>" + "# " + players[i].rank + "</div>";
        let playerAvatar = "<div class='playerAvatar'>" + "<img src='" + players[i].avatar + "'height='100%'>" + "</div>";
        let playerTitle = "<div class='playerTitle'>" + players[i].title + "</div>";
        let userName = "<div class='userName'>" + players[i].username + "</div>";
        let ratingText = "<div class='Rating'> Rating: </div>";
        let rating = "<div class='userName' style='color: rgb(52, 52, 52); position: absolute;left: 80%; margin-top: 2vh;'>" + players[i].score + "</div>";

        // Fetch country data and create HTML element for country
        let c = await getData(players[i].country);
        let country = "<div class='Country'>" + c.name + "</div>"

        // Check if player has no title and set a default value
        let playerTitleContent = players[i].title ? playerTitle : "<div class='playerTitleBlank'>N</div>";

        // Create the main player item HTML element
        let playerItem = "<div class='playerItem' id=" + players[i].url + ">" + playerItemRank + playerAvatar + playerTitleContent + userName + ratingText + rating + country + "</div>" + "<hr class='lineSeparate'>";
        list.innerHTML += playerItem;
    }

    // Finish loading - hide the loading screen
    document.getElementsByClassName('LoadingScreen')[0].classList.toggle("fadeOut", true);

    // Add click event listeners to all player items to open player's URL on click
    let allPlayers = document.getElementsByClassName("playerItem");
    for (let i = 0; i < allPlayers.length; i++) {
        allPlayers[i].addEventListener("click", () => window.open(allPlayers[i].id));
    }
}

// Change selected chess mode and update player list
function changeMode(text) {
    selectedMode = text === "Rapid" ? "live_rapid" : text.toLowerCase();
    setList();
}

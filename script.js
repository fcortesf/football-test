document.addEventListener("DOMContentLoaded", function() {
    const playerNames = ["Fer", "Jorgillo", "Rubal", "Grandu", "Joselu", "Redo", "Pablillo", "Juanky", "Rober", "Tomas", "Josema", "Alvaro", "Mikel", "Jhony", "Mario"];
    const playerInputs = document.getElementById("playerInputs");

    playerNames.forEach((name, i) => {
        let div = document.createElement("div");
        div.className = "player-input";
        div.innerHTML = `
            <input type="text" id="playerName${i}" value="${name}" readonly>
            <input type="number" id="playerSkill${i}" placeholder="Habilidad (1-10)" min="1" max="10" required>
            <select id="playerAvoid${i}" multiple>
                <option value="">No jugar con...</option>
                ${playerNames.map((n, j) => `<option value="player${j}">${n}</option>`).join('')}
            </select>
        `;
        playerInputs.appendChild(div);
    });
});

function generateTeams() {
    const players = [];
    for (let i = 0; i < 15; i++) {
        players.push({
            name: document.getElementById(`playerName${i}`).value,
            skill: parseInt(document.getElementById(`playerSkill${i}`).value),
            avoid: Array.from(document.getElementById(`playerAvoid${i}`).selectedOptions).map(option => option.value)
        });
    }

    if (!validateInput(players)) {
        alert("Por favor, ingresa todos los datos correctamente.");
        return;
    }

    const teams = createTeams(players);
    displayTeams(teams);
}

function validateInput(players) {
    return players.every(player => player.name && player.skill >= 1 && player.skill <= 10);
}

function createTeams(players) {
    let teams = [[], [], []];
    let teamSums = [0, 0, 0];

    players.sort((a, b) => b.skill - a.skill);

    players.forEach(player => {
        let bestTeam = -1;
        let bestSum = Infinity;

        for (let i = 0; i < teams.length; i++) {
            if (teams[i].some(p => player.avoid.includes(p.name)) || player.avoid.some(name => teams[i].map(p => p.name).includes(name))) {
                continue;
            }

            if (teamSums[i] < bestSum) {
                bestSum = teamSums[i];
                bestTeam = i;
            }
        }

        if (bestTeam >= 0) {
            teams[bestTeam].push(player);
            teamSums[bestTeam] += player.skill;
        }
    });

    return teams;
}

function displayTeams(teams) {
    const teamNames = ["Team Ironman", "Team Captain America", "Team Thor"];
    const teamsOutput = document.getElementById("teamsOutput");
    teamsOutput.innerHTML = "";
    teamsOutput.style.display = "block";

    teams.forEach((team, index) => {
        let teamDiv = document.createElement("div");
        teamDiv.className = "team";
        teamDiv.innerHTML = `<h2>${teamNames[index]}</h2><ul>${team.map(player => `<li>${player.name} (Habilidad: ${player.skill})</li>`).join('')}</ul><p>Suma de habilidades: ${team.reduce((sum, player) => sum + player.skill, 0)}</p>`;
        teamsOutput.appendChild(teamDiv);
    });
}

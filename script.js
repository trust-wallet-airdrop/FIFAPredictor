document.addEventListener('DOMContentLoaded', function() {
    fetch('matches.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            const previousMatches = lines.map(line => {
                const [teamA, teamB, scoreA, scoreB] = line.split(',');
                return { teamA: teamA.trim(), teamB: teamB.trim(), scoreA: parseInt(scoreA), scoreB: parseInt(scoreB) };
            });
            // Stocker les matchs précédents globalement
            window.previousMatches = previousMatches;
        })
        .catch(error => console.error('Erreur lors du chargement du fichier:', error));
});

function generatePrediction() {
    const teamA = document.getElementById('teamAInput').value.trim().toLowerCase();
    const teamB = document.getElementById('teamBInput').value.trim().toLowerCase();

    if (!teamA || !teamB) {
        document.getElementById('prediction').innerText = 'Veuillez entrer les noms des deux équipes.';
        return;
    }

    // Vérifier si les matchs précédents sont chargés
    if (!window.previousMatches) {
        document.getElementById('prediction').innerText = 'Les données des matchs précédents ne sont pas encore chargées.';
        return;
    }

    // Compter les victoires et les scores moyens pour chaque équipe
    let teamAVictories = 0;
    let teamBVictories = 0;
    let teamAScoreTotal = 0;
    let teamBScoreTotal = 0;
    let teamAMatchCount = 0;
    let teamBMatchCount = 0;

    window.previousMatches.forEach(match => {
        const matchTeamA = match.teamA.toLowerCase();
        const matchTeamB = match.teamB.toLowerCase();

        if (matchTeamA === teamA) {
            teamAScoreTotal += match.scoreA;
            teamAMatchCount++;
            if (match.scoreA > match.scoreB) {
                teamAVictories++;
            }
        } else if (matchTeamB === teamA) {
            teamAScoreTotal += match.scoreB;
            teamAMatchCount++;
            if (match.scoreB > match.scoreA) {
                teamAVictories++;
            }
        }

        if (matchTeamA === teamB) {
            teamBScoreTotal += match.scoreA;
            teamBMatchCount++;
            if (match.scoreA > match.scoreB) {
                teamBVictories++;
            }
        } else if (matchTeamB === teamB) {
            teamBScoreTotal += match.scoreB;
            teamBMatchCount++;
            if (match.scoreB > match.scoreA) {
                teamBVictories++;
            }
        }
    });

    // Calculer les scores moyens et les arrondir
    const teamAAverageScore = teamAMatchCount ? Math.round(teamAScoreTotal / teamAMatchCount) : 0;
    const teamBAverageScore = teamBMatchCount ? Math.round(teamBScoreTotal / teamBMatchCount) : 0;

    // Prédire le résultat basé sur les victoires
    let prediction;
    if (teamAVictories > teamBVictories) {
        prediction = `Victoire de ${teamA} !`;
    } else if (teamBVictories > teamAVictories) {
        prediction = `Victoire de ${teamB} !`;
    } else {
        prediction = 'Ce match semble être compliqué, la prédiction est un match nul donc vous pouvez miser sur une double chance de l\'équipe non favorite';
    }

    // Prédire le score exact
    const scorePrediction = `Score prédit : ${teamAAverageScore} - ${teamBAverageScore}`;

    document.getElementById('prediction').innerText = `${prediction}\n${scorePrediction}`;
}

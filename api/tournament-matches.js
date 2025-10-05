//https://sf15-terminlister-prod-app.azurewebsites.net/ta/TournamentMatches/?tournamentId=436311


export default async function handler(req, res) {
  const { tournamentId } = req.query;

  const apiUrl = `https://sf15-terminlister-prod-app.azurewebsites.net/ta/TournamentMatches/?tournamentId=436311`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Noe gikk galt med henting av data.' });
  }
}

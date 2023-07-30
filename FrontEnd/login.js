async function ajoutListenerLogin() {
  const formulaireLogin = document.querySelector(".formulaire-login");
  formulaireLogin.addEventListener("submit", function (event) {
    event.preventDefault(); // bloquer le comportement le changement d 'URL et chargementde la page. la communication avec le serveur est gérer par fetch

    // Création de l’objet du nouveau login, récupération valeur email et mot de passe
    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    function loginRequest() {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: chargeUtile,
        headers: { "content-Type": "application/json" }
      })
      .then((response) => response.json()
      .then((data) => {

        // Vérification de la réponse de l'API
        if (data.userId && data.token) {
          // Connexion réussie
          // Stockage de l'identifiant utilisateur et du token dans le navigateur
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("token", data.token);
          // Redirection vers la page d'accueil ou une autre page
          window.location.href = "index.html";
        } 
        else if (response.status === 404) {
          alert(data.message);
        } 
        else if (response.status === 401) {
          alert("Not Authorized");
        }

      })
      )
    }
    
    loginRequest();

  })
}


ajoutListenerLogin();
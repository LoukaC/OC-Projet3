export function ajoutListenerLogin() {
  const formulaireLogin = document.querySelector(".formulaire-login");
  formulaireLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    // Création de l’objet du nouveau login, récupération valeur email et mot de passe
    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    function login() {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: chargeUtile,
        headers: { "content-Type": "apllication/json" }
      });
    }
  });
}


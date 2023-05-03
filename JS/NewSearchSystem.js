/*****************************************************  BASES  ********************************************************************/

/** ---------- FETCH DATA pour récupérer les infos des photographes du fichier JSON ---------- */

async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.querySelector("#searchbar");
  const searchBarIngredient = document.getElementById("ingredient");
  const searchBarAppareils = document.getElementById("appareils");
  const searchBarUstensiles = document.getElementById("ustensiles");
  const recipesContainer = document.querySelector(".all-card-container");

  const divCard = document.querySelectorAll(".div-card");
  const errorMessage = document.querySelector("#error-search");
  /*********************************************  ALGORYTHME DE RECHERCHE V1 *********************************************************/

  /** Recherche par noms des plats **/

  searchBar.addEventListener("keyup", function () {
    const searchDish = searchBar.value.toLowerCase();

    if (searchDish === "") {
      recipesContainer.style.display = "grid";
    }

    getRecipes().then((data) => {
      const recipesList = data.recipes;

      const filteredRecipes = recipesList.filter((recipe) => {
        return recipe.name.toLowerCase().includes(searchDish);
      });

      console.log(filteredRecipes);
      console.log(divCard);
      divCard.forEach((card) => {
        const divTitle = card.getAttribute("card-title").toLowerCase();
        if (
          divTitle.includes(
            filteredRecipes.map((recipe) => recipe.name.toLowerCase())
          )
        ) {
          card.classList.add("show-card");
          card.classList.remove("hide-card");
          console.log("la recette est inclue");
        } else {
          card.classList.add("hide-card");
          card.classList.remove("show-card");
          console.log("la recette n'est pas inclue");
        }
      });
    });
  });

  /** recherche par ingrédients **/

  searchBarIngredient.addEventListener("keyup", function () {
    const searchIngredient = searchBarIngredient.value.toLowerCase();

    getRecipes().then((data) => {
      const ingredientsList = data.recipes;
      const filteredIngredients = ingredientsList.filter((recipe) => {
        return recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchIngredient)
        );
      });
      console.log(filteredIngredients);
      filteredIngredients.forEach((e) => {
        /** Pour chaqque element de notre ingredientList */
        /** Element du DOM */
        const suggestionIngredients = document.getElementById(
          "suggestions-ingredient"
        );
        const pIngredient =
          document.createElement("p"); /** Nous créeons un lien */
        pIngredient.setAttribute("id", "pIngredient");
        /** Texte et implémentation*/
        pIngredient.textContent =
          e; /** pour chaque lien crée nous ajoutons en texte un ingrédients */
        suggestionIngredients.appendChild(
          pIngredient
        ); /** notre DIV suggestion-ingredient enfante de chaque lien 
        crée précédemment */
      });
    });
  });

  /** Recherche par appliance **/

  searchBarAppareils.addEventListener("keyup", function () {
    const searchAppliance = searchBarAppareils.value.toLowerCase();
    getRecipes().then((data) => {
      const recipesList = data.recipes;
      const filteredRecipes = recipesList.filter((recipe) => {
        return recipe.appliance.toLowerCase().includes(searchAppliance);
      });
      console.log(filteredRecipes);
    });
  });

  /** Recherche par ustensils **/

  searchBarUstensiles.addEventListener("keyup", function () {
    const searchUstensil = searchBarUstensiles.value.toLowerCase();
    getRecipes().then((data) => {
      const recipesList = data.recipes;
      const filteredRecipes = recipesList.filter((recipe) => {
        return recipe.ustensils.some((ustensil) => {
          return ustensil.toLowerCase().includes(searchUstensil);
        });
      });
      console.log(filteredRecipes);
    });
  });

  /** Affichage **/

  function displayIngredientList() {
    const divIngredient = document.getElementById("suggestions-ingredient");
    divIngredient.style.display = "grid";
    const chevronIngredient = document.querySelector(".chevron-ingredients");
    chevronIngredient.style.transform = "rotate(180deg)";
  }
});

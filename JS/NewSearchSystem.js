/*****************************************************  BASES  ********************************************************************/

/** ---------- FETCH DATA pour récupérer les infos des photographes du fichier JSON ---------- */

async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

/**** BASE ****/

function searchAlgoV1() {
  const searchBar = document.querySelector("#searchbar");
  const searchBarIngredient = document.getElementById("ingredient");
  const searchBarAppareils = document.getElementById("appareils");
  const searchBarUstensiles = document.getElementById("ustensiles");
  const recipesContainer = document.querySelector(".all-card-container");
  const divCard = document.querySelectorAll(".div-card");
  const divTitle = document.querySelectorAll(".card-title");
  const errorMessage = document.querySelector("#error-search");
  /****  ALGORYTHME DE RECHERCHE V1 ****/

  /** Recherche par noms des plats **/

  searchBar.addEventListener("keyup", function () {
    const searchDish = searchBar.value.toLowerCase();
    if (searchDish.length > 3) {
      getRecipes().then((data) => {
        const recipesList = data.recipes;

        const filteredRecipes = recipesList.filter((recipe) => {
          return recipe.name.toLowerCase().includes(searchDish);
        });

        console.log(filteredRecipes);

        divCard.forEach((card, index) => {
          const title = divTitle[index].textContent.toLowerCase();
          if (!title.includes(searchDish)) {
            card.classList.add("hide-card");
            card.classList.remove("show-card");
          } else {
            card.classList.add("show-card");
            card.classList.remove("hide-card");
          }
        });
      });
    }
    if (searchDish == "") {
      divCard.forEach((card) => {
        card.classList.add("show-card");
        card.classList.remove("hide-card");
      });
    }
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
}

/** Initialisation des données des recipes pour la recherche */
async function initSearch() {
  const { recipes } =
    await getRecipes(); /** Récupére les données des récipes avant recherche*/
  searchAlgoV1(
    recipes
  ); /** Apelle de la fonction de rercherche des données des récipes */
}

initSearch();

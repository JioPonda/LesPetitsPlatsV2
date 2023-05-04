async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

function searchByName(searchDish) {
  const cardTitle = document.querySelectorAll(".card-title");
  const card = document.querySelectorAll(".div-card");

  getRecipes().then((data) => {
    const recipesList = data.recipes;
    const filteredRecipes = recipesList.filter((recipe) => {
      return recipe.name.toLowerCase().indexOf(searchDish) !== -1;
    });

    console.log(filteredRecipes);

    card.forEach((card, index) => {
      const title = cardTitle[index].textContent.toLowerCase();
      const filteredRecipeNames = filteredRecipes.map((recipe) =>
        recipe.name.toLowerCase()
      );
      if (!filteredRecipeNames.includes(title)) {
        card.classList.add("hide-card");
        card.classList.remove("show-card");
      } else {
        card.classList.add("show-card");
        card.classList.remove("hide-card");
      }
    });
  });
}

function searchByIngredients(searchDish) {
  const cardIngretient = document.querySelectorAll(".span-ingredient");
  const card = document.querySelectorAll(".div-card");

  getRecipes().then((data) => {
    const ingredientsList = data.recipes;
    const filteredIngredients = ingredientsList.filter((recipe) => {
      return recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient.toLowerCase().indexOf(searchDish) !== -1
      );
    });
    console.log(filteredIngredients);

    card.forEach((card, index) => {
      const ingredients = cardIngretient[index].textContent.toLowerCase();
      if (
        !filteredIngredients.some((recipe) =>
          recipe.ingredients.some((ingredient) =>
            ingredients.includes(ingredient.ingredient.toLowerCase())
          )
        )
      ) {
        card.classList.add("hide-card");
        card.classList.remove("show-card");
      } else {
        card.classList.add("show-card");
        card.classList.remove("hide-card");
      }
    });
  });
}

function searchAlgoV1() {
  const searchBar = document.querySelector("#searchbar");
  const card = document.querySelectorAll(".div-card");

  searchBar.addEventListener("keyup", function () {
    const searchDish = searchBar.value.toLowerCase();
    if (searchDish.length >= 3) {
      searchByName(searchDish);
      searchByIngredients(searchDish);
    } else {
      const card = document.querySelectorAll(".div-card");
      card.forEach((card) => {
        card.classList.add("show-card");
        card.classList.remove("hide-card");
      });
    }
    if (searchDish.length < 3) {
      card.forEach((card) => {
        card.classList.add("show-card");
        card.classList.remove("hide-card");
      });
    }
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

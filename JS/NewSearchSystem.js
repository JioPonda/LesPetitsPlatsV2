/** ---------- FETCH DATA pour récupérer les infos des photographes du fichier JSON ---------- */

async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

function recipesFactory(data) {
  const {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = data;
  const clock = "assets/clock.png";

  function getRecipesCardDOM() {
    /** Squelette de la card */
    const divCard = document.createElement("article");
    divCard.setAttribute("class", "div-card");
    const divGreyZone = document.createElement("div");
    divGreyZone.setAttribute("class", "grey-zone");
    const divCardInfos = document.createElement("div");
    divCardInfos.setAttribute("class", "card-infos");
    const divRecipes = document.createElement("div");
    divRecipes.setAttribute("class", "div-recipes");
    const divDescription = document.createElement("div");
    divDescription.setAttribute("class", "div-description");
    /** texte de la card */
    const cardTitle = document.createElement("h2");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.textContent = name;
    const divTime = document.createElement("div");
    divTime.setAttribute("class", "div-time");
    const cardClock = document.createElement("img");
    cardClock.setAttribute("class", "card-clock");
    cardClock.setAttribute("src", clock);
    const cardTime = document.createElement("p");
    cardTime.setAttribute("class", "card-time");
    cardTime.textContent = time + "min";
    const cardSpan = document.createElement("span");
    cardSpan.setAttribute("class", "span-ingredient");
    ingredients.forEach((ingredient) => {
      if (ingredient.unit === " " && ingredient.quantity === " ") {
        const cardIngredient = document.createElement("p");
        cardIngredient.setAttribute("class", "card-ingredient");
        cardIngredient.innerHTML =
          cardIngredient.textContent + ingredient.ingredient;
        cardSpan.appendChild(cardIngredient);
      } else {
        const cardIngredient = document.createElement("p");
        cardIngredient.setAttribute("class", "card-ingredient");
        cardIngredient.innerHTML =
          cardIngredient.textContent +
          ingredient.ingredient +
          " : " +
          ingredient.quantity +
          " " +
          ingredient.unit;
        cardSpan.appendChild(cardIngredient);
      }
    });
    const cardDescription = document.createElement("p");
    cardDescription.setAttribute("class", "card-description");
    cardDescription.textContent = description;

    divCard.appendChild(divGreyZone);
    divCard.appendChild(divCardInfos);
    divCardInfos.appendChild(divRecipes);
    divRecipes.appendChild(cardTitle);
    divRecipes.appendChild(cardSpan);
    divCardInfos.appendChild(divDescription);
    divTime.appendChild(cardClock);
    divTime.appendChild(cardTime);
    divDescription.appendChild(divTime);
    divDescription.appendChild(cardDescription);

    return divCard;
  }

  console.log(
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  );
  return {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getRecipesCardDOM,
  };
}

/**** BASE ****/

function searchAlgoV1() {
  const searchBar = document.querySelector("#searchbar");
  const searchBarIngredient = document.getElementById("ingredient");
  const searchBarAppareils = document.getElementById("appareils");
  const searchBarUstensiles = document.getElementById("ustensiles");
  const recipesContainer = document.querySelector(".all-card-container");
  const card = document.querySelectorAll(".div-card");
  const cardTitle = document.querySelectorAll(".card-title");
  const cardIngretient = document.querySelectorAll(".span-ingredient");
  const cardDescription = document.querySelectorAll(".card-description");
  const errorMessage = document.querySelector("#error-search");

  /****  ALGORYTHME DE RECHERCHE V1 ****/

  searchBar.addEventListener("keyup", function () {
    /****/
    /****/
    /** Recherche par noms des plats **/

    const searchDish = searchBar.value.toLowerCase();
    if (searchDish.length >= 3) {
      getRecipes().then((data) => {
        const recipesList = data.recipes;
        const filteredRecipes = recipesList.filter((recipe) => {
          return recipe.name.toLowerCase().includes(searchDish);
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

    /****/
    /****/
    /** recherche par ingrédients **/

    getRecipes().then((data) => {
      const ingredientsList = data.recipes;
      const filteredIngredients = ingredientsList.filter((recipe) => {
        return recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchDish)
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

    /****/
    /****/
    /** Recherche par appliance **/

    // getRecipes().then((data) => {
    //   const recipesList = data.recipes;
    //   const filteredRecipes = recipesList.filter((recipe) => {
    //     return recipe.appliance.toLowerCase().includes(searchDish);
    //   });
    //   console.log(filteredRecipes);
    // });

    /****/
    /****/
    /** Recherche par ustensils **/

    //   getRecipes().then((data) => {
    //     const recipesList = data.recipes;
    //     const filteredRecipes = recipesList.filter((recipe) => {
    //       return recipe.ustensils.some((ustensil) => {
    //         return ustensil.toLowerCase().includes(searchDish);
    //       });
    //     });
    //     console.log(filteredRecipes);
    //   });
    // });

    /****/
    /****/
    /** recherche dans la barre ingrédients **/

    // searchBarIngredient.addEventListener("keyup", function () {
    //   const searchIngredient = searchBarIngredient.value.toLowerCase();

    //   getRecipes().then((data) => {
    //     const ingredientsList = data.recipes;
    //     const filteredIngredients = ingredientsList.filter((recipe) => {
    //       return recipe.ingredients.some((ingredient) =>
    //         ingredient.ingredient.toLowerCase().includes(searchIngredient)
    //       );
    //     });
    //     console.log(filteredIngredients);
    //   });
    // });

    /****/
    /****/
    /** Recherche dans la barre appliance **/

    // searchBarAppareils.addEventListener("keyup", function () {
    //   const searchAppliance = searchBarAppareils.value.toLowerCase();
    //   getRecipes().then((data) => {
    //     const recipesList = data.recipes;
    //     const filteredRecipes = recipesList.filter((recipe) => {
    //       return recipe.appliance.toLowerCase().includes(searchAppliance);
    //     });
    //     console.log(filteredRecipes);
    //   });
    // });

    /****/
    /****/
    /** Recherche dans la barre ustensils **/

    // searchBarUstensiles.addEventListener("keyup", function () {
    //   const searchUstensil = searchBarUstensiles.value.toLowerCase();
    //   getRecipes().then((data) => {
    //     const recipesList = data.recipes;
    //     const filteredRecipes = recipesList.filter((recipe) => {
    //       return recipe.ustensils.some((ustensil) => {
    //         return ustensil.toLowerCase().includes(searchUstensil);
    //       });
    //     });
    //     console.log(filteredRecipes);
    //   });
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

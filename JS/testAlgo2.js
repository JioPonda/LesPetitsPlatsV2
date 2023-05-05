/** ---------- FETCH DATA pour récupérer les infos des recettes du fichier JSON ---------- */

async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

function filteredCardFactory(data) {
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

  function getFilteredCardDOM() {
    /** Squelette de la card */
    const filteredCard = document.createElement("article");
    filteredCard.setAttribute("class", "filtered-card");
    const filteredGreyZone = document.createElement("div");
    filteredGreyZone.setAttribute("class", "filtered-grey-zone");
    const filteredCardInfos = document.createElement("div");
    filteredCardInfos.setAttribute("class", "filtered-card-infos");
    const filteredRecipes = document.createElement("div");
    filteredRecipes.setAttribute("class", "filtered-recipes");
    const filteredDescription = document.createElement("div");
    filteredDescription.setAttribute("class", "filtered-description");
    /** texte de la card */
    const filteredCardTitle = document.createElement("h2");
    filteredCardTitle.setAttribute("class", "filtered-card-title");
    filteredCardTitle.textContent = name;
    const filteredTime = document.createElement("div");
    filteredTime.setAttribute("class", "filtered-div-time");
    const filteredCardClock = document.createElement("img");
    filteredCardClock.setAttribute("class", "filtered-card-clock");
    filteredCardClock.setAttribute("src", clock);
    const filteredCardTime = document.createElement("p");
    filteredCardTime.setAttribute("class", "filtered-card-time");
    filteredCardTime.textContent = time + "min";
    const filteredCardSpan = document.createElement("span");
    filteredCardSpan.setAttribute("class", "filtered-span-ingredient");
    ingredients.forEach((ingredient) => {
      if (ingredient.unit === " " && ingredient.quantity === " ") {
        const filteredCardIngredient = document.createElement("p");
        filteredCardIngredient.setAttribute(
          "class",
          "filtered-card-ingredient"
        );
        filteredCardIngredient.innerHTML =
          filteredCardIngredient.textContent + ingredient.ingredient;
        filteredCardSpan.appendChild(filteredCardIngredient);
      } else {
        const filteredCardIngredient = document.createElement("p");
        filteredCardIngredient.setAttribute(
          "class",
          "filtered-card-ingredient"
        );
        filteredCardIngredient.innerHTML =
          filteredCardIngredient.textContent +
          ingredient.ingredient +
          " : " +
          ingredient.quantity +
          " " +
          ingredient.unit;
        filteredCardSpan.appendChild(filteredCardIngredient);
      }
    });
    const filteredcardDescription = document.createElement("p");
    filteredcardDescription.setAttribute("class", "filtered-card-description");
    filteredcardDescription.textContent = description;

    filteredCard.appendChild(filteredGreyZone);
    filteredCard.appendChild(filteredCardInfos);
    filteredCardInfos.appendChild(filteredRecipes);
    filteredRecipes.appendChild(filteredCardTitle);
    filteredRecipes.appendChild(filteredCardSpan);
    filteredCardInfos.appendChild(filteredDescription);
    filteredTime.appendChild(filteredCardClock);
    filteredTime.appendChild(filteredCardTime);
    filteredDescription.appendChild(filteredTime);
    filteredDescription.appendChild(filteredcardDescription);

    return filteredCard;
  }

  return {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getFilteredCardDOM,
  };
}

function searchAlgoV1() {
  const searchBar = document.querySelector("#searchbar");
  const searchBarIngredient = document.getElementById("ingredient");
  const searchBarAppareils = document.getElementById("appareils");
  const searchBarUstensiles = document.getElementById("ustensiles");
  const recipesContainer = document.querySelector(".all-card-container");
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const card = document.querySelectorAll(".div-card");
  const cardTitle = document.querySelectorAll(".card-title");
  const cardIngretient = document.querySelectorAll(".span-ingredient");
  const cardDescription = document.querySelectorAll(".card-description");
  const errorMessage = document.querySelector("#error-search");

  /****  ALGORYTHME DE RECHERCHE V1 ****/

  searchBar.addEventListener("keyup", function () {
    const searchDish = searchBar.value.toLowerCase();
    if (searchDish.length >= 3) {
      recipesContainer.style.display = "none";
      filteredCardContainer.style.display = "grid";
      getRecipes().then((data) => {
        const recipesList = data.recipes;
        const filteredRecipes = recipesList.filter((recipe) => {
          return recipe.name.toLowerCase().includes(searchDish);
        });
        const filteredIngredients = recipesList.filter((recipe) => {
          return recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(searchDish)
          );
        });
        const filteredAppliance = recipesList.filter((appliance) => {
          return appliance.appliance.toLowerCase().includes(searchDish);
        });
        const filteredUstensils = recipesList.filter((recipe) => {
          return recipe.ustensils.some((ustensil) => {
            return ustensil.toLowerCase().includes(searchDish);
          });
        });
        console.log(filteredRecipes);
        console.log(filteredRecipes);
        console.log(filteredIngredients);
        console.log(filteredAppliance);
        console.log(filteredUstensils);
        filteredCardContainer.innerHTML = "";

        /****/
        /****/
        /** Recherche par noms des plats **/
        filteredRecipes.forEach((recipes) => {
          const filteredModelpage = filteredCardFactory(recipes);
          const filteredCardDOMpage = filteredModelpage.getFilteredCardDOM();
          filteredCardContainer.appendChild(filteredCardDOMpage);
        });
        /****/
        /****/
        /** recherche par ingrédients **/
        filteredIngredients.forEach((ingredient) => {
          const filteredModelpage = filteredCardFactory(ingredient);
          const filteredCardDOMpage = filteredModelpage.getFilteredCardDOM();
          filteredCardContainer.appendChild(filteredCardDOMpage);
        });
        filteredAppliance.forEach((appliance) => {
          const filteredModelpage = filteredCardFactory(appliance);
          const filteredCardDOMpage = filteredModelpage.getFilteredCardDOM();
          filteredCardContainer.appendChild(filteredCardDOMpage);
        });
        filteredUstensils.forEach((ustensil) => {
          const filteredModelpage = filteredCardFactory(ustensil);
          const filteredCardDOMpage = filteredModelpage.getFilteredCardDOM();
          filteredCardContainer.appendChild(filteredCardDOMpage);
        });
      });
      if (searchDish.length < 3) {
        recipesContainer.style.display = "grid";
        filteredCardContainer.style.display = "none";
        filteredCardContainer.innerHTML = "";
      }
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

/** VERSION AVEC BUG DE DOUBLONS **/
// searchBar.addEventListener("keyup", function () {
//   /****/
//   /****/
//   /** Recherche par noms des plats **/

//   const searchDish = searchBar.value.toLowerCase();
//   if (searchDish.length >= 3) {
//     recipesContainer.style.display = "none";
//     filteredCardContainer.style.display = "grid";
//     getRecipes().then((data) => {
//       const recipesList = data.recipes;
//       const filteredRecipes = recipesList.filter((recipe) => {
//         return recipe.name.toLowerCase().includes(searchDish);
//       });

//       console.log(filteredRecipes);
//       filteredCardContainer.innerHTML = "";

//       filteredRecipes.forEach((recipes) => {
//         const filteredModelPage = filteredCardFactory(recipes);
//         const filteredCardDOMpage = filteredModelPage.getFilteredCardDOM();
//         filteredCardContainer.appendChild(filteredCardDOMpage);
//       });
//     });

//     /****/
//     /****/
//     /** recherche par ingrédients **/

//     getRecipes().then((data) => {
//       const recipesList = data.recipes;
//       const filteredIngredients = recipesList.filter((recipe) => {
//         return recipe.ingredients.some((ingredient) =>
//           ingredient.ingredient.toLowerCase().includes(searchDish)
//         );
//       });

//       console.log(filteredIngredients);

//       filteredIngredients.forEach((ingredients) => {
//         const filteredModelPage = filteredCardFactory(ingredients);
//         const filteredCardDOMpage = filteredModelPage.getFilteredCardDOM();
//         filteredCardContainer.appendChild(filteredCardDOMpage);
//       });
//     });

//     /****/
//     /****/
//     /** Recherche par appliance **/

//     getRecipes().then((data) => {
//       const recipesList = data.recipes;
//       const filteredAppliance = recipesList.filter((appliance) => {
//         return appliance.appliance.toLowerCase().includes(searchDish);
//       });

//       console.log(filteredAppliance);

//       filteredAppliance.forEach((ingredients) => {
//         const filteredModelPage = filteredCardFactory(ingredients);
//         const filteredCardDOMpage = filteredModelPage.getFilteredCardDOM();
//         filteredCardContainer.appendChild(filteredCardDOMpage);
//       });
//     });
//   }

//   if (searchDish.length < 3) {
//     recipesContainer.style.display = "grid";
//     filteredCardContainer.style.display = "none";
//     filteredCardContainer.innerHTML = "";
//   }
// });
// }

/** RECHERCHE DANS LES BARRE DE TAGS **/
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

// VERSION FONCTIONELLE MAIS RECHERCHE DANS LES CARDS

// function searchAlgoV2() {
//   const searchBar = document.querySelector("#searchbar");
//   const searchBarIngredient = document.getElementById("ingredient");
//   const searchBarAppareils = document.getElementById("appareils");
//   const searchBarUstensiles = document.getElementById("ustensiles");
//   const recipesContainer = document.querySelector(".all-card-container");
//   const filteredCardContainer = document.querySelector(
//     ".filtered-card-container"
//   );
//   const errorMessage = document.querySelector("#error-search");

//   const allCardData = []; // tableau pour stocker toutes les cartes
//   getRecipes().then((data) => {
//     data.recipes.forEach((recipe) => {
//       const card = filteredCardFactory(recipe);
//       allCardData.push(card); // Ajouter la carte à notre tableau
//     });
//   });

//   searchBar.addEventListener("keyup", function () {
//     const searchValue = searchBar.value.toLowerCase();
//     if (searchValue.length >= 3) {
//       // Recherche par noms des plats, ingrédients, appareils ou ustensiles
//       const filteredData = allCardData.filter((card) => {
//         return (
//           card.name.toLowerCase().includes(searchValue) ||
//           card.ingredients.some((ingredient) =>
//             ingredient.ingredient.toLowerCase().includes(searchValue)
//           ) ||
//           card.appliance.toLowerCase().includes(searchValue) ||
//           card.ustensils.some((ustensil) =>
//             ustensil.toLowerCase().includes(searchValue)
//           )
//         );
//       });

//       // Afficher les résultats de la recherche
//       recipesContainer.style.display = "none";
//       filteredCardContainer.style.display = "grid";
//       filteredCardContainer.innerHTML = "";

//       if (filteredData.length === 0) {
//         // Afficher un message d'erreur si aucun résultat trouvé
//         errorMessage.style.display = "block";
//       } else {
//         errorMessage.style.display = "none";
//         filteredData.forEach((card) => {
//           const cardDOM = card.getFilteredCardDOM();
//           filteredCardContainer.appendChild(cardDOM);
//         });
//       }
//     } else {
//       // Si la barre de recherche est vide, afficher toutes les cartes
//       recipesContainer.style.display = "grid";
//       filteredCardContainer.style.display = "none";
//       errorMessage.style.display = "none";
//     }
//   });
// }

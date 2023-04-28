/*****************************************************  BASES  ********************************************************************/

/** ---------- FETCH DATA pour récupérer les infos des photographes du fichier JSON ---------- */
async function getRecipes() {
    await fetch("JS/recipes.json")
      .then((res) => res.json())
      .then((data) => (recipes = data.recipes));
    return {recipes: [...recipes],};
  }

/*********************************************  ALGORYTHME DE RECHERCHE V1 *********************************************************/

function factorySearch (data) {
    /** Données du JSON*/ 
    const {ingredients,appliance,ustensils}= data;

    /************************* INGREDIENTS *************************************/
    /** création d'un tableau avec uniquement les ingrédient*/ 
    let ingredientsArray = []; /** premier tableau avec les données brute */
    let ingredientsArray2 = []; /** deuxiéme tableau avec les données pré-filtrer */
    
    for ( let i = 0; i < data.length; i++ ) {
        ingredientsArray.push(data[i].ingredients); /** pour chaque ingredient dans le JSON nous l'ajoutons dans le premier tableau*/
    }
    
    ingredientsArray = ingredientsArray.flat(); /** Mise a plat du premier tableau */
    
    for ( let i = 0; i < ingredientsArray.length; i++ ) {
        ingredientsArray2.push(ingredientsArray[i].ingredient.toLowerCase()); /** Pour chaque ingrédient dans le premier tableau nous l'ajoutons dans le deuxiémée 
        tableau en supprimant les majuscule */
    }

    let ingredientList = ingredientsArray2.filter((x, i) => ingredientsArray2.indexOf(x) === i); /** Nous créons une variable ou  nous filtrons les ingrédients 
    afin de retourner un tableau sans doublons */

    ingredientList.forEach(e =>  { /** Pour chaqque element de nortre ingredientList */
        /** Element du DOM */ 
        const suggestionIngredients = document.getElementById("suggestions-ingredient"); 
        const pIngredient = document.createElement("p"); /** Nous créeons un lien */
        pIngredient.setAttribute("id" , "pIngredient");
        /** Texte et implémentation*/ 
        pIngredient.textContent = e; /** pour chaque lien crée nous ajoutons en texte un ingrédients */
        suggestionIngredients.appendChild(pIngredient); /** notre DIV suggestion-ingredient enfante de chaque lien crée précédemment */
    });
    /************************* APPLIANCE *************************************/
    
    /** création d'un tableau avec uniquement les appareils*/ 
    let appareilsArray = []; /** tableau avec les données brute */ 
    
    for ( let i = 0; i < data.length; i++ ) {
        appareilsArray.push(data[i].appliance.toLowerCase()); /** pour chaque appareil dans le JSON nous l'ajoutons dans le tableau*/
    }
    
    appareilsArray = appareilsArray.flat(); /** Mise a plat du tableau */

    let appareilList = appareilsArray.filter((x, i) => appareilsArray.indexOf(x) === i); /** Nous créons une variable ou  nous filtrons les appareils 
    afin de retourner un tableau sans doublons */

    appareilList.forEach(e =>  {
        /** Element du dom*/ 
        const suggestionAppareils = document.getElementById("suggestions-appareils"); 
        const pAppareils = document.createElement("p");
        pAppareils.setAttribute("id" , "pAppareils");
        /** Texte et implémentation*/ 
        pAppareils.textContent = e; /** pour chaque lien crée nous ajoutons en texte les appareils */
        suggestionAppareils.appendChild(pAppareils); /** notre DIV suggestion-ingédient enfante de chaque lien crée précédemment */
    });

    /************************* USTENSILES *************************************/

    /** création d'un tableau avec uniquement les ustensiles*/ 
    let ustensilesArray = []; /** tableau avec les données brute */
    
    for ( let i = 0; i < data.length; i++ ) {
        ustensilesArray.push(data[i].ustensils); /** pour chaque ustensile dans le JSON nous l'ajoutons dans le tableau*/
    }
    ustensilesArray = ustensilesArray.flat(); /** Mise a plat du tableau */
    
    let ustensilslList = ustensilesArray.filter((x, i) => ustensilesArray.indexOf(x) === i); /** Nous créons une variable ou nous filtrons les ustensiles 
    afin de retourner un tableau sans doublons */

    ustensilslList.forEach(e =>  {
        /** Element du dom*/ 
        const suggestionUstensils = document.getElementById("suggestions-ustensiles"); 
        const pUstensils = document.createElement("p");
        pUstensils.setAttribute("id" , "pUstensils");
        /** Texte et implémentation*/ 
        pUstensils.textContent = e; /** pour chaque lien crée nous ajoutons en texte les ustensiles */
        suggestionUstensils.appendChild(pUstensils); /** notre DIV suggestion-ingédient enfante de chaque lien crée précédemment */
    });

    /************************* SEARCH SYSTEM *************************************/

    /** Element du DOM*/
    const searchBar = document.querySelector("#searchbar");
    const divCard = document.querySelectorAll(".div-card");
    const divTitle = document.querySelectorAll(".card-title");
    const errorMessage = document.querySelector("#error-search"); /** message d'erreur */

    searchBar.addEventListener('keyup', function() { /** mise en place d'un écoute sur la barre de recherche*/ 
        let arrayCard = [];
        let searchValue = searchBar.value;
        for ( let i = 0; i < divCard.length; i++) { /** Boucle for afin que */       
            if (divTitle[i].textContent.toLowerCase().includes(searchValue.toLowerCase()) && searchValue.length >=3 ) { /** Pour chaque card si le titre de notre plat inclue ce qui est saisie dans la barre de recherche */
                divCard[i].style.display = "block"; /** alors notre card reste ou deviennent visible */
                arrayCard.splice(divCard[i]);
                console.log(arrayCard);
            } else if (searchValue.length <3) {/** et si la barre de recherche est vide  */
                divCard[i].style.display = "block"; /** les card s'affiche */
            } else {
                divCard[i].style.display = "none"; /** sinon elle disparait */
                arrayCard.push(divCard[i]);
                console.log(arrayCard);
            }
        }
        
        if (arrayCard.length === divCard.length) {
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
        }
    });

    /** Recherchez dans les barres d'ingrédients d'appareils et d'ustensiles */ 

    /** Element du DOM*/ 
    const searchIngredient = document.getElementById('ingredient');
    const pIngredient = document.querySelectorAll('#pIngredient');
    const searchAppareils = document.getElementById('appareils');
    const pAppareils = document.querySelectorAll('#pAppareils');
    const searchUstensiles = document.getElementById('ustensiles');
    const pUstensils = document.querySelectorAll('#pUstensils');
    const spanIngredient = document.querySelectorAll(".span-ingredient");
    const cardDescription = document.querySelectorAll(".card-description");
    
    /** Recherche des Ingrédients*/     
    searchIngredient.addEventListener('keyup', function() { /** Création d'une écoute sur notre barre de recherche d'ingrédients */
        const inputIngredient = searchIngredient.value;

        for (let i = 0; i < pIngredient.length; i++) { /** Pour chaque ingrédient */
            if (pIngredient[i].textContent.toLowerCase().includes(inputIngredient.toLowerCase())) { /** si notre ingrédient saisie et inclus dans notre liste */
                pIngredient[i].style.display = "block"; /** Alors l'ingrédient reste affiché */
            } else {
                pIngredient[i].style.display = "none"; /** Sinon il disparais*/
            }

            if (inputIngredient === "") { /** Si la zone de saisie est vide*/
                pIngredient[i].style.display = "block"; /** Alors les ingrédients restent affiché */
            }
        }
    });

    /** Recherche des Ingrédients via suggestion + création du tag au click*/ 
    for (let iI = 0; iI < pIngredient.length; iI++) /** Pour chaque ingrédient */
    pIngredient[iI].addEventListener('click', function() { /** Création d'une écoute sur nos ingrédients */
        let ingredientCardArray = [];
        for (let i = 0; i < spanIngredient.length; i++) { /** Pour chaque Span contenant nos ingrédient */
            if (spanIngredient[i].textContent.toLowerCase().includes(pIngredient[iI].textContent.toLowerCase())) { /** si notre Span contient notre ingrédient */
                divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                ingredientCardArray.splice(divCard[i]);   
            } else {
                divCard[i].style.display = "none"; /** Sinon elle disparais */
                ingredientCardArray.push(divCard[i]);
            }
        }

        if (ingredientCardArray.length === divCard.length) {
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
        }

        /** Création du tag au click sur les ingrédients */
        const tag = document.getElementById("ingredient-tag-liste");
        const divTag = document.createElement("div");
        divTag.setAttribute("class" , "tag-ingredient");
        const iTag = document.createElement("p");
        iTag.setAttribute("class" , "text-ingredient-tag");
        iTag.textContent = pIngredient[iI].textContent;        
        const crossTag = document.createElement("i");
        crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
        crossTag.setAttribute("id" , "crossed-ingredient");
        crossTag.setAttribute("onclick" , "hideTag ()");
        divTag.appendChild(iTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
    });

    /** Affichage des tag ingrédients via la touche ENTER */ 
    const ingredientSearch = document.querySelector("#ingredient");
    ingredientSearch.addEventListener('keyup', function(e) { /** Création d'une écoute d'évenement sur notre zone de saisie */
        let ingredientEnterCardArray = [];
        if (e.key === "Enter" && ingredientList.includes(ingredientSearch.value.toLowerCase())) {
            for (let i = 0; i < spanIngredient.length; i++) { /** Pour chaque Span contenant nos ingrédient */
                if (spanIngredient[i].textContent.toLowerCase().includes(ingredientSearch.value.toLowerCase())) { /** si notre Span contient notre ingrédient */
                    divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                    ingredientEnterCardArray.splice(divCard[i]);   
                } else {
                    divCard[i].style.display = "none"; /** Sinon elle disparais */
                    ingredientEnterCardArray.push(divCard[i]);
                }
            }

            if (ingredientEnterCardArray.length === divCard.length) {
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            }
        
            const tag = document.getElementById("ingredient-tag-liste"); 
            const divTag = document.createElement("div");
            divTag.setAttribute("class" , "tag-ingredient");
            const iTag = document.createElement("p");
            iTag.setAttribute("class" , "text-ingredient-tag");
            const crossTag = document.createElement("i");
            crossTag.setAttribute("id" , "crossed-ingredient");
            
            if (e.key === "Enter" & ingredientSearch.value !== "") { /** Si la touche ENTER et que la valeur de la zone de recherche n'est pas vide alors il crée un tag */
                iTag.textContent = ingredientSearch.value; 
                crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
                crossTag.setAttribute("id" , "crossed-ingredient");       
                crossTag.setAttribute("onclick" , "hideTag ()");
                divTag.appendChild(iTag);
                divTag.appendChild(crossTag);
                tag.appendChild(divTag);
            }
        }
    });

    /** Recherche des Appareils*/
    searchAppareils.addEventListener('keyup', function() { /** Création d'une écoute sur notre barre de recherche d'appareils */
        const inputAppareils = searchAppareils.value;

        for (let i = 0; i < pAppareils.length; i++) { /** Pour chaque appareil */
            if (pAppareils[i].textContent.includes(inputAppareils.toLowerCase())) { /** si notre appareil saisie et inclus dans notre liste */
                pAppareils[i].style.display = "block"; /** Alors l'appareil reste affiché */
            } else {
                pAppareils[i].style.display = "none"; /** Sinon il disparais*/
            }

            if (inputAppareils === "") { /** Si la zone de saisie est vide*/
                pAppareils[i].style.display = "block"; /** Alors les appareils restent affiché */
            }
        }
    });
    
    /** Recherche des Appareils via suggestion + création du tag au click */ 
    for (let iA = 0; iA < pAppareils.length; iA++)/** Pour chaque appareil */
    pAppareils[iA].addEventListener('click', function() {/** Création d'une écoute sur nos appareils */
        let appareilCardArray = [];
        for (let i = 0; i < cardDescription.length; i++) { /** Pour chaque déscription contenant nos appareils */
            if (cardDescription[i].textContent.includes(pAppareils[iA].textContent)) { /** Si notre déscription contient notre appareil */
                divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                appareilCardArray.splice(divCard[i]);
            } else {
                divCard[i].style.display = "none"; /** Sinon elle disparais */
                appareilCardArray.push(divCard[i]);
            }
        }

        if (appareilCardArray.length === divCard.length) {
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
        }

        /** Création du tag au click sur les appareils */
        const tag = document.getElementById("appareil-tag-liste");
        const divTag = document.createElement("div");
        divTag.setAttribute("class" , "tag-appareil");
        const aTag = document.createElement("p");
        aTag.setAttribute("class" , "text-appareil-tag");
        aTag.textContent = pAppareils[iA].textContent;        
        const crossTag = document.createElement("i");
        crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
        crossTag.setAttribute("id" , "crossed-appareils");
        crossTag.setAttribute("onclick" , "hideTag ()");
        divTag.appendChild(aTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
    });
    
    /** Affichage des tag appareils via la touche ENTER */ 
    const appareilSearch = document.querySelector("#appareils");
    appareilSearch.addEventListener('keyup', function(e) { /** Création d'une écoute d'évenement sur notre zone de saisie */
        let appareilEnterCardArray = [];
        if (e.key === "Enter" && appareilList.includes(appareilSearch.value.toLowerCase())) {
            for (let i = 0; i < cardDescription.length; i++) { /** Pour chaque déscription contenant nos appareils */
                if (cardDescription[i].textContent.includes(appareilSearch.value.toLowerCase())) { /** Si notre déscription contient notre appareil */
                    divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                    appareilEnterCardArray.splice(divCard[i]);
                } else {
                    divCard[i].style.display = "none"; /** Sinon elle disparais */
                    appareilEnterCardArray.push(divCard[i]);
                }
            }

            if (appareilEnterCardArray.length === divCard.length) {
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            }

            const tag = document.getElementById("appareil-tag-liste");
            const divTag = document.createElement("div");
            divTag.setAttribute("class" , "tag-appareil");
            const aTag = document.createElement("p");
            aTag.setAttribute("class" , "text-appareil-tag");
            const crossTag = document.createElement("i");
            crossTag.setAttribute("id" , "crossed-appareils");
            crossTag.setAttribute("onclick" , "hideTag ()");

            if (e.key === "Enter" & appareilSearch.value !== "") { /** Si la touche ENTER et que la valeur de la zone de recherche n'est pas vide alors il crée un tag */                aTag.textContent = appareilSearch.value;
                crossTag.setAttribute("id" , "crossed-appareils");        
                crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
                crossTag.setAttribute("onclick" , "hideTag ()");
                divTag.appendChild(aTag);
                divTag.appendChild(crossTag);
                tag.appendChild(divTag);
            }
        }
    });
    
    /** Recherche des Ustensiles*/
    searchUstensiles.addEventListener('keyup', function() { /** Création d'une écoute sur notre barre de recherche d'ustensiles */
        const inputUstensiles = searchUstensiles.value;
        for (let i = 0; i < pUstensils.length; i++) { /** Pour chaque ingrédient */
            if (pUstensils[i].textContent.includes(inputUstensiles.toLowerCase())) { /** si notre ustensile saisie et inclus dans notre liste */
                pUstensils[i].style.display = "block"; /** Alors l'ustensile reste affiché */
            } else {
                pUstensils[i].style.display = "none"; /** Sinon il disparais*/
            }

            if (inputUstensiles === "") { /** Si la zone de saisie est vide*/
                pUstensils[i].style.display = "block"; /** Alors les ustensiles restent affiché */
            }
        }
    });

    /** Recherche des Ustensiles via suggestion + création du tag au click */ 
    for (let iU = 0; iU < pUstensils.length; iU++) /** Pour chaque ustensile */
    pUstensils[iU].addEventListener('click', function() { /** Création d'une écoute sur nos ustensiles */
        let ustensileCardArray = [];
        for (let i = 0; i < cardDescription.length; i++) { /** Pour chaque déscription contenant nos ustensiles */
            if (cardDescription[i].textContent.includes(pUstensils[iU].textContent)) { /** Si notre déscription contient notre ustensile */
                divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                ustensileCardArray.splice(divCard[i]);
            } else {
                divCard[i].style.display = "none"; /** Sinon elle disparais */
                ustensileCardArray.push(divCard[i]);
            }
        }

        /** Création du tag au click sur les ustensiles */
        const tag = document.getElementById("ustensile-tag-liste");
        const divTag = document.createElement("div");
        divTag.setAttribute("class" , "tag-ustensile");
        const uTag = document.createElement("p");
        uTag.setAttribute("class" , "text-ustensile-tag");
        uTag.textContent = pUstensils[iU].textContent;        
        const crossTag = document.createElement("i");
        crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
        crossTag.setAttribute("id" , "crossed-ustensiles");
        crossTag.setAttribute("onclick" , "hideTag ()");
        divTag.appendChild(uTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);

        if (ustensileCardArray.length === divCard.length) {
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
        }
    });    

    /** Affichage des tag ustensiles via la touche ENTER */ 
    const ustensileSearch = document.querySelector("#ustensiles");
    ustensileSearch.addEventListener('keyup', function(e) { /** Création d'une écoute d'évenement sur notre zone de saisie */
        let ustensileEnterCardArray = [];
        if (e.key === "Enter" && ustensilslList.includes(ustensileSearch.value.toLowerCase())) { /**Si notre liste d'ustensile inclue l'ustensile saisie alors il crée un tag */    
            for (let i = 0; i < cardDescription.length; i++) { /** Pour chaque déscription contenant nos appareils */
                if (cardDescription[i].textContent.includes(ustensileSearch.value.toLowerCase())) { /** Si notre déscription contient notre appareil */
                    divCard[i].style.display = "block"; /** Alors notre card reste affiché */
                    ustensileEnterCardArray.splice(divCard[i]);
                } else {
                    divCard[i].style.display = "none"; /** Sinon elle disparais */
                    ustensileEnterCardArray.push(divCard[i]);
                }
            }

            if (ustensileEnterCardArray.length === divCard.length) {
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            } 

            const tag = document.getElementById("ustensile-tag-liste");
            const divTag = document.createElement("div");
            divTag.setAttribute("class" , "tag-ustensile");
            const uTag = document.createElement("p");
            uTag.setAttribute("class" , "text-ustensile-tag");
            const crossTag = document.createElement("i");
            crossTag.setAttribute("id" , "crossed-ustensiles");
            crossTag.setAttribute("onclick" , "hideTag ()");
            if (e.key === "Enter" & ustensileSearch.value !== "") { /** Si la touche ENTER et que la valeur de la zone de recherche n'est pas vide alors il crée un tag */
                uTag.textContent = ustensileSearch.value;
                crossTag.setAttribute("id" , "crossed-ustensiles");
                crossTag.setAttribute("onclick" , "hideTag ()");
                crossTag.setAttribute("class" , "fa-regular fa-circle-xmark");
                divTag.appendChild(uTag);
                divTag.appendChild(crossTag);
                tag.appendChild(divTag);
            }
        }        
    });

    return {ingredients,appliance,ustensils};
}
/********************************************* INITIALISATION *********************************************************/

/** Initialisation des données des recipes pour la recherche */
async function initSearch () {
    const {recipes} = await getRecipes(); /** Récupére les données des récipes avant recherche*/
    factorySearch(recipes); /** Apelle de la fonction de rercherche des données des récipes */
}

initSearch();


/********************************************* LISTES *********************************************************/

/** Affichage de la liste des ingredients */ 
function displayIngredientList () {
    const divIngredient = document.getElementById("suggestions-ingredient");
    divIngredient.style.display = "grid";
    const chevronIngredient = document.querySelector(".chevron-ingredients");
    chevronIngredient.style.transform = "rotate(180deg)";
};

/** Masquer la liste d'ingrédient */
function hideIngredientList () {
    const divIngredient = document.getElementById("suggestions-ingredient");
    divIngredient.style.display = "none";
    const chevronIngredient = document.querySelector(".chevron-ingredients");
    chevronIngredient.style.transform = "rotate(0)";
};

const divIngredientButton = document.getElementById("ingredient");
divIngredientButton.setAttribute("onclick","displayIngredientList()");

/** Affichage de la liste des appareils */ 
function displayAppareilsList () {
    const divAppareils = document.getElementById("suggestions-appareils");
    divAppareils.style.display = "grid";
    const chevronAppareils = document.querySelector(".chevron-appareils");
    chevronAppareils.style.transform = "rotate(180deg)";
};

/** Masquer la liste d'appareils */
function hideAppareilsList () {
    const divAppareils = document.getElementById("suggestions-appareils");
    divAppareils.style.display = "none";
    const chevronAppareils = document.querySelector(".chevron-appareils");
    chevronAppareils.style.transform = "rotate(0)";
};

const divAppareilsButton = document.getElementById("appareils");
divAppareilsButton.setAttribute("onclick","displayAppareilsList()");

/** Affichage de la liste des ustensiles */ 
function displayUstensilesList () {
    const divUstensiles = document.getElementById("suggestions-ustensiles");
    divUstensiles.style.display = "grid";
    const chevronUstensiles = document.querySelector(".chevron-ustensiles");
    chevronUstensiles.style.transform = "rotate(180deg)";
};

/** Masquer la liste d'ustensiles */
function hideUstensilesList () {
    const divUstensiles = document.getElementById("suggestions-ustensiles");
    divUstensiles.style.display = "none";
    const chevronUstensiles = document.querySelector(".chevron-ustensiles");
    chevronUstensiles.style.transform = "rotate(0)";
};

const divUstensilesButton = document.getElementById("ustensiles");
divUstensilesButton.setAttribute("onclick","displayUstensilesList()");



/** Suppression des tag ingrédient */

const dishName = document.querySelectorAll("card-title");
let dishNameListe = [];
dishName.forEach((title) => {dishNameListe.push(title.textContent)});
console.log(dishNameListe);


function hideTag () {
    const divcard = document.querySelectorAll(".div-card");
    const errorMessage = document.querySelector("#error-search");
    let crossedIngredient = document.querySelectorAll("#crossed-ingredient");
    let tagIngredientListe = [];
    let crossedAppareils = document.querySelectorAll("#crossed-appareils");
    let tagAppareilsListe = [];
    let crossedUstensiles = document.querySelectorAll("#crossed-ustensiles");
    let tagUstensilesListe = [];

    for ( let crossI = 0; crossI < crossedIngredient.length; crossI++){
        const tagIngredient = document.querySelectorAll('.tag-ingredient');
        for (let tI = 0; tI < tagIngredient.length; tI++)
        crossedIngredient[crossI].addEventListener('click' , function () {
            tagIngredient[tI].remove();
            tagIngredientListe.push(tagIngredient[tI].textContent)
            if (tagIngredientListe.length == 1){
                divcard.forEach((card)=>{
                    card.style.display = 'block';
                    errorMessage.style.display = "none";
                })
            }
        })
    }

    for ( let crossA = 0; crossA < crossedAppareils.length; crossA++){
        const tagAppareils = document.querySelectorAll('.tag-appareil');
        for (let tA = 0; tA < tagAppareils.length; tA++)
        crossedAppareils[crossA].addEventListener('click' , function () {
            tagAppareils[tA].remove();
            tagAppareilsListe.push(tagAppareils[tA].textContent)
            if (tagAppareilsListe.length == 1){
                divcard.forEach((card)=>{
                    card.style.display = 'block';
                    errorMessage.style.display = "none";
                })
            }
        })
    }

    for ( let crossU = 0; crossU < crossedUstensiles.length; crossU++){
        const tagUstensiles = document.querySelectorAll('.tag-ustensile');
        for (let tU = 0; tU < tagUstensiles.length; tU++)
        crossedUstensiles[crossU].addEventListener('click' , function () {
            tagUstensiles[tU].remove();
            tagUstensilesListe.push(tagUstensiles[tU].textContent)
            if (tagUstensilesListe.length == 1){
                divcard.forEach((card)=>{
                    card.style.display = 'block';
                    errorMessage.style.display = "none";
                })
            }
        })
    }
}
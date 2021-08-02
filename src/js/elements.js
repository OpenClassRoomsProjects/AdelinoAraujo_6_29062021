import {HomePage} from "./Views/HomePage.js";
import {PhotographerPage} from "./Views/PhotographerPage.js";

//DOM ELEMENTS
export const gallery = document.getElementById("gallery") ;

//VARIABLES
export let allUserSelectedTags = [] ;

//FUNCTION
export function enableTag(tag){
    return document.setAttribute(["enabled"], true) ;
}

export function disableTag(tag){
    return document.setAttribute(["enabled"], false) ;
}

//EVENTS LISTENERS
export  function addPhotographerTagsEventListener(){
    let allPhotographersTags = document.getElementsByClassName("tag") ;

    for (let i = 0; i < allPhotographersTags.length; i ++){
        allPhotographersTags[i].addEventListener("click", filterPhotographersByTag) ;
    }
}

export function filterPhotographersByTag(event){ //TODO add multiple filter feature using allUserSelectedTags

    let userSelectedTag = event.target.innerText.toLowerCase() ;
    let allTagsFromActualPage = document.getElementsByClassName("navigation__link") ; //TODO remove if useless
    let allCardsFromPhotographersGallery = document.getElementsByClassName("card") ;


    if (!allUserSelectedTags.includes(userSelectedTag)){
        allUserSelectedTags.push(userSelectedTag)
    } else {
        let indexOfUserTagToDelete = allUserSelectedTags.indexOf(userSelectedTag) ;
        allUserSelectedTags.splice(indexOfUserTagToDelete, 1) ;
    }

    for (let i = 0; i < allCardsFromPhotographersGallery.length; i++) {

        for (let j = 0; j < allUserSelectedTags.length; j++) {

            if (!allCardsFromPhotographersGallery[i].innerText.includes(allUserSelectedTags[j])){

                allCardsFromPhotographersGallery[i].setAttribute(["visible"], false)

            } else if (allCardsFromPhotographersGallery[i].innerText.includes(allUserSelectedTags[j])){
                allCardsFromPhotographersGallery[i].setAttribute(["visible"], true)
            }
        }
    }
}


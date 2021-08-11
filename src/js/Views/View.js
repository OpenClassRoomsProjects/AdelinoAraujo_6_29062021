export class View {
    constructor(listeners) {
    }

    displayAllTagsForNavigation(allPhotographerTags){
        allPhotographerTags
            .then(tags => {
                tags.forEach(element => {
                    let tag = element.charAt(0).toUpperCase() + element.slice(1) ; //set first caracter tag uppercase

                    let navigationTag =
                        `<a class="navigation__link tag" data-tag-category="${tag.toLowerCase()}" data-tag-selected-status="default" title="Afficher les photographes de portraits" role="link" aria-label="Afficher les photographes de portraits">
                            #${tag}
                        </a>`

                    document.getElementById("navigation").innerHTML += navigationTag
                })
            })
    }

    displayPhotographersGallery(photographersArray){
        photographersArray
            .then(data => {
                data.forEach(photographer => {

                    let photographerTags = photographer.tags ;

                    let htmlPhotographerTags = "" ;
                    photographerTags.forEach(tag => {
                        htmlPhotographerTags +=
                            `<a class="navigation__link navigation__link--inCard tag" data-tag-category="${tag}" data-tag-selected-status="default" title="Afficher les photographes de la catégorie ${tag}"
                                role="link" aria-label="Afficher les photographes de la catégorie ${tag}">
                                #${tag}
                            </a>`
                    })

                    let htmlCard =

                        `<div class="card" aria-label="photographe" data-photographer-categories="${photographerTags}" >
                            <a class="card__link" href="public/common/photographer.html?id=${photographer._id}" title="Découvrez ${photographer._name}"  role="link" aria-label="Découvrez ${photographer._name}" >
                                <img class="card__picture" src="public/media/Photographers%20ID%20Photos/${photographer.portrait}" alt="">
                               <h2 class="card__name">
                                 ${photographer._name}
                               </h2>
                            </a>
                            <h3 class="cards__location">
                                 ${photographer._city}, ${photographer._country}
                            </h3>
                            <p class="card__tagline">
                                 ${photographer._tagline}
                            </p>
                            <p class="card__price">
                                 ${photographer._price} €/jour
                            </p>
                        
                           <nav class="navigation navigation--forPhotographerCard" role="link" aria-label="photographer categories">${htmlPhotographerTags}
                           </nav>
                        </div><!-- end card -->`

                    document.getElementById("gallery").innerHTML += htmlCard ;
                })
            })
    }

    displayPhotographerMetaData(photographer){
        photographer
            .then(element => {
                document.title = `${element._name}, photographe spécialiste.` ;//TODO add tags
                document.querySelector('meta[name="description"]').setAttribute("content", `${element._name}, photographe spécialiste.`);
            })
        }

    displayPhotographerBanner(photographer){
        photographer
            .then(element => {
                let portraitPicturePath = `../media/Photographers%20ID%20Photos/${element.portrait}`
                let photographerTags = element.tags ;

                let photographerHtmlTags = "" ;
                photographerTags.forEach(tag => {
                    photographerHtmlTags +=`<a class="navigation__link navigation__link--inCard tag" enabled="false" title="Afficher les photographies de la catégorie ${tag}"
                    role="link" aria-label="Afficher les photographies de la catégorie ${tag}">#${tag}</a>`
                }) ;

                let htmlBanner =
                    `<div class="about__informations">
                        <div class="card card--photographer-page" aria-label="photographe">
                            <h1 id="card__name" class="card__name card__name--photographer-page">
                                ${element.name}
                            </h1>
                            <h2 class="card__location card__location--photographer-page">
                                ${element.city}, ${element.country}
                            </h2>
                            <p class="card__tagline card__tagline--photographer--page">
                                ${element.tagline}
                            </p>
                            <nav class="navigation navigation--photographerPage" role="link" aria-label="photographer categories">
                                ${photographerHtmlTags}
                            </nav>
                        </div><!-- end about informations -->

                        <button id="contact" class="button button--contact">Contactez-moi</button>

                    </div>
    
                    <div class="bio__picture">
                        <img class="card__picture card__picture--photographer-page" src="${portraitPicturePath}" alt="${element._name}">
                    </div>`

                document.getElementById("about").innerHTML += htmlBanner ;
            }) ;
    }

    displayPhotographerMediaGallery(photographerMedia, photographer){

        let mediaGallery = "" ;

        photographerMedia
            .then(data => {
                photographer
                    .then(element => {

                        //get only first name and remove "-" for composed first names
                        let photographerNameForMediaPath = element.name.split(" ")[0].replace("-"," ") ;

                        data.forEach(media => {

                            if (media.image){

                                let mediaPath = `/public/media/${photographerNameForMediaPath}/${media.image}`

                                mediaGallery +=
                                    `<div class="media" data-media-title="${media.title}" data-media-category="${media.tags}" data-media-date="${media.date}" data-media-likes="${media.likes}">
                                        <picture class="media__element">
                                            <img src="${mediaPath}" alt="${media.title}" title="${media.title}"> 
                                        </picture>
                                        <div class="media__informations">
                                            <div class="media__title">
                                                ${media.title}
                                            </div>
                                            <div class="media__likes">
                                                ${media.likes}
                                            </div>
                                        </div>
                                    </div>`

                            } else if (media.video){

                                let mediaPath = `/public/media/${photographerNameForMediaPath}/${media.video}`

                                mediaGallery +=
                                    `<div class="media" data-media-title="${media.title}" data-media-category="${media.tags}" data-media-date="${media.date}" data-media-likes="${media.likes}">
                                        <video class="media__element">
                                            <source src="${mediaPath}" alt="${media.title}" title="${media.title}"> 
                                        </video>
                                        <div class="media__informations">
                                            <div class="media__title">
                                                ${media._title}
                                            </div>
                                            <div class="media__likes">
                                                ${media._likes}
                                            </div>
                                        </div>
                                    </div>`
                            }

                        })
                        document.getElementById("media-gallery").innerHTML += mediaGallery ;
                    })
            })
    }

    displayTotalLikes(photographerTotalLikes) {
        photographerTotalLikes
            .then(data => {
                document.getElementById("likes-number").innerText = data ;
            })
    }

    displayPrice(photographerPrice){
        photographerPrice
            .then(data => {
                document.getElementById("price").innerText = `${data}€ / jour` ;
            })
    }

    displayNavigationTagsStatusStyles(userSelectedTagCategory, userSelectedTagStatus){
        let allTagsInPage = document.getElementsByClassName("tag") ;

        for (let i = 0; i < allTagsInPage.length; i++) {
            if (allTagsInPage[i].dataset.tagCategory === userSelectedTagCategory) {
                if(userSelectedTagStatus === "selected"){
                    allTagsInPage[i].dataset.tagSelectedStatus = "default" ;
                } else {
                    allTagsInPage[i].dataset.tagSelectedStatus = "selected" ;
                }
            } else {
                allTagsInPage[i].dataset.tagSelectedStatus = "default" ;
            }
        }
    }

    onHomePageTagClick(){
        document
            .addEventListener("click", event => {
                if (event.target.className.includes("tag")){

                    let userSelectedTagCategory = event.target.dataset.tagCategory ;
                    let userSelectedTagStatus = event.target.dataset.tagSelectedStatus ;

                    this.filterPhotographerByTag(userSelectedTagCategory, userSelectedTagStatus)
                }
            })
    }

    filterPhotographerByTag(userSelectedTagCategory, userSelectedTagStatus){

        this.displayNavigationTagsStatusStyles(userSelectedTagCategory, userSelectedTagStatus) ;

        let allPhotographersCards = document.getElementsByClassName("card") ;

        if (userSelectedTagStatus ==="default"){
            for (let i = 0; i < allPhotographersCards.length; i++) {
                let photographerCategories = allPhotographersCards[i].dataset.photographerCategories.split(",") ;
                if (!photographerCategories.includes(userSelectedTagCategory)){
                    allPhotographersCards[i].classList.add("card--isHidden") ;
                } else if (photographerCategories.includes(userSelectedTagCategory)){
                    allPhotographersCards[i].classList.remove("card--isHidden") ;
                }
            }
        } else {
            for (let i = 0; i < allPhotographersCards.length; i++) {
                let photographerCategories = allPhotographersCards[i].dataset.photographerCategories.split(",") ;
                if (!photographerCategories.includes(userSelectedTagCategory)){
                    allPhotographersCards[i].classList.remove("card--isHidden") ;
                } else if (photographerCategories.includes(userSelectedTagCategory)){
                    allPhotographersCards[i].classList.remove("card--isHidden") ;
                }
            }
        }
    }
}
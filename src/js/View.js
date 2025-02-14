export class View {
    constructor() {
        this._gallery = document.getElementById("gallery") ;
    }

    onHomePageScroll(){
        window.onscroll = this.displayToMain ;
    }

    displayToMain(){
        let toMainContentButton = document.getElementById("toMainContent")

        if (document.body.scrollTop > 160 || document.documentElement.scrollTop > 160) {
            toMainContentButton.classList.add("button-toMain--isVisible");
        } else {
            toMainContentButton.classList.remove("button-toMain--isVisible")
        }
    }
    
    displayHomePageTagsFilters(allPhotographersTagsAvailable){
        let navigationDomElement = document.getElementById("navigation") ;

        allPhotographersTagsAvailable
            .then(tags => {
                tags.forEach(element => {
                    let tag = element.charAt(0).toUpperCase() + element.slice(1) ; //set first character tag uppercase

                    let navigationTag =
                        `<a href="#" class="navigation__link tag" data-tag-category="${tag.toLowerCase()}" data-tag-selected-status="default" title="Afficher les photographes de la catégorie ${tag.toLowerCase()}" aria-label="Afficher les photographes de ${tag.toLowerCase()}">
                            #${tag}
                        </a>` ;

                    navigationDomElement.innerHTML += navigationTag
                })
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    generateHtmlTags(photographer){
        let photographerTags = photographer.tags ;
        let htmlPhotographerTags = "" ;

        photographerTags.forEach(tag => {
            htmlPhotographerTags +=
                `<a href="#" class="navigation__link navigation__link--inCard tag" data-tag-category="${tag}" data-tag-selected-status="default" title="Afficher les photographes de la catégorie ${tag}"
                                aria-label="Afficher les photographes de la catégorie ${tag}">
                    #${tag}
                </a>`
        }) ;
        return htmlPhotographerTags ;
    }

    displayAllPhotographersGallery(allPhotographers){
        allPhotographers
            .then(data => {
                data.forEach(photographer => {

                    let photographerCategories = photographer.tags ;
                    let htmlPhotographerTags = this.generateHtmlTags(photographer) ;

                    let htmlCard =
                        `<div class="card" aria-label="photographe" data-photographer-categories="${photographerCategories}" >
                            <a class="card__link" href="photographer.html?id=${photographer._id}" title="Découvrez ${photographer._name}"  role="link" aria-label="Découvrez ${photographer._name}" >
                                <div class="card__picture" >
                                    <img src="./public/media/Photographers%20ID%20Photos/${photographer.portrait}" alt="${photographer._name}" aria-label="${photographer._name}" title="${photographer._name}">
                                </div>
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
                        
                           <nav class="navigation navigation--forPhotographerCard" aria-label="Photographer categories">
                                ${htmlPhotographerTags}
                           </nav>
                        </div><!-- end card -->`

                    this._gallery.innerHTML += htmlCard ;
                }) ;
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    generatePhotographerMetaInformations(photographer){
        photographer
            .then(element => {
                let htmlTags = "" ;

                for (let i = 0; i < element.tags.length - 1; i++) {
                    htmlTags += element.tags[i] + ", "
                }

                htmlTags += "et " + element.tags[element.tags.length - 1] ;

                document.title = `${element._name}, photographe FishEye : ${htmlTags}.` ;
                document
                    .querySelector('meta[name="description"]')
                    .setAttribute("content", `${element._name} vous apporte son regard pour capturer l'essence de vos projets de type ${htmlTags}`);
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
        }

    displayPhotographerBanner(photographer){
        photographer
            .then(element => {
                let portraitPicturePath = `./public/media/Photographers%20ID%20Photos/${element.portrait}`
                let photographerTags = element.tags ;
                let photographerHtmlTags = "" ;

                photographerTags.forEach(tag => {
                    photographerHtmlTags +=`<a class="navigation__link navigation__link--inCard tag" data-tag-category="${tag}" data-tag-selected-status="default" title="Afficher les photographies de la catégorie ${tag}"
                    aria-label="Afficher les photographies de la catégorie ${tag}" tabindex="0">#${tag}</a>`
                }) ;

                let htmlBanner =
                    `<div class="about__informations">
                        <div class="card card--photographer-page">
                            <h1 id="card__name" class="card__name card__name--photographer-page">
                                ${element.name}
                            </h1>
                            <h2 class="card__location card__location--photographer-page">
                                ${element.city}, ${element.country}
                            </h2>
                            <p class="card__tagline card__tagline--photographer--page">
                                ${element.tagline}
                            </p>
                            <nav class="navigation navigation--photographerPage" role="button" aria-label="photographer categories" data-photographer-categories="${photographerTags}">
                                ${photographerHtmlTags}
                            </nav>
                        </div><!-- end about informations -->

                        <button id="contact" tabindex="0" aria-label="Contact Me" class="button button--contact">Contactez-moi</button>

                    </div>
    
                    <div class="bio__picture">
                        <img class="card__picture card__picture--photographer-page" src="${portraitPicturePath}" alt="${element._name}">
                    </div>`

                document.getElementById("about").innerHTML += htmlBanner ;
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    displayMediaGallery(photographerMedia, photographer){ //TODO replace photographer parameter => use function inside to get name

        let mediaGallery = "" ;

        photographerMedia
            .then(data => {
                photographer
                    .then(element => {

                        //get only first name and remove "-" if composed first names
                        let photographerNameForMediaPath = element.name.split(" ")[0].replace("-"," ") ;

                        data.forEach(media => {
                            if (media.image){

                                let mediaPath = `./public/media/${photographerNameForMediaPath}/${media.image}`

                                mediaGallery += //TODO solve mediaId at 2 locations
                                    `<div class="media" data-media-id="${media.id}" data-media-type="picture"  data-media-status="default" data-media-title="${media.title}" data-media-category="${media.tags}" data-media-date="${media.date}" data-media-likes="${media.likes}">
                                        <picture class="media__element" tabindex="0">
                                            <img data-media-id="${media.id}" src="${mediaPath}" alt="${media.title}" title="${media.title}" aria-label="${media.title}"> 
                                        </picture>
                                        <div class="media__informations">
                                            <div class="media__title">
                                                ${media.title}
                                            </div>
                                            <div class="media__likes" tabindex="0">
                                                ${media.likes}
                                            </div>
                                        </div>
                                    </div>`

                            } else if (media.video){

                                let mediaPath = `./public/media/${photographerNameForMediaPath}/${media.video}`

                                mediaGallery += //TODO solve mediaId at 2 locations
                                    `<div class="media" data-media-id="${media.id}" data-media-type="video" data-media-status="default" data-media-title="${media.title}"  data-media-category="${media.tags}" data-media-date="${media.date}" data-media-likes="${media.likes}">
                                        <video data-media-id="${media.id}" class="media__element" tabindex="0">
                                            <source src="${mediaPath}" title="${media.title}" aria-label="${media.title}"> 
                                        </video>
                                        <div class="media__informations">
                                            <div class="media__title">
                                                ${media._title}
                                            </div>
                                            <div class="media__likes" tabindex="0">
                                                ${media._likes}
                                            </div>
                                        </div>
                                    </div>`
                            }

                        })
                        this._gallery.innerHTML += mediaGallery ;
                    })
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    displayTotalLikesNumber(photographerTotalLikes) {
        photographerTotalLikes
            .then(data => {
                document.getElementById("likes-number").innerText = data ;
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    displayPrice(photographerPrice){
        photographerPrice
            .then(data => {
                document.getElementById("price").innerText = `${data}€ / jour` ;
            })
            .catch(error => {
                console.log("An error has occured :", error) ;
            }) ;
    }

    addDataAttributeFilterTagStatus(userSelectedTagCategory, userSelectedTagStatus){
        let allFilterTagsInPage = document.getElementsByClassName("tag") ;

        for (let i = 0; i < allFilterTagsInPage.length; i++) {
            if (allFilterTagsInPage[i].dataset.tagCategory === userSelectedTagCategory) {
                if(userSelectedTagStatus === "selected"){
                    allFilterTagsInPage[i].dataset.tagSelectedStatus = "default" ;
                } else {
                    allFilterTagsInPage[i].dataset.tagSelectedStatus = "selected" ;
                }
            } else {
                allFilterTagsInPage[i].dataset.tagSelectedStatus = "default" ;
            }
        }
    }

    onHomePageFilterTags(){
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

        this.addDataAttributeFilterTagStatus(userSelectedTagCategory, userSelectedTagStatus) ;

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
                if (!photographerCategories.includes(userSelectedTagCategory)) {
                    allPhotographersCards[i].classList.remove("card--isHidden");
                }
            }
        }
    }

    onPhotographerPageTags(){
        document
            .addEventListener("click", event => {
                if (event.target.className.includes("tag")){

                    let userSelectedTagCategory = event.target.dataset.tagCategory ;
                    let userSelectedTagStatus = event.target.dataset.tagSelectedStatus ;

                    this.filterMediaByTag(userSelectedTagCategory, userSelectedTagStatus);
                }
            })
        document
            .addEventListener("keydown", event => {

                if (event.key === "Enter"){

                    let userSelectedTagCategory = event.target.dataset.tagCategory ;
                    let userSelectedTagStatus = event.target.dataset.tagSelectedStatus ;

                    this.filterMediaByTag(userSelectedTagCategory, userSelectedTagStatus) ;
                }
            })
    }

    filterMediaByTag(userSelectedTagCategory, userSelectedTagStatus){

        this.addDataAttributeFilterTagStatus(userSelectedTagCategory,userSelectedTagStatus ) ;

        let allMedia = document.getElementsByClassName("media") ;

        if (userSelectedTagStatus ==="default"){

            for (let i = 0; i < allMedia.length; i++) {
                let mediaCategory = allMedia[i].dataset.mediaCategory ;
                if (mediaCategory !== userSelectedTagCategory){
                    allMedia[i].classList.add("card--isHidden") ;
                    allMedia[i].dataset.mediaStatus = "unselected" ;
                } else if (mediaCategory === userSelectedTagCategory){
                    allMedia[i].classList.remove("card--isHidden") ;
                    allMedia[i].dataset.mediaStatus = "selected" ;
                }
            }
        } else {

            for (let i = 0; i < allMedia.length; i++) {
                let mediaCategory = allMedia[i].dataset.mediaCategory;
                if (mediaCategory !== userSelectedTagCategory) {
                    allMedia[i].classList.remove("card--isHidden");
                    allMedia[i].dataset.mediaStatus = "default" ;
                }
                if (mediaCategory === userSelectedTagCategory) {
                    allMedia[i].dataset.mediaStatus = "default" ;
                }
            }
        }
    }

    onContactButton(){
        document
            .addEventListener("click", event => {
                if(event.target.id ==="contact"){
                    this.openContactModal() ;
                }
            })
    }

    openContactModal(){

        let modalElement = document.getElementById("contact-modal") ;
        this.trapFocusForAccessibility(modalElement) ;

        let photographerName = document.getElementById("card__name").innerText ;
        document.getElementById("photographer-name").innerText = photographerName ;

        document
            .getElementById("contact-modal")
            .classList.remove("contact-modal--isHidden")
    }

    closeContactModal(){
        document
            .getElementById("contact-modal")
            .classList.add("contact-modal--isHidden")
    }

    onCloseContactModalButton() {
        document
            .addEventListener("click", event => {
                if (event.target.id === "contact-form-close") {
                    this.closeContactModal();
                }
            }) ;
        document
            .addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    this.closeContactModal();
                }
            }) ;
    }

    onSubmitContactModalButton(){
        document
            .addEventListener("click", event => {
                if (event.target.id === "submit-contact-form") {
                    this.submitContactForm(event);
                }
            }) ;
    }

    submitContactForm(event){
        event.preventDefault() ;
        let firstName = document.getElementById("firstName").value ;
        let lastName = document.getElementById("lastName").value  ;
        let email = document.getElementById("email").value  ;

        console.log("Prénom : ", firstName) ;
        console.log("Nom : ", lastName) ;
        console.log("Email : ", email) ;
        console.log("Message : ", message.value) ;
    }

    onSort(){
        document.getElementById("sort__selection")
            .addEventListener("click", event => {
                let sortType = event.target.id ;
                this.sortMedia(sortType) ;
        }) ;

        document.getElementById("sort__selection")
            .addEventListener("focus", event => {
                if (event.explicitOriginalTarget.id === "contact"){
                document.getElementById("sort__selection").classList.add("sort__selection--accessibility") ;
            }
        })

        document.getElementById("title-sort")
            .addEventListener("focusout", event => {
                document.getElementById("sort__selection").classList.remove("sort__selection--accessibility") ;
            })
    }

    sortMedia(sortType){

        let allMediaNodeList = document.getElementsByClassName("media") ;
        let allMediaArray = Array.from(allMediaNodeList) ;

        let allSortOptions = Array.from(document.getElementById("sort__selection").children) ;
        allSortOptions.forEach(button => {
            button.removeAttribute("aria-selected") ;
        })

        if (sortType ==="popularity-sort"){

            this.sortMediaByPopularity(allMediaArray)

        } else if (sortType ==="date-sort"){

            this.sortMediaByDate(allMediaArray) ;

        } else if (sortType ==="title-sort"){

            this.sortMediaByTitle(allMediaArray)

        }
    }

    sortMediaByPopularity(allMediaArray) {
        let datasetAttribute = "mediaLikes";
        let firstDataValue = Number(allMediaArray[0].dataset[datasetAttribute]);
        let lastDataValue = Number(allMediaArray[allMediaArray.length - 1].dataset[datasetAttribute]);
        document.getElementById("popularity-sort").setAttribute("aria-selected", true);
        document.getElementById("popularity-sort").parentNode.setAttribute("aria-activedescendant", "popularity-sort")

        if (allMediaArray.length > 1) {

            if (firstDataValue > lastDataValue) {

                allMediaArray.sort(function (a, b) {

                    let aLikesNumber = Number(a.dataset[datasetAttribute]);
                    let bLikesNumber = Number(b.dataset[datasetAttribute]);

                    if (aLikesNumber < bLikesNumber) {return -1} ;
                    if (aLikesNumber > bLikesNumber) {return 1};

                });
                this._gallery.innerHTML = "";
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML;
                })

            } else {
                allMediaArray.sort(function (a, b) {

                    let aLikesNumber = Number(a.dataset[datasetAttribute]);
                    let bLikesNumber = Number(b.dataset[datasetAttribute]);

                    if (aLikesNumber < bLikesNumber) {return 1};
                    if (aLikesNumber > bLikesNumber) {return -1};

                });
                this._gallery.innerHTML = "";
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML;
                })
            }
        }
    }

    sortMediaByDate(allMediaArray){
        let datasetAttribute = "mediaDate" ;

        let firstDataValue = new Date (allMediaArray[0].dataset[datasetAttribute]);
        let lastDataValue = new Date (allMediaArray[allMediaArray.length - 1].dataset[datasetAttribute]);
        document.getElementById("date-sort").setAttribute("aria-selected", true) ;
        document.getElementById("date-sort").parentNode.setAttribute("aria-activedescendant", "date-sort") ;

        if (allMediaArray.length > 1){

            if (firstDataValue > lastDataValue){

                allMediaArray.sort(function (a,b){

                    let aLikesNumber = new Date(a.dataset[datasetAttribute]) ;
                    let bLikesNumber = new Date(b.dataset[datasetAttribute]) ;

                    if (aLikesNumber < bLikesNumber){return -1} ;
                    if (aLikesNumber > bLikesNumber){return 1};

                });
                this._gallery.innerHTML = "" ;
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML ;
                })

            } else {
                allMediaArray.sort(function (a,b){

                    let aLikesNumber = new Date(a.dataset[datasetAttribute]) ;
                    let bLikesNumber = new Date(b.dataset[datasetAttribute]) ;

                    if (aLikesNumber < bLikesNumber){return 1} ;
                    if (aLikesNumber > bLikesNumber){return -1};

                });
                this._gallery.innerHTML = "" ;
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML ;
                })
            }
        }

    }

    sortMediaByTitle(allMediaArray){
        let datasetAttribute = "mediaTitle" ;

        let firstDataValue = allMediaArray[0].dataset[datasetAttribute];
        let lastDataValue = allMediaArray[allMediaArray.length - 1].dataset[datasetAttribute];
        document.getElementById("title-sort").setAttribute("aria-selected", true) ;
        document.getElementById("title-sort").parentNode.setAttribute("aria-activedescendant", "title-sort") ;

        if (allMediaArray.length > 1){

            if (firstDataValue > lastDataValue){

                allMediaArray.sort(function (a,b){

                    let aLikesNumber = a.dataset[datasetAttribute] ;
                    let bLikesNumber = b.dataset[datasetAttribute] ;

                    if (aLikesNumber < bLikesNumber){return -1} ;
                    if (aLikesNumber > bLikesNumber){return 1};
                });

                this._gallery.innerHTML = "" ;
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML ;
                })

            } else {
                allMediaArray.sort(function (a,b){

                    let aLikesNumber = a.dataset[datasetAttribute] ;
                    let bLikesNumber = b.dataset[datasetAttribute] ;

                    if (aLikesNumber < bLikesNumber){return 1} ;
                    if (aLikesNumber > bLikesNumber){return -1};
                });

                this._gallery.innerHTML = "" ;
                allMediaArray.forEach(media => {
                    this._gallery.innerHTML += media.outerHTML ;
                })
            }
        }
    }

    onMediaLikes(){
        document
            .addEventListener("click", event => {
                if (event.target.className.includes("media__likes")){
                    let media = event.target.parentNode.parentNode ;
                    this.likeMedia(media) ;
                }
            })
        document
            .addEventListener("keydown", event => {
                if (event.key === "Enter"){
                    if (event.target.className.includes("media__likes")){
                        let media = event.target.parentNode.parentNode ;
                        this.likeMedia(media) ;
                    }
                }
            })
    }

    likeMedia(media){
        let actualMediaLikesNumber = Number(media.dataset.mediaLikes) ;
        let actualTotalMediaLikes = Number(document.querySelector(".extra__likes-number").innerHTML) ;
        let newMediaLikesNumber = 0 ;
        let newTotalLikesNumber = 0 ;

        if (media.dataset.ismediaLiked === "true"){
            newMediaLikesNumber = actualMediaLikesNumber - 1 ;
            newTotalLikesNumber = actualTotalMediaLikes - 1 ;
            media.dataset.mediaLikes = newMediaLikesNumber ;
            media.setAttribute(["data-isMedia-liked"], "false") ;
        } else {
            newMediaLikesNumber = actualMediaLikesNumber + 1 ;
            newTotalLikesNumber = actualTotalMediaLikes + 1 ;
            media.dataset.mediaLikes = newMediaLikesNumber ;
            media.setAttribute(["data-isMedia-liked"], "true") ;
        }

        media.querySelector(".media__likes").innerHTML = newMediaLikesNumber ;
        document.querySelector(".extra__likes-number").innerHTML = newTotalLikesNumber ;
    }

    onMediaElement(){
        document
            .getElementById("gallery")
            .addEventListener("click", event => {
                if (event.target.localName ==="img" || event.target.localName ==="video"){
                    let userFirstMediaSelectedId = Number(event.target.dataset.mediaId) ;
                    this.openLightBox(userFirstMediaSelectedId) ;
                }
            })
        document
            .getElementById("gallery")
            .addEventListener("keydown", event => {
                if (event.key === "Enter"){
                    if (event.target.className.includes("media__element")){
                        let userFirstMediaSelectedId = Number(event.target.children[0].dataset.mediaId) ;
                        this.openLightBox(userFirstMediaSelectedId) ;
                    }
                }
            })
    }

    openLightBox(firstUserSelectedMedia){

        let element = document.getElementById("lightBox-modal") ;
        this.trapFocusForAccessibility(element) ;

        document.getElementById("lightBox-gallery").innerHTML = "" ;

        let onlyVisibleMedia = document.querySelectorAll('[data-media-status="default"], [data-media-status="selected"]') ;

        let mediaIndex = 0 ;

        for (let i = 0; i < onlyVisibleMedia.length; i++) {

            let mediaType = onlyVisibleMedia[i].getAttribute('data-media-type') ;
            let mediaId = Number(onlyVisibleMedia[i].getAttribute('data-media-id')) ;
            let mediaPath = onlyVisibleMedia[i].children[0].children[0].getAttribute("src") ;
            let mediaTitle = onlyVisibleMedia[i].children[1].children[0].innerText ;

            let lightBoxMediaElement = "" ;

            if (mediaType === "picture"){
                lightBoxMediaElement =
                    `<picture class="lightBox-modal__element-picture">
                        <img id="${mediaId}" src="${mediaPath}" alt="${mediaTitle}" aria-label="${mediaTitle}" title="${mediaTitle}">
                    </picture>`
            } else {
                lightBoxMediaElement =
                    `<video controls id="${mediaId}" class="lightBox-modal__element-video">
                        <source src="${mediaPath}" alt="${mediaTitle}" aria-label="${mediaTitle}" title="${mediaTitle}>
                    </video>`
            }

            let lightBox = "" ;

            if (mediaId === firstUserSelectedMedia){
                lightBox =
                    `<div class="lightBox-modal__media lightBox-modal__media--isVisible" data-lightbox-media-status="default" data-lightbox-media-index="${mediaIndex}" >
                         <div class="lightBox-modal__element">
                            ${lightBoxMediaElement}
                         </div>
                         <div class="lightBox-modal__title">
                            <h3>
                                ${mediaTitle}
                            </h3>
                         </div>
                    </div>` ;
            } else {
                lightBox =
                    `<div class="lightBox-modal__media" data-lightbox-media-status="default" data-lightbox-media-index="${mediaIndex}" >
                         <div class="lightBox-modal__element">
                            ${lightBoxMediaElement}
                         </div>
                         <div class="lightBox-modal__title">
                            <h3>
                                ${mediaTitle}
                            </h3>
                         </div>
                    </div>` ;
            }

            document.getElementById("lightBox-gallery").innerHTML += lightBox ;

            mediaIndex += 1 ;
        }

        document.getElementById("lightBox-modal").classList.add("lightBox-modal--isVisible") ;
    }

    onLightBoxKeyboardEvents(){
        document
            .getElementById("lightBox-modal")
            .addEventListener("keydown", event => {
                if (event.key === "ArrowLeft"){
                    this.displayPreviousMedia() ;
                }
            })
        document
            .getElementById("lightBox-modal")
            .addEventListener("keydown", event => {
                if (event.key === "ArrowRight"){
                    this.displayNextMedia() ;
                }
            })
        document
            .getElementById("lightBox-modal")
            .addEventListener("keydown", event => {
                if (event.key === "Escape"){
                    this.closeLightBoxModal() ;
                }
            })
        document
            .getElementById("nav-close")
            .addEventListener("keydown", event => {
                if (event.key === "Enter"){
                    this.closeLightBoxModal() ;
                }
            })
        document
            .getElementById("nav-next")
            .addEventListener("keydown", event => {
                if (event.key === "Enter"){
                    this.displayNextMedia() ;
                }
            })
        document
            .getElementById("nav-prev")
            .addEventListener("keydown", event => {
                if (event.key === "Enter"){
                    this.displayPreviousMedia() ;
                }
            })
    }

    onLightBoxClickEvents(){

        document
            .getElementById("nav-close")
            .addEventListener("click", this.closeLightBoxModal) ;

        document
            .getElementById("nav-next")
            .addEventListener("click", this.displayNextMedia) ;

        document
            .getElementById("nav-prev")
            .addEventListener("click", this.displayPreviousMedia) ;
    }


    closeLightBoxModal(){
        document
            .getElementById("lightBox-modal")
            .classList.remove("lightBox-modal--isVisible")
    }

    displayNextMedia(){
        let maxIndex = Number(document.getElementsByClassName("lightBox-modal__media").length - 1) ;
        let actualIndex = Number(document.querySelector(".lightBox-modal__media--isVisible").dataset.lightboxMediaIndex) ;

        document.querySelector(".lightBox-modal__media--isVisible").classList.remove("lightBox-modal__media--isVisible") ;

        if (actualIndex === maxIndex){
            document.querySelector('[data-lightbox-media-index="0"]').classList.add("lightBox-modal__media--isVisible") ;
        } else {
            document.querySelector(`[data-lightbox-media-index=${CSS.escape(actualIndex + 1)}]`).classList.add("lightBox-modal__media--isVisible") ;
        }
    }

    displayPreviousMedia(){
        let maxIndex = Number(document.getElementsByClassName("lightBox-modal__media").length - 1) ;
        let actualIndex = Number(document.querySelector(".lightBox-modal__media--isVisible").dataset.lightboxMediaIndex) ;

        document.querySelector(".lightBox-modal__media--isVisible").classList.remove("lightBox-modal__media--isVisible") ;

        if (actualIndex === 0){
            document.querySelector(`[data-lightbox-media-index=${CSS.escape(maxIndex)}]`).classList.add("lightBox-modal__media--isVisible") ;
        } else {
            document.querySelector(`[data-lightbox-media-index=${CSS.escape(actualIndex - 1)}]`).classList.add("lightBox-modal__media--isVisible") ;
        }
    }

    onLogo(){
        document
            .querySelector(".header__logo")
            .addEventListener("keydown", event =>{
                if (event.key ==="Enter"){
                    window.open("FishEye/index.html");
                }
            })
    }

    trapFocusForAccessibility(domElement){
        window.setTimeout(function () {
            domElement.focus()
            let focusableElementsArray = Array.from(domElement.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex = "0"]')) ;
            let firstFocusableElement = focusableElementsArray[0] ;
            let lastFocusableElement = focusableElementsArray[focusableElementsArray.length - 1] ;

            firstFocusableElement.focus() ;

           domElement.addEventListener("keydown", event => {
                   if (document.activeElement === firstFocusableElement){
                   if (event.shiftKey && event.key ==="Tab"){
                       event.preventDefault()
                       lastFocusableElement.focus() ; //TODO find a solution to make it work
                   }
               }
                if (document.activeElement === lastFocusableElement){
                    if (event.key === "Tab"){

                        event.preventDefault() ;
                        firstFocusableElement.focus() ;
                    }
                }
           })
        }, 0)
    }
}


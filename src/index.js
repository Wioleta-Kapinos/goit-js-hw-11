import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import jQuery from "jquery";
const form = document.querySelector(".search-form");
const inputForm = document.querySelector("input");
const gallery = document.querySelector(".gallery");
const buttonLoadMore = document.querySelector(".load-more");
const buttonToTop = document.querySelector("#back-to-top");
window.onload = () => {
    document.getElementById("back-to-top").className = "hide";
};
const searchParams = {
    imageType: "photo",
    orient: "horizontal",
    safeSearch: "true",
}
buttonLoadMore.style.display = "none";
let inputFormValue = "";
let currentPage = 1;
const perPage = 40;
let allPages;
let lightbox = new SimpleLightbox(".gallery a");
function renderGalleryImages(response) {
    let cardMarker = "";
    const info = response.data.hits;
    cardMarker = info.map(el => {
        return `<div class="photo-card"><a href="${el.largeImageURL}">
        <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
        <div class="info"><p class="info-item"><b>Likes</b>${el.likes}</p>
        <p class="info-item"><b>Views</b>${el.views}</p>
        <p class="info-item"><b>Comments</b>${el.comments}</p>
        <p class="info-item"><b>Downloads</b>${el.downloads}</p>
        </div></div>`
    }).join("");
    gallery.insertAdjacentHTML("beforeend", cardMarker);
    lightbox.refresh();
}
const searchImages = async event => {
    event.preventDefault();
    inputFormValue = inputForm.value;
    gallery.innerHTML = "";
    if(inputFormValue === "") {
        buttonLoadMore.style.display = "none";
        Notiflix.Notify.info("Empty field, please complete them.");
        return;
    }
    fetchImages() 
    .then(response => {
        allPages = Math.ceil(response.data.totalHits / perPage);
        if(response.data.totalHits === 0) {
           return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        renderGalleryImages(response);
        buttonLoadMore.style.display = "block";
        currentPage += 1;
        return Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    });
}
async function fetchImages() {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=32928385-c573e9cc533413973b7398451&q=${inputFormValue}&image_type=${searchParams.imageType}&orientation=${searchParams.orient}&safe_search=${searchParams.safeSearch}&per_page=${perPage}&page=${currentPage}`);
        console.log(response);
        return response;
    }
    catch (error) {
        console.error(error);
    }
}
function loadMoreImages() {
    if(currentPage > allPages) {
        buttonLoadMore.style.display = "none";
        return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    fetchImages()
        .then((response) => {
            renderGalleryImages(response);
            currentPage += 1;
            scrollImages();
        })
        .catch((error) => {
            console.log(error);
        });   
}
 function scrollImages() {
     const { height: cardHeight } = document
   .querySelector(".gallery")
   .firstElementChild.getBoundingClientRect();

    window.scrollBy({
   top: cardHeight * 2,
   behavior: "smooth",
});
}
form.addEventListener("submit", searchImages);
buttonLoadMore.addEventListener("click", loadMoreImages);
document.addEventListener("scroll", scrollPage);
function scrollPage() {
    if (document.documentElement.scrollTop > 500) {
        document.getElementById("back-to-top").className = "visib";
    } else {
    document.getElementById("back-to-top").className = "hide";
    }
}
buttonToTop.addEventListener("click", function() {
    $("html, body").animate({scrollTop: 0 }, 500);
});
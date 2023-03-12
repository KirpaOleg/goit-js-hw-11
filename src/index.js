import Notiflix from 'notiflix';
import Notiflix from 'notiflix';
import { ApiService } from './js/api-servise';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const apiService = new ApiService();
loadMoreBtnEl.classList.add('is-hidden');

searchFormEl.addEventListener('submit', onSearch);
loadMoreBtnEl.addEventListener('click', fetchScrollImages);

function onSearch(event) {
  event.preventDefault();

  const inputText = event.currentTarget.elements.searchQuery.value.trim();
  if (inputText === '') {
    return Notiflix.Notify.info('Please enter your search data!');
  }
  apiService.searchQuery = inputText;
  apiService.resetPage();
  clearGallery();
  fetchScrollImages();
}

function fetchScrollImages() {
  apiService
    .fetchPictures()
    .then(({ data }) => {
      if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      createGalleryList(data.hits);
      simpleLightbox();
      scroll();

      if (galleryEl.children.length === data.totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      } else {
        loadMoreBtnEl.classList.remove('is-hidden');
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function createGalleryList(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                  <a class="galery-item" href="${largeImageURL}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                  <a/>
                  <div class="info">
                    <p class="info-item">Likes
                      <b>${likes}</b>
                    </p>
                    <p class="info-item">Views
                      <b>${views}</b>
                    </p>
                    <p class="info-item">Comments
                      <b>${comments}</b>
                    </p>
                    <p class="info-item">Downloads
                      <b>${downloads}</b>
                    </p>
                  </div>
                </a>
              </div>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
    captionsData: 'alt',
  });
  return lightbox;
}

function scroll() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

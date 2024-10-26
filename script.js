// Открытие модального окна для изображений в отзывах
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// Функция для открытия модального окна
function openImageModal(imageUrl) {
    modal.style.display = "block";
    modalImg.src = imageUrl;
}

// Закрытие модального окна
function closeModal() {
    modal.style.display = "none";
}

// Рейтинг звезд
let selectedStars = 0;

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        selectedStars = this.getAttribute('data-value');
        updateStars();
    });

    star.addEventListener('mouseover', function() {
        highlightStars(this.getAttribute('data-value'));
    });

    star.addEventListener('mouseout', function() {
        updateStars();
    });
});

// Обновление звезд
function updateStars() {
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('selected');
        if (star.getAttribute('data-value') <= selectedStars) {
            star.classList.add('selected');
        }
    });
}

// Подсветка звезд
function highlightStars(count) {
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('selected');
        if (star.getAttribute('data-value') <= count) {
            star.classList.add('selected');
        }
    });
}

// Отправка отзыва
function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById("reviewer-name").value;
    const text = document.getElementById("review-text").value;
    const imageInput = document.getElementById("review-image");
    const imageFile = imageInput.files[0];
    let imageUrl = '';

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result; // Получаем URL изображения
            saveAndDisplayReview(name, text, imageUrl); // Сохраняем и отображаем отзыв
        };
        reader.readAsDataURL(imageFile); // Читаем файл как URL
    } else {
        saveAndDisplayReview(name, text, imageUrl); // Если изображения нет, просто сохраняем отзыв
    }

    // Очистка формы и сброс рейтинга
    document.getElementById("review-form").reset();
    selectedStars = 0;
    updateStars();
}

// Сохранение и отображение отзыва
function saveAndDisplayReview(name, text, imageUrl) {
    // Сохранение отзыва в Local Storage
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push({ name, text, rating: selectedStars, image: imageUrl });
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Отображение отзыва
    displayReview(name, text, selectedStars, imageUrl);
}

// Отображение отзыва
function displayReview(name, text, rating, imageUrl) {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.innerHTML = `
        <strong>${name}</strong>
        <div class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
        <p>${text}</p>
    `;
    if (imageUrl) {
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.alt = "Отзывное изображение";
        imgElement.style.maxWidth = "100px";
        imgElement.style.marginTop = "10px";
        imgElement.style.borderRadius = "5px";

        // Добавьте обработчик события на клик для изображения
        imgElement.addEventListener("click", function() {
            openImageModal(imageUrl);
        });

        reviewItem.appendChild(imgElement);
    }
    document.getElementById("reviews-list").appendChild(reviewItem);
}

// Загрузка отзывов при загрузке страницы
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.forEach(review => {
        displayReview(review.name, review.text, review.rating, review.image);
    });
}

// Загрузка отзывов при загрузке страницы
window.onload = loadReviews;

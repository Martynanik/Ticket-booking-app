const userButton = document.querySelector(".user-button")
const adminButton = document.querySelector(".admin-button")
const addMovieButton = document.querySelector(".add-movie-button")
const logo = document.querySelector(".logo")

const loginPage = document.querySelector(".login-page")
const movieListPage = document.querySelector(".movie-list-page")
const createMovieField = document.querySelector(".create-movie-field")

let addMovieButtonClicked = false
let seatsInput = document.querySelector(".movie-seats-input");
let titleInput = document.querySelector(".movie-title-input");
let movieImageInput = document.querySelector(".movie-image-input")
const createMovieButton = document.querySelector(".create-movie-button")
let movieField = document.querySelector(".movie-field");
const seatSelectingPage =document.querySelector(".seat-selecting-page")
const allMovies =document.querySelector(".all-movies")
const background =document.querySelector(".background")
const bookSeat =document.querySelector(".book-seat")

let isAdmin = false

///NAVIGATION
logo.onclick=()=>{
    movieListPage.style.display = "none"
    loginPage.style.display = "block"
    addMovieButton.style.display = "none"
    logo.style.display = "none"
    allMovies.style.display = "none"
    seatSelectingPage.style.display = "none"
}
userButton.onclick=()=>{
    isAdmin = false
    movieListPage.style.display = "block"
    loginPage.style.display = "none"
    addMovieButton.style.display = "none"
   logo.style.display = "block"
    createMovieField.style.display = "none";
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.style.display = "none";
    });
    allMovies.style.display = "block"
    seatSelectingPage.style.display = "none"
    background.style.display = "block"
}
adminButton.onclick=()=>{
    isAdmin = true
    movieListPage.style.display = "block"
    loginPage.style.display = "none"
    addMovieButton.style.display = "block"
    logo.style.display = "block"
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.style.display = "block";
    });
    allMovies.style.display = "block"
    seatSelectingPage.style.display = "none"
    background.style.display = "block"

}
addMovieButton.onclick = () => {

    if (!addMovieButtonClicked) {
        createMovieField.style.display = "block";
        addMovieButtonClicked = true;
    } else {
        createMovieField.style.display = "none";
        addMovieButtonClicked = false;
    }
};


createMovieButton.onclick = () => {
    if (movieImageInput.value.trim() !== '' && titleInput.value.trim() !== '' && seatsInput.value.trim() !== '') {

        const seatAvailability = [];
        for (let i = 1; i <= parseInt(seatsInput.value); i++) {
            seatAvailability.push({ isAvailable: true });
        }

        const movieDetails = {
            imageUrl: movieImageInput.value,
            title: titleInput.value,
            seats: parseInt(seatsInput.value),
            seatAvailability: seatAvailability
        };
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        console.log(movies)
        movies.push(movieDetails);
        localStorage.setItem('movies', JSON.stringify(movies));
        createMovieBox(movieDetails, movies.length - 1);
    } else {
        console.log("Fill in all fields");
    }
};

function deleteMovieFromLocalStorage(index) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    console.log(movies)
    movies.splice(index, 1);3
    localStorage.setItem('movies', JSON.stringify(movies));
}

function createMovieBox(movieDetails, index) {
    const { imageUrl, title, seats } = movieDetails;

    const el = document.createElement("div");
    el.classList.add("movie-box");
    el.style.backgroundImage = `url("${imageUrl}")`;
    el.id = `movie-box-${index}`;

    const hoverInfo = document.createElement("div");
    hoverInfo.classList.add("hover-with-info");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = title;

    let availableSeats = movieDetails.seatAvailability.filter(seat => seat.isAvailable).length;
    const seatsDiv = document.createElement("div");
    seatsDiv.classList.add("seats");
    seatsDiv.textContent = `Available seats ${availableSeats}/${seats}`;
    seatsDiv.addEventListener("click", () => {
        movieListPage.style.display = "block";
        loginPage.style.display = "none";
        addMovieButton.style.display = "none";
        logo.style.display = "block";
        createMovieField.style.display = "none";
        const deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach(button => {
            button.style.display = "none";
        });
        seatSelectingPage.style.display = "block";
        allMovies.style.display = "none";
        background.style.display = "none";

        addMovieImage(index);
        bookSeat.innerHTML = "";
        addSeats(index);
    });

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("delete");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        el.remove();
        deleteMovieFromLocalStorage(index);
    });

    hoverInfo.appendChild(titleDiv);
    hoverInfo.appendChild(seatsDiv);
    hoverInfo.appendChild(deleteButton);
    el.appendChild(hoverInfo);
    movieField.appendChild(el);
}

function loadMoviesFromLocalStorage() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies.forEach((movie, index) => {
        createMovieBox(movie, index);
    });
    console.log(movies)
}

function addMovieImage(index){
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const imageUrl = movies[index].imageUrl;
    let movieImage = document.querySelector(".chosen-movie-box")
    movieImage.style.backgroundImage = `url("${imageUrl}")`;
}

function addSeats(index){
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const seatNumber = parseInt(movies[index].seats);
    console.log(seatNumber)
    console.log(movies[index].seatAvailability.length)
    for (let i = 0; i < seatNumber; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("seat-icon");
        bookSeat.appendChild(emptyDiv)
        emptyDiv.addEventListener("click", () => {
            reserveSeats(index, i);
        });
        emptyDiv.style.backgroundColor = movies[index].seatAvailability[i].isAvailable ? "white" : "red";
    }
}

function reserveSeats(index, seat) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    console.log(movies)
    const selectedMovie = movies[index];
    console.log(selectedMovie)

    if (!selectedMovie.seatAvailability[seat].isAvailable && !isAdmin) {
        console.log("You don't have permission to unreserve this seat.");
        return;
    }
    selectedMovie.seatAvailability[seat].isAvailable = !selectedMovie.seatAvailability[seat].isAvailable;

    const seatIcons = document.querySelectorAll(".seat-icon");
    seatIcons[seat].style.backgroundColor = selectedMovie.seatAvailability[seat].isAvailable ? "white" : "green"

    const availableSeats = selectedMovie.seatAvailability.filter(seat => seat.isAvailable).length;
    const seatsDiv = document.querySelector(`#movie-box-${index} .seats`);
    seatsDiv.textContent = `Available seats ${availableSeats}/${selectedMovie.seats}`;

    localStorage.setItem('movies', JSON.stringify(movies));
}

window.onload = loadMoviesFromLocalStorage;

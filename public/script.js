
window.onload = function(){

  var baseUrl = "https://www.omdbapi.com/";
  var movies;

  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    //Prevents the page from reloading with the form submit button is clicked.
    e.preventDefault();
    // searchParam is the name of the text field in our movie search form
    // in the index.html document. This is a handy way to get form data based
    // on the name of the field.
    var searchTerm = document.getElementById('movieSearchForm').searchParam.value;
    sendSearchRequest(searchTerm);
  };

  document.getElementById('favorites-button').onclick = function(e){
    getFavorites();
  };

  /////////////////////////////////////////////////////////////////////////
  //
  //These functions handle the send and receiving of data between between
  //the web page and OMDB and between the webpage and the Sinatra server.
  //
  ///////////////////////////////////////////////////////////////////////

  function sendSearchRequest(searchTerm){
    var searchUrl = baseUrl + "?s=" + searchTerm;

    // Builds the request object
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        // JavaScript's asynchronicity in action. This line will not run until
        // the response from OMBD comes back.
        // Then it will pass the response to the addMovies function defined below.
        // The response needs to be put into JSON format so we can process it.
        var jsonData = JSON.parse(request.response);
        //'Search' here is not a JavaScript function. It's particular to the JSON
        //data from OMDB. Play around with the movies variable in the 
        //console to see.
        movies = jsonData.Search;
        addMovies(movies);
      }
    }
    request.open('GET', searchUrl, true);
    request.send();
  };

  function requestMovieData(target, imdbId){
    var movieUrl = baseUrl + "?i=" + imdbId;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var movie = JSON.parse(request.response);
        addMovie(target.parentElement, movie);
      }
    };

    request.open('GET', movieUrl, true);
    request.send();
  };

  //This function has the same structure as sendSearchRequest(), but it sends 
  //request to our own app.rb.
  function saveFavoriteMovie(movieName, imdbid){
    var request = new XMLHttpRequest();
    //This puts the name and imdbID in the query string so they'll
    //be in the params in the route in app.rb.
    var url = '/favorites?title=' + movieName + "&imdbid=" + imdbid
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200){
            var movieName = JSON.parse(request.response).Title;
          addMessage(movieName + " has been saved in your favorites.");
        }
      }

    request.open('POST', url, true);
    request.send();
  };

  function getFavorites(){
    var request = new XMLHttpRequest();
    var url = '/favorites'
      request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
          var response = request.response
          if (response == ""){
            response = "{}"
          }
          var movies = JSON.parse(response);
          addMovies(movies);
        }
      }

    request.open('GET', url, true);
    request.send();
  };

  /////////////////////////////////////////////////////////////////////////////
  //
  //These functions handle parsing the data and adding and removing
  //elements from the DOM.
  //
  ////////////////////////////////////////////////////////////////////////////

  //Goes through the movies list, builds the html code that we need
  //to add to the page, and then appends it to the movie-list ul.
  //This is the proper order to do these things.
  function addMovies(movies){
    if (movies == undefined){
      addMessage('no movies found');
      return;
    }else{
      clearMessages();
    }
    var movieList = document.getElementsByClassName('movie-list')[0];
    movieList.innerHTML = "";
    for(var i = 0; i < movies.length; ++i){
      var movieTitle = movies[i].Title;
      //imdbId is not arcane JavaScriptery. It's a unique identifier we can use
      //to the the specific movie from OMDB.
      var movieImdbId = movies[i].imdbID;
      // First: build the individual elements
      var titleDivEl = document.createElement('div');
      var titleSpan = document.createElement('span');
      titleDivEl.className = "title-bar";
      titleSpan.innerHTML = movieTitle;
      var listItemEl = document.createElement('li');
      //Use 'data-something' to store data in an HTML element.
      titleSpan.setAttribute('data-imdbid', movieImdbId);
      titleSpan.onclick = function(e){
        //JavaScript provides this cute way to get your data back out of the 
        //HTML elemement. Any attribute in an HTML element that starts with 'data-' 
        //is available in the 'dataset'.
        var targetImdbId = e.target.dataset.imdbid;
        requestMovieData(e.target.parentElement, targetImdbId);
      }
      // Next: put the elements together
      titleDivEl.appendChild(titleSpan);
      listItemEl.appendChild(titleDivEl);

      // Last: add them to the page. 
      movieList.appendChild(listItemEl);
    }
  };

  function addMovie(target, movie){
    clearMessages();
    var titleSpan = target.getElementsByTagName('span')[0];
    //this turns off the onclick on the movie title so it doesn't mess 
    //with the buttons.
    titleSpan.setAttribute('onclick', null);

    var movieDivEl = document.createElement('div');
    var movieName = movie.Title;
    var imdbid = movie.imdbID;
    movieDivEl.className = 'movie-info';
    var titleDivEl = target.getElementsByClassName('title-bar')[0];
    addCloseButton(titleDivEl);
    addFavoriteButton(titleDivEl, movieName, imdbid);
    var listEl = document.createElement('ul');
    //This removes the properties of the movie object we don't want to
    //display
    delete movie.Title;
    delete movie.Poster;
    delete movie.Type;
    delete movie.Response;
    //This gets every property of the movie object and displays the 
    //property name and it's value.
    for (var property in movie) {
      var text = property + ": " + movie[property];
      var listItemEl = document.createElement('li');
      listItemEl.innerHTML = text;
      listEl.appendChild(listItemEl);
    }
    movieDivEl.appendChild(listEl);
    target.appendChild(movieDivEl);
  };

  function addFavoriteButton(target, movie, imdbid){
    var favoriteButton = document.createElement('button');
    favoriteButton.className = "favorite-button";
    favoriteButton.className = "movie-buttons";
    favoriteButton.innerHTML = 'favorite';
    favoriteButton.onclick = function(){
      saveFavoriteMovie(movie, imdbid);
    };
    target.appendChild(favoriteButton);
  };

  function addCloseButton(target){
    var closeButton = document.createElement('button');
    closeButton.className = "close-button";
    closeButton.className = "movie-buttons";
    closeButton.innerHTML = 'close';
    closeButton.onclick = function(){
      //the close button really just runs addMovies again to rebuild the 
      //movie list.
      addMovies(movies);
    };
    target.appendChild(closeButton);
  };

  function addMessage(message){
    var messageDiv = document.getElementsByClassName('message-area')[0];
    var innerMessageDiv = document.createElement('div');
    innerMessageDiv.innerHTML = message;
    innerMessageDiv.className = 'inner-message-div';
    messageDiv.appendChild(innerMessageDiv);
  };

  function clearMessages(){
    var messages = document.getElementsByClassName('inner-message-div');
    while(messages.length != 0){
      messages[0].parentNode.removeChild(messages[0]);
    }
  }

}

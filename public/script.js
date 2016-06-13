
window.onload = function(){

  var baseUrl = "https://www.omdbapi.com/";

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
        var movies = jsonData.Search;
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
        addMovie(target, movie);
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
          console.log(request.response);
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
      addMessage('');
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
      titleDivEl.className = "title-bar";
      var listItemEl = document.createElement('li');
      //Use 'data-something' to store data in an HTML element.
      titleDivEl.setAttribute('data-imdbid', movieImdbId);
      titleDivEl.onclick = function(e){
        //JavaScript provides this cute way to get your data back out of the 
        //HTML elemement. Any attribute in an HTML element that starts with 'data-' 
        //is available in the 'dataset'.
        var targetImdbId = e.target.dataset.imdbid;
        requestMovieData(e.target.parentElement, targetImdbId);
      }
      // Next: put the elements together
      titleDivEl.innerHTML = movieTitle;
      listItemEl.appendChild(titleDivEl);

      // Last: add them to the page. 
      movieList.appendChild(listItemEl);
    }
  };

  function addMovie(target, movie){
    var movieDivEl = document.createElement('div');
    var movieName = movie.Title;
    var imdbid = movie.imdbID;
    movieDivEl.className = 'movie-info';
    var titleBar = target.getElementsByClassName('title-bar')[0];
    addCloseButton(titleBar);
    addFavoriteButton(titleBar, movieName, imdbid);
    var listEl = document.createElement('ul');
    //This gets every attribute (item) of the movie object and displays the 
    //attribute and it's value.
    for (var item in movie) {
      var text = item + ": " + movie[item];
      var listItemEl = document.createElement('li');
      listItemEl.innerHTML = text;
      listEl.appendChild(listItemEl);
    }
    movieDivEl.appendChild(listEl);
    target.appendChild(movieDivEl);
  };

  function addFavoriteButton(target, movie, imdbid){
    var favoriteButton = document.createElement('button');
    favoriteButton.innerHTML = 'favorite';
    favoriteButton.onclick = function(){
      saveFavoriteMovie(movie, imdbid);
    };
    target.appendChild(favoriteButton);
  };

  function addCloseButton(target){
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'close';
    closeButton.onclick = function(){
      removeOldMovieData();
    };
    target.appendChild(closeButton);
  };

  function addMessage(message){
    var messageDiv = document.getElementsByClassName('message-area')[0];
    messageDiv.innerHTML = message;
  };

  function removeOldMovieData(){
    //there should only ever be one oldMovies element, but since
    //getElementsByClassName returns an array, we might as well
    //use for to make sure we remove everything in the array.
    var oldMovies = document.getElementsByClassName('movie-info');
    for(var i = 0; i < oldMovies.length; ++ i){
      oldMovies[i].parentNode.removeChild(oldMovies[i]);
    };
  };

}

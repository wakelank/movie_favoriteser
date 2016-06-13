
window.onload = function(){

  var baseUrl = "https://www.omdbapi.com/";

  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    e.preventDefault();
    // searchParam is the name of the text field in our movie search form
    // in the index.html document. This is a handy way to get form data based
    // on the name of the field.
    var searchTerm = document.getElementById('movieSearchForm').searchParam.value;
    sendSearchRequest(searchTerm);
  };

  function sendSearchRequest(searchTerm){
    var searchUrl = baseUrl + "?s=" + searchTerm;

    // Builds the request object
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        // JavaScript's asynchronicity in action. This line will not run until
        // the response from OMBD comes back.
        // Then it will pass the response to the processResponse function defined below.

        processResponse(request.response);
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
        var movieListEl = processMovieData(request.response);
        target.appendChild(movieListEl);
      }
    };

    request.open('GET', movieUrl, true);
    request.send();
  };

  //This function has the same structure as sendSearchRequest(), but it sends 
  //request to our own app.rb.
  function saveFavoriteMovie(movieName, oid){
    var request = new XMLHttpRequest();
    //This puts the name and oid in the query string so they'll
    //be in the params in the route in app.rb.
    var url = '/favorites?name=' + movieName + "&oid=" + oid
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.statys == 200){
          console.log('movie added');
        }
      }

    request.open('POST', url, true);
    request.send();
  }

  function processResponse(response){
    // The response needs to be put into JSON format so we can process it.
    var jsonData = JSON.parse(response);
    //'Search' here is not a JavaScript function. It's particular to the JSON
    //data from OMDB. Play around with the movies variable in the 
    //console to see.
    var movies = jsonData.Search;
    var movieList = document.getElementsByClassName('movie-list')[0];

    //Goes through the movies list, builds the html code that we need
    //to add to the page, and then appends it to the movie-list ul.
    //This is the proper order to do these things.
    for(var i = 0; i < movies.length; ++i){
      var movieTitle = movies[i].Title;
      //imdbId is not arcane JavaScriptery. It's a unique identifier we can use
      //to the the specific movie from OMDB.
      var movieImdbId = movies[i].imdbID;
      // First: build the individual elements
      var titleNode = document.createTextNode(movieTitle);
      var titleSpanEl = document.createElement('span');
      var listItemEl = document.createElement('li');
      //Use 'data-something' to store data in an HTML element.
      titleSpanEl.setAttribute('data-imdbid', movieImdbId);
      titleSpanEl.onclick = function(e){
        //JavaScript provides this cute way to get your data back out of the 
        //HTML elemement. Any attribute in an HTML element that starts with 'data-' 
        //is available in the 'dataset'.
        var targetImdbId = e.target.dataset.imdbid;
        requestMovieData(e.target.parentElement, targetImdbId);
      }
      // Next: put the elements together
      titleSpanEl.appendChild(titleNode);
      listItemEl.appendChild(titleSpanEl);

      // Last: add them to the page. 
      movieList.appendChild(listItemEl);
    }
  }

  function processMovieData(response){
    var movie = JSON.parse(response);
    var movieDivEl = document.createElement('div');
    var movieName = movie.Title;
    var oid = movie.imdbID;
    movieDivEl.className = 'movie-info';
    addCloseButton(movieDivEl);
    addFavoriteButton(movieDivEl, movieName, oid);
    var listEl = document.createElement('ul');
    //This gets every attribute (item) of the movie object and displays the 
    //attrbute and it's value.
    for (var item in movie) {
      var text = item + ": " + movie[item];
      var textNode = document.createTextNode(text);
      var listItemEl = document.createElement('li');
      listItemEl.appendChild(textNode);
      listEl.appendChild(listItemEl);
    }
    movieDivEl.appendChild(listEl);
    return movieDivEl;
  };

  function addFavoriteButton(target, movie, oid){
    var favoriteButton = document.createElement('button');
    var text = document.createTextNode('favorite');
    favoriteButton.appendChild(text);
    favoriteButton.onclick = function(){
      saveFavoriteMovie(movie, oid);
    };
    target.appendChild(favoriteButton);
  }

  function addCloseButton(target){
    var closeButton = document.createElement('button');
    var text = document.createTextNode('close');
    closeButton.appendChild(text);
    closeButton.onclick = function(){
      removeOldMovieData();
    };
    target.appendChild(closeButton);
  }

  function removeOldMovieData(){
    var oldMovies = document.getElementsByClassName('movie-info');
    for(var i = 0; i < oldMovies.length; ++ i){
      oldMovies[i].parentNode.removeChild(oldMovies[i]);
    };
  }

}

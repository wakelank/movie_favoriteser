
window.onload = function(){
  
  var baseUrl = "https://www.omdbapi.com/";

  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    e.preventDefault();

    var searchValue = document.getElementById('movieSearchForm').searchParam.value;
    var searchUrl = baseUrl + "?s=" + searchValue;

    // Builds the request object
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        // JavaScript's asynchronicity in action. This line will not run until
        // the response from OMBD comes back.
        // Then it will pass the response to the processResponse function defined below.

        processResponse(request.response);
      }
    };

    request.open('GET', searchUrl, true);
    request.send();
  };
  

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
      var listItemEl = document.createElement('li');
      //Use 'data-something' to store data in an HTML element.
      listItemEl.setAttribute('data-imdbid', movieImdbId);
      listItemEl.onclick = function(e){
        e.preventDefault();
        //JavaScript provides this cute way to get your data back out of the 
        //HTML elemement. Anything attribute that starts with 'data-' 
        //is available in the 'dataset'.
        var targetImdbId = e.target.dataset.imdbid;
        requestMovieData(e.target, targetImdbId);
      }
      // Next: put the elements together
      listItemEl.appendChild(titleNode);
        

      // Last: add them to the page. 
      movieList.appendChild(listItemEl);
    }
  }

  function requestMovieData(target, imdbId){
    var movieUrl = baseUrl + "?i=" + imdbId;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var movieListEl = processMovieData(request.response);
        var oldMovies = document.getElementsByClassName('movie-info');
        for(var i = 0; i < oldMovies.length; ++ i){
          oldMovies[i].parentNode.removeChild(oldMovies[i]);
        };
        target.appendChild(movieListEl);



      }
    };

    request.open('GET', movieUrl, true);
    request.send();
  };

  function processMovieData(data){
    var movie = JSON.parse(data);
    var listEl = document.createElement('ul');
    listEl.className = 'movie-info';
   for (var item in movie) {
     var text = item + ": " + movie[item];
     var textNode = document.createTextNode(text);
     var listItemEl = document.createElement('li');
     listItemEl.appendChild(textNode);
     listEl.appendChild(listItemEl);
   }
   return listEl;


  };
}


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
      var movieTitle = movies[i].Title
      var movieUrl = baseUrl + "?t=" + movieTitle;
      // First: build the individual elements
      var listEl = document.createElement('li');
      var titleNode = document.createTextNode(movieTitle);
      // Next: put the elements together
      listEl.appendChild(titleNode);
      listEl.onclick = function(e){
        e.preventDefault();
        var movieTitle = e.currentTarget.innerText;
        requestMovieData(movieTitle);
      }
        

      // Last: add them to the page. 
      movieList.appendChild(listEl);
    }
  }

  function requestMovieData(movieTitle){
    var movieUrl = baseUrl + "?t=" + movieTitle
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        processMovieData(request.response);
      }
    };

    request.open('GET', movieUrl, true);
    request.send();
  };

  function processMovieData(data){
    console.log(data);
  };
}

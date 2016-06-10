window.onload = function(){
  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    e.preventDefault();

    var searchValue = document.getElementById('movieSearchForm').searchParam.value;
    var baseUrl = "https://www.omdbapi.com/?s=";
    var searchUrl = baseUrl + searchValue;
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        processResponse(request.response);
      }
    };

    request.open('GET', searchUrl, true);
    request.send();
  };

  function processResponse(response){
    var jsonData = JSON.parse(response);
    var movies = jsonData.Search;
    var movieList = document.getElementsByClassName('movie-list')[0];
    for(var i = 0; i < movies.length; ++i){
      movieEl = document.createElement('li');
      titleNode = document.createTextNode(movies[i].Title);
      movieEl.appendChild(titleNode);
      movieList.appendChild(movieEl);
    }

  }



}

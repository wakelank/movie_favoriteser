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
        console.log(JSON.parse(response));
  }
    


}

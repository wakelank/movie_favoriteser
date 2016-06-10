window.onload = function(){
  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    e.preventDefault();
    var searchValue = document.getElementById('movieSearchForm').searchParam.value;
    

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        console.log(JSON.parse(request.response));
      }
    };
    var url = "http://www.omdbapi.com/?s=%27frozen%27"
      request.open('GET', url, true);
    request.send();
    

  };


}

window.onload = function(){
  document.getElementById('movieSearchFormSubmit').onclick = function(e){
    e.preventDefault();
    console.log('click');
    var searchValue = document.getElementById('movieSearch').searchParam.value;
    console.log(searchValue);
  };
}

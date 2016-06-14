
Link to app on Heroku: <http://moviefavoriteser.herokuapp.com>

##backend
I fixed the bugs in the app.rb file and labeled them as if I were 
giving feedback to a student. I also made some minor changes and additions,
and commented on those as well.

##frontend
The look is very simple. I erred on the side of making it understandible to
a student, rather than including a lot of nested HTML. There are three general
sections within the script.js file.
 
* The top part has some global variables and the even listeners for the 
two buttons in the HTML doc.

* Next are the methods that handle communicating with Sinatra and OMDB. 
There could be some refactoring here to increase dryness, but I thought that 
a student would find it easier to see the differences if they were layed out
in seperate functions.

*  Last there are functions that handle constructing elements and adding
them to the page. Some of these are long, but I think they are straightforward,
and I made comments where I thought someone might have a question.

Thanks for the considerdation, guys! I look forward to the teaching demo,
and I hope I get to be part of the team!

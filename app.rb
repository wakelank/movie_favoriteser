require 'json' #Need this to be able to use JSON below
#getting gems from Gemfile instead of app.rb.
require 'bundler'
Bundler.require

get '/' do  #Forgot the 'do'
  File.read('views/index.html') #Need to include 'views'
end

get '/favorites' do #Put the slash in before favorites.
  response.headers['Content-Type'] = 'application/json' #headers, not header
  data = File.read('data.json')
end

post '/favorites' do #Changed get to post to differentiate from the get
                     # favorites method above
  #The first time the data.json file is read it is empty, and the 
  #JSON parser throws a 'JSON::ParserError'. So we rescue the error, and 
  #make our own file array to put the movie data in.
  begin
    file = JSON.parse(File.read('data.json'))
  rescue JSON::ParserError
    puts "there was a parser error, but I think we're ok"
    file = []
  end
  unless params[:title] && params[:imdbid]
    return 'Invalid Request'
  end #Don't forget to close that unless loop
  movie = { Title: params[:title], imdbID: params[:imdbid] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
end

require 'json' #Need this to be able to use JSON below
#getting gems from Gemfile instead of app.rb.
require 'bundler'
Bundler.require

get '/' do  #Forgot the 'do'
  File.read('views/index.html') #Need to include 'views'
end

# get 'favorites' do
#   response.header['Content-Type'] = 'application/json'
#   File.read('data.json')
# end

post '/favorites' do 
  puts 'get data'
  #The first time the data.json file is read it is empty, and the 
  #JSON parser throws a 'JSON::ParserError'. So we rescue the error, and 
  #make our own file array to put the movie data in.
  begin
    file = JSON.parse(File.read('data.json'))
  rescue JSON::ParserError
    puts "there was a parser error, but I think we're ok"
    file = []
  end
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end #Don't forget to close that unless loop
  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
end

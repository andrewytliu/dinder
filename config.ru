require 'jellyfish'
require 'json'

class Go
    include Jellyfish
    
    get '/posts' do
        {_posts: [{msg: 'first',
          comments: [
             {time: Time.now, msg: '1-1', id: 1},
             {time: Time.now - 10, msg: '1-2', id: 2}],
          id: 1
         },
         {msg: 'second',
          comments: [
              {time: Time.now, msg: '2-1', id: 3}],
          id: 2
         }
        ]}.to_json
    end

    post '/posts' do
        {_post: {msg: 'third',
         comments: [],
         id: 3
        }}.to_json
    end

    post '/comments/1' do
        {_comment: {msg: '1-3', time: Time.now, id: 5}}.to_json
    end

    post '/comments/2' do
        {_comment: {msg: '2-2', time: Time.now, id: 6}}.to_json
    end
    
    post '/comments/3' do
        {_comment: {msg: '3-1', time: Time.now, id: 7}}.to_json
    end

    module Helper
        def render &block
            variables = eval('local_variables', block.binding)
            deliver = variables.select {|k| k =~ /^_/}

            json = {}
            deliver.each {|d| json[d] = eval(d.to_s, block.binding) }
            json.to_json
        end
    end
    controller_include Helper
end
use Rack::ContentLength
use Rack::ContentType, 'text/plain'
use Rack::Static, :urls => ["/static", "/index.html"]
run Go.new


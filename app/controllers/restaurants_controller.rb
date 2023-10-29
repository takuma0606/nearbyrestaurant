class RestaurantsController < ApplicationController
    def search
    end

    def index
        require 'net/http'
        require 'uri'
        require 'json'
        key = "087ce2f78e1da5e8"
        lat = params[:latitude]
        lng = params[:longitude]
        range = params[:range]
        api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&order=1&format=json")
        json = Net::HTTP.get(api)
        result = JSON.parse(json)
        render json: result
    end 
    
    def show
    end
end

class RestaurantsController < ApplicationController
    require 'net/http'
    require 'uri'
    require 'json'
    def search
    end

    def index
        key = "087ce2f78e1da5e8"
        lat = params[:latitude]
        lng = params[:longitude]
        range = params[:range]
        start = params[:start]
        count = 9
        api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&start=#{start}&count=#{count}&order=1&format=json")
        json = Net::HTTP.get(api)
        result = JSON.parse(json)
        render json: result
    end 
    
    def show
        key = "087ce2f78e1da5e8"
        restaurant_id = params[:id]
        api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&id=#{restaurant_id}&format=json")
        json = Net::HTTP.get(api)
        @restaurant = JSON.parse(json)
    end
end

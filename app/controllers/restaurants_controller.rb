class RestaurantsController < ApplicationController
    require 'net/http'
    require 'uri'
    require 'json'
    def search
    end

    def index
        key = "087ce2f78e1da5e8"
        lat = "34.70450143800738"
        lng = "135.49478311156489"
        range = params[:range]
        start = params[:start]
        count = 39
        budget = params[:budget]
        if budget == 1
            api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&start=#{start}&count=#{count}&order=1&format=json")
        else
            budget = budget_code(budget)
            api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&start=#{start}&count=#{count}&budget=#{budget}&order=1&format=json")
        end
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

    def budget_code(value)
        budget = {"2"=>"B009","3"=>"B010","4"=>"B011","5"=>"B001","6"=>"B002","7"=>"B003","8"=>"B008","9"=>"B004"}
        return budget[value]
    end
end

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
        count = 9
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

    def budget_code(budget)
        case budget 
        when "2" then
          return "B009"
        when "3" then 
          return "B010"
        when "4" then 
          return "B011"
        when "5" then 
          return "B001"
        when "6" then 
          return "B002"
        when "7" then 
          return "B003"
        when "8" then 
          return "B008"
        when "9" then 
          return "B004"
        end
      end
end

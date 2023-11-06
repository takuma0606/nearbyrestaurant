class RestaurantsController < ApplicationController
    require 'net/http'
    require 'uri'
    require 'json'
    def search
        @genres = {"居酒屋"=>"G001","イタリアン"=>"G006","中華"=>"G007","焼肉"=>"G008","韓国料理"=>"G017","カフェ"=>"G014","バー"=>"G012","エスニック料理"=>"G009","和食"=>"G004","洋食"=>"G005","お好み焼き"=>"G016","ラーメン"=>"G013","その他グルメ"=>"G015"}
    end

    def index
        key = "087ce2f78e1da5e8"
        lat = params[:latitude]
        lng = params[:longitude]
        range = params[:range]
        start = params[:start]
        count = 39
        budget = params[:budget]
        genre = params[:genre]
        if budget == 1
            api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&start=#{start}&count=#{count}&genre=#{genre}&order=1&format=json")
        else
            budget = budget_code(budget)
            api = URI.parse("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{key}&lat=#{lat}&lng=#{lng}&range=#{range}&start=#{start}&count=#{count}&budget=#{budget}&genre=#{genre}&order=1&format=json")
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

// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import jquery from "jquery"
window.$ = jquery

window.addEventListener('DOMContentLoaded', function(){
    $(document).ready(function() {
        var csrfToken = $('meta[name="csrf-token"]').attr('content');
        $("#location").click(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var range = $("#rangeslider").val();
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    }
                });

                // 2. Ajax通信を使ってRailsコントローラに緯度と経度を送信
                $.ajax({
                url: "/index",
                type: "POST",
                data: {latitude : latitude, longitude : longitude, range : range},
                dataType: 'json'
                })
                .done(function(data) {
                    RestaurantDataShow(data);
                });
            },function(){
                console.log("位置情報が取得できません");
            });
        });
    });
});

function RestaurantDataShow(data) {
    document.querySelector(".main").innerHTML = "";
    const template = document.getElementById("template");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < data.results.shop.length; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector("a").href = `/show/${data.results.shop[i].id}`;
      clone.querySelector(".photo img").src = data.results.shop[i].photo.pc.m;
      clone.querySelector(".name").textContent = data.results.shop[i].name;
      clone.querySelector(".budget").textContent = `￥：${data.results.shop[i].budget.name}`;
      clone.querySelector(".access").textContent = `アクセス：${data.results.shop[i].access}`;
      clone.querySelector(".genre").textContent = `ジャンル：${data.results.shop[i].genre.name}`;
      fragment.appendChild(clone);
    }
    document.querySelector(".main").appendChild(fragment);
}


window.addEventListener('DOMContentLoaded', function(){
    const inputElem = document.getElementById('rangeslider');
    const currentdistance = document.getElementById('distance');
    currentdistance.textContent = rangeOnChange(inputElem.value);
    inputElem.addEventListener('input', function(){
        currentdistance.textContent = rangeOnChange(this.value);
    });
    function rangeOnChange(value) {
        switch (value){
            case "1":
                return "300";
            case "2":
                return "500";
            case "3":
                return "1000";
            case "4":
                return "2000";
            case "5":
                return "3000";
        }
    }
});

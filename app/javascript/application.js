// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import { Turbo } from "@hotwired/turbo-rails"
Turbo.session.drive = false
import "controllers"
import jquery from "jquery"
window.$ = jquery


$("#location").click(getrestauarnt);
function getrestauarnt(event) {
    var start = $(this).val();
    var page = $(this).data("page");
    var toindex = $('.index').offset().top;
    navigator.geolocation.getCurrentPosition(function(position) {
        var csrfToken = $('meta[name="csrf-token"]').attr('content');
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
        data: {latitude : latitude, longitude : longitude, range : range, start : start},
        dataType: 'json'
        })
        .done(function(data) {
            RestaurantDataShow(data);
            $(`.pagenation button[data-page=${page}]`).addClass('current');
            $("html").animate({scrollTop: toindex},500);
        });
    },function(){
        console.log("位置情報が取得できません");
    });
}

function RestaurantDataShow(data) {
    document.querySelector(".main").innerHTML = "";
    document.querySelector(".pagenation").innerHTML = "";
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

    if (data.results.results_available > 9) {
        const i = Math.floor(data.results.results_available / 9) + 1;
        for (let j = 0; j < i; j++) {
          const span = document.createElement("button");
          span.textContent = j + 1;
          span.value = 9 * j + 1;
          span.dataset.page = j + 1;
          span.addEventListener("click", getrestauarnt);
          fragment.appendChild(span);
        }
        document.querySelector(".pagenation").appendChild(fragment);
    }
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

$(function () {
    $(".pagetop a").click(function () {
        $("body,html").animate({ scrollTop: 0 }, 500);
        return false;
    });
});

// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import { Turbo } from "@hotwired/turbo-rails"
Turbo.session.drive = false
import "controllers"
import jquery from "jquery"
window.$ = jquery


$("#location").click(getrestauarnt);
//レストランデータを取得する関数
function getrestauarnt(event) {
    $(".index").css("display","block");
    //何件目のデータを取得するか
    var start = $(this).val();
    //現在のページ数を取得
    var page = $(this).data("page");
    var toindex = $('.index').offset().top;
    //現在地をgeolocationapiを使用して取得
    navigator.geolocation.getCurrentPosition(function(position) {
        var csrfToken = $('meta[name="csrf-token"]').attr('content');
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var range = $("#distancerange").val();
        var budget = $("#budgetrange").val();
        var genre = $('.selectfield input:checked').val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': csrfToken
            }
        });

        // 2. Ajax通信を使ってRailsコントローラに検索クエリを送信
        $.ajax({
        url: "/index",
        type: "POST",
        data: {latitude : latitude, longitude : longitude, range : range, start : start, budget : budget, genre : genre},
        dataType: 'json'
        })
        //ajax通信成功時
        .done(function(data) {
            RestaurantDataShow(data);
            //現在表示されているページ数を色付け
            $(`.pagenation button[data-page=${page}]`).addClass('current');
            //最後のページ番号を取得
            var lastpage = $(".pagenation button:last").data("page");
            if (lastpage >= 11) {
                $(".pagenation button").hide();
                if (page < 5) {
                    for (let i = 1; i < 11; i++) {
                        $(`.pagenation button[data-page=${i}]`).show();
                    }
                } else if ((lastpage - page) < 4 ) {
                    for (let i = (lastpage-10); i <= (lastpage); i++) {
                        $(`.pagenation button[data-page=${i}]`).show();
                    }
                } else {
                    //現在のページの前後4ページを表示
                    for (let i = 1; i < 5; i++) {
                        $(`.pagenation button[data-page=${page-i}]`).show();
                        $(`.pagenation button[data-page=${page+i}]`).show();
                    }
                    $(`.pagenation button[data-page=${page}]`).show();
                }
            }
            $("html").animate({scrollTop: toindex},500);
        });
    },function(){
        console.log("位置情報が取得できません");
    });
}

//グルメサーチapiで得られたデータをviewに埋め込む関数
function RestaurantDataShow(data) {
    //再び検索した時に前回表示したデータが再び表示されないように中身を消す
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

    if (data.results.results_available > 39) {
        //ページ数を算出
        const i = Math.floor(data.results.results_available / 39) + 1;
        for (let j = 0; j < i; j++) {
          const span = document.createElement("button");
          //ページ番号
          span.textContent = j + 1;
          //検索クエリstartの値
          span.value = 39 * j + 1;
          //ページ数を格納
          span.dataset.page = j + 1;
          //ページボタン押下時にgetrestaurant関数（レストラン検索関数）を実行
          span.addEventListener("click", getrestauarnt);
          fragment.appendChild(span);
        }
        document.querySelector(".pagenation").appendChild(fragment);
    }
}

//距離検索スライダーをスライド時に距離の表示を動的に変える関数
window.addEventListener('DOMContentLoaded', function(){
    const inputElem = document.getElementById('distancerange');
    const currentdistance = document.getElementById('distance');
    currentdistance.textContent = rangeOnChange(inputElem.value);
    inputElem.addEventListener('input', function(){
        currentdistance.textContent = rangeOnChange(this.value);
    });
    function rangeOnChange(value) {
        const distance = {'1':'300','2':'500','3':'1000','4':'2000','5':'3000'};
        return distance[value];
    }
});

//予算検索スライダーをスライド時に予算の表示を動的に変える関数
window.addEventListener('DOMContentLoaded', function(){
    const inputElem = document.getElementById('budgetrange');
    const currentdistance = document.getElementById('budget');
    currentdistance.textContent = rangeOnChange(inputElem.value);
    inputElem.addEventListener('input', function(){
        currentdistance.textContent = rangeOnChange(this.value);
    });
    function rangeOnChange(value) {
        const budget = {'1':'指定なし','2':'～500円','3':'501～1000円','4':'1001～1500円','5':'1501～2000円'
        ,'6':'2001～3000円','7':'3001～4000円','8':'4001～5000円','9':'5001～7000円'};
        return budget[value];
    }
});

//上に戻るボタンの処理
$(function () {
    $(".pagetop a").click(function () {
        $("body,html").animate({ scrollTop: 0 }, 500);
        return false;
    });
});

//ジャンル検索ボタンが複数選択されないようにする処理
$(function(){
    $('.searchfield input').on('click', function() {
        if ($(this).prop('checked')){
            $('.searchfield input').prop('checked', false);
            $(this).prop('checked', true);
        }
    });
});

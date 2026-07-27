'use strict';

let allData = [];

// JSONを読み込んでallDataに保存
$.ajax({
    url: 'json/data.json',
    dataType: 'json'
})
    .done(function (data) {
        // console.log(data);
        allData = data;
    })
    .fail(function (error) {
        alert('データーを取得できませんでした');
        console.log(error);
    });

const modal = document.querySelector('#modal');
const modalImg = document.querySelector('#modal-img');

// 画像クリックでモーダル表示
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('click-img')) {
        modal.classList.add('active');
        modalImg.src = event.target.src;
    }
});

// モーダルクリックで閉じる
modal.addEventListener('click', function () {
    modal.classList.remove('active');
});

document.querySelector('#clearBtn').addEventListener('click', function () {

    // ラジオボタン全部オフ
    document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.checked = false;
    });

    // 結果消す
    const result = document.querySelector('#result');
    const soil = document.querySelector('#soil');

    result.innerHTML = '';
    soil.innerHTML = '';

    result.style.display = 'none';
    soil.style.display = 'none';

});

const showBtn = document.querySelector('#showBtn');

// お気に入り保存
let favorites = [];

favorites = loadFavorites();

let selectedItem = '';



// localStorageから取得したお気に入りデータを検証し、正しい形式のものだけを残す関数
function loadFavorites() {

    let newFavorites;

    if (localStorage.getItem('favorites')) {
        newFavorites = JSON.parse(localStorage.getItem('favorites'));
    } else {
        newFavorites = [];
    }

    newFavorites = newFavorites.filter(function (item) {
        const isValidId = typeof item.id === "number" && item.id >= 1;
        const isValidImage = typeof item.image === "string" && item.image !== "";
        const isValidFavText = typeof item.favText === "string" && item.favText !== "";

        return isValidId && isValidImage && isValidFavText;
    });

    return newFavorites;
}



// お花を見てみるボタンのクリック処理
showBtn.addEventListener('click', function () {

    const typeEl = document.querySelector('input[name="type"]:checked');
    const sunEl = document.querySelector('input[name="sun"]:checked');
    const seasonEl = document.querySelector('input[name="season"]:checked');

    const result = document.querySelector('#result');
    const soil = document.querySelector('#soil');
    const loading = document.querySelector('#loading');

    // 未選択チェック
    if (!typeEl || !sunEl || !seasonEl) {
        alert('すべて選択してください');
        return;
    }

    const type = typeEl.value;
    const sun = sunEl.value;
    const season = seasonEl.value;

    // 「初期化」
    result.innerHTML = '';
    soil.innerHTML = '';

    result.style.display = 'none';
    soil.style.display = 'none';

    // ローディング表示
    loading.style.display = 'block';

    setTimeout(function () {

        // ローディング消す
        loading.style.display = 'none';

        let recommendations;

        // 条件に一致するデータを抽出する
        recommendations = allData.filter(function (item) {
            return item.type === type && item.sun === sun;
        });

        // ===== 条件分岐 =====

        if (type === 'planter') {

            soil.innerHTML = `
        <h3>土について</h3>
        <p>土は市販の草花用培養土を使えばOK。</p>
        <p>プランターの底に鉢底石やネットを入れると、水がたまりにくくなり育てやすくなります。</p>
        `;

        } else if (type === 'ground') {

            soil.innerHTML = `
        <h3>土について</h3>
        <p>地植えの場合は、そのままでも育つことが多いですが、水はけのよい場所だとより安心です。</p>
        `;
        }

        // ランダムで選択
        const count = recommendations.length;
        selectedItem = recommendations[Math.floor(Math.random() * count)];

        let newText = selectedItem.seasonText.replace("季節", season);

        // 結果を表示
        result.innerHTML = `
            <div class="fade-in">
             <h2>おすすめの寄せ植え</h2>
             <div class="result-content">
                   <img src="${selectedItem.image}" class="click-img" alt="${selectedItem.alt}">
                    <div class="result-text">
                        <div id="btn-area">
                            <button class="button" id="favBtn">お気に入り：<span id="heart">♡</span></button>
                            <button class="linkBtn" id="linkBtnFav">お気に入り一覧</button>
                        </div>
                        <div class="text-area">
                            <p>${selectedItem.introText}</p>
                            <p>${newText}</p>
                            <p>${selectedItem.summaryText}</p>
                        </div>
                        <ul class="info">
                            <li>育てやすさ：<span class="star">${selectedItem.star}</span></li>
                            <li>水やり：${selectedItem.water}</li>
                            <li>ポイント：${selectedItem.point}</li>
                        </ul>
                    </div>
              </div>
            </div>
            `;

        updateHeart();


        // お気に入りボタンのクリック処理
        document.querySelector('#favBtn').addEventListener('click', function () {
            let duplicateCheck = favorites.some(function (item) {
                return item.id === selectedItem.id;
            });

            // すでにお気に入りにある場合は、削除してlocalStorageに保存する
            if (duplicateCheck) {
                favorites = favorites.filter(function (item) {
                    return item.id !== selectedItem.id;
                });

                updateHeart();

                localStorage.setItem('favorites', JSON.stringify(favorites));

                // お気に入り登録されていなければ、追加してlocalStorageに保存する
            } else {

                favorites.push(selectedItem);

                updateHeart();

                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        });

        result.style.display = 'block';
        soil.style.display = 'block';

    }, 700);

});

favorites = loadFavorites();
updateHeart();

// リンクボタンクリックでお気に入り一覧のページを開く
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('linkBtn')) {
        openFav();
    }
});

function openFav() {
    favorites = loadFavorites();

    if (favorites.length >= 1) {
        window.open('favorite.html', 'favoriteWindow');
    } else {
        alert('お気に入りは０件です');
    }
}

// 他のページでlocalStorageが更新されたときに発火
// お気に入りの状態を再取得して表示を更新
addEventListener('storage', function () {
    favorites = loadFavorites();
    updateHeart();
});

// お気に入りの状態に合わせてハートの表示を更新
function updateHeart() {
    const isFavorite = favorites.some(function (item) {
        return item.id === selectedItem.id;
    });
    const heart = document.getElementById('heart');

    if (!heart) {
        return
    }

    if (isFavorite) {
        heart.textContent = '❤';
        heart.classList.add('heartActive');
    } else {
        heart.textContent = '♡';
        heart.classList.remove('heartActive');
    }

}
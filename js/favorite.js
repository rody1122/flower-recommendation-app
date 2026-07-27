'use strict';

const favorite = document.querySelector('#favorite');

let favorites = [];

// localStorageからfavoritesを取得して配列に戻す
if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
}

// localStorageから取得したお気に入りデータを検証し、正しい形式のものだけを残す
favorites = favorites.filter(function (item) {
    const isValidId = typeof item.id === "number" && item.id >= 1;
    const isValidImage = typeof item.image === "string" && item.image !== "";
    const isValidFavText = typeof item.favText === "string" && item.favText !== "";

    return isValidId && isValidImage && isValidFavText;
});

showFavorites();

// // お気に入り一覧を画面に表示する関数
function showFavorites() {
    if (favorites.length === 0) {
        favorite.innerHTML = '';
        favorite.style.display = 'none';
        return
    }

    favorite.style.display = 'block';
    let favList = ``;

    // favoritesから1件ずつ取得し、HTMLを組み立て
    favorites.forEach(function (item, index) {
        const items = `
    <div class="favItem">
        <img src="${item.image}" alt="${item.alt}">
        <p>育てやすさ：${item.star}</p>
        <p>${item.favText}</p>
        <button class="button" id="favClear" data-index="${index}">削除</button>
    </div>
    `;
        favList += items;
    });

    favorite.innerHTML = `
    <h2>一覧表示</h2>
    <button class="button" id="allClear">すべて削除</button>
    <div class="favItems">
        ${favList}
    </div>
    `;

    // 該当データを削除し、localStorageを更新して再描画する
    document.querySelectorAll('#favClear').forEach(function (btn) {

        btn.addEventListener('click', function () {
            favorites.splice(btn.dataset.index, 1);

            localStorage.setItem('favorites', JSON.stringify(favorites));
            showFavorites();
        });
    });

    // お気に入りをすべて削除
    document.querySelector('#allClear').addEventListener('click', function () {

        if (confirm('すべて削除しますか？')) {
            favorites = [];
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showFavorites();
        }
    });
}

// localStorageのfavoritesが変更されたときに、画面を更新する
addEventListener('storage', function (event) {

    if (localStorage.getItem('favorites')) {
        favorites = JSON.parse(localStorage.getItem('favorites'));
    }
    showFavorites();
});

// お気に入り一覧ページのウィンドウを閉じるための処理
document.querySelector('#closeBtn').addEventListener('click', function () {
    window.close();
});
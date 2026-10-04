/* ====================
   商品をチェックする
==================== */

function checkItem(item) {

    item.classList.toggle("checked");

    saveShops();
}


/* ====================
   商品を追加する
==================== */

function addItem(button) {

    const ul = button.closest(".shop").querySelector("ul");

    const li = document.createElement("li");

    li.innerHTML = `
        <span class="check"></span>
        <input
            type="text"
            class="new-item"
            placeholder="品目を入力"
        >
        <button class="add-ok">追加</button>
    `;

    ul.appendChild(li);

    const input = li.querySelector(".new-item");
    const addButton = li.querySelector(".add-ok");

    input.focus();


    // 品目を追加する処理
    function addNewItem() {

        const itemName = input.value.trim();

        if (itemName === "") {
            return;
        }

        li.innerHTML = `
    <span class="check"></span>
    <span class="item-name">${itemName}</span>
`;

        const check = li.querySelector(".check");
        const itemNameElement = li.querySelector(".item-name");


        // チェック部分
        check.onclick = function (event) {

            event.stopPropagation();

            checkItem(li);

        };


        // 品目部分 → 編集
        itemNameElement.onclick = function (event) {

            event.stopPropagation();

            editItem(itemNameElement);

        };


        // 長押し並び替え
        enableItemDrag(li);


        saveShops();
    }


    // 「追加」ボタン
    addButton.onclick = function (event) {

        event.stopPropagation();

        addNewItem();

    };


    // Enterでも追加
    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addNewItem();

        }

    });
}


/* ====================
   店を追加する
==================== */

function addShop() {

    const leftColumn = document.querySelector("#left-column");
    const rightColumn = document.querySelector("#right-column");

    const shop = document.createElement("div");

    shop.className = "shop";


    shop.innerHTML = `
        <input
            type="text"
            class="new-shop-name"
            placeholder="店名を入力"
        >

        <button class="shop-ok">
            追加
        </button>
    `;


    // 高さが低いほうの列に追加
    if (leftColumn.scrollHeight <= rightColumn.scrollHeight) {

        leftColumn.appendChild(shop);

    } else {

        rightColumn.appendChild(shop);

    }


    const input = shop.querySelector(".new-shop-name");
    const addButton = shop.querySelector(".shop-ok");

    input.focus();


    // 店を追加する処理
    function addNewShop() {

        const shopName = input.value.trim();

        if (shopName === "") {
            return;
        }

        createShopCard(shop, shopName);

        saveShops();

    }


    // クリック
    addButton.onclick = function (event) {

        event.stopPropagation();

        addNewShop();

    };


    // Enter
    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addNewShop();

        }

    });
}


/* ====================
   店カードを作る
==================== */

function createShopCard(shop, shopName) {

    shop.innerHTML = `
        <div class="shop-header">

            <h2 class="shop-name" onclick="editShop(this)">${shopName}</h2>

            <div class="shop-actions">

    <button onclick="deleteShop(this)">
        🗑️
    </button>

    <button onclick="shareShop(this)">
        ↗️
    </button>

</div>

        </div>

        <ul>
        </ul>

        <div class="shop-footer">

            <button onclick="addItem(this)">
                ＋ 追加
            </button>

            <button onclick="removeChecked(this)">
                🧹 削除
            </button>

        </div>
    `;
}


/* ====================
   買った商品を削除
==================== */

function removeChecked(button) {

    const shop = button.closest(".shop");

    const checkedItems =
        shop.querySelectorAll("li.checked");


    if (checkedItems.length === 0) {

        alert("買ったものがありません");

        return;
    }


    const result = confirm(
        "チェックした商品を削除しますか？"
    );


    if (!result) {

        return;
    }


    checkedItems.forEach(function (item) {

        item.remove();

    });


    saveShops();
}


/* ====================
   店名を編集
==================== */

function editShop(button) {

    const shop = button.closest(".shop");

    const shopName =
        shop.querySelector(".shop-name");


    const input =
        document.createElement("input");


    input.type = "text";

    input.value = shopName.textContent;

    input.className = "edit-shop-name";


    shopName.replaceWith(input);


    input.focus();

    input.select();


    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            saveShopName(input);

        }

    });


    input.addEventListener("blur", function () {

        saveShopName(input);

    });

}


/* ====================
   店名を保存
==================== */

function saveShopName(input) {

    const newName =
        input.value.trim();


    if (newName === "") {

        input.focus();

        return;

    }


    const h2 =
        document.createElement("h2");


    h2.className = "shop-name";

    h2.textContent = newName;


    input.replaceWith(h2);


    saveShops();
}


/* ====================
   店を削除
==================== */

function deleteShop(button) {

    const shop =
        button.closest(".shop");


    shop.remove();


    saveShops();
}


/* ====================
   データを保存
==================== */

function saveShops() {

    const shops = [];


    document
        .querySelectorAll(".shop")
        .forEach(function (shop) {


            const shopName =
                shop.querySelector(".shop-name");


            if (!shopName) {
                return;
            }


            const items = [];


            shop
                .querySelectorAll("li")
                .forEach(function (item) {


                    const itemName =
                        item.querySelector(".item-name");


                    if (!itemName) {
                        return;
                    }


                    items.push({

                        name:
                            itemName.textContent.trim(),

                        checked:
                            item.classList.contains("checked")

                    });

                });


            shops.push({

                name:
                    shopName.textContent.trim(),

                items: items

            });

        });


    localStorage.setItem(
        "shoppingShops",
        JSON.stringify(shops)
    );
}


/* ====================
   保存したデータを読み込む
==================== */

function loadShops() {

    const savedShops =
        localStorage.getItem("shoppingShops");


    const leftColumn =
        document.querySelector("#left-column");

    const rightColumn =
        document.querySelector("#right-column");


    let shops;


    if (!savedShops) {

        shops = [

            {
                name: "スーパー",

                items: [
                    { name: "たまねぎ", checked: false },
                    { name: "ねぎ", checked: false },
                    { name: "ウインナー", checked: false },
                    { name: "ソース", checked: false }
                ]

            },

            {
                name: "ドラスト",

                items: [
                    { name: "シャンプー", checked: false },
                    { name: "ティッシュ", checked: false },
                    { name: "洗剤", checked: false }
                ]

            }

        ];

    } else {

        shops = JSON.parse(savedShops);

    }


    leftColumn.innerHTML = "";
    rightColumn.innerHTML = "";


    shops.forEach(function (shopData) {

        const shop =
            document.createElement("div");


        shop.className = "shop";


        createShopCard(
            shop,
            shopData.name
        );


        if (
            leftColumn.scrollHeight
            <=
            rightColumn.scrollHeight
        ) {

            leftColumn.appendChild(shop);

        } else {

            rightColumn.appendChild(shop);

        }


        const ul =
            shop.querySelector("ul");


        shopData.items.forEach(
            function (itemData) {

                const li =
                    document.createElement("li");


                li.innerHTML = `
    <span class="check"></span>

    <span class="item-name">
        ${itemData.name}
    </span>
`;


                if (itemData.checked) {

                    li.classList.add("checked");

                }


                const check =
                    li.querySelector(".check");

                const itemNameElement =
                    li.querySelector(".item-name");


                // チェック
                check.onclick = function (event) {

                    event.stopPropagation();

                    checkItem(li);

                };


                // 編集
                itemNameElement.onclick = function (event) {

                    event.stopPropagation();

                    editItem(itemNameElement);

                };


                // 長押し並び替え
                enableItemDrag(li);


                ul.appendChild(li);

            }
        );

    });

}


/* ====================
   商品名を編集
==================== */

function editItem(itemNameElement) {

    const oldName =
        itemNameElement.textContent.trim();


    const input =
        document.createElement("input");


    input.type = "text";

    input.value = oldName;

    input.className = "edit-item-name";


    itemNameElement.replaceWith(input);


    input.focus();

    input.select();


    let cancelled = false;

    let finished = false;


    // 編集を確定
    function saveItemName() {

        if (cancelled || finished) {

            return;

        }


        const newName =
            input.value.trim();


        if (newName === "") {

            input.value = oldName;

            input.focus();

            return;

        }


        finished = true;


        const newItemName =
            document.createElement("span");


        newItemName.className = "item-name";

        newItemName.textContent = newName;


        input.replaceWith(newItemName);


        newItemName.onclick =
            function (event) {

                event.stopPropagation();

                editItem(newItemName);

            };


        


        saveShops();

    }


    // Enter → 確定
    // Esc → キャンセル
    input.addEventListener(
        "keydown",
        function (event) {


            if (event.key === "Enter") {

                event.preventDefault();

                saveItemName();

            }


            if (event.key === "Escape") {

                event.preventDefault();

                cancelled = true;

                finished = true;


                input.replaceWith(
                    itemNameElement
                );


                itemNameElement.onclick = function (event) {

                    event.stopPropagation();

                    editItem(itemNameElement);

                };

            }

        }
    );


    // 編集欄から離れたら確定
    input.addEventListener(
        "blur",
        function () {

            if (!cancelled && !finished) {

                saveItemName();

            }

        }
    );

}


/* ====================
   全部の買い物メモを共有
==================== */

async function shareShoppingMemo() {

    let text =
        "🛒 買い物メモ\n\n";


    document
        .querySelectorAll(".shop")
        .forEach(function (shop) {


            const shopName =
                shop.querySelector(".shop-name");


            if (!shopName) {
                return;
            }


            text +=
                "【"
                + shopName.textContent.trim()
                + "】\n";


            shop
                .querySelectorAll("li")
                .forEach(function (item) {


                    if (
                        item.classList.contains("checked")
                    ) {

                        return;

                    }


                    const itemName =
                        item.querySelector(".item-name");


                    if (!itemName) {
                        return;
                    }


                    text +=
                        "□ "
                        + itemName.textContent.trim()
                        + "\n";

                });


            text += "\n";

        });


    if (navigator.share) {

        try {

            await navigator.share({

                title: "買い物メモ",

                text: text

            });

        } catch (error) {

            console.log(
                "共有をキャンセルしました"
            );

        }

    } else {

        await navigator.clipboard.writeText(text);

        alert(
            "買い物メモをコピーしました！"
        );

    }

}


/* ====================
   店ごとの買い物メモを共有
==================== */

async function shareShop(button) {

    const shop =
        button.closest(".shop");


    const shopName =
        shop.querySelector(".shop-name");


    let text =
        "🛒 買い物メモ\n\n";


    text +=
        "【"
        + shopName.textContent.trim()
        + "】\n";


    shop
        .querySelectorAll("li")
        .forEach(function (item) {


            if (
                item.classList.contains("checked")
            ) {

                return;

            }


            const itemName =
                item.querySelector(".item-name");


            if (!itemName) {
                return;
            }


            text +=
                "□ "
                + itemName.textContent.trim()
                + "\n";

        });


    if (navigator.share) {

        try {

            await navigator.share({

                title: "買い物メモ",

                text: text

            });

        } catch (error) {

            console.log(
                "共有をキャンセルしました"
            );

        }

    } else {

        await navigator.clipboard.writeText(text);

        alert(
            "この店の買い物メモをコピーしました！"
        );

    }

}

/* ====================
   品目を長押しして並び替え
==================== */

function enableItemDrag(li) {

    const itemNameElement = li.querySelector(".item-name");

    if (!itemNameElement) {
        return;
    }

    let timer = null;
    let dragging = false;
    let startY = 0;

    // 長押し開始
    itemNameElement.addEventListener("touchstart", function (event) {

        const touch = event.touches[0];

        startY = touch.clientY;

        dragging = false;

        timer = setTimeout(function () {

            dragging = true;

            li.classList.add("dragging");

            // 長押しした瞬間から文字選択を解除
            window.getSelection().removeAllRanges();

        }, 600);

    }, { passive: true });


    // 指を動かす
    itemNameElement.addEventListener("touchmove", function (event) {

        if (!dragging) {

            clearTimeout(timer);

            return;
        }

        event.preventDefault();

        const touch = event.touches[0];

        const y = touch.clientY;

        const ul = li.parentElement;

        const target = document.elementFromPoint(
            touch.clientX,
            y
        );

        const targetLi = target
            ? target.closest("li")
            : null;


        if (
            !targetLi ||
            targetLi === li ||
            targetLi.parentElement !== ul
        ) {
            return;
        }


        const rect = targetLi.getBoundingClientRect();

        const middle =
            rect.top + rect.height / 2;


        if (y < middle) {

            ul.insertBefore(
                li,
                targetLi
            );

        } else {

            ul.insertBefore(
                li,
                targetLi.nextSibling
            );

        }

    }, { passive: false });


    // 指を離す
    itemNameElement.addEventListener("touchend", function () {

        clearTimeout(timer);

        if (!dragging) {
            return;
        }

        dragging = false;

        li.classList.remove("dragging");

        saveShops();

    });


    // キャンセル
    itemNameElement.addEventListener("touchcancel", function () {

        clearTimeout(timer);

        dragging = false;

        li.classList.remove("dragging");

    });

}



/* ====================
   アプリ起動
==================== */

loadShops();
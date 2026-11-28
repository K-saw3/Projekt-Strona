const cartStorageKey = "cart";

function getCart() {
    const savedCart = localStorage.getItem(cartStorageKey);
    return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function formatPrice(price) {
    return price.toFixed(2).replace(".", ",") + " zł";
}
//żeby nie było ja ci te komentarze pisze nie Ai ;) łatwij zrozumieć bo ai głupoty czaem może pisać w zabardzo inżynieryjnym języku
//tu pobiera po klasie product i jego buttonie, tworzy tablice pobranych elementów z html bo to div, odpowiednik w css (.product button { styl })
document.querySelectorAll(".product button").forEach((button) => {
    button.addEventListener("click", () => {
        //to sobie znajduje najblizszy button z dova no czyli poprostu ten który jest w konkretnym divie
        //i przechodzi forEachem tak po wszystkich divach
        const product = button.closest(".product");
        //to pobiera te id co jest teraz jako atrybut  data-product-id="monitor"> w html
        //czyli id = "monitor"
        const id = product.dataset.productId;
        //pobiera od produktu nazwe ceny itp niżej
        const name = product.querySelector("h2").textContent.trim();
        const priceText = product.querySelector("h3").textContent;
        //tu patrzy czy pasuje do paternu, nie musisz znać na pamiec spokojnie
        const priceMatch = priceText.match(/\d+(?:[.,]\d+)?/);
       //jesli cena jest zla to informuje
        if (!priceMatch) {
            throw new Error("Nie udało się odczytać ceny produktu: " + name);
        }

        const price = Number(priceMatch[0].replace(",", "."));
        //pobiera z local storage produky co sa dodane do koszyka
        const cart = getCart();
        const existingProduct = cart.find((item) => item.id === id);

        //jeli dodales dwa razy na stronce hARDWARE NP TO DODAJE ILOSC W KOSZYKU
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        // zapisuje zmiany do koszyka i localstorage i
        // na chwile pokazuje napisz dodano na buttonie i zmienia na oryginalny
        saveCart(cart);
        button.textContent = "Dodano do koszyka";
        setTimeout(() => {
            button.textContent = "Kup teraz";
        }, 1200);
    });
});

// jesli jestes na stronce koszyka to te id istnieje i je pobiera i renderuje koszyk
const cartItems = document.getElementById("cart-items");

if (cartItems) {
    function renderCart() {
        const cart = getCart();
        cartItems.replaceChildren();

        if (cart.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Twój koszyk jest pusty.";
            cartItems.appendChild(emptyMessage);
            document.getElementById("cart-total").textContent = formatPrice(0);
            return;
        }

        let total = 0;

        //oblicza ceny wszystkich produktów i tworzy ogl bloki tych produktów w koszyku
        //przez createElement
        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const product = document.createElement("div");
            product.className = "product cart-product";

            const name = document.createElement("h2");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent = "Cena: " + formatPrice(item.price);

            const quantity = document.createElement("p");
            quantity.textContent = "Ilość: " + item.quantity;

            const actions = document.createElement("div");
            actions.className = "cart-actions";

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "−";
            decreaseButton.setAttribute("aria-label", "Zmniejsz ilość " + item.name);
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCart(cart);
                renderCart();
            });

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.setAttribute("aria-label", "Zwiększ ilość " + item.name);
            increaseButton.addEventListener("click", () => {
                item.quantity += 1;
                saveCart(cart);
                renderCart();
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Usuń";
            removeButton.addEventListener("click", () => {
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
            });

            actions.append(decreaseButton, increaseButton, removeButton);
            product.append(name, price, quantity, actions);
            cartItems.appendChild(product);
        });

        document.getElementById("cart-total").textContent = formatPrice(total);
        document.getElementById("checkout-button").onclick = () => {
            alert("Zapłacono: " + formatPrice(total) + " !");
        }
    }
    renderCart();
}

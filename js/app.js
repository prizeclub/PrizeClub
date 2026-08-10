function createProductCard(product){

return `

<div class="col-md-4">

<div class="card h-100 shadow-sm product-card">

<div class="position-relative">

<button
type="button"
class="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle wishlist-btn"
data-id="${product["Product ID"]}"
style="z-index:10;">

${wishlist.includes(product["Product ID"]) ? "❤️" : "🤍"}

</button>

<a
href="product.html?id=${product["Product ID"]}"
class="text-decoration-none text-dark">

<img
src="${product["Main Image"]}"
class="card-img-top"
style="height:280px;width:100%;object-fit:cover;background:#fff;"
alt="${product["Product Name"]}">

</a>

${product.Trending === "Yes" ? `
<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
⭐ Trending
</span>
` : ""}

${product["New Arrival"] === "Yes" ? `
<span class="badge bg-success position-absolute"
style="top:45px;left:8px;">
✨ New Arrival
</span>
` : ""}
${product["Best Seller"] === "Yes" ?
`
<span class="badge bg-danger position-absolute"
style="top:85px;left:8px;">
🔥 Best Seller
</span>
`
: ""}

</div>

<div class="card-body">

<a
href="product.html?id=${product["Product ID"]}"
class="text-decoration-none text-dark">

<p class="text-muted mb-1">
${product.Brand}
</p>

<h5 class="card-title fw-bold">
${product["Product Name"]}
</h5>

<p>

<del class="text-muted">
₹${product.MRP}
</del>

<span class="fs-4 fw-bold text-danger ms-2">
₹${product["Selling Price"]}
</span>

</p>

<p class="text-success fw-bold">
${product.Discount}% OFF
</p>
<p class="mb-2 text-warning">

⭐ ${product.Rating}

<span class="text-muted">

(${product.Reviews} Reviews)

</span>

</p>

<p>

${Number(product.Stock) > 10 ?

`<span class="badge bg-success">
✅ In Stock
</span>`

:

Number(product.Stock) > 0 ?

`<span class="badge bg-warning text-dark">
⚠️ Only ${product.Stock} Left
</span>`

:

`<span class="badge bg-danger">
❌ Out of Stock
</span>`

}

</p>

</a>

</div>

</div>

</div>

`;

}

function renderSectionProducts(products, containerId, limit = 6) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    products.slice(0, limit).forEach(product => {

        container.innerHTML += createProductCard(product);

    });

}

const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;

function renderProducts(products) {

    const productsContainer =
        document.getElementById("products-container");

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (products.length === 0) {

        productsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <h4>No products found.</h4>
        </div>
        `;

        document.getElementById("pagination").innerHTML = "";

        return;
    }

    const start =
        (currentPage - 1) * PRODUCTS_PER_PAGE;

    const end =
        start + PRODUCTS_PER_PAGE;

    products
        .slice(start, end)
        .forEach(product => {

            productsContainer.innerHTML +=
                createProductCard(product);

        });

}
function renderPagination(products){

    const pagination =
        document.getElementById("pagination");

    if(!pagination) return;

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(products.length / PRODUCTS_PER_PAGE);

    if(totalPages <= 1) return;

    pagination.innerHTML += `

<li class="page-item ${currentPage===1?"disabled":""}">

<a class="page-link" href="#products">

Previous

</a>

</li>

`;

    for(let i=1;i<=totalPages;i++){

        pagination.innerHTML += `

<li class="page-item ${currentPage===i?"active":""}">

<a class="page-link"
href="#products"
data-page="${i}">

${i}

</a>

</li>

`;

    }

    pagination.innerHTML += `

<li class="page-item ${currentPage===totalPages?"disabled":""}">

<a class="page-link" href="#products">

Next

</a>

</li>

`;

    pagination.querySelectorAll(".page-link").forEach(button => {

    button.onclick = (e) => {

        e.preventDefault();

        const page = button.dataset.page;

        if (page) {

            currentPage = Number(page);

        } else if (button.textContent.trim() === "Previous" && currentPage > 1) {

            currentPage--;

        } else if (button.textContent.trim() === "Next" && currentPage < totalPages) {

            currentPage++;

        }

        renderProducts(products);
        renderPagination(products);

        document.getElementById("products")
            .scrollIntoView({ behavior: "smooth" });

    };

});

}
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function toggleWishlist(productId) {

    if (wishlist.includes(productId)) {

        wishlist = wishlist.filter(id => id !== productId);

    } else {

        wishlist.push(productId);

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}
document.addEventListener("DOMContentLoaded", async () => {

    const products = await getProducts();

    const searchBox =
        document.getElementById("searchBox");

    const categoryFilter =
        document.getElementById("categoryFilter");
        const sortFilter =
document.getElementById("sortFilter");

    const categories = [
        ...new Set(
            products.map(product => product.Category)
        )
    ];
    const brands = [
    ...new Set(
        products.map(product => product.Brand)
    )
];

    categories.sort();

    categories.forEach(category => {

        categoryFilter.innerHTML += `
        <option value="${category}">
            ${category}
        </option>
        `;

    });
    const brandFilter =
document.getElementById("brandFilter");

brands.sort();

brands.forEach(brand => {

    brandFilter.innerHTML += `
        <option value="${brand}">
            ${brand}
        </option>
    `;

});

    renderProducts(products);
renderPagination(products);
    const trendingProducts =
    products.filter(product => product.Trending === "Yes");

renderSectionProducts(
    trendingProducts,
    "trending-products",
    6
);

const newArrivalProducts =
    products.filter(product => product["New Arrival"] === "Yes");

renderSectionProducts(
    newArrivalProducts,
    "new-products",
    6
);
const recentIds =
JSON.parse(localStorage.getItem("recentProducts")) || [];

const recentProducts =
recentIds
.map(id =>
    products.find(
        product => product["Product ID"] === id
    )
)
.filter(product => product);

renderSectionProducts(
    recentProducts,
    "recent-products",
    8
);

    function filterProducts() {

        const searchText =
            searchBox.value.toLowerCase().trim();

        const selectedCategory =
            categoryFilter.value;
            const selectedBrand =
    brandFilter.value;

        const filteredProducts =
            products.filter(product => {

                const matchesSearch =
                    product["Product Name"]
                    .toLowerCase()
                    .includes(searchText);

                const matchesCategory =
    selectedCategory === "All" ||
    product.Category === selectedCategory;

const matchesBrand =
    selectedBrand === "All" ||
    product.Brand === selectedBrand;

return matchesSearch &&
       matchesCategory &&
       matchesBrand;

            });

const sortValue = sortFilter.value;

if (sortValue === "low") {

    filteredProducts.sort(
        (a, b) => Number(a["Selling Price"]) - Number(b["Selling Price"])
    );

}

else if (sortValue === "high") {

    filteredProducts.sort(
        (a, b) => Number(b["Selling Price"]) - Number(a["Selling Price"])
    );

}

else if (sortValue === "discount") {

    filteredProducts.sort(
        (a, b) => Number(b.Discount) - Number(a.Discount)
    );

}

else if (sortValue === "new") {

    filteredProducts.reverse();

}
        currentPage = 1;

renderProducts(filteredProducts);

renderPagination(filteredProducts);
}


    searchBox.addEventListener("input", filterProducts);

    categoryFilter.addEventListener("change", filterProducts);
    sortFilter.addEventListener("change", filterProducts);
    brandFilter.addEventListener("change", filterProducts);

});
document.addEventListener("click", (e) => {

    const button = e.target.closest(".wishlist-btn");

    if (!button) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = button.dataset.id;

    toggleWishlist(productId);

    button.innerHTML =
        wishlist.includes(productId) ? "❤️" : "🤍";

});
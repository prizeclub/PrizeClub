document.addEventListener("DOMContentLoaded", async () => {

    const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    const products = await getProducts();

    const container =
        document.getElementById("wishlistContainer");

    if (wishlist.length === 0) {

        container.innerHTML = `
        <div class="col-12 text-center py-5">
            <h4>Your Wishlist is Empty ❤️</h4>
        </div>
        `;

        return;

    }

    const wishlistProducts = products.filter(product =>
        wishlist.includes(product["Product ID"])
    );

    wishlistProducts.forEach(product => {

        container.innerHTML += `

<div class="col-md-3">

<a href="product.html?id=${product["Product ID"]}"
class="text-decoration-none text-dark">

<div class="card h-100 shadow-sm">

<img
src="${product["Main Image"]}"
class="card-img-top"
style="height:250px;object-fit:cover;">

<div class="card-body">

<p class="text-muted mb-1">
${product.Brand}
</p>

<h6 class="fw-bold">
${product["Product Name"]}
</h6>

<p class="text-danger fw-bold">
₹${product["Selling Price"]}
</p>

</div>

</div>

</a>

</div>

`;

    });

});
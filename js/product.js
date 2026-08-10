document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const products = await getProducts();

    const product = products.find(p => p["Product ID"] === productId);
    let recentProducts =
JSON.parse(localStorage.getItem("recentProducts")) || [];

recentProducts =
recentProducts.filter(id => id !== productId);

recentProducts.unshift(productId);

recentProducts = recentProducts.slice(0, 8);

localStorage.setItem(
"recentProducts",
JSON.stringify(recentProducts)
);

    if (!product) {

        document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px;'>Product Not Found</h2>";
        return;

    }

    const mainImage = document.getElementById("mainImage");

mainImage.src = product["Main Image"];
mainImage.onclick = () => {

    if(mainImage.style.transform === "scale(2)"){

        mainImage.style.transform = "scale(1)";

        mainImage.style.cursor = "zoom-in";

    }else{

        mainImage.style.transform = "scale(2)";

        mainImage.style.cursor = "zoom-out";

    }

    mainImage.style.transition = ".3s";

};

const thumbnailContainer =
document.getElementById("thumbnailContainer");

const images = [

product["Main Image"],
product["Image 2"],
product["Image 3"],
product["Image 4"],
product["Image 5"]

];

images.forEach(image=>{

if(image){

thumbnailContainer.innerHTML += `

<img
src="${image}"
style="width:80px;height:80px;object-fit:cover;cursor:pointer;border-radius:10px;border:2px solid #ddd;"
onclick="
document.getElementById('mainImage').src='${image}';
document.getElementById('mainImage').style.transform='scale(1)';
document.getElementById('mainImage').style.cursor='zoom-in';
">

`;

}

});

    document.getElementById("brand").innerText =
        product.Brand;

    document.getElementById("productName").innerText =
        product["Product Name"];

    document.getElementById("mrp").innerText =
        "₹" + product.MRP;

    document.getElementById("price").innerText =
        "₹" + product["Selling Price"];

    document.getElementById("discount").innerText =
        product.Discount + "% OFF";

    document.getElementById("stock").innerHTML =
        "<strong>Stock:</strong> " + product.Stock;

    document.getElementById("description").innerText =
        product.Description;

    const message = `Hello PRIZE CLUB,

I am interested in this product.

🛍️ Product:
${product["Product Name"]}

💰 Price:
₹${product["Selling Price"]}

🏷️ Brand:
${product.Brand}

Please share payment details.

Thank you.`;

document.getElementById("buyBtn").href =
`https://wa.me/919326077735?text=${encodeURIComponent(message)}`;
const relatedProducts = products.filter(p =>

    p.Category === product.Category &&
    p["Product ID"] !== product["Product ID"]

).slice(0, 4);

const relatedContainer =
document.getElementById("relatedProducts");

relatedProducts.forEach(item => {

    relatedContainer.innerHTML += `

<div class="col-md-3">

<a href="product.html?id=${item["Product ID"]}"
class="text-decoration-none text-dark">

<div class="card h-100 shadow-sm">

<img
src="${item["Main Image"]}"
class="card-img-top"
style="height:220px;object-fit:cover;">

<div class="card-body">

<p class="text-muted mb-1">

${item.Brand}

</p>

<h6 class="fw-bold">

${item["Product Name"]}

</h6>

<p class="text-danger fw-bold">

₹${item["Selling Price"]}

</p>

</div>

</div>

</a>

</div>

`;

});

// Product Video

if(product["Video URL"]){

document.getElementById("videoSection").style.display="block";

document.getElementById("productVideo").src=
product["Video URL"];

}



// Share Button

document.getElementById("shareBtn").onclick=async()=>{

if(navigator.share){

await navigator.share({

title:product["Product Name"],

text:"Check out this product on PRIZE CLUB",

url:window.location.href

});

}else{

alert("Sharing not supported on this device.");

}

};




// Copy Link

document.getElementById("copyBtn").onclick=()=>{

navigator.clipboard.writeText(window.location.href);

alert("Product link copied!");

};
});
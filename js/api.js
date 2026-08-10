const API_URL = "https://script.google.com/macros/s/AKfycbz18KIoGTZiWVIQDMfaoT7_yyXlIa3Qw4TCk-DgIQM9QLPhgqJ4Xv02oJdxV_mWjOuY/exec";

async function getProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        return [];
    }
}
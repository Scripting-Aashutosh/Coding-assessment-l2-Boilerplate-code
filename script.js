//create a empty array to store bundler items
let bundlerItems = [];

// Select DOM elements
const addToBundlerButtons = document.querySelectorAll('.add-to-bundler-btn');
const bundlerProductList = document.getElementById('bundler-product-list');
const bundleProgress = document.getElementById('bundle-progress');
const bundleDiscount = document.getElementById('bundle-discount');
const bundleSubtotal = document.getElementById('bundle-subtotal');
const proceedToBundlerBtn = document.getElementById('proceed-to-bundle-btn');





// bundler UI ko render/update 

function renderBundler(){
    bundlerProductList.innerHTML = '';
    let total = 0;
    let discount = 0;

    // agar bundler empty ho to
    if(bundlerItems.length === 0){
        bundlerProductList.innerHTML = `<p class="empty-bundler-message">Your bundler is empty</p>`;
    }else{
        // har items ko display kara
        bundlerItems.forEach(items =>{
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = 
            `
            <img src="${items.imageSrc}" alt="${items.name}">
            <div class="product-details">
                <div class="product-name">${items.name}</div>
                <div class="product-price">$${items.price.toFixed(2)}</div>
                <div class="quantity-control">
                    <button class="quantity-minus" data-product-name="${items.name}">-</button>
                    <span>${items.quantity}</span>
                    <button class="quantity-plus" data-product-name="${items.name}">+</button>
                </div>
            </div>
            <button class="delete-btn" data-product-name="${items.name}"><i class="ri-delete-bin-line"></i></button>

            `;

            bundlerProductList.appendChild(productDiv);
            total += items.price * items.quantity;
        })
    }

    // calculate discount
    if(bundlerItems.length >= 3){
        discount = total * 0.30;
        proceedToBundlerBtn.innerHTML = `Proceed to Checkout <span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1905 9.0306L7.19051 14.0306C7.04961 14.1715 6.85852 14.2506 6.65926 14.2506C6.46 14.2506 6.26891 14.1715 6.12801 14.0306C5.98711 13.8897 5.90796 13.6986 5.90796 13.4993C5.90796 13.3001 5.98711 13.109 6.12801 12.9681L10.5974 8.49997L6.12926 4.0306C6.0595 3.96083 6.00415 3.87801 5.9664 3.78686C5.92864 3.69571 5.90921 3.59801 5.90921 3.49935C5.90921 3.40069 5.92864 3.30299 5.9664 3.21184C6.00415 3.12069 6.0595 3.03786 6.12926 2.9681C6.19902 2.89833 6.28185 2.84299 6.373 2.80524C6.46415 2.76748 6.56185 2.74805 6.66051 2.74805C6.75917 2.74805 6.85687 2.76748 6.94802 2.80524C7.03917 2.84299 7.122 2.89833 7.19176 2.9681L12.1918 7.9681C12.2616 8.03786 12.317 8.12072 12.3547 8.21193C12.3925 8.30313 12.4118 8.4009 12.4117 8.49961C12.4116 8.59832 12.392 8.69603 12.354 8.78715C12.3161 8.87827 12.2605 8.961 12.1905 9.0306Z" fill="white"/>
        </svg></span>`;
        proceedToBundlerBtn.disabled = false;
    }else{
        proceedToBundlerBtn.textContent = `Add ${3 - bundlerItems.length} Items to proceed`;
        proceedToBundlerBtn.disabled = true;
    }

    // update total
    bundleDiscount.textContent = `-$${discount.toFixed(2)}(30%)`;
    bundleSubtotal.textContent = `$${(total - discount).toFixed(2)}`;

    // update progress bar
    const progressPercentage = Math.min((bundlerItems.length / 3) * 100, 100);
    bundleProgress.style.width = `${progressPercentage}%`;

    // Quantity and Delete Button event listeners
    bundlerProductList.querySelectorAll('.quantity-minus').forEach(button =>{
        button.addEventListener('click', (event)=> updateQuantity(event.target.dataset.productName, -1));
    });

    bundlerProductList.querySelectorAll('.quantity-plus').forEach(button =>{
        button.addEventListener('click', (event)=> updateQuantity(event.target.dataset.productName, 1));
    });

    bundlerProductList.querySelectorAll('.delete-btn').forEach(button =>{
        button.addEventListener('click', (event)=> deleteProduct(event.target.dataset.productName));
    });
}

// quantity update function
function updateQuantity(productName, change){
    const productIndex = bundlerItems.findIndex(items => items.name === productName);
    if(productIndex !== -1){
        bundlerItems[productIndex].quantity += change;
        if(bundlerItems[productIndex].quantity <= 0){
            bundlerItems.splice(productName, 1);

            const originalProductButton = document.querySelector(`.add-to-bundler-btn[data-product-name="${productName}"]`);
            if(originalProductButton){
                originalProductButton.disabled =false;
                originalProductButton.innerHTML = `Add to Bundler`;
                originalProductButton.style.backgroundColor = '';
                originalProductButton.style.Color = '';
                originalProductButton.style.border = '';
            }
        }

        renderBundler();
    }
}

function deleteProduct(productName) {
    const productIndex = bundlerItems.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        bundlerItems.splice(productIndex, 1);
        // Original product button ko enable karein
        const originalProductButton = document.querySelector(`.add-to-bundler-btn[data-product-name="${productName}"]`);
        if (originalProductButton) {
            originalProductButton.disabled = false;
            originalProductButton.innerHTML = `Add to Bundler <span class="plus-icon"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9099 8.5C..."/>...</svg></span>`; // Original SVG ko wapas layein
            originalProductButton.style.backgroundColor = ''; // Default style
            originalProductButton.style.color = '';
            originalProductButton.style.border = '';
        }
        renderBundler(); // UI ko update karein
    }
}


addToBundlerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.items');
        const productName = productCard.dataset.productName;
        const productPrice = parseFloat(productCard.dataset.productPrice);
        const imageSrc = productCard.dataset.imageSrc;

        // Check if product already in bundler
        const existingProduct = bundlerItems.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity++; // Quantity badhayein
        } else {
            // Naya product object banayein
            const product = {
                name: productName,
                price: productPrice,
                imageSrc: imageSrc,
                quantity: 1
            };
            bundlerItems.push(product); // Array mein add karein
        }

        // Button ka text aur style change karein
        button.innerHTML = `Added to Bundler <span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.1905 5.53066L7.19051 13.5307C7.12083 13.6006 7.03804 13.6561 6.94687 13.6939C6.85571 13.7318 6.75797 13.7513 6.65926 13.7513C6.56055 13.7513 6.46281 13.7318 6.37165 13.6939C6.28048 13.6561 6.19769 13.6006 6.12801 13.5307L2.62801 10.0307C2.55825 9.9609 2.5029 9.87807 2.46515 9.78692C2.42739 9.69577 2.40796 9.59807 2.40796 9.49941C2.40796 9.40075 2.42739 9.30305 2.46515 9.2119C2.5029 9.12075 2.55825 9.03793 2.62801 8.96816C2.69777 8.8984 2.7806 8.84306 2.87175 8.8053C2.9629 8.76754 3.0606 8.74811 3.15926 8.74811C3.25792 8.74811 3.35562 8.76754 3.44677 8.8053C3.53792 8.84306 3.62075 8.8984 3.69051 8.96816L6.65988 11.9375L14.1293 4.46941C14.2702 4.32851 14.4613 4.24936 14.6605 4.24936C14.8598 4.24936 15.0509 4.32851 15.1918 4.46941C15.3327 4.61031 15.4118 4.8014 15.4118 5.00066C15.4118 5.19992 15.3327 5.39101 15.1918 5.53191L15.1905 5.53066Z" fill="white"/>
        </svg></span>`;
        button.style.backgroundColor = `Black`;
        button.style.color = `#ffff`;
        button.style.border = `1px solid #0000`; // Transparent border
        
        button.disabled = true; // Button ko disabled karein

        renderBundler(); // Bundler UI ko update karein
    });
});

// Page load hone par initial render karein
document.addEventListener('DOMContentLoaded', renderBundler);

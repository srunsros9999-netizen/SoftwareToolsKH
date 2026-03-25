/* ==========================================
   CONFIG SECTION
   ========================================== */

const scriptURL =
  "https://script.google.com/macros/s/AKfycbyneYc5JU7V3_R6-DxZ_ursRy8kcxQmTJqUzrTJrE07PEDdjZ_eB2VrYYee_lkF1JrI/exec";

const botToken = "8773786808:AAHU7d0A9FMOyj8c496pg0_zuTcKyt34ifM"; // Token របស់អូន
const chatId = "1126254088"; // Chat ID របស់អូន

// ៣. តំណភ្ជាប់ទៅកាន់ Telegram ផ្ទាល់ខ្លួនរបស់អ្នក (សម្រាប់ទាក់ទង Admin)
const ADMIN_TELEGRAM_LINK = "https://t.me/ChhaySemZ"; // ប្តូរ 'your_username' ទៅជា Username របស់អូន

/* ==========================================
   CORE VARIABLES (Variables សំខាន់ៗ)
   ========================================== */
let cart = [];
let discountPercent = 0;
let currentPromoCode = "";

/* ==========================================
   CART FUNCTIONS
   ========================================== */

// ១. មុខងារថែមទំនិញទៅក្នុងកន្ត្រក (addToCart) - ឥឡូវរើសបានច្រើន!
function addToCart(name, price) {
  cart.push({ name: name, price: price });
  updateCartCount();
  alert(`✅ បានបញ្ចូល ${name} ទៅក្នុងកន្ត្រក!`);
}

// ២. មុខងារបង្ហាញចំនួនលេខនៅលើរូបកន្ត្រក
function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.innerText = cart.length;
  }
}

// ៣. មុខងារបើក/បិទ ផ្ទាំងកន្ត្រកទំនិញ (toggleCart)
function toggleCart() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;

  if (modal.style.display === "none" || modal.style.display === "") {
    modal.style.display = "block";
    displayCart();
  } else {
    closeCartModal();
  }
}

// មុខងារបិទកន្ត្រក និង Reset ស្ថានភាព
function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (modal) modal.style.display = "none";

  // Reset ស្ថានភាព UI
  document.getElementById("checkout-section").style.display = "none";
  document.getElementById("btn-main").innerText = "បន្តទៅការបង់ប្រាក់ 💳";
  document.getElementById("btn-main").style.background = "#0088cc";
  document.getElementById("btn-main").onclick = startCheckout;
  document.getElementById("promo-code").value = "";
  discountPercent = 0;
  currentPromoCode = "";
}

// ៤. មុខងារបង្ហាញបញ្ជីទំនិញក្នុងកន្ត្រក និងប៊ូតុងលុប
function displayCart() {
  const list = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!list || !totalElement) return;

  if (cart.length === 0) {
    list.innerHTML =
      "<p style='text-align:center; color:#999;'>កន្ត្រកទទេស្អាត!</p>";
    totalElement.innerText = "$0.00";
    return;
  }

  let subtotal = 0;
  list.innerHTML = cart
    .map((item, index) => {
      subtotal += parseFloat(item.price);
      return `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px; font-size:14px;">
            <span>${item.name} ($${item.price.toFixed(2)})</span>
            <button onclick="removeFromCart(${index})" style="color:#ff4757; border:none; background:none; cursor:pointer;">លុប ❌</button>
        </div>`;
    })
    .join("");

  let discountAmount = subtotal * discountPercent;
  let finalTotal = subtotal - discountAmount;

  totalElement.innerText = `$${finalTotal.toFixed(2)}`;
}

// ៥. មុខងារលុបទំនិញចេញពីកន្ត្រក
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  displayCart();
}

// ៦. មុខងារប្រើកូដបញ្ចុះតម្លៃ
function applyPromo() {
  const code = document.getElementById("promo-code").value.trim().toUpperCase();
  if (code === "FREE30") {
    // ឧទាហរណ៍៖ CS50 ចុះ 50%
    discountPercent = 0.3;
    currentPromoCode = code;
    alert("✅ បានប្រើកូដចុះថ្លៃ 30%!");
  } else {
    alert("❌ កូដមិនត្រឹមត្រូវ!");
  }
  displayCart();
}

/* ==========================================
   CHECKOUT & PAYMENT (ប្រព័ន្ធទូទាត់ប្រាក់)
   ========================================== */

// ៧. មុខងារ Checkout - ដំណាក់កាលទី ១ (បង្ហាញ QR)
function startCheckout() {
  if (cart.length === 0) {
    alert("⚠️ កន្ត្រកទទេ! សូមរើសទំនិញសិន។");
    return;
  }

  const name = document.getElementById("user-name").value.trim();
  const phone = document.getElementById("user-phone").value.trim();

  if (!name || !phone) {
    alert("⚠️ សូមបំពេញឈ្មោះ និងលេខ Telegram របស់អ្នក!");
    return;
  }

  // បង្ហាញផ្នែក QR Code និង Upload
  document.getElementById("checkout-section").style.display = "block";

  // ប្តូរមុខងារប៊ូតុងទៅជា " Upload និងទទួលបាន Account "
  const btnMain = document.getElementById("btn-main");
  btnMain.innerText = "Upload វិក្កយបត្រ និងទទួលបាន Account 🚀";
  btnMain.style.background = "#2ed573";
  btnMain.onclick = () => finishPayment(name, phone);
}

// ៨. មុខងារទំនាក់ទំនង Admin
function contactAdmin() {
  window.open(ADMIN_TELEGRAM_LINK, "_blank");
}

// ៩. មុខងារបញ្ចប់ការបង់ប្រាក់ - Upload រូប និងទាញ Acc (finishPayment)
async function finishPayment(name, phone) {
  const fileInput = document.getElementById("screenshot-input");

  // ១. ពិនិត្យមើលថាតើគេបានជ្រើសរើសរូបភាពឬនៅ?
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("⚠️ សូមជ្រើសរើសរូបភាពវិក្កយបត្រ (Screenshot) របស់អ្នកសិន!");
    return;
  }

  const file = fileInput.files[0];
  const productName = cart[0].name; // ទាញយក Account សម្រាប់ផលិតផលទី ១
  const finalPrice = document.getElementById("cart-total").innerText;

  alert(
    "⏳ កំពុង Upload រូបភាព និងទាញយក Account ពី Database ជូន... សូមកុំបិទផ្ទាំងនេះ!",
  );

  // ២. បំប្លែងរូបភាពទៅជា Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function () {
    const base64Data = reader.result.split(",")[1];

    // ៣. បង្កើតទិន្នន័យសម្រាប់ផ្ញើទៅ Google Apps Script
    const payload = {
      productName: productName,
      userName: name,
      userPhone: phone,
      price: finalPrice,
      promoCode: currentPromoCode,
      image: base64Data, // រូបភាព Base64
      imageName: file.name, // ឈ្មោះរូបភាព
    };

    try {
      // ៤. ផ្ញើទៅ Google Sheets
      const response = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      // ៥. ឆែកលទ្ធផល
      if (result.status === "Success") {
        // ក. បង្ហាញ Account ឱ្យអតិថិជន
        alert("🎉 ជោគជ័យ! នេះជា Account របស់អ្នក៖\n\n" + result.account);

        // ខ. ផ្ញើសារដំណឹងលម្អិតទៅ Telegram Bot
        sendNotifyToBot(name, phone, productName, finalPrice, result.imageUrl);

        // គ. Reset កន្ត្រក
        cart = [];
        updateCartCount();
        closeCartModal();
      } else if (result.status === "Out of Stock") {
        alert("⚠️ សុំទោស! ទំនិញ " + productName + " នេះអស់ស្តុកហើយ។");
      } else {
        alert("❌ មានបញ្ហាក្នុងការ Upload រូបភាព! សូមទាក់ទង Admin។");
      }
    } catch (e) {
      console.error(e);
      alert("❌ មានបញ្ហាបច្ចេកទេស! សូមឆែកមើល Web App URL ម្តងទៀត។");
    }
  };
}

/* ==========================================
   TELEGRAM BOT NOTIFY (ផ្ញើដំណឹងទៅអ្នកលក់)
   ========================================= */

// មុខងារផ្ញើសារដំណឹងលម្អិតទៅ Telegram Bot
async function sendNotifyToBot(name, phone, productName, price, imageUrl) {
  let adminMsg =
    `🚨 *មានការបញ្ជាទិញថ្មី (Upload រូបរួច)!*\n\n` +
    `👤 អតិថិជន: ${name}\n` +
    `📞 លេខ: ${phone}\n` +
    `📦 ទំនិញ: ${productName}\n` +
    `💰 តម្លៃ: ${price}\n` +
    `📄 វិក្កយបត្រ: [មើលរូបថត](${imageUrl})\n\n` +
    `⚠️ *សូមឆែកមើលវិក្កយបត្រក្នុង Google Sheet ម្តងទៀតដើម្បីភាពច្បាស់លាស់!*`;

  try {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: adminMsg,
        parse_mode: "Markdown",
      }),
    });
  } catch (e) {
    console.error("Error sending notify to Bot:", e);
  }
}

/* ==========================================
   ONLOAD INIT (ដើរពេលបើក Page)
   ========================================== */
window.onload = function () {
  updateCartCount();
  const modal = document.getElementById("cart-modal");
  if (modal) modal.style.display = "none";
};
document.addEventListener("contextmenu", (event) => event.preventDefault());

// បិទ Shortcut Keys (F12, Ctrl+Shift+I, Ctrl+U)
document.onkeydown = function (e) {
  if (e.keyCode == 123) {
    return false;
  } // បិទ F12
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }
};

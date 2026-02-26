// ===============================
// UUID пользователя
// ===============================
const USER_UUID = getUserUUID();

function getUserUUID() {
  let uuid = localStorage.getItem("user_uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("user_uuid", uuid);
  }
  return uuid;
}

// ===============================
// Обработка клика "Купить подписку"
// ===============================
function onBuyClick(service) {
  localStorage.setItem("currentPay", service);
  // Редирект на страницу оплаты
  location.href = "payment.html";
}

// ===============================
// Оплата подписки на payment.html
// ===============================
async function pay() {
  const service = localStorage.getItem("currentPay");
  if (!service) return;

  try {
    // Отправка POST на backend
    const res = await fetch(`/api/pay/${USER_UUID}/${service}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();

    // Сохраняем дату окончания подписки в localStorage
    localStorage.setItem(`paidUntil_${service}`, data.paidUntil);

    // Показываем уведомление о успешной оплате
    const snack = document.getElementById("snack");
    if (snack) {
      snack.innerText = "Оплата успешно прошла";
      snack.classList.add("show");

      requestAnimationFrame(() => {
        setTimeout(() => {
          snack.classList.remove("show");
          // Редирект на страницу услуги после оплаты
          location.href = `service-${service}.html`;
        }, 1200);
      });
    } else {
      location.href = `service-${service}.html`;
    }

  } catch (e) {
    alert("Ошибка при оплате: " + e.message);
  }
}

// ===============================
// API документы
// ===============================
async function getDocuments(service) {
  const res = await fetch(`/api/documents/${service}`);
  return await res.json();
}

// ===============================
// API подписки (mock)
// ===============================
async function getSubscription(service) {
  const res = await fetch(`/api/subscription/${USER_UUID}/${service}`);
  return await res.json();
}

// ===============================
// Обработка подписки и отображение контента
// ===============================
async function handleSubscription(service) {
  const content = document.getElementById("content");
  const notice = document.getElementById("subscriptionNotice");
  if (!content) return;

  const data = await getDocuments(service);

  // Сначала берем подписку из localStorage
  const paidUntilLS = localStorage.getItem(`paidUntil_${service}`);
  let paidUntil = paidUntilLS ? new Date(paidUntilLS) : null;

  // Если нет в localStorage, берем с backend
  const subscription = await getSubscription(service);
  if (!paidUntil && subscription.paidUntil) {
    paidUntil = new Date(subscription.paidUntil);
  }

  const now = new Date();
  let daysLeft = 0;
  if (paidUntil) {
    daysLeft = Math.ceil((paidUntil - now) / 86400000);
  }

  // Размываем контент только если нет активной подписки
  content.classList.toggle("blur", daysLeft <= 0);

  if (notice) {
    notice.style.display = daysLeft > 0 ? "block" : "none";
    if (daysLeft > 0) document.getElementById("daysLeft").innerText = daysLeft;
  }

  // Рендерим документы
  content.innerHTML = data.map(d => `
    <div class="document">
      <h4 onclick="toggleText(this)" style="cursor:pointer;text-decoration:underline">${d.title}</h4>
      <p style="display:${daysLeft > 0 ? "block" : "none"}">${d.text}</p>
    </div>
  `).join("");
}

// ===============================
// Раскрытие текста по клику
// ===============================
function toggleText(el) {
  const p = el.nextElementSibling;
  if (!p) return;
  p.style.display = p.style.display === "block" ? "none" : "block";
}
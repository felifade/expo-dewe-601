// ============================
// CURSOR RILAKKUMA
// ============================

const cursorRilakkuma = document.createElement("div");
cursorRilakkuma.id = "cursor-rilakkuma";

const imgRilakkuma = document.createElement("img");

const enPaginaSecundaria = window.location.pathname.includes("/paginas/");

if (enPaginaSecundaria) {
    imgRilakkuma.src = "../img/rilakkuma.jpg";
} else {
    imgRilakkuma.src = "img/rilakkuma.jpg";
}

imgRilakkuma.alt = "Rilakkuma";
cursorRilakkuma.appendChild(imgRilakkuma);
document.body.appendChild(cursorRilakkuma);

const auraCursor = document.createElement("div");
auraCursor.id = "aura-cursor";
document.body.appendChild(auraCursor);

document.addEventListener("mousemove", function (e) {
    cursorRilakkuma.style.left = e.clientX + "px";
    cursorRilakkuma.style.top  = e.clientY + "px";
    auraCursor.style.left = e.clientX + "px";
    auraCursor.style.top  = e.clientY + "px";
});

document.addEventListener("mousedown", function () {
    auraCursor.classList.add("activa");
});

document.addEventListener("mouseup", function () {
    auraCursor.classList.remove("activa");
});

document.addEventListener("mouseleave", function () {
    cursorRilakkuma.style.opacity = "0";
    auraCursor.style.opacity = "0";
});

document.addEventListener("mouseenter", function () {
    cursorRilakkuma.style.opacity = "1";
    auraCursor.style.opacity = "1";
});
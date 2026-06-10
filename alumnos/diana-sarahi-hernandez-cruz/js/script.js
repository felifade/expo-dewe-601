document.addEventListener("DOMContentLoaded", () => {

    const ringBtn = document.getElementById("ringBtn");
    const display = document.getElementById("display");
    const statusText = document.getElementById("statusText");
    const statusDot = document.getElementById("statusDot");
    const lens = document.getElementById("lens");
    const video = document.getElementById("video");
    const themeBtn = document.getElementById("themeBtn");

    let stream = null;

    /* =========================
       MODO CLARO / OSCURO
    ========================= */

    if(themeBtn){

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("light-mode");

            if(document.body.classList.contains("light-mode")){
                themeBtn.textContent = "☀️";
            }else{
                themeBtn.textContent = "🌙";
            }

        });

    }

    /* =========================
       ABRIR CÁMARA
    ========================= */

    async function abrirCamara(){

        if(!video) return;

        try{

            stream = await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:false
            });

            video.srcObject = stream;
            video.style.display = "block";

        }catch(error){

            console.log("Error al abrir cámara:", error);

        }

    }

    /* =========================
       CERRAR CÁMARA
    ========================= */

    function cerrarCamara(){

        if(stream){

            stream.getTracks().forEach(track => track.stop());
            stream = null;

        }

        if(video){
            video.style.display = "none";
        }

    }

    /* =========================
       TIMBRE INTELIGENTE
    ========================= */

    if(ringBtn){

        ringBtn.addEventListener("click", () => {

            let segundos = 5;

            statusText.textContent = "ESPERANDO";
            statusDot.style.background = "#facc15";

            display.innerHTML = `
                <p class="label">Visitante detectado</p>
                <p class="value">Esperando respuesta...</p>
            `;

            const contador = setInterval(() => {

                display.innerHTML = `
                    <p class="label">Cuenta regresiva</p>
                    <p class="value">${segundos} segundos</p>
                `;

                segundos--;

                if(segundos < 0){

                    clearInterval(contador);

                    statusText.textContent = "GRABANDO";
                    statusDot.style.background = "#ef4444";

                    if(lens){
                        lens.classList.add("grabando");
                    }

                    abrirCamara();

                    display.innerHTML = `
                        <p class="label">📷 Cámara activada</p>
                        <p class="value">No me encuentro en casa</p>
                    `;

                    setTimeout(() => {

                        statusText.textContent = "STANDBY";
                        statusDot.style.background = "#22c55e";

                        if(lens){
                            lens.classList.remove("grabando");
                        }

                        cerrarCamara();

                        display.innerHTML = `
                            <p class="label">Listo</p>
                            <p class="value">Toca el botón →</p>
                        `;

                    }, 5000);

                }

            }, 1000);

        });

    }

});
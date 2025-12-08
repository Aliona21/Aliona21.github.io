function showPopup(){
    const popup = document.getElementById("popup");
    popup.classList.add("show");
}

document.getElementById("q1").oninput = function () {
    document.getElementById("q1_value").textContent = this.value;
}

document.getElementById("q2").oninput = function () {
    document.getElementById("q2_value").textContent = this.value;
}

document.getElementById("q3").oninput = function () {
    document.getElementById("q3_value").textContent = this.value;
}


document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
        vardas: document.getElementById("fname").value,
        pavarde: document.getElementById("lname").value,
        email: document.getElementById("email").value,
        telefonas: document.getElementById("phone").value,
        adresas: document.getElementById("address").value,
        klausimas1: Number(document.getElementById("q1").value),
        klausimas2: Number(document.getElementById("q2").value),
        klausimas3: Number(document.getElementById("q3").value)
    };

    console.log(formData);

    const vidurkis = (
        formData.klausimas1 +
        formData.klausimas2 +
        formData.klausimas3
    ) / 3;

    const vidurkisRounded = vidurkis.toFixed(1);

    const output = `
        <p><strong>Vardas:</strong> ${formData.vardas}</p>
        <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
        <p><strong>El. paštas:</strong> ${formData.email}</p>
        <p><strong>Tel. numeris:</strong> ${formData.telefonas}</p>
        <p><strong>Adresas:</strong> ${formData.adresas}</p>
        <hr>
        <p><strong>${formData.vardas} ${formData.pavarde}: ${vidurkisRounded}</strong></p>
    `;

    document.getElementById("result").innerHTML = output;
});

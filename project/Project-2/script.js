let qrCode;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize QR Code Styling
    qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "canvas",
        data: "",
        dotsOptions: { color: "#000000", type: "rounded" },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { margin: 10 }
    });
});

// Function to update QR Code live
function updateQRCode() {
    let text = document.getElementById("textInput").value.trim();
    let color = document.getElementById("colorPicker").value;
    let qrContainer = document.getElementById("qrCode");

    if (!text) {
        qrContainer.innerHTML = "<p style='color:gray;'>Enter text to generate QR</p>";
        return;
    }

    // Ensure qrCode is initialized before using it
    if (!qrCode) return;

    qrCode.update({ data: text, dotsOptions: { color: color } });

    qrContainer.innerHTML = ""; // Clear previous QR
    qrCode.append(qrContainer);
}

// Function to download QR Code
function downloadQRCode() {
    if (!qrCode || !qrCode._options.data) {
        alert("Generate a QR Code first!");
        return;
    }
    qrCode.download({ name: "qr_code", extension: "png" });
}

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
});

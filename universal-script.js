/**Scripts which are needed on every page on the website */
export function copyEmail() {
    const text = document.getElementById("E-mail").innerText;
    navigator.clipboard.writeText(text).then(() => { });
    Toastify({
        text: "E-Mail kopiert",
        duration: 2500,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#1a3e47",
            border: "solid #0f2529",
            borderRadius: "6px",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}
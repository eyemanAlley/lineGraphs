import html2canvas from "html2canvas";

function exportToImage() {
    const element = document.getElementById("visualisation"); // Replace "yourDivId" with the actual ID of your div
    html2canvas(element).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "visualisation.png";
        link.click();
    });
}

export { exportToImage };

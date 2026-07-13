const subMenuItems = [
    {
        label: "ANOMALY",
        href: "anomaly.html",
    },
    {
        label: "RIVE",
        href: "rive.html",
    },
    {
        label: "RM40",
        href: "rm40.html",
    },
    {
        label: "SPECTRAL COMPRESSOR",
        href: "spectralcompressor.html",
    },
    {
        label: "FUSION",
        href: "fusion.html",
    },
    {
        label: "OBRA",
        href: "obra.html",
    },
    {
        label: "SPECTRAL GATE 2",
        href: "spectralgate.html"
    },
]

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("plugins-submenu")
    container.innerHTML = ""
    for (const menuItem of subMenuItems) {
        const element = document.createElement("a")
        element.href = menuItem.href
        element.textContent = menuItem.label
        container.appendChild(element)
    }
})

function toggleSubMenu() {
    const submenu = document.querySelector(".submenu");
    submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}
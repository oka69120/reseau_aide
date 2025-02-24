const routes = {
    "/": "pages/accueil.html",
    "/bricolage": "pages/bricolage.html",
    "/garderie": "pages/garderie.html",
    "/menage": "pages/menage.html",
    "/contact": "pages/contact.html"
};

const loadPage = async (path) => {
    const contentDiv = document.getElementById("content");
    const page = routes[path] || routes["/"];

    try {
        const response = await fetch(page);
        if (!response.ok) throw new Error("Page non trouvée");
        const html = await response.text();
        contentDiv.innerHTML = html;

        loadCSS(`css/${path.substring(1) || "accueil"}.css`);
        loadScript(`js/${path.substring(1) || "accueil"}.js`);
    } catch (error) {
        contentDiv.innerHTML = "<h2>Erreur 404 - Page introuvable</h2>";
    }
};

const navigateTo = (url) => {
    history.pushState({}, "", url);
    loadPage(url);
};

const loadCSS = (href) => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
};

const loadScript = (src) => {
    let script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
};

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    window.addEventListener("popstate", () => {
        loadPage(location.pathname);
    });

    // Charger header et footer depuis "components"
    loadComponent("header", "components/header.html", "css/header.css", "js/header.js");
    loadComponent("footer", "components/footer.html", "css/footer.css", "js/footer.js");

    loadPage(location.pathname);
});

const loadComponent = async (id, file, cssFile, jsFile) => {
    const container = document.getElementById(id);
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("Composant non trouvé");
        container.innerHTML = await response.text();
        loadCSS(cssFile);
        loadScript(jsFile);
    } catch (error) {
        console.error(error);
    }
};
/**
 * Charles Taragin Portfolio JavaScript - Premium Site Enhancements
 * ------------------------------------------------------------------
 * Post-processes R Markdown HTML to inject dark mode, search filters,
 * dynamic publication card styling, and interactive abstract toggles.
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Theme Mode (Dark/Light)
    initTheme();

    // 2. Decorate Publications & Bibliography (if present)
    decorateBibliography();

    // 3. Add Custom Footer to Page
    injectFooter();
});

/**
 * Injects a theme toggle switch in the navbar and manages the theme.
 */
function initTheme() {
    const navbar = document.querySelector(".navbar-collapse");
    if (!navbar) return;

    // Create the toggle container and button
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "nav navbar-nav navbar-right theme-switch-wrapper";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "theme-toggle-btn";
    toggleBtn.id = "theme-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle dark/light theme");
    toggleBtn.innerHTML = `
        <i class="fa-solid fa-moon"></i>
        <i class="fa-solid fa-sun"></i>
    `;

    toggleWrapper.appendChild(toggleBtn);
    
    // Find the right place to inject: after the existing list items in right navbar
    const rightNav = navbar.querySelector(".navbar-right");
    if (rightNav) {
        rightNav.appendChild(toggleWrapper);
    } else {
        navbar.appendChild(toggleWrapper);
    }

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
        document.body.classList.add("dark-theme");
    }

    // Toggle event listener
    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

/**
 * Bibliography dictionary mapping Pandoc Citation Keys to details and abstracts.
 */
const papersDB = {
    "ref-TaraginTaylhardat2025": {
        title: "A distance-based algorithm for defining antitrust markets",
        authors: "Charles Taragin and Marco Taylhardat",
        journal: "Finance Research Letters",
        year: "2025",
        volume: "86",
        pages: "108972",
        doi: "10.1016/j.frl.2025.108972",
        url: "https://doi.org/10.1016/j.frl.2025.108972",
        abstract: "The paper proposes a new distance-based algorithm for defining geographic antitrust markets in banking and retail. It establishes a quantitative framework to draw realistic market boundaries based on spatial competition and distance vectors, bypassing traditional ad-hoc county or metropolitan area definitions.",
        tags: ["Market Definition", "Banking", "Spatial Competition"]
    },
    "ref-BensonBordGarnerTaragin2023": {
        title: "Size and Survival of Entrants to Retail Banking",
        authors: "David Benson, Vitaly Bord, Aaron Garner, and Charles Taragin",
        journal: "FEDS Notes",
        publisher: "Board of Governors of the Federal Reserve System",
        year: "2023",
        doi: "10.17016/2380-7172.3345",
        url: "https://doi.org/10.17016/2380-7172.3345",
        abstract: "This note examines the entry rates and post-entry growth dynamics of newly chartered banks in the United States over the past three decades. The authors analyze how initial capital size, local market structures, and macroeconomic conditions influence the survival rates of banking entrants, providing insights into retail banking competition.",
        tags: ["Banking", "Entrant Survival", "Retail Banking"]
    },
    "ref-PanhansTaragin2023": {
        title: "Consequences of model choice in predicting horizontal merger effects",
        authors: "Matthew T. Panhans and Charles Taragin",
        journal: "International Journal of Industrial Organization",
        year: "2023",
        volume: "89",
        pages: "102986",
        doi: "10.1016/j.ijindorg.2023.102986",
        url: "https://doi.org/10.1016/j.ijindorg.2023.102986",
        abstract: "How practitioners model competition influences the predicted effects of a merger. We show how a Bertrand price setting and a second score auction model can be nested within a general bargaining framework. Through numerical simulations, we then show how the predicted merger effects vary with model choice, and that two commonly used strategies for obtaining demand parameters can yield markedly different outcomes across the models. Finally, we show how model and calibration strategy choices affect the magnitude of predicted harm in the 2012 Bazaarvoice/PowerReviews merger.",
        tags: ["Bargaining", "Merger Simulation", "Model Choice", "Antitrust"]
    },
    "ref-VitaEtAl2022": {
        title: "Economics at the FTC: Estimating Harm from Deception and Analyzing Mergers",
        authors: "Michael Vita, Keith Brand, Miriam Larson-Koester, Nathan Petek, Charles Taragin, William Violette, and Daniel H. Wood",
        journal: "Review of Industrial Organization",
        year: "2022",
        volume: "61",
        number: "4",
        pages: "405-438",
        doi: "10.1007/s11151-022-09883-w",
        url: "https://doi.org/10.1007/s11151-022-09883-w",
        abstract: "Economists in the U.S. Federal Trade Commission’s Bureau of Economics perform economic analysis in support of the Commission’s dual missions to protect consumers and competition by preventing anticompetitive, deceptive, and unfair business practices through law enforcement, advocacy, and education. This article first presents summaries of analyses that FTC economists performed to estimate the consumer harm from two different types of deception that involved misleading information about lease terms and suppression of negative product reviews. The essay next turns to economic analyses of mergers: We first consider the vertical issues that arose in a semiconductor merger; and then we provide a discussion of how complementarity between hospitals may affect the analysis of hospital mergers.",
        tags: ["Consumer Protection", "FTC", "Hospital Mergers", "Vertical Mergers"]
    },
    "ref-Sheu2018": {
        title: "Simulating mergers in a vertical supply chain with bargaining",
        authors: "Gloria Sheu and Charles Taragin",
        journal: "The RAND Journal of Economics",
        year: "2021",
        volume: "52",
        number: "3",
        pages: "596-632",
        doi: "10.1111/1756-2171.12385",
        url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/1756-2171.12385",
        abstract: "We model a two-level supply chain where Nash bargaining occurs upstream and firms compete in a logit setting downstream, either via Bertrand price setting or an auction. The parameters can be calibrated with a discrete set of data on prices, margins, and market shares, facilitating use by antitrust practitioners. We perform numerical simulations to identify cases where modelling the full vertical structure is important and where harm is likely. We also examine the thwarted Anthem/Cigna merger and show how the model weighs the various arguments made by the government and the defendants.",
        tags: ["Bargaining", "Merger Simulation", "Vertical Mergers", "Supply Chain"]
    },
    "ref-Froeb2018": {
        title: "The simple algebra of surplus in private values open auctions: A nested logit merger model",
        authors: "Luke M. Froeb, Vladimir Mares, Steven Tschantz, and Charles Taragin",
        journal: "Economics Bulletin",
        year: "2018",
        volume: "38",
        number: "4",
        pages: "2304-2312",
        url: "https://ideas.repec.org/a/ebl/ecbull/eb-18-00431.html",
        abstract: "In a private values, open auction, we show that bidder surplus can be expressed as a simple difference between unconditional moments of order statistics. The strength of the result is its simplicity and generality, as we dispense with the typical assumptions of independence or symmetry. We show how to use the expression to derive closed-form expressions for the effects of a merger among bidders for any joint value distribution.",
        tags: ["Auctions", "Nested Logit", "Merger Model"]
    },
    "ref-Froeb2018a": {
        title: "Economics at the Antitrust Division: 2017–2018",
        authors: "Luke M. Froeb, Russell W. Pittman, Charles S. Taragin, Steven Tschantz, and Gregory J. Werden",
        journal: "Review of Industrial Organization",
        year: "2018",
        volume: "53",
        number: "4",
        pages: "637-651",
        doi: "10.1007/s11151-018-9662-8",
        url: "https://doi.org/10.1007/s11151-018-9663-7",
        abstract: "This article describes some of the work of Antitrust Division economists over the past year, with a focus on modeling. It begins by illustrating the mapping from evidence to prediction using tools for assessing the effects of mergers using Bertrand, Cournot, and auction models. It then turns to two hot topics in competition policy: the implications of claims of increasing margins for merger enforcement and the validity of claims of increasing concentration. Finally, it considers how mergers affect prices in bargaining models.",
        tags: ["Antitrust", "Bargaining", "Concentration", "DOJ"]
    },
    "ref-Borzekowski2009": {
        title: "Competition and price discrimination in the market for mailing lists",
        authors: "Ron Borzekowski, Raphael Thomadsen, and Charles Taragin",
        journal: "Quantitative Marketing and Economics (QME)",
        year: "2009",
        volume: "7",
        number: "2",
        pages: "147-179",
        doi: "10.1007/s11129-009-9050-7",
        url: "https://doi.org/10.1007/s11129-009-9050-7",
        abstract: "This paper examines whether mailing list sellers, when faced with additional competitors, are more likely to try to segment consumers by offering additional choices at different prices (second-degree price discrimination) and/or offering different prices to readily identifiable groups of consumers (third-degree price discrimination). We utilize a dataset that includes information about all consumer response lists available for rental in 1997 and 2002. Our results indicate that increased competition leads to an increased propensity to price discriminate along each of the dimensions we investigate.",
        tags: ["Price Discrimination", "Mailing Lists", "Competition"]
    },
    "ref-TaraginWallaceWatkins2025": {
        title: "Financial Structure and Mergers",
        authors: "Charles Taragin, Benjamin Wallace, and Eddie Watkins",
        journal: "Finance and Economics Discussion Series, Board of Governors of the Federal Reserve System",
        number: "2025-080",
        year: "2025",
        doi: "10.17016/FEDS.2025.080",
        url: "https://doi.org/10.17016/FEDS.2025.080",
        note: "Conditional accept at International Journal of Industrial Organization",
        abstract: "The paper investigates how corporate debt levels influence the competitive outcomes of both horizontal and conglomerate mergers. In contrast to standard economic models where debt is often assumed not to impact pricing, this research demonstrates that mergers allow firms to spread fixed debt obligations across a wider portfolio of products. This creates an 'insurance effect' against adverse demand shocks. Through numerical simulations and a case study of a casino merger, the authors find that debt can either dampen or amplify post-merger price increases, depending on the specific market environment.",
        tags: ["Financial Structure", "Corporate Debt", "Pricing Effects", "Mergers"]
    },
    "ref-HoskenLarsonKoesterTaragin2025": {
        title: "Labor and Product Market Effects of Mergers",
        authors: "Daniel Hosken, Miriam Larson-Koester, and Charles Taragin",
        year: "2025",
        note: "Revise and Resubmit at International Journal of Industrial Organization",
        abstract: "The paper utilizes a two-level vertical supply chain model to forecast how mergers impact both product markets (where firms compete) and labor markets (where firms bargain with workers over wages). By extending traditional merger simulation techniques—which typically focus only on downstream product market competition—the authors analyze how mergers influence worker welfare alongside consumer outcomes. The research identifies that mergers between direct competitors can harm workers in three primary ways: reduced employment, increased employer bargaining power (product market), and decreased worker bargaining power (labor market).",
        tags: ["Labor Markets", "Product Markets", "Bargaining", "Worker Welfare"]
    },
    "ref-BensonLoudermilkTaragin2026": {
        title: "Merger Screening Under Uncertain Conduct",
        authors: "David Benson, Margaret Loudermilk, and Charles Taragin",
        year: "2026",
        note: "Manuscript in progress",
        abstract: "This paper analyzes the performance of classical structural merger screens (e.g. market share and HHI thresholds) in environments where the competitive mode of conduct (e.g., Bertrand vs. Cournot vs. Bargaining) is uncertain. We evaluate screen errors (false positives and false negatives) and propose a robust screening framework.",
        tags: ["Merger Screening", "Conduct Uncertainty", "Antitrust Policy"]
    },
    "ref-BensonGarnerSheuTaragin2026": {
        title: "Merger Effects and Efficiencies Under Uncertainty: Evidence from Supreme Court Decisions on Banking",
        authors: "David Benson, Aaron Garner, Gloria Sheu, and Charles S. Taragin",
        year: "2026",
        note: "Manuscript in progress",
        abstract: "Focusing on historical Supreme Court rulings regarding bank mergers, this paper investigates how regulatory and legal uncertainty surrounding post-merger efficiencies impacts pricing and consolidation in the retail banking sector.",
        tags: ["Banking Regulation", "Supreme Court", "Efficiencies", "Uncertainty"]
    },
    "ref-LoudermilkSheuTaragin2023": {
        title: "Beyond \"Horizontal\" and \"Vertical\": The Welfare Effects of Complex Integration",
        authors: "Margaret Loudermilk, Gloria Sheu, and Charles Taragin",
        journal: "Finance and Economics Discussion Series, Board of Governors of the Federal Reserve System",
        number: "2023-005",
        year: "2023",
        doi: "10.17016/FEDS.2023.005",
        url: "https://doi.org/10.17016/FEDS.2023.005",
        abstract: "We analyze firm integration that does not fit neatly into horizontal or vertical paradigms, focusing on conglomerate mergers and complex supply chains. We build a generalized theoretical framework to measure the welfare effects of these integrations on consumers and upstream partners.",
        tags: ["Complex Integration", "Conglomerate Mergers", "Welfare Effects"]
    }
};

/**
 * Restructures Plain Bibliography outputs into styled, interactive cards.
 * Also appends a real-time keyword search box at the top.
 */
function decorateBibliography() {
    const refsContainer = document.getElementById("refs");
    if (!refsContainer) return;

    // Get list of all plain bibliography items
    const entries = refsContainer.querySelectorAll(".csl-entry");
    if (entries.length === 0) return;

    // 1. Ingest all current references and map them
    const cardsList = [];
    
    entries.forEach(entry => {
        const id = entry.id;
        const rawHTML = entry.innerHTML;
        let paperData = papersDB[id];

        // If paper not in our database, parse standard details from raw HTML
        if (!paperData) {
            paperData = parseRawCitation(entry);
        }

        cardsList.push({
            id: id,
            element: entry,
            data: paperData
        });
    });

    // 2. Inject Search box above bibliography container
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "research-controls";
    searchWrapper.innerHTML = `
        <div class="search-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" class="search-input" id="bib-search" placeholder="Search publications by title, author, or keyword...">
        </div>
    `;
    
    refsContainer.parentNode.insertBefore(searchWrapper, refsContainer);

    // 3. Render gorgeous custom card inside each csl-entry container
    cardsList.forEach(item => {
        const entry = item.element;
        const d = item.data;

        // Build HTML for tags
        let tagsHTML = "";
        if (d.tags && d.tags.length > 0) {
            tagsHTML = `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                ${d.tags.map(t => `<span class="skill-tag" style="font-size: 0.75rem; padding: 2px 8px; background: var(--bg-secondary); border-radius: 4px; font-weight: 500; color: var(--text-muted);">${t}</span>`).join('')}
            </div>`;
        }

        // Build HTML for Abstract toggle button & container
        let abstractHTML = "";
        if (d.abstract) {
            abstractHTML = `
                <button class="abstract-toggle-btn" data-target="${item.id}-abstract">
                    <i class="fa-solid fa-file-text"></i> View Abstract <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; transition: transform 0.2s;"></i>
                </button>
                <div class="paper-abstract" id="${item.id}-abstract">
                    ${d.abstract}
                </div>
            `;
        }

        // Build Link buttons
        let linksHTML = "";
        if (d.url || d.doi) {
            linksHTML = `<div class="paper-links">`;
            if (d.doi) {
                linksHTML += `
                    <a href="https://doi.org/${d.doi}" target="_blank" class="paper-link-btn">
                        <i class="fa-solid fa-fingerprint"></i> DOI Link
                    </a>
                `;
            } else if (d.url) {
                linksHTML += `
                    <a href="${d.url}" target="_blank" class="paper-link-btn">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Publisher
                    </a>
                `;
            }
            linksHTML += `</div>`;
        }

        // Highlight Charles Taragin in author list
        let formattedAuthors = d.authors;
        formattedAuthors = formattedAuthors
            .replace("Charles Taragin", "<strong>Charles Taragin</strong>")
            .replace("Charles S. Taragin", "<strong>Charles S. Taragin</strong>")
            .replace("Taragin, Charles", "<strong>Taragin, Charles</strong>")
            .replace("Taragin, Charles S.", "<strong>Taragin, Charles S.</strong>");

        // Format publication details line
        let detailLine = "";
        if (d.journal) {
            detailLine += `<em>${d.journal}</em>`;
            if (d.volume) detailLine += `, Vol. ${d.volume}`;
            if (d.number) detailLine += `, No. ${d.number}`;
            if (d.pages) detailLine += `, pp. ${d.pages}`;
            if (d.year) detailLine += ` (${d.year})`;
        } else if (d.note) {
            detailLine += `<strong>${d.note}</strong>`;
            if (d.year) detailLine += ` (${d.year})`;
        } else if (d.year) {
            detailLine += `Manuscript (${d.year})`;
        }

        // Assemble the card layout
        entry.innerHTML = `
            <span class="paper-title">${d.title}</span>
            <span class="paper-authors">${formattedAuthors}</span>
            <span class="paper-journal">${detailLine}</span>
            ${tagsHTML}
            ${abstractHTML}
            ${linksHTML}
        `;
    });

    // 4. Implement Abstract toggle accordion slide animations
    const toggleBtns = refsContainer.querySelectorAll(".abstract-toggle-btn");
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const abstractDiv = document.getElementById(targetId);
            const icon = this.querySelector(".fa-chevron-down");

            if (abstractDiv.classList.contains("show")) {
                abstractDiv.classList.remove("show");
                if (icon) icon.style.transform = "rotate(0deg)";
            } else {
                abstractDiv.classList.add("show");
                if (icon) icon.style.transform = "rotate(180deg)";
            }
        });
    });

    // 5. Implement real-time Search input listener
    const searchInput = document.getElementById("bib-search");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase().trim();

            cardsList.forEach(item => {
                const el = item.element;
                const d = item.data;
                
                const matchesSearch = 
                    d.title.toLowerCase().includes(query) ||
                    d.authors.toLowerCase().includes(query) ||
                    (d.journal && d.journal.toLowerCase().includes(query)) ||
                    (d.abstract && d.abstract.toLowerCase().includes(query)) ||
                    (d.tags && d.tags.some(tag => tag.toLowerCase().includes(query)));

                if (query === "" || matchesSearch) {
                    el.style.display = "block";
                } else {
                    el.style.display = "none";
                }
            });
        });
    }
}

/**
 * Fallback parser that attempts to parse citation items if they aren't in database.
 */
function parseRawCitation(entry) {
    const rawText = entry.textContent || "";
    // Crude parser fallback
    return {
        title: rawText.split("(")[1] ? (rawText.split(")")[1] || "").split(".")[0].trim() : "Working Paper",
        authors: rawText.split("(")[0].trim() || "Charles Taragin",
        journal: "",
        year: rawText.match(/\((\d{4})\)/)?.[1] || "",
        abstract: "",
        tags: []
    };
}

/**
 * Appends a sleek, premium footer to the bottom of the main-container.
 */
function injectFooter() {
    const container = document.querySelector(".main-container");
    if (!container) return;

    // Check if footer exists first
    let footer = document.querySelector(".footer-wrap");
    if (footer) return;

    footer = document.createElement("div");
    footer.className = "footer-wrap";
    footer.innerHTML = `
        <div class="footer-container">
            <span class="footer-text">&copy; 2026 Charles Taragin. All rights reserved.</span>
            <div class="footer-socials">
                <a href="mailto:ctaragin@gmail.com" title="Email"><i class="fa-solid fa-envelope"></i></a>
                <a href="https://www.linkedin.com/in/charles-taragin-b950a668" target="_blank" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
            </div>
        </div>
    `;

    // Append to container but outside the primary row/sections
    container.appendChild(footer);
}

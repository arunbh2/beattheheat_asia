# BeatTheHeat.Asia

**Orchestrating Urban Heat Resilience Across India & South Asia**
**Championing Systemic Adaptation for Vulnerable Communities**

---

## About The Project

[cite_start]BeatTheHeat.Asia is an ecosystem orchestration platform designed to address the interconnected, systemic challenge of extreme heat. Our goal is to align government, private sector, NGO, and academic efforts to protect Asia's most vulnerable populations through data, finance, and community-led action.

[cite_start]This platform is not just a website; it is a field-building movement intended to make the heat resilience ecosystem visible, fundable, and learnable.

Our Theory of Change is built on a **"Sense -> Shift -> Learn"** loop:
* **Sense:** We gather signals on what’s needed by mapping risks, listening to communities, and identifying bottlenecks.
* **Shift:** We change system behavior by directing capital and knowledge to what works, influencing policy and practice.
* **Learn:** The entire platform is a learning engine, converting fragmented data into shared insight to refine the loop.

## Platform Architecture & Sitemap

The website is structured to guide users logically from understanding the crisis to finding actionable solutions and partners.

-   `/` (`index.html`): **Homepage** - The primary entry point that establishes the narrative and provides on-ramps for all stakeholders.
-   `/crisis.html`: **The Heat Crisis Hub** - The evidence base, showcasing data, risk maps, and the human impact of extreme heat.
-   `/knowledge.html`: **Knowledge Hub** - A curated library of solutions, toolkits, and case studies, filterable by scale (household to ecosystem) and type.
-   `/fund.html`: **"Fund Heat" Hub** - The central directory for all heat-related financing, including grants, blended finance, and outcome funds.
-   `/community.html`: **Community Forum** - The hub for peer-to-peer exchange and collaborative problem-solving (MVP is a landing page for the upcoming forum).
-   `/events.html`: **Events Hub** - A convening calendar for webinars, conferences, and roundtables across the ecosystem.
-   `/policy.html`: **Policy & Governance Lab** - A resource for strengthening Heat Action Plans (HAPs) with best practices, toolkits, and policy analysis.
-   `/coalition.html`: **The Coalition** - A page dedicated to the movement, showcasing partners and providing a clear pathway to join.

## Getting Started: Local Development

This is a static website built with HTML, CSS, and minimal JavaScript, designed for easy deployment on GitHub Pages.

To set up a local development environment:

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/beattheheat-asia.git](https://github.com/your-username/beattheheat-asia.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd beattheheat-asia
    ```
3.  **Serve the files locally:**
    * We recommend using a simple live server. If you are using Visual Studio Code, you can install the "Live Server" extension.
    * Once installed, right-click on `index.html` and select "Open with Live Server." This will open the site in your browser and automatically reload on changes.

## Folder & Asset Structure

The project follows a clean, modular structure to separate concerns and make maintenance straightforward.

```
beattheheat-asia/
├── index.html
├── crisis.html
├── knowledge.html
├── fund.html
├── community.html
├── events.html
├── policy.html
└── coalition.html
│
└── assets/
    ├── css/
    │   ├── tokens.css          # Holds all design system variables (colors, fonts, spacing)
    │   ├── main.css            # Global styles for body, typography, and basic layout
    │   └── components.css      # Styles for reusable components (buttons, cards, ribbon, footer)
    │
    ├── js/
    │   ├── main.js             # Main script for global interactions (e.g., mobile nav, sticky ribbon)
    │   └── carousel.js         # Dedicated script for any carousel/slider components
    │
    ├── images/                 # Optimized images, logos, and background assets
    │   ├── logo.svg
    │   └── hero-bg.jpg
    │
    └── fonts/                  # Self-hosted font files (e.g., Poppins, Inter) in .woff2 format
```

## Core Features (MVP)

-   **Responsive, Mobile-First Design:** Ensures accessibility on all devices.
-   **Stakeholder-Centric Navigation:** Clear on-ramps via the homepage's 8 Ecosystem Cards.
-   [cite_start]**Global Heat Emergency Ribbon:** A sticky UI element to create urgency and share timely information.
-   [cite_start]**Multi-Level Knowledge Hub:** A system for classifying solutions by scale of impact (Individual, Community, City, etc.).
-   [cite_start]**Comprehensive Funding Directory:** Showcases various financing models and live opportunities.
-   **Static Events Calendar & Community Hub:** Provides information and pathways for engagement, with plans for dynamic functionality.

## Deployment

This site is optimized for deployment on **GitHub Pages**. Please refer to the detailed deployment guide in the full handoff package for step-by-step instructions.

## Contributing

Contributions that advance the mission are welcome. Please read our contribution guidelines (to be created) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License** - see the [LICENSE.md](LICENSE.md) file for details.
[cite_start]This license encourages sharing and adaptation for non-commercial purposes, aligning with our goal of building knowledge as a public good.

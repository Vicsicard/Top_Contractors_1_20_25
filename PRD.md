**Project PRD: Multi-Client Dynamic Website Platform (HTML-Based MVP)**

**Objective:**
Build a scalable system that supports multiple dynamic client websites, all powered by a single Supabase backend. Each website will have its own live subdomain (via Vercel), dynamic content, and CMS dashboard—all managed from static HTML and JavaScript files. The system will be structured to upgrade into a full Next.js app in the future, but begins with a simple, low-overhead HTML-based MVP.

---

**Core Requirements:**

1. **Central Backend (Supabase)**
   - Use one Supabase project to manage all content.
   - Create a `dynamic_content` table with the following schema:
     - `project_id` (text) — identifies which client/site this content belongs to
     - `key` (text) — the content identifier (e.g. `rendered_title`, `brand-blue`)
     - `value` (text) — the HTML or text value to display
   - Primary key: (`project_id`, `key`)

2. **Admin CMS Form / Dashboard (`edit.html`)**
   - A basic HTML form connected directly to Supabase via JavaScript
   - Each field uses `name="key"` matching the keys in `dynamic_content`
   - A hidden or dropdown input identifies the `project_id` for the current client
   - On form submission:
     - JavaScript gathers all inputs using `FormData`
     - It sends one `upsert` per key to the Supabase table with `project_id`
     - Values are saved or updated accordingly
   - Hosted on Vercel as a static HTML page

3. **Public Website (`index.html`)**
   - Also a plain HTML file using `data-key="..."` attributes to mark dynamic content spots
   - On page load:
     - A script pulls all content where `project_id = 'xyz-client'`
     - It loops through all DOM elements with `data-key` and injects the corresponding `value`
     - Brand colors (e.g. `brand-blue`) are injected as `--css-vars` in a `<style>` tag
   - This site is fully static, but rendered dynamically using Supabase content
   - Layout includes:
     - Hero section (title, subtitle)
     - Bio/About
     - Blog section (2x2 grid)
     - Social media section (2x2 grid)
     - Contact info + footer

4. **Hosting & Subdomains (Vercel)**
   - The entire system lives in one Git repo
   - Vercel hosts both the admin (`edit.html`) and site (`index.html`)
   - Each client site is deployed to a unique subdomain:
     - `client-a.yourdomain.com`
     - `client-b.yourdomain.com`
   - The JavaScript on each site detects its `project_id` via subdomain parsing or hardcoded config

---

**Directory Structure (MVP)**
```
/public-site/
  ├── index.html          <-- Client-facing site
  ├── edit.html           <-- CMS admin form
  ├── script.js           <-- JS that fetches content from Supabase and injects into DOM
  └── style.css           <-- Optional shared styles
```

---

**Connection Flow (Summary):**
1. Admin opens `edit.html`, selects or enters `project_id`, and fills out form fields
2. On submit, the script uses Supabase’s `upsert()` API to save each `key` and `value` under that `project_id`
3. On the live site (`index.html`), the `script.js` fetches all content for `project_id`
4. That content is injected into the matching `data-key` placeholders and styled using injected CSS variables
5. The client sees their fully personalized, up-to-date site — no rebuild required

---

**Future Upgrade Plan:**
- Convert the static HTML into a Next.js app
- Move routing to dynamic `[project_id].js` pages
- Use middleware to detect subdomains automatically
- Add authentication and role-based access to the admin form

---

**Deliverables:**
- Supabase project with schema ready
- `edit.html` CMS form
- `index.html` dynamic public site
- `script.js` content injector
- CSS + layout for 2x2 blog and social grids
- Vercel configuration for subdomain-based deployments

---

**End Goal:**
A repeatable, scalable system to spin up new client sites with dynamic content editing, centralized backend, and clean subdomain-based publishing — all from one Git repo and no framework overhead to start.


/*
 * portfolio.js - hand-written behavior for the Experience section.
 *
 * Vendor scripts (jQuery and Webflow) load separately and are left untouched;
 * this file holds only our own logic so it lives in one predictable place. It
 * is loaded at the end of <body>, after the Experience markup exists.
 */

/*
 * Single source of truth: each Experience title's text class maps to the id of
 * the detail panel it reveals. The click selector is derived from these keys,
 * so adding a title later means editing this one map only.
 */
const PANEL_BY_TITLE_CLASS =
{
	"xr-trainer-text": "tacticle-AR",
	"vr-ar-tour-text": "AR-Tour",
	"cad-motion-text": "CAD",
	"xfoundry-text": "Hackathon",
	"embedded-nav-text": "Geocache",
	"unity-dungeon-text": "Gritty",
	"data-vis-text": "Data-vis",
	"server-chat-text": "server-chat",
	"hci-ux-text": "HCI",
	"cellular-text": "game-of-life",
	"calculator-text": "calc"
};

const TITLE_SELECTOR = Object.keys(PANEL_BY_TITLE_CLASS)
	.map(function (cls)
	{
		return "." + cls;
	})
	.join(", ");

// Return the detail panel this title reveals, or null if it maps to nothing.
function panelForTitle(title)
{
	for (const cls in PANEL_BY_TITLE_CLASS)
	{
		if (title.classList.contains(cls))
		{
			return document.getElementById(PANEL_BY_TITLE_CLASS[cls]);
		}
	}

	return null;
}

// Clear the selected glow from every title so only one stays lit at a time.
function clearActiveGlow(titles)
{
	titles.forEach(function (title)
	{
		title.classList.remove("active-glow");
	});
}

// Panels share a single slot, so this is usually a no-op; only scroll when the
// panel is not already fully on screen.
function scrollPanelIntoViewIfNeeded(panel)
{
	const rect = panel.getBoundingClientRect();
	const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
	if (fullyVisible)
	{
		return;
	}

	panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Restart the CSS fade on every click: drop the class, force a reflow, re-add.
function replayFade(panel)
{
	panel.classList.remove("panel-reveal");
	void panel.offsetWidth;
	panel.classList.add("panel-reveal");
}

// Reveal a panel just after Webflow's own show/hide has had time to settle.
function revealPanel(panel)
{
	setTimeout(function ()
	{
		scrollPanelIntoViewIfNeeded(panel);
		replayFade(panel);
	}, 60);
}

// Light up the clicked title and reveal its panel; ignore titles with no panel.
function handleTitleClick(event, titles)
{
	event.preventDefault();

	const title = event.currentTarget;
	clearActiveGlow(titles);
	title.classList.add("active-glow");

	const panel = panelForTitle(title);
	if (!panel)
	{
		return;
	}

	revealPanel(panel);
}

// Wire every Experience title to glow-and-reveal on click.
function initExperienceTitles()
{
	const titles = document.querySelectorAll(TITLE_SELECTOR);
	if (titles.length === 0)
	{
		return;
	}

	titles.forEach(function (title)
	{
		title.addEventListener("click", function (event)
		{
			handleTitleClick(event, titles);
		});
	});
}

initExperienceTitles();

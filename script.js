document.addEventListener("DOMContentLoaded", () => {
	const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
	const sections = navLinks
		.map((link) => document.querySelector(link.getAttribute("href")))
		.filter(Boolean);

	for (const link of navLinks) {
		link.addEventListener("click", (event) => {
			const target = document.querySelector(link.getAttribute("href"));

			if (!target) {
				return;
			}

			event.preventDefault();

			target.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) {
					continue;
				}

				for (const link of navLinks) {
					link.classList.toggle(
						"is-active",
						link.getAttribute("href") === `#${entry.target.id}`
					);
				}
			}
		},
		{
			rootMargin: "-35% 0px -55% 0px",
			threshold: 0,
		}
	);

	for (const section of sections) {
		observer.observe(section);
	}

	for (const block of document.querySelectorAll("pre")) {
		const button = document.createElement("button");

		button.className = "copy-button";
		button.type = "button";
		button.textContent = "Copy";

		button.addEventListener("click", async () => {
			const code = block.querySelector("code");
			const text = code ? code.innerText : block.innerText;

			try {
				await navigator.clipboard.writeText(text);

				button.textContent = "Copied";
				button.classList.add("is-copied");

				window.setTimeout(() => {
					button.textContent = "Copy";
					button.classList.remove("is-copied");
				}, 1200);
			} catch {
				button.textContent = "Failed";

				window.setTimeout(() => {
					button.textContent = "Copy";
				}, 1200);
			}
		});

		block.appendChild(button);
	}

	const navToggle = document.querySelector("[data-nav-toggle]");
	const nav = document.querySelector("[data-nav]");

	if (navToggle && nav) {
		navToggle.addEventListener("click", () => {
			const isOpen = nav.classList.toggle("is-open");
			navToggle.setAttribute("aria-expanded", String(isOpen));
		});

		for (const link of navLinks) {
			link.addEventListener("click", () => {
				nav.classList.remove("is-open");
				navToggle.setAttribute("aria-expanded", "false");
			});
		}
	}
});

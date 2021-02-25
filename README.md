- npx create-next-app easy-blog
- build three folders of components, lib, pages
- create /enter, /[username], /[username]/[slug], /admin, /admin/[slug]
- Add snippet to make it easy
- cmd-shift-P, Preferences: configure user snippets, use javascript

"next-page": {
		"prefix": "next-page",
        "scope": "javascript,typescript",
		"body": [
			"export default function Page({ }) {",
            "  return (",
            "    <main>",
            "    </main>",
            "  )",
            "}"
		],
		"description": "NextJS Page"
	}

- And return just simple text
- In package,json change "dev": "cross-env NODE_OPTIONS='--inspect' next"
- Of course install "npm i cross-env -g"
- Create vscode debug config, type node and add port: 9229
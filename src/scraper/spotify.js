/**
 * i just fixed this code, and i got this code on channel ~
 */
import axios from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";

const spotidown = {
	getToken: async () => {
		try {
			const response = await axios.get("https://spotidown.app/");
			const $ = cheerio.load(response.data);
			const inputs = $('input[name^="_"]');
			const recaptchaInput = $('input[name="g-recaptcha-response"]');
			const results = [];
			const cookies = response.headers["set-cookie"];

			inputs.each((index, element) => {
				const inputName = $(element).attr("name");
				const inputValue = $(element).val();
				results.push({ name: inputName, value: inputValue });
			});

			return { results, cookies, recaptchaInput: recaptchaInput.attr("name") };
		} catch (error) {
			console.error("Error fetching data:", error);
			throw new Error("Error fetching data");
		}
	},
	getData: async (url) => {
		try {
			const data = new FormData();
			const { results, cookies, recaptchaInput } = await spotidown.getToken();
			const name = results[0].name;
			const value = results[0].value;
			data.append("url", url);
			data.append(name, value);
			data.append(recaptchaInput, "dummy-recaptcha-response");

			const config = {
				method: "POST",
				url: "https://spotidown.app/action",
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
					"accept-language": "id-ID",
					referer: "https://spotidown.app/",
					origin: "https://spotidown.app",
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-origin",
					priority: "u=0",
					te: "trailers",
					Cookie: cookies.join("; "),
					...data.getHeaders(),
				},
				data,
			};

			const response = await axios.request(config);
			return response.data;
		} catch (error) {
			console.error("Error in getData:", error);
			throw new Error("Error in getData");
		}
	},
	download: async (url) => {
		try {
			const htmlData = await spotidown.getData(url);
			const $ = cheerio.load(htmlData);
			const downloadInfo = [];

			$(".spotidown-downloader").each((index, element) => {
				const title = $(element).find(".hover-underline").attr("title").trim();
				const artist = $(element).find("p span").text().trim();
				const thumbnail = $(element).find("img").attr("src");
				let audioLink = null;
				let coverLink = null;

				$(element)
					.find(".abuttons a")
					.each((i, el) => {
						const link = $(el).attr("href");
						const linkTitle = $(el).text().trim();
						if (linkTitle.includes("Mp3")) {
							audioLink = link;
						} else if (linkTitle.includes("Cover")) {
							coverLink = link;
						}
					});

				downloadInfo.push({ title, artist, thumbnail, audioLink, coverLink });
			});

			return downloadInfo;
		} catch (error) {
			console.error("Error:", error);
			throw new Error("Error!");
		}
	},
};

export { spotidown };

// (async () => {
// 	try {
// 		const url =
// 			"https://open.spotify.com/track/7zOVh5fGpEwSbZd0g9z80B?si=90e87ac6019a48a7%27";
// 		const downloadInfo = await spotidown.download(url);
// 		console.log(downloadInfo);
// 	} catch (error) {
// 		console.error("Failed to download:", error);
// 	}
// })();
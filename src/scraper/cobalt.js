async function cobalt(url, opts = {}) {
    const response = await fetch("https://c.2ru.xyz/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, ...opts }),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
}

module.exports = cobalt;
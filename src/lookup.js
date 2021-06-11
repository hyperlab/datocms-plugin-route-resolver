let lookups = [];

export function configure(sources, locale) {
  sources.forEach((config) => {
    if (config.type === "jetshop") {
      jetshop(config, locale);
    } else if (config.type === "findify") {
      findify(config, locale);
    }
  });
}

function jetshop(config, locale) {
  if (config.shopid && config.token) {
    const channelid = (config.locales && config.locales[locale]) || 1;

    lookups.push(async (url) => {
      const result = await fetch("https://storeapi.jetshop.io", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: config.token,
          shopid: config.shopid,
          channelid,
        },
        body: JSON.stringify({
          query: `
query($url: String) {
  route(path: $url) {
    path
  }
}
          `,
          variables: {
            url,
          },
        }),
      }).then((res) => res.json());

      if (result.data && result.data.route) {
        return {
          source: "jetshop",
          url: result.data.route.path,
        };
      } else {
        return null;
      }
    });
  } else {
    console.error("Jetshop plugin was not configured properly");
  }
}

function findify(config, locale) {
  if (config.locales) {
    const token = config.locales[locale] || config.locales["se"];

    lookups.push(async (url) =>
      fetch(`https://api-v3.findify.io/v3/smart-collection/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Key": token,
        },
        body: JSON.stringify({
          user: {
            lang: ["sv-SE"],
          },
          t_client: +new Date(),
        }),
      })
        .then((res) => res.json())
        .then(
          (data) => {
            if (data.error) {
              return null;
            } else {
              return {
                source: "findify",
                url: url.startsWith("/") ? url : `/${url}`,
              };
            }
          },
          () => null
        )
    );
  } else {
    console.error("Findify plugin was not configured properly");
  }
}

export function lookup(url) {
  return lookups
    .reduce(
      (promise, cur) =>
        promise.catch(() =>
          cur(url).then((val) => {
            if (val === null) {
              return Promise.reject(null);
            } else {
              return Promise.resolve(val);
            }
          })
        ),
      Promise.reject()
    )
    .catch(() => ({
      source: "No match",
      url: url.startsWith("/") ? url : `/${url}`,
    }));
}

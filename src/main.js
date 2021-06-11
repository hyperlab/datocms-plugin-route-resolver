import DatoCmsPlugin from "datocms-plugins-sdk";
import Field from "./Field.svelte";
import { configure } from "./lookup";
import { value } from "./store";

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  const val = plugin.getFieldValue(plugin.fieldPath);

  if (val) {
    value.set(val);
  }

  plugin.addFieldChangeListener(plugin.fieldPath, () =>
    value.set(plugin.getFieldValue(plugin.fieldPath))
  );

  value.subscribe((newVal) => plugin.setFieldValue(plugin.fieldPath, newVal));

  let urlPrefix = "";

  if (plugin.parameters.global) {
    try {
      const sources = JSON.parse(plugin.parameters.global.sources);
      const sourcesFilter = plugin.parameters.instance.sources
        ? plugin.parameters.instance.sources.split(",")
        : [];
      configure(
        sourcesFilter.length
          ? sources.filter((source) => sourcesFilter.includes(source.type))
          : sources,
        plugin.locale
      );
    } catch {}

    try {
      const urlPrefixes = JSON.parse(plugin.parameters.global.prefixes);
      urlPrefix =
        urlPrefixes[plugin.locale] || urlPrefixes[Object.keys(urlPrefixes)[0]];
    } catch {}
  }

  new Field({
    target: document.body,
    props: {
      placeholder: plugin.placeholder,
      urlPrefix,
    },
  });
});

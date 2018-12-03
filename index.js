export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'example_vis',
    uiExports: {
      visTypes: ['plugins/example_vis/example_vis']
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}

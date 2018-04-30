import { configure } from '@storybook/vue';
import { setOptions } from '@storybook/addon-options';

// options
setOptions({
  name: 'my elements',
  url: '/'
});

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

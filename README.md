# storybook

> This is a Storybook for Vue.js as host for the Stencil components.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## How to setup your own Storybook + Stencil support

This Storybook was generated with [vue-cli](https://www.npmjs.com/package/vue-cli).

Here's a description of how to setup it from scratch:

## Setup a Vue.js project and integrate a Storybook

### 1) Install `vue-cli` globally

First of all, install the official [Vue.js CLI](https://github.com/vuejs/vue-cli) tool globally:

```
npm install -g vue-cli
```

### 2) Init a new Vue.js project

After you've installed the CLI tool, you can init a fresh Vue.js project. Just type in your terminal:

```
vue init webpack storybook
```

and insert the strings that fit your needs:

```
? Project name storybook
? Project description This is a Storybook for Vue.js as host for the Stencil components.
? Author Patrick Hillert <phillert@inovex.de>
? Vue build standalone
? Install vue-router? No
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests Yes
? Pick a test runner jest
? Setup e2e tests with Nightwatch? Yes
? Should we run `npm install` for you after the project has been created? (recommended) yarn

   vue-cli · Generated "storybook".


# Installing project dependencies ...
# Running eslint --fix to comply with chosen preset rules...
# Project initialization finished!
# ========================
```

Test if all works well:

```
cd storybook
yarn dev
```

You're set. Skip over to the next step.

### 3) Install `@storybook/cli` globally

After you've setup the boilerplate for the Vue.js project, you can now install the [Storybook CLI](https://www.npmjs.com/package/@storybook/cli) tool:

```
npm i -g @storybook/cli
```

### 4) Generate a fresh Storybook

You are now able to apply a fresh Storybook on top of your Vue.js project. It's simply a one liner:

```
getstorybook
```

This will give you something like this in your terminal:

```
 getstorybook - the simplest way to add a storybook to your project.

 • Detecting project type. ✓
 • Adding storybook support to your "Single File Components Vue" app. ✓
 • Preparing to install dependencies. ✓

 ...

  • Installing dependencies. ✓
 ```

This generates all the Storybook related files.

> Warning! There's currently [an open issue](https://github.com/storybooks/storybook/issues/2727) adressing a problem with the auto generated code. [You must manually fix this by adding the `h` parameter to the `render()` function around line 24](https://github.com/storybooks/storybook/issues/2727#issuecomment-361177519).

You're now able to run Storybook on `http://localhost:6006` by typing:

```
yarn storybook
```

### 5) Add some Storybook addons

I just want to add some plugins here to get more out of Storybook. Simply install these three things, I'll tell you in a moment what they're good for:

```
yarn add @storybook/addon-options --dev
yarn add @storybook/addon-knobs --dev
yarn add storybook-readme --dev
```

The [addon-options](https://www.npmjs.com/package/@storybook/addon-options) let you specify a custom name and the general appearance.

The [addon-knobs](https://www.npmjs.com/package/@storybook/addon-knobs) give you the ability to define properties of you components you want your Storybook visitors to dynamically change. It's very useful to give them a practical way to interact live in the browser with properties of your component.

The [storybook-readme](https://github.com/tuchk4/storybook-readme) enables us to write docs in markdown and integrate the demo of the component into the docs. This gives us super powers as we can properly document components while not missing any live editing features and the live demo of the component itself.

### 6) Register addons in Storybook and set basic config

Now we've to register the installed addons in storybook.

Open `.storybook/addons.js` and append:

```
import '@storybook/addon-options/register';
import '@storybook/addon-knobs/register';
import 'storybook-readme/register';
```

This registers the addons when Storybook gets bootstrapped.

We now want to set some basic configuration in `.storybook/config.js`, so we append:

```
import { setOptions } from '@storybook/addon-options';

// options
setOptions({
  name: 'my elements',
  url: '/'
});
```

### 7) Integrate the stencil components

As you've now prepared the Vue.js part and setup the Storybook with some plugins, it's time to integrate the components.

Here you have two possibilities. If you already host your built components in a npm registry, you can just add these as `dependencies` to your `node_modules` folder. So you choose 7a. If you don't have a npm registry set up, you can also add the git repo as a dependency (and pin that to any tag in there). This is what 7b will guide you.

####  Add `postinstall` hook

Before you begin, just add this postinstall hook to compile the components after you've installed them:

```js
// Change file: package.json

{
  scripts: {
    "postinstall": "cd node_modules/stencil-components-spike && yarn install && yarn build"
  }
}
```

#### 7a) Using components from a npm registry:

> If you use a private npm registry like [Verdaccio](https://github.com/verdaccio/verdaccio) you have to configure npm to use that registry instead of the default registry.npmjs.com. It's best to setup a per-project config file called `.yarnrc`.

> Simply create a `.yarnrc` file in your projects folder and insert something like `registry "https://my-registry.example.com"`. Yarn will now use this registry instead of the default one. Just re-check if Yarn will use this registry by typing `yarn config get registry` in the terminal. This should return `https://my-registry.example.com` to you.

If you've setup `.yarnrc` properly, you are now able to add dependencies from that registry, simply run:

```
yarn add silenthoo/stencil-components-spike
```

This is all you have to do. The components referenced from the registry are already built, so we only need to declare them as dependency as we would with any other other library on npm too. But yarn is also capable of referencing dependencies from git. So if you - as I do in development - need to reference the source from git, you can go to the next paragraph. Otherwise you can skip over the next part.

#### 7b) Using components from a git source

If you don't have a private registry you can also add the source from any git repo you can access from your command line. Here is how I use my components from GitHub:

```
yarn add https://github.com/silentHoo/stencil-components-spike.git
```

> This will only install the source, not the built components, so we need to add a `postinstall` lifecycle hook to our scripts.

#### 8) Extend the Storybook Webpack config

To copy our components into the dist folder for Storybook so that the webserver can serve these, you have to extend the Webpack config. Additionally we copy our assets we will later add our stories.

```js
// New file: .storybook/webpack.config.js

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (baseConfig, env, defaultConfig) => {

  // We extend the default config by
  const copyWebpackPlugin = new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../node_modules/stencil-components-spike/dist/stencil-components-spike'),
      to: path.posix.join('static', 'stencil-components-spike'),
      ignore: ['.*']
    },
    {
      from: path.resolve(__dirname, '../src/assets'),
      to: path.posix.join('static', 'assets'),
      ignore: ['.*']
    }
  ]);

  if (defaultConfig.plugins) {
    defaultConfig.plugins.push(copyWebpackPlugin);
  } else {
    defaultConfig.plugins = [
      copyWebpackPlugin
    ];
  }

  return defaultConfig;
};
```

#### 9) The first story

The Storybook is now ready to host the components. First we remove all the content of `src/stories/index.stories.js`.

Next we have to import the Stencil components and ignore them in Vue.js. If we don't ignore the elements, Vue.js would treat these components as Vue components:

```js
// file: src/stories/index.stories.js

/* eslint-disable react/react-in-jsx-scope */

// Storybook
import Vue from 'vue'
import { addDecorator } from '@storybook/vue'

// Storybook addons
import { withKnobs } from '@storybook/addon-knobs/vue'

// Web Components
import 'stencil-components-spike/stencil-components-spike'

// Story imports
import SectionButton from './cs-button/index.js'

Vue.config.ignoredElements = [
  /^cs-/ // ignore all web components starting with "cs-"
]

addDecorator(withKnobs)

SectionButton.addStory()

/* eslint-enable react/react-in-jsx-scope */

```

Then we can add our story for the button. To keep the directory structure clean we put the story code into `src/stories/cs-button/index.js`. The goal is to put each component into a separate folder. So it's easy to add more components later without getting a kuddelmuddel.

This is the file content I put in there:

```js
import { storiesOf } from '@storybook/vue'

//
// Add-Ons
//
import { action } from '@storybook/addon-actions'
import { text, boolean } from '@storybook/addon-knobs/vue'
import { withDocs } from 'storybook-readme'

//
// Helpers
//
import ComponentTemplateRenderer from '../helpers/ComponentTemplateRenderer.js'

//
// Component Imports
//
import { CsButton } from 'stencil-components-spike/dist/collection/stencil-components-spike/cs-button/cs-button.js'

//
// Knobs
//
const knobDisabled = (disabled) => boolean('cs-disabled', disabled)
const knobButtonName = (name) => (
  text('Button name', name)
)

const template = new ComponentTemplateRenderer({ 'csButton': CsButton }).getTemplate()

export default {
  addStory: () => storiesOf('<cs-button>', module)
    .addDecorator(withDocs(template))
    .add('Simple', () => ({
      render (h) {
        return (
          <cs-button
            onClick={action('button clicked')}
            cs-disabled={knobDisabled(false)}
          >
            {knobButtonName('Simple')}
          </cs-button>
        )
      }
    }))
    .add('Simple disabled', () => ({
      render (h) {
        return (
          <cs-button
            onClick={action('button clicked')}
            cs-disabled={knobDisabled(true)}
          >
            {knobButtonName('Simple')}
          </cs-button>
        )
      }
    }))
}
```

On top of the file I import the `storiesOf` from Storybook to get all the basic Storybook features. Then I import some add-ons:

* `actions` from Storybook itself. This will later give us the nice tab on the bottom of the page showing us the all the events our component emits.
* `text` and `boolean` which will generates us a form in the additional _Knobs_ tab to manipulate the properties of the component for the label and disabled status of the button.
* `withDocs` from [@tuch4k](https://twitter.com/tuchk4) which adds another tab to put a markdown README in there. But I use it to add custom markdown into the content section where the live demo of our component lives. I don't like it to have my README on that small tab on the bottom. I know there's a view to put the README on the right side of the component. But then I don't have enough space on the left side to show the live demo. For me this is way better as I can control where I put my component (see `src/stories/helpers/ComponentTemplateRenderer.js`).

The first two points are easy (I hope). Otherwise please give me some feedback here or make a PR to improve this article.

The important things are:

```js
const template = new ComponentTemplateRenderer({ 'csButton': CsButton }).getTemplate()
```

Here I put together the single pieces for the Storybook's page. My `ComponentTemplateRenderer` just uses this very raw markdown template and replaces each part with the corresponding content:

```md
# <!-- TITLE -->

## Live demo

<!-- STORY -->

<!-- API_DOCS -->
```

The returned string has all the content to parse it with markdown. We not yet have the API_DOCS part. We will add them later. So here we only need to add this to our story by using the `.addDecorator()` method. And here within that we have to use `.withDocs()` from `storybook-readme` to get the content right into the preview page.

And that's it. To get more structure into it, I made a default export for the `.addStory()` function which just generates the story. So it's very clean and easy to read. And even better: we can see what we do in `index.stories.js`. We only need to add a single line of code to get our button right into Storybook:

```js
SectionButton.addStory()
```

This single line generates us a new section in the navbar as well as the whole story thing. When we add more components we simply need to add one more line per component and nothing more.

Next we want to add our API documentation to provide more info about our component for the people who use it.

#### 10) Autogenerate documentation from your code with JSDoc

We have all the tools we need to document our component. The only thing is to use them. So I decided to put the document as near as possbible to the code. Any documentation will otherwise get some dust and therefor out of sync with the code base. I want to avoid that by using JSDoc which is as close as possbile to the code.

First, we extend our `package.json` `postinstall` script of the Storybook project from:

```json
  "scripts": {
    "postinstall": "cd node_modules/stencil-components-spike && npm install && npm build"
  }
```

to

```json
  "scripts": {
    "postinstall": "cd node_modules/stencil-components-spike && npm install && npm run build && npm run build:doc"
  }
```

This `npm build:doc` is the new script we add to our components repository. This will later extract our JSDoc to markdown we then use to integrate into Storybook. I've added this to my [stencil-components-spike](https://github.com/silentHoo/stencil-components-spike):

```json
  "scripts": {
    "build:doc": "./gendocs.sh",
  }
```

And we add the file `gendocs.sh` to the root of our components project where the content is:

```sh
  #!/bin/sh

  find src/components -type f -name '*.tsx' |
  while read filename
  do
    eval "./node_modules/jsdoc-to-markdown/bin/cli.js --no-cache --files $filename --configure jsdoc2md.json > $filename.md"
  done
```

How this works, I'll explain next. But before that, we have to install some new dependencies in our components repo:

```sh
npm install --save-dev @babel/core@7.0.0-beta.41 @babel/cli@7.0.0-beta.41 @babel/plugin-proposal-class-properties@7.0.0-beta.41 @babel/plugin-proposal-decorators@7.0.0-beta.41 @babel/plugin-proposal-object-rest-spread@7.0.0-beta.41 @babel/plugin-syntax-jsx@7.0.0-beta.41 @babel/preset-env@7.0.0-beta.41 @babel/preset-typescript@7.0.0-beta.41
```

These are all the babel things we need for `jsdoc`. After you've installed all the packages, we have to add:

```sh
npm install --save-dev jsdoc@3.5.5 jsdoc-babel@0.4.0-alpha.0 jsdoc-to-markdown@4.0.1
```

Okay, now it's time to set the configuration options for `jsdoc2md` which will convert - as the name states - our jsdoc to markdown. So we've to add `jsdoc2md.json` to the root of our repo:

```json
{
  "source": {
    "includePattern": ".+\\.(j|t)s(doc|x)?$",
    "excludePattern": ".+\\.(test|spec).ts"
  },
  "plugins": [
    "plugins/markdown",
    "node_modules/jsdoc-babel"
  ],
  "babel": {
    "extensions": ["ts", "tsx"],
    "ignore": ["**/*.(test|spec).ts"],
    "babelrc": false,
    "presets": [["@babel/preset-env", { "targets": { "node": "current" } }], "@babel/typescript"],
    "plugins": ["@babel/plugin-syntax-jsx", "@babel/plugin-proposal-decorators", "@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"]
  }
}
```

Now you can run `npm run build:doc`. This command will extract all the JSDoc comments into a file with the same name as the component but ending in `*.tsx.md`. This file is used by our Storybook script we defined in the `postinstall` hook. So everytime you install, the markdown gets updated.

The last thing we need to do is to import this extracted markdown file in Storybook. We do this by extending our Storybook's `src/stories/cs-button/index.js` file:

```js
//
// Component Imports
//
import { CsButton } from 'stencil-components-spike/dist/collection/components/cs-button/cs-button.js'
import apiDocs from 'stencil-components-spike/src/components/cs-button/cs-button.tsx.md' // <--- new line

// ...

const template = new ComponentTemplateRenderer({ 'csButton': CsButton }, apiDocs).getTemplate() // <-- gets apiDocs as second parameter and is placed right into our documentation
```

Now you can simply run your Storybook with

```sh
yarn storybook
```

and visit `http://localhost:6006` and you'll see the full API documentation you've appended in your component. See my [component demo project here](https://github.com/silentHoo/stencil-components-spike) for the example JSDoc I used.

I hope this was helpful to you. Please give me your feedback about it so I can improve this over time.

## Appendix

### Setting up new components with `stencil-component-starter`

To setup new components, it's really easy to get started. All you have to do is clone a starter repo:

```
git clone https://github.com/ionic-team/stencil-component-starter stencil-components-spike
```

Then just run `npm install && npm start` to install all the dependencies and start the project. For more infos you can read more at https://stenciljs.com/docs/getting-started.

You can see my [component demo project here](https://github.com/silentHoo/stencil-components-spike).

### PoC: Use your Vue.js Storybook as real project

As we use a Vue.js Storybook to host our Stencil components, we can also use that project as our real WebApp. We only need to extend the Webpack config to copy our components into the  corresponding output folders for dev and production. This step is simple when you know how to modify your config. Here's what I changed:

```js
// Change file: build/webpack.dev.conf.js

  // (somewhere around line 28) ...
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
        {
          from: /^\/components\/.*$/,
          to: function (context) {
            return path.posix.join(config.dev.assetsPublicPath, 'static', context.parsedUrl.pathname)
          }
        },
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
      ]
    },
  // ...

  // (somewhere around line 72) ...
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    },
    {
      from: path.resolve(__dirname, '../node_modules/stencil-components-spike/dist/stencil-components-spike'),
      to: path.posix.join(config.dev.assetsSubDirectory, 'components'),
      ignore: ['.*']
    }
  ])
  // ...
```

```js
// Change file: build/webpack.prod.conf.js

// (somewhere around line 116) ...
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    },
    {
      from: path.resolve(__dirname, '../node_modules/stencil-components-spike/dist/stencil-components-spike'),
      to: path.posix.join(config.build.assetsSubDirectory, 'js', 'components'),
      ignore: ['.*']
    }
  ])
// ...
```

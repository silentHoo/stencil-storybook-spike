/* eslint-disable react/react-in-jsx-scope */

// Storybook
import Vue from 'vue'
import { addDecorator } from '@storybook/vue'

// Storybook addons
import { withKnobs } from '@storybook/addon-knobs/vue'

// Web Components
import 'stencil-components-spike/dist/stencil-components-spike'

// Story imports
import SectionButton from './cs-button/index.js'

Vue.config.ignoredElements = [
  /^cs-/ // ignore all web components starting with "cs-"
]

addDecorator(withKnobs)

SectionButton.addStory()

/* eslint-enable react/react-in-jsx-scope */

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
import { CsButton } from 'stencil-components-spike/dist/collection/components/cs-button/cs-button.js'
import apiDocs from 'stencil-components-spike/src/components/cs-button/cs-button.tsx.md'

//
// Knobs
//
const knobDisabled = (disabled) => boolean('cs-disabled', disabled)
const knobButtonName = (name) => (
  text('Button name', name)
)

const template = new ComponentTemplateRenderer({ 'csButton': CsButton }, apiDocs).getTemplate()

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

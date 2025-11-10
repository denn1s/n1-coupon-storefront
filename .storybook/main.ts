import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx|js|jsx)'],

  addons: ['@chromatic-com/storybook'],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  docs: {},

  viteFinal: (config) => {
    // Add TailwindCSS support if needed
    return config
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: '../tsconfig.stories.json'
    }
  }
}

export default config

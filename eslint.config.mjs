
import { globalIgnores } from 'eslint/config'
import { defineAtomazingConfig } from '@atomazing-org/eslint-config'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = typeof import.meta.dirname !== 'undefined'
  ? import.meta.dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default [
	   globalIgnores([
		'dist',
		'postcss.config.js',
		'postcss.config.ts',
		'tsconfig.json',
		'tailwind.config.js',
		'vite.config.ts',
		'node_modules',
		'src/storybook/**',
		'src/vite-env.d.ts',
		'src/react-app-env.d.ts',
		'src/templates/**',
		'public/auth.js',
		'public/environment.js',
		'public/mockServiceWorker.js',
		'workbox.config.ts',
		'manifest.ts',
	]),
	   ...defineAtomazingConfig({ dirname }),
	   {
			   rules: {
					   'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
					   // Accessibility rules can remain off for library code
					   'jsx-a11y/no-static-element-interactions': 'off',
					   'jsx-a11y/click-events-have-key-events': 'off',
					   'jsx-a11y/anchor-is-valid': 'off',
					   // Stricter rules for production npm package
					   'func-names': 'error',
					   'unicorn/prefer-add-event-listener': 'error',
					   'consistent-return': 'error',
					   'react-hooks/exhaustive-deps': 'error',
					   'react/jsx-no-useless-fragment': 'error',
					   'react/jsx-key': 'error',
					   'array-callback-return': 'error',
					   '@typescript-eslint/no-var-requires': 'error',
					   'import/no-dynamic-require': 'error',
					   'global-require': 'error',
					   '@typescript-eslint/no-explicit-any': 'error',
					   '@typescript-eslint/no-non-null-assertion': 'error',
					   'unicorn/prefer-top-level-await': 'error',
					   'react/jsx-handler-names': 'error',
					   '@typescript-eslint/class-methods-use-this': 'error',
					   'unicorn/consistent-function-scoping': 'error',
					   'unicorn/prefer-global-this': 'error',
					   // Optional: keep prop-types off for TS, or set to error if you want both
					   'react/prop-types': 'off',
			   },
	   },
]

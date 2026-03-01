import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)', 'sans-serif'],
				heading: ['var(--font-inter)', 'sans-serif'], // Simplified to Inter for soft minimalist cohesion
			},
			colors: {
				'brand': {
					'01': 'rgb(var(--color-01) / <alpha-value>)',
					'02': 'rgb(var(--color-02) / <alpha-value>)',
					'03': 'rgb(var(--color-03) / <alpha-value>)',
					'04': 'rgb(var(--color-04) / <alpha-value>)',
					'05': 'rgb(var(--color-05) / <alpha-value>)',
					'06': 'rgb(var(--color-06) / <alpha-value>)',
					'07': 'rgb(var(--color-07) / <alpha-value>)',
					'08': 'rgb(var(--color-08) / <alpha-value>)',
				},
				primary: {
					DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
				},
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				card: {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
				},
				border: 'rgb(var(--border) / <alpha-value>)',
				input: 'rgb(var(--input) / <alpha-value>)',
				ring: 'rgb(var(--ring) / <alpha-value>)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				none: '0px'
			},
			boxShadow: {
				'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
				'soft-lg': '0 10px 40px -4px rgba(0, 0, 0, 0.06)'
			},
			fontSize: {
				'h1': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'h2': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
				'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
				'p1': ['1rem', { lineHeight: '1.6' }],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;

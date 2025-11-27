import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'Plus Jakarta Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			],
  			serif: [
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			objection: {
  				DEFAULT: 'hsl(var(--objection))',
  				foreground: 'hsl(var(--objection-foreground))'
  			},
  			proposal: {
  				DEFAULT: 'hsl(var(--proposal))',
  				foreground: 'hsl(var(--proposal-foreground))'
  			},
  			'pro-argument': {
  				DEFAULT: 'hsl(var(--pro-argument))',
  				foreground: 'hsl(var(--pro-argument-foreground))'
  			},
			variant: {
				DEFAULT: 'hsl(var(--variant))',
				foreground: 'hsl(var(--variant-foreground))'
			},
			'concern-type': {
				DEFAULT: 'hsl(var(--concern-type))',
				foreground: 'hsl(var(--concern-type-foreground))'
			},
			problem: {
				DEFAULT: 'hsl(var(--problem))',
				foreground: 'hsl(var(--problem-foreground))'
			},
			school: {
				DEFAULT: 'hsl(var(--school))',
				foreground: 'hsl(var(--school-foreground))'
			},
			endorse: {
				DEFAULT: 'hsl(var(--endorse))',
				foreground: 'hsl(var(--endorse-foreground))',
				hover: 'hsl(var(--endorse-hover))'
			},
			object: {
				DEFAULT: 'hsl(var(--object))',
				foreground: 'hsl(var(--object-foreground))'
			},
			vote: {
				DEFAULT: 'hsl(var(--vote))',
				foreground: 'hsl(var(--vote-foreground))'
			},
			question: {
				DEFAULT: 'hsl(var(--question))',
				foreground: 'hsl(var(--question-foreground))'
			},
			statistics: {
				DEFAULT: 'hsl(var(--statistics))',
				foreground: 'hsl(var(--statistics-foreground))'
			},
			'new-concern': {
				DEFAULT: 'hsl(var(--new-concern))',
				foreground: 'hsl(var(--new-concern-foreground))'
			},
			'secondary-action': {
				DEFAULT: 'hsl(var(--secondary-action))',
				foreground: 'hsl(var(--secondary-action-foreground))'
			},
			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

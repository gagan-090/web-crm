/** @type {import('tailwindcss').Config} */
export default {
  "content": [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "inverse-surface": "#303030",
        "on-primary-fixed": "#001944",
        "on-surface": "#1b1c1c",
        "tertiary-fixed": "#ffdbcb",
        "background": "#fcf9f8",
        "on-tertiary-container": "#fffbff",
        "surface-container": "#f0eded",
        "primary-fixed-dim": "#afc6ff",
        "on-tertiary-fixed": "#341100",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#370e00",
        "secondary": "#a73a00",
        "on-secondary-container": "#571b00",
        "surface-dim": "#dcd9d9",
        "on-primary-container": "#fefcff",
        "tertiary-container": "#c15300",
        "on-tertiary-fixed-variant": "#783100",
        "on-primary-fixed-variant": "#004299",
        "on-error": "#ffffff",
        "surface": "#fcf9f8",
        "surface-container-highest": "#e5e2e1",
        "outline-variant": "#c2c6d6",
        "surface-container-low": "#f6f3f2",
        "primary": "#0056c3",
        "primary-container": "#1f6feb",
        "surface-tint": "#0059c8",
        "on-secondary": "#ffffff",
        "outline": "#727786",
        "surface-container-high": "#eae7e7",
        "tertiary": "#9a4100",
        "inverse-primary": "#afc6ff",
        "on-background": "#1b1c1c",
        "secondary-fixed": "#ffdbce",
        "primary-fixed": "#d9e2ff",
        "surface-variant": "#e5e2e1",
        "on-surface-variant": "#424754",
        "on-secondary-fixed-variant": "#7f2b00",
        "surface-bright": "#fcf9f8",
        "error": "#ba1a1a",
        "tertiary-fixed-dim": "#ffb691",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "secondary-container": "#fd661d",
        "inverse-on-surface": "#f3f0ef",
        "secondary-fixed-dim": "#ffb599",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "accent-success": "#27AE60",
        "accent-call": "#27AE60",
        "accent-custom": "#FB641B",
        "whatsapp-green": "#27AE60",
        "accent-purple": "#8E44AD",
        "brand-purple": "#8E44AD",
        "brand-accent": "#FB641B",
        "brand-orange": "#FB641B"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "lg": "16px",
        "sm": "8px",
        "md": "12px",
        "base": "4px",
        "xs": "4px",
        "gutter": "16px",
        "xl": "24px",
        "margin-page": "24px",
        "unit": "4px",
        "density-table-py": "8px",
        "density-table-px": "12px",
        "container-max": "1440px",
        "stack-md": "16px",
        "inset-table": "12px 16px",
        "stack-xs": "4px",
        "margin-mobile": "16px",
        "margin-desktop": "32px",
        "stack-sm": "8px",
        "table-row": "32px"
      },
      "fontFamily": {
        "data-mono": [
          "Inter"
        ],
        "label-caps": [
          "Inter"
        ],
        "headline-md": [
          "Inter"
        ],
        "role-badge": [
          "Inter"
        ],
        "body-sm": [
          "Inter"
        ],
        "body-hindi": [
          "Noto Sans"
        ],
        "body-md": [
          "Inter"
        ],
        "title-sm": [
          "Inter"
        ],
        "label-md": [
          "Inter"
        ],
        "headline-lg": [
          "Inter"
        ],
        "headline-lg-mobile": [
          "Inter"
        ],
        "mono-data": [
          "Inter"
        ],
        "body-lg": [
          "Inter"
        ],
        "display": [
          "Inter"
        ],
        "table-data": [
          "Inter"
        ],
        "display-sm": [
          "Inter"
        ],
        "headline-sm": [
          "Inter"
        ],
        "code-sm": [
          "JetBrains Mono"
        ],
        "code-md": [
          "JetBrains Mono"
        ],
        "display-lg": [
          "Inter"
        ],
        "hindi": [
          "Noto Sans Devanagari",
          "sans-serif"
        ],
        "devanagari": [
          "Noto Sans Devanagari",
          "sans-serif"
        ],
        "hindi-md": [
          "Noto Sans Devanagari"
        ]
      },
      "fontSize": {
        "data-mono": [
          "13px",
          {
            "lineHeight": "18px",
            "fontWeight": "600"
          }
        ],
        "label-caps": [
          "11px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.05em",
            "fontWeight": "700"
          }
        ],
        "headline-md": [
          "18px",
          {
            "lineHeight": "24px",
            "fontWeight": "600"
          }
        ],
        "role-badge": [
          "11px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.05em",
            "fontWeight": "700"
          }
        ],
        "body-sm": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "400"
          }
        ],
        "body-hindi": [
          "14px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ],
        "body-md": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "400"
          }
        ],
        "title-sm": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "600"
          }
        ],
        "label-md": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.05em",
            "fontWeight": "600"
          }
        ],
        "headline-lg": [
          "32px",
          {
            "lineHeight": "40px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "headline-lg-mobile": [
          "24px",
          {
            "lineHeight": "32px",
            "fontWeight": "700"
          }
        ],
        "mono-data": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "500"
          }
        ],
        "body-lg": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "display": [
          "24px",
          {
            "lineHeight": "32px",
            "letterSpacing": "-0.02em",
            "fontWeight": "600"
          }
        ],
        "table-data": [
          "13px",
          {
            "lineHeight": "18px",
            "fontWeight": "400"
          }
        ],
        "display-sm": [
          "24px",
          {
            "lineHeight": "32px",
            "letterSpacing": "-0.02em",
            "fontWeight": "600"
          }
        ],
        "headline-sm": [
          "20px",
          {
            "lineHeight": "28px",
            "fontWeight": "600"
          }
        ],
        "code-sm": [
          "11px",
          {
            "lineHeight": "14px",
            "fontWeight": "500"
          }
        ],
        "code-md": [
          "13px",
          {
            "lineHeight": "18px",
            "fontWeight": "400"
          }
        ],
        "display-lg": [
          "32px",
          {
            "lineHeight": "40px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "hindi-md": [
          "14px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ]
      }
    }
  },
  "plugins": []
};
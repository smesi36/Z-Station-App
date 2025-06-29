export function generatePriceMarker(price) {
  return {
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='51' viewBox='0 0 40 51' fill='none'>
      <path d='M20 0.75C25.2264...Z' fill='url(%23paint0_linear_72_1967)' stroke='%233931AF' stroke-width='0.5'/>
      <text x='50%' y='45%' text-anchor='middle' fill='white' font-size='12' font-family='Arial' dy='.3em'>${price}</text>
      <defs>
        <linearGradient id='paint0_linear_72_1967' x1='0' y1='0.5' x2='40' y2='0.5' gradientUnits='userSpaceOnUse'>
          <stop stop-color='%23272270'/>
          <stop offset='1' stop-color='%233931AF'/>
        </linearGradient>
      </defs>
    </svg>`,
    scaledSize: { width: 40, height: 51 },
  };
}

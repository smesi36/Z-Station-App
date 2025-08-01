import { icons } from "./IconsLibrary.js";

export function generatePriceMarker(price) {
  if (!price) return icons.zMarkerIcon; // fallback for missing price

  const svg = `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='51' viewBox='0 0 40 51' fill='none'>
      <path d='M20 0.75C25.2264 0.75 29.8225 2.57896 33.7988 6.24609C37.7608 9.90014 39.75 14.8089 39.75 21C39.75 25.0999 38.12 29.583 34.8242 34.4541C31.5557 39.2848 26.6167 44.5229 20 50.1699C13.3833 44.5229 8.4443 39.2848 5.17578 34.4541C1.88002 29.583 0.25 25.0999 0.25 21C0.25 14.8089 2.2392 9.90014 6.20117 6.24609C10.1775 2.57896 14.7736 0.75 20 0.75Z' fill='url(%23paint0_linear_72_1967)' stroke='%233931AF' stroke-width='0.5'/>
      <text x='50%' y='45%' text-anchor='middle' fill='white' font-size='12' font-family='Arial' dy='.3em'>${price}</text>
      <defs>
        <linearGradient id='paint0_linear_72_1967' x1='0' y1='0.5' x2='40' y2='0.5' gradientUnits='userSpaceOnUse'>
          <stop stop-color='%23272270'/>
          <stop offset='1' stop-color='%233931AF'/>
        </linearGradient>
      </defs>
    </svg>`;

  return {
    url: svg,
    scaledSize: new google.maps.Size(40, 51),
  };
}


